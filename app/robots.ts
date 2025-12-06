import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://fusionfinance.pl";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/ulubione", "/historia"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/ulubione", "/historia"],
      },
      {
        userAgent: "Googlebot-News",
        allow: "/",
        disallow: ["/api/", "/ulubione", "/historia", "/polityka-prywatnosci", "/regulamin", "/cookies"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

