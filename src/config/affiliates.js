export const INSTANT_GAMING_IGR_ID = 'game-recommended';
export const G2A_GNAME_ID = 'gamerecommended';

export const POPULAR_GAMES_LINKS = {
  '1245620': { ig: 'https://www.instant-gaming.com/es/4822-comprar-elden-ring-pc-juego-steam/' },
  '1091500': { ig: 'https://www.instant-gaming.com/es/2685-comprar-cyberpunk-2077-pc-juego-gog-com/' },
  '367520':  { ig: 'https://www.instant-gaming.com/es/2198-comprar-hollow-knight-pc-mac-steam/' },
  '620':     { ig: 'https://www.instant-gaming.com/es/400-comprar-portal-2-pc-mac-steam/' },
  '292030':  { ig: 'https://www.instant-gaming.com/es/290-comprar-the-witcher-3-wild-hunt-pc-juego-gog-com/' },
  '413150':  { ig: 'https://www.instant-gaming.com/es/2179-comprar-stardew-valley-pc-mac-steam/' },
};

export function getInstantGamingUrl(gameName, appId) {
  const appIdStr = String(appId || '');
  const popular = POPULAR_GAMES_LINKS[appIdStr];
  if (popular?.ig) {
    return `${popular.ig}?igr=${INSTANT_GAMING_IGR_ID}`;
  }
  return `https://www.instant-gaming.com/es/busquedas/?query=${encodeURIComponent(gameName || '')}&igr=${INSTANT_GAMING_IGR_ID}`;
}

export function getG2aUrl(gameName) {
  return `https://www.g2a.com/search?query=${encodeURIComponent(gameName || '')}&gname=${G2A_GNAME_ID}`;
}

export function getSteamStoreUrl(appId) {
  return `https://store.steampowered.com/app/${appId}`;
}
