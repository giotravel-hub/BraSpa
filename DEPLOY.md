# BraSpa — Oracle Cloud Deployment Guide

## Phase 1: Create Your Oracle Cloud Account

1. Go to **https://cloud.oracle.com** and click **Sign Up**
2. Create an account — you'll need a credit card for verification, but **you will not be charged** for Always Free resources
3. Pick your **Home Region** — choose the one closest to Contra Costa County (e.g., **US West (San Jose)**). This cannot be changed later
4. Once your account is active, you'll land on the Oracle Cloud dashboard

---

## Phase 2: Create a Virtual Machine

1. From the dashboard, click **Create a VM instance**
2. Configure it like this:
   - **Name**: `braspa` (or whatever you like)
   - **Image**: Click **Edit** → choose **Canonical Ubuntu 22.04**
   - **Shape**: Click **Change Shape** → select **Ampere** (ARM) → pick **VM.Standard.A1.Flex** → set **1 OCPU** and **6 GB RAM** (plenty, stays within free tier)
   - **Networking**: Leave defaults (it creates a VCN for you)
   - **SSH Key**: Select **Generate a key pair** and **download both** the private and public key files. Save them somewhere safe (e.g., `~/Desktop/oracle-keys/`). You need these to log into your server
3. Click **Create** — it takes a minute or two to provision
4. Once it says **Running**, note the **Public IP Address** shown on the instance page (e.g., `129.146.xx.xx`)

---

## Phase 3: Open Firewall Ports

Oracle blocks web traffic by default. You need to open ports 80 and 443.

1. On your instance page, click the **Subnet** link (under "Primary VNIC")
2. Click the **Default Security List**
3. Click **Add Ingress Rules** and add these two rules:
   - **Rule 1**: Source CIDR: `0.0.0.0/0`, Destination Port: `80`, Protocol: TCP
   - **Rule 2**: Source CIDR: `0.0.0.0/0`, Destination Port: `443`, Protocol: TCP
4. Save

---

## Phase 4: Connect to Your Server

Open Terminal on your Mac:

```bash
# Make your key file secure (required by SSH)
chmod 600 ~/Desktop/oracle-keys/ssh-key-*.key

# Connect to your server (replace with YOUR IP)
ssh -i ~/Desktop/oracle-keys/ssh-key-*.key ubuntu@YOUR_PUBLIC_IP
```

If it asks "Are you sure you want to continue connecting?" type `yes`.

You're now on your server. Everything from here runs on the server.

---

## Phase 5: Set Up the Server

Run these commands one at a time:

```bash
# Update the system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify it worked
node --version
npm --version

# Install PM2 (keeps your app running forever)
sudo npm install -g pm2

# Install Caddy (web server that handles HTTPS automatically)
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy -y

# Open firewall ports on the OS level too
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

---

## Phase 6: Upload Your Project

Open a **new Terminal tab** on your Mac (keep the server connection open in the other tab):

```bash
# Copy your project to the server (replace YOUR_PUBLIC_IP)
scp -i ~/Desktop/oracle-keys/ssh-key-*.key \
  -r /Users/giovanna/Desktop/claude-projects/BraSpa \
  ubuntu@YOUR_PUBLIC_IP:~/braspa
```

This may take a minute. Now switch back to your **server terminal tab**:

```bash
cd ~/braspa

# Remove the local node_modules and rebuild for the server's architecture (ARM)
rm -rf node_modules
npm install

# Create the uploads directory
mkdir -p public/uploads
```

---

## Phase 7: Configure Environment Variables

On the server:

```bash
nano ~/braspa/.env
```

Replace the contents with production values:

```
DATABASE_URL="file:./prisma/prod.db"
NEXTAUTH_SECRET="GENERATE_A_REAL_SECRET"
NEXTAUTH_URL="http://YOUR_PUBLIC_IP:3000"
RESEND_API_KEY="your_resend_api_key_here"
```

To generate a real secret, open another terminal and run:

```bash
openssl rand -base64 32
```

Paste that value in place of `GENERATE_A_REAL_SECRET`.

Save the file: press **Ctrl+O**, then **Enter**, then **Ctrl+X**.

> Later, if you get a domain name, change `NEXTAUTH_URL` to `https://yourdomain.com`

---

## Phase 8: Build & Start the App

On the server:

```bash
cd ~/braspa

# Set up the database
npx prisma generate
npx prisma migrate deploy

# Seed initial data
npm run seed

# Build the production app
npm run build

# Start with PM2
pm2 start npm --name "braspa" -- start

# Make PM2 restart your app if the server reboots
pm2 startup
# (it will print a command — copy and run that command)
pm2 save
```

At this point, your app is running! Test it by visiting `http://YOUR_PUBLIC_IP:3000` in your browser.

---

## Phase 9: Set Up Caddy (HTTPS + Clean URLs)

This step removes the `:3000` from the URL.

### Without a domain (just the IP for now)

```bash
sudo nano /etc/caddy/Caddyfile
```

Replace everything with:

```
:80 {
    reverse_proxy localhost:3000
}
```

Save (Ctrl+O, Enter, Ctrl+X), then:

```bash
sudo systemctl restart caddy
```

Now visit `http://YOUR_PUBLIC_IP` (no port needed).

### Later, when you get a domain

Update the Caddyfile to:

```
yourdomain.com {
    reverse_proxy localhost:3000
}
```

Caddy will automatically get an SSL certificate. Then update your `.env`:

```bash
nano ~/braspa/.env
# Change NEXTAUTH_URL to https://yourdomain.com
```

Restart the app:

```bash
pm2 restart braspa
sudo systemctl restart caddy
```

---

## Quick Reference

| What | Command |
|---|---|
| SSH into server | `ssh -i ~/Desktop/oracle-keys/ssh-key-*.key ubuntu@YOUR_PUBLIC_IP` |
| View app logs | `pm2 logs braspa` |
| Restart app | `pm2 restart braspa` |
| Stop app | `pm2 stop braspa` |
| Check app status | `pm2 status` |

### Redeploy After Making Changes

On your Mac — upload the updated code:

```bash
scp -i ~/Desktop/oracle-keys/ssh-key-*.key \
  -r /Users/giovanna/Desktop/claude-projects/BraSpa \
  ubuntu@YOUR_PUBLIC_IP:~/braspa
```

On the server:

```bash
cd ~/braspa
rm -rf node_modules
npm install
npx prisma migrate deploy
npm run build
pm2 restart braspa
```
