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
   * 2. BANNIÈRE GLOBALE
   * Lue depuis NEOTERRA_CONFIG.banner. Peut être surchargée
   * en local par localStorage.NEOTERRA_BANNER_OVERRIDE (JSON).
   * ───────────────────────────────────────────────────────── */
  function getBannerConfig() {
    let cfg = window.NEOTERRA_CONFIG.banner || null;
    try {
      const override = localStorage.getItem('NEOTERRA_BANNER_OVERRIDE');
      if (override) cfg = JSON.parse(override);
    } catch (e) {}
    return cfg;
  }

  function injectBannerStyles() {
    if (document.getElementById('neoterra-banner-styles')) return;
    const css =
      '.neoterra-banner{position:relative;display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;' +
      'padding:10px 50px 10px 24px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;' +
      'border-bottom:1px solid rgba(244,200,122,0.3);line-height:1.4;z-index:1000;' +
      'background:linear-gradient(90deg,#0d1530 0%,#1a2050 50%,#0d1530 100%);color:#f5e6c4}' +
      '.neoterra-banner.style-info{border-bottom-color:rgba(100,150,255,0.4)}' +
      '.neoterra-banner.style-warning{border-bottom-color:rgba(255,180,60,0.4)}' +
      '.neoterra-banner.style-success{border-bottom-color:rgba(94,214,112,0.4)}' +
      '.neoterra-banner-jbox{background:rgba(244,200,122,0.15);border:1px solid #f4c87a;border-radius:6px;' +
      'padding:4px 12px;color:#f4c87a;font-family:"Courier New",monospace;font-size:16px;font-weight:600;min-width:56px;text-align:center}' +
      '.neoterra-banner.style-info .neoterra-banner-jbox{border-color:#88aaff;color:#88aaff;background:rgba(136,170,255,0.1)}' +
      '.neoterra-banner.style-warning .neoterra-banner-jbox{border-color:#ffb43c;color:#ffb43c;background:rgba(255,180,60,0.12)}' +
      '.neoterra-banner.style-success .neoterra-banner-jbox{border-color:#5ed670;color:#5ed670;background:rgba(94,214,112,0.12)}' +
      '.neoterra-banner-msg{letter-spacing:0.5px}' +
      '.neoterra-banner-msg strong{color:#f4c87a;font-weight:600}' +
      '.neoterra-banner.style-info .neoterra-banner-msg strong{color:#88aaff}' +
      '.neoterra-banner.style-warning .neoterra-banner-msg strong{color:#ffb43c}' +
      '.neoterra-banner.style-success .neoterra-banner-msg strong{color:#5ed670}' +
      '.neoterra-banner-timer{font-family:"Courier New",monospace;font-size:11px;color:rgba(245,230,196,0.7);' +
      'padding-left:14px;border-left:1px solid rgba(244,200,122,0.25);letter-spacing:0.5px}' +
      '.neoterra-banner-close{position:absolute;top:50%;right:14px;transform:translateY(-50%);background:transparent;' +
      'border:none;color:rgba(245,230,196,0.6);font-size:18px;cursor:pointer;padding:4px 8px;line-height:1}' +
      '.neoterra-banner-close:hover{color:#f4c87a}' +
      '@media (max-width:600px){.neoterra-banner{font-size:12px;padding:8px 40px 8px 14px;gap:10px}' +
      '.neoterra-banner-jbox{font-size:14px;padding:3px 10px;min-width:48px}' +
      '.neoterra-banner-timer{display:none}}';
    const style = document.createElement('style');
    style.id = 'neoterra-banner-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function formatCountdown(diffMs) {
    if (diffMs <= 0) return { jLabel: 'J-0', timer: "C'est aujourd'hui !" };
    const j = Math.floor(diffMs / 86400000);
    const h = Math.floor((diffMs / 3600000) % 24);
    const m = Math.floor((diffMs / 60000) % 60);
    const s = Math.floor((diffMs / 1000) % 60);
    const pad = n => String(n).padStart(2, '0');
    return {
      jLabel: 'J-' + j,
      timer: pad(j) + ' j · ' + pad(h) + ' h · ' + pad(m) + ' min · ' + pad(s) + ' s'
    };
  }

  function initBanner() {
    const cfg = getBannerConfig();
    if (!cfg || !cfg.enabled) return;
    if (sessionStorage.getItem('NEOTERRA_BANNER_DISMISSED') === '1') return;

    injectBannerStyles();

    const banner = document.createElement('div');
    banner.className = 'neoterra-banner style-' + (cfg.style || 'info');
    banner.setAttribute('role', 'status');

    let html = '';
    if (cfg.mode === 'countdown' && cfg.targetDate) {
      html += '<div class="neoterra-banner-jbox" data-banner-jbox>J-?</div>';
      html += '<div class="neoterra-banner-msg">' +
              (cfg.message || 'Présentation') +
              '</div>';
      html += '<div class="neoterra-banner-timer" data-banner-timer>--</div>';
    } else {
      html += '<div class="neoterra-banner-msg">' + (cfg.message || '') + '</div>';
    }
    html += '<button class="neoterra-banner-close" aria-label="Fermer">✕</button>';
    banner.innerHTML = html;

    document.body.insertBefore(banner, document.body.firstChild);

    banner.querySelector('.neoterra-banner-close').addEventListener('click', function() {
      sessionStorage.setItem('NEOTERRA_BANNER_DISMISSED', '1');
      banner.remove();
    });

    if (cfg.mode === 'countdown' && cfg.targetDate) {
      const target = new Date(cfg.targetDate);
      const jboxEl = banner.querySelector('[data-banner-jbox]');
      const timerEl = banner.querySelector('[data-banner-timer]');
      function tick() {
        const diff = target - new Date();
        const { jLabel, timer } = formatCountdown(diff);
        if (jboxEl) jboxEl.textContent = jLabel;
        if (timerEl) timerEl.textContent = timer;
      }
      tick();
      setInterval(tick, 1000);
    }
  }

  /* ─────────────────────────────────────────────────────────
   * 3. SLOTS VIDÉO
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
    initBanner();
    fillVideoSlots();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
