import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/listings"],
        disallow: [
          "/login",
          "/signup",
          "/my-listings",
          "/admin",
          "/reset-password",
          "/forgot-password",
          "/verify-email",
        ],
      },
    ],
    sitemap: "https://braspa.org/sitemap.xml",
  };
}
