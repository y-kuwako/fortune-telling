/* ==========================================================================
   x-TEN Global Navigation — 共有ロジック
   - localStorage の plan を読んで PLAN バッジを更新
   - 現在の URL から該当ナビ項目に `nav__link--active` を自動付与
   ========================================================================== */
(function () {
  'use strict';

  // 旧 shot ティアは廃止 → free に正規化
  var PLAN_LABELS = { free: 'FREE', basic: 'BASIC', premium: 'PREMIUM' };

  function refreshPlanBadge() {
    var el = document.querySelector('.plan-badge__value');
    if (!el) return;
    try {
      var raw = localStorage.getItem('celestia.plan');
      if (!raw) return;
      var parsed = JSON.parse(raw);
      var plan = parsed.plan === 'shot' ? 'free' : parsed.plan;
      if (PLAN_LABELS[plan]) el.textContent = PLAN_LABELS[plan];
    } catch (e) { /* noop */ }
  }

  function refreshActive() {
    var links = document.querySelectorAll('.nav .nav__link');
    if (!links.length) return;
    var path = location.pathname.replace(/\/+$/, '');
    var file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    var hash = (location.hash || '').toLowerCase();

    links.forEach(function (a) { a.classList.remove('nav__link--active'); });

    // 1) astrology-v2.html はハッシュで判定 (#hack/#month/#year/#core)
    if (file === 'astrology-v2.html') {
      var hashKey = (hash || '#hack').slice(1);
      var match = null;
      links.forEach(function (a) {
        var href = (a.getAttribute('href') || '').toLowerCase();
        var idx = href.indexOf('#');
        if (idx >= 0 && href.slice(idx + 1) === hashKey) match = a;
      });
      if (match) match.classList.add('nav__link--active');
      return;
    }

    // 2) それ以外はファイル名で判定
    var matched = null;
    links.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var hrefFile = href.split('#')[0].split('?')[0].split('/').pop();
      if (!hrefFile) hrefFile = 'index.html';
      if (hrefFile === file && !matched) matched = a;
    });
    if (matched) matched.classList.add('nav__link--active');
  }

  function init() {
    refreshPlanBadge();
    refreshActive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('hashchange', refreshActive);
})();
