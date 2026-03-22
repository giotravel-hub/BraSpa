import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://braspa.org/listings",
  },
};

export default function ListingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
