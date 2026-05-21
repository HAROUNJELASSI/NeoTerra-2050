/*
 * NEOTERRA 2050 — Bootstrap script
 * ─────────────────────────────────────────────────────────
 * Chargé par les 6 pages du site après videos-config.js.
 * Rôles :
 *   1. Initialise Google Analytics (si un ID est configuré)
 *   2. Remplit tous les <div data-video-slot="..."> avec
 *      l'iframe YouTube correspondante (ou un placeholder)
 *
 * Les overrides locaux (testés via admin.html) sont lus
 * dans localStorage et priment sur les valeurs du config.
 */
(function() {
  'use strict';

  if (!window.NEOTERRA_CONFIG) {
    console.error('[NEOTERRA] videos-config.js doit être chargé avant neoterra-init.js');
    return;
  }

  /* ─────────────────────────────────────────────────────────
   * 1. GOOGLE ANALYTICS
   * ───────────────────────────────────────────────────────── */
  function initAnalytics() {
    const gaId = window.NEOTERRA_CONFIG.analytics;
    if (!gaId || gaId.indexOf('G-') !== 0) return;
    // Injecte le script gtag
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', gaId);
  }

  /* ─────────────────────────────────────────────────────────
   * 2. SLOTS VIDÉO
   * Remplit chaque <div data-video-slot="key"> avec l'iframe
   * YouTube (ou un placeholder si vide).
   * ───────────────────────────────────────────────────────── */
  function getOverrides() {
    try {
      return JSON.parse(localStorage.getItem('NEOTERRA_VIDEO_OVERRIDES') || '{}');
    } catch (e) {
      return {};
    }
  }
  function getVideoId(key) {
    const overrides = getOverrides();
    if (overrides[key]) return overrides[key];
    return (window.NEOTERRA_CONFIG.videos || {})[key] || '';
  }
  function buildIframe(videoId) {
    const url = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) + '?rel=0';
    return '<iframe src="' + url + '" loading="lazy" frameborder="0" ' +
           'referrerpolicy="strict-origin-when-cross-origin" ' +
           'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
           'allowfullscreen></iframe>';
  }
  function buildPlaceholder(key) {
    return '<div class="video-placeholder-content">' +
           '<div class="video-placeholder-icon">🎬</div>' +
           '<div class="video-placeholder-text">Vidéo à venir</div>' +
           '<div class="video-placeholder-key">' + key + '</div>' +
           '</div>';
  }
  function fillVideoSlots() {
    const slots = document.querySelectorAll('[data-video-slot]');
    slots.forEach(function(el) {
      const key = el.dataset.videoSlot;
      const videoId = getVideoId(key);
      // Si déjà rempli avec une iframe valide pour le même ID, ne pas refaire
      const existingIframe = el.querySelector('iframe');
      if (videoId && existingIframe && existingIframe.src.indexOf(videoId) >= 0) return;
      if (videoId) {
        el.innerHTML = buildIframe(videoId);
        el.classList.remove('video-empty');
      } else {
        el.innerHTML = buildPlaceholder(key);
        el.classList.add('video-empty');
      }
    });
  }

  /* Expose au scope global pour pouvoir rafraîchir après changement de slot dynamique */
  window.NEOTERRA = window.NEOTERRA || {};
  window.NEOTERRA.refreshVideoSlots = fillVideoSlots;
  window.NEOTERRA.getVideoId = getVideoId;
  /* Rafraîchit UN seul slot (utile quand un onglet change le data-video-slot dynamiquement) */
  window.NEOTERRA.refreshSlot = function(el) {
    if (!el || !el.dataset || !el.dataset.videoSlot) return;
    const key = el.dataset.videoSlot;
    const videoId = getVideoId(key);
    if (videoId) {
      el.innerHTML = buildIframe(videoId);
      el.classList.remove('video-empty');
    } else {
      el.innerHTML = buildPlaceholder(key);
      el.classList.add('video-empty');
    }
  };

  /* ─────────────────────────────────────────────────────────
   * INIT
   * ───────────────────────────────────────────────────────── */
  function init() {
    initAnalytics();
    fillVideoSlots();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
