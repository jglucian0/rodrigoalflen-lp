import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api/",
          "/ver/",
          "/cliente/galeria",
          "/cliente/recuperar-senha",
          "/cliente/redefinir-senha",
        ],
      },
    ],
  };
}