const API_BASE = 'https://api-mylistys-production.up.railway.app/api/v1/';
const FILES_URL = 'https://api-mylistys-production.up.railway.app/files/';
const APP_URL = 'https://www.mylistys.com';
const DEFAULT_IMAGE = `${APP_URL}/assets/logo/logoMyllistys.png`;

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resolveImage(raw) {
  if (!raw) return DEFAULT_IMAGE;
  if (raw.startsWith('http')) return raw;
  return FILES_URL + raw;
}

export default async function handler(req, res) {
  const { id } = req.query;
  const redirectUrl = `${APP_URL}/adminlist?id=${id}`;

  try {
    const response = await fetch(`${API_BASE}getonepost?id=${encodeURIComponent(id)}`);
    if (!response.ok) throw new Error('not found');
    const post = await response.json();

    const raw = post.imagen?.[0]?.large ?? post.imagen?.[0]?.medium ?? post.imagen?.[0]?.small;
    const imageUrl = resolveImage(raw);
    const title = escapeHtml(post.name || 'mylistys');
    const description = escapeHtml(
      post.description?.trim() || post.typePostName || 'Descubre y comparte contenido en mylistys'
    );
    const canonicalUrl = `${APP_URL}/share/${id}`;

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${title} | mylistys</title>
  <meta property="og:site_name" content="mylistys" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta http-equiv="refresh" content="0;url=${redirectUrl}" />
</head>
<body>
  <script>window.location.replace("${redirectUrl}");</script>
  <p><a href="${redirectUrl}">Ver en mylistys</a></p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    res.status(200).send(html);
  } catch {
    res.redirect(302, redirectUrl);
  }
}
