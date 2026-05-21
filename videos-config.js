/*
 * NEOTERRA 2050 — Configuration centrale
 * ─────────────────────────────────────────────────────────
 * Ce fichier contient :
 *   - L'ID Google Analytics utilisé sur les 6 pages du site
 *   - Les 31 IDs YouTube des vidéos du projet
 *
 * Pour modifier ce fichier, utilise admin.html (recommandé)
 * ou édite directement les valeurs ci-dessous puis pousse sur GitHub.
 */
window.NEOTERRA_CONFIG = {

  /* ─────────────────────────────────────────────────────────
   * GOOGLE ANALYTICS
   * ID de mesure GA4. Format : G-XXXXXXXXXX
   * ───────────────────────────────────────────────────────── */
  analytics: 'G-HV8B1Q54YP',

  /* ─────────────────────────────────────────────────────────
   * VIDÉOS YOUTUBE
   * Chaque clé est un emplacement vidéo dans le site.
   * La valeur est l'ID de la vidéo YouTube (les 11 caractères
   * dans l'URL : https://youtube.com/watch?v=ICI_LES_11_CARS)
   * Laisser '' (vide) → un placeholder "Vidéo à venir" s'affiche.
   * ───────────────────────────────────────────────────────── */
  videos: {

    /* ── index.html ── */
    'index-intro':                 '',

    /* ── projet.html ── */
    'projet-intro':                '',

    /* ── mars.html (5 onglets) ── */
    'mars-apercu':                 '',
    'mars-climat':                 '',
    'mars-paysages':               '',
    'mars-eau':                    '',
    'mars-colonisation':           '',

    /* ── cite.html (5 onglets) ── */
    'cite-plan':                   '',
    'cite-chiffres':               '',
    'cite-vision':                 '',
    'cite-batiments':              '',
    'cite-construction':           '',


    /* ── maquette.html (2 vidéos) ── */
    'maquette-construction':       '',
    'maquette-visite':             '',

    /* ── technologie.html (16 cartes) ── */
    'technologie-logement':        '',
    'technologie-education':       '',
    'technologie-energie':         '',
    'technologie-eau':             '',
    'technologie-air':             '',
    'technologie-agriculture':     '',
    'technologie-communication':   '',
    'technologie-transports':      '',
    'technologie-recyclage':       '',
    'technologie-medecine':        '',
    'technologie-construction-ia': '',
    'technologie-securite':        '',
    'technologie-sport':           '',
    'technologie-culture':         '',
    'technologie-terraforming':    '',
    'technologie-cohabitation':    '',

    /* ── architecte.html ── */
    'architecte-intro':            ''
  }
};
