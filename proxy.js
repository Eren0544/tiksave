export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { path, ...params } = req.query;
  if (!path) return res.status(400).json({ error: "path manquant" });

  const allowed = ["/api/", "/api/user/info", "/api/user/posts"];
  if (!allowed.some(p => path.startsWith(p)))
    return res.status(403).json({ error: "non autorisé" });

  const qs = new URLSearchParams(params).toString();
  const url = `https://tikwm.com${path}${qs ? "?" + qs : ""}`;

  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
        "Referer": "https://tikwm.com/",
        "Accept": "application/json",
      },
    });
    const data = await r.json();
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
