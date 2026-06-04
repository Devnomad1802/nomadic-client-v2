/**
 * Dynamic Sitemap Generator for Nomadic Townies
 * Run: node generate-sitemap.js
 * This fetches all trips and blogs from the API and generates a sitemap.xml
 * Add this to your build pipeline: "build": "vite build && node generate-sitemap.js"
 */

import fs from "fs";
import path from "path";

const BASE_URL = "https://nomadictownies.com";
const API_URL = "https://api.nomadictownies.com"; // Update with your actual API URL
const OUTPUT_PATH = "./dist/sitemap.xml";

const staticRoutes = [
  { url: "/", priority: "1.0", changefreq: "daily" },
  { url: "/all-packages", priority: "0.9", changefreq: "daily" },
  { url: "/blogs", priority: "0.8", changefreq: "weekly" },
  { url: "/about-us", priority: "0.6", changefreq: "monthly" },
  { url: "/contact-us", priority: "0.6", changefreq: "monthly" },
  { url: "/careers", priority: "0.4", changefreq: "monthly" },
  { url: "/terms-and-conditions", priority: "0.3", changefreq: "yearly" },
  { url: "/cancellation-and-refund", priority: "0.3", changefreq: "yearly" },
  { url: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
];

function generateSitemapXml(urls) {
  const today = new Date().toISOString().split("T")[0];
  const urlEntries = urls
    .map(
      ({ url, priority, changefreq, lastmod }) => `
  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${lastmod || today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;
}

async function fetchTrips() {
  try {
    const res = await fetch(`${API_URL}/api/trips`);
    const json = await res.json();
    return (json?.data || [])
      .filter((trip) => trip.seoSlug)
      .map((trip) => ({
        url: `/trips/${trip.seoSlug}`,
        priority: "0.8",
        changefreq: "weekly",
        lastmod: new Date(trip.updatedAt || trip.createdAt || Date.now())
          .toISOString()
          .split("T")[0],
      }));
  } catch (e) {
    console.warn("Could not fetch trips for sitemap:", e.message);
    return [];
  }
}

async function fetchBlogs() {
  try {
    const res = await fetch(`${API_URL}/api/blogs`);
    const json = await res.json();
    return (json?.data || []).map((blog) => ({
      url: blog.seoSlug ? `/blogs/${blog.seoSlug}` : `/blogs/Details/${blog._id}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: new Date(blog.Date || blog.createdAt || Date.now())
        .toISOString()
        .split("T")[0],
    }));
  } catch (e) {
    console.warn("Could not fetch blogs for sitemap:", e.message);
    return [];
  }
}

async function generateSitemap() {
  console.log("🗺️  Generating sitemap...");

  const [tripRoutes, blogRoutes] = await Promise.all([
    fetchTrips(),
    fetchBlogs(),
  ]);

  const allUrls = [...staticRoutes, ...tripRoutes, ...blogRoutes];

  const xml = generateSitemapXml(allUrls);

  // Ensure dist directory exists
  const distDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, xml, "utf8");

  console.log(`✅ Sitemap generated: ${OUTPUT_PATH}`);
  console.log(`   Static routes: ${staticRoutes.length}`);
  console.log(`   Trip pages: ${tripRoutes.length}`);
  console.log(`   Blog pages: ${blogRoutes.length}`);
  console.log(`   Total URLs: ${allUrls.length}`);
}

generateSitemap().catch(console.error);
