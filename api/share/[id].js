const API_BASE = 'https://api-mylistys-production.up.railway.app/api/v1/';
const FILES_URL = 'https://api-mylistys-production.up.railway.app/files/';
const APP_URL = 'https://www.mylistys.com';
const DEFAULT_IMAGE = `${APP_URL}/assets/logo/logoMyllistys.png`;

function escapeHtml(str) {
  return String(str || '')
   .replace(/&/g,'&amp;')
   .replace(/"/g,'&quot;')
   .replace(/</g,'&lt;')
   .replace(/>/g,'&gt;');
}

function resolveImage(raw) {
  if (!raw) return DEFAULT_IMAGE;
  if (raw.startsWith('http')) return raw;
  return FILES_URL + raw;
}

function buildHtml({ title, description, imageUrl, canonicalUrl, redirectUrl }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${title} | mylistys</title>
  <meta property="og:site_name" content="mylistys" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${canonicalUrl}" />
</head>
<body>
  <script>window.location.replace("${redirectUrl}");</script>
  <p><a href="${redirectUrl}">Ver en mylistys</a></p>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  const id = req.query.id || (req.url || '').split('/').pop();
  const redirectUrl = `${APP_URL}/shared/${id}`;
  const canonicalUrl = `${APP_URL}/share/${id}`;

  let title = 'mylistys';
  let description = 'Descubre y comparte contenido en mylistys';
  let imageUrl = DEFAULT_IMAGE;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${API_BASE}shared/${encodeURIComponent(id)}`, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.ok) {
      const post = await response.json();
      const raw = post.imagen?.[0]?.large ?? post.imagen?.[0]?.medium ?? post.imagen?.[0]?.small;
      imageUrl = resolveImage(raw);
      title = escapeHtml(post.name || 'mylistys');
      description = escapeHtml(post.description?.trim() || post.typePostName || description);
    }
  } catch (_) {}

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
  return res.status(200).send(buildHtml({ title, description, imageUrl, canonicalUrl, redirectUrl }));
};