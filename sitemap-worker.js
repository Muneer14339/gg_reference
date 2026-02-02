export default {
  async fetch() {
    try {
      const [gamesRes, comingSoonRes] = await Promise.all([
        fetch("https://www.gajjugames.com/assets/files/games.csv"),
        fetch("https://www.gajjugames.com/assets/files/comingSoon.csv")
      ]);

      const gamesCsv = await gamesRes.text();
      const comingSoonCsv = await comingSoonRes.text();

      const gamesLines = gamesCsv.trim().split("\n").slice(1);
      const comingSoonLines = comingSoonCsv.trim().split("\n").slice(1);

      const today = new Date().toISOString().split("T")[0];

      const gameUrls = gamesLines.map(line => {
        const id = line.split(",")[0];
        return `  <url>
    <loc>https://www.gajjugames.com/games/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }).join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.gajjugames.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${gameUrls}
</urlset>`;

      return new Response(xml, {
        headers: { "Content-Type": "application/xml; charset=utf-8" }
      });
    } catch (error) {
      return new Response("Error generating sitemap", { status: 500 });
    }
  }
};
