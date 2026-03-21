export const loadPluings = [
  {
    url: 'https://www.instagram.com/embed.js',
    globalObject: 'instgrm',
    callbackMethodPath: 'Embeds.process',
  },
  {
    url: 'https://platform.twitter.com/widgets.js',
    globalObject: 'twttr',
    callbackMethodPath: 'widgets.load',
  },
  {
    url: 'https://www.youtube.com/iframe_api',
    globalObject: 'YT',
    // No método a ejecutar directamente, la API tiene otro flujo
  },
  {
    url: 'https://www.tiktok.com/embed.js', // URL oficial del script (puede cambiar)
    globalObject: 'tt', // Objeto global que TikTok usa (ej: `tt.widgets`)
    callbackMethodPath: 'tt._onWidgetLoad',
  },
  {
    url: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0',
    globalObject: 'FB',
    callbackMethodPath: 'XFBML.parse',
  },
];
