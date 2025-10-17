import { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getAllEntries } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl.replace(/\/$/, "");
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/docs`, lastModified: new Date() },
    { url: `${base}/roteiros`, lastModified: new Date() },
    { url: `${base}/plano`, lastModified: new Date() },
    { url: `${base}/agenda`, lastModified: new Date() },
    { url: `${base}/newsletter`, lastModified: new Date() },
    { url: `${base}/contato`, lastModified: new Date() },
    { url: `${base}/redes`, lastModified: new Date() },
    { url: `${base}/busca`, lastModified: new Date() },
  ];

  const entries = getAllEntries();
  const dynamicRoutes: MetadataRoute.Sitemap = entries.map((e) => ({
    url: `${base}/${e.type === "roteiro" ? "roteiros" : "docs"}/${e.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
