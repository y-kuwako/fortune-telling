// ======================================================
// /api/fortune クライアントヘルパー（結果キャッシュ付き）
// - window.xtenFetchFortune(payload) を公開
// - 成功時は鑑定JSON、失敗時は null（呼び出し側は null なら既存テンプレ表示のまま）
// - file:// やバックエンド未デプロイ環境では何もせず null（＝サイトは従来通り動く）
//
// 結果キャッシュ（localStorage）:
//   同じ人の同じ日・同じ計算結果なら API を再度叩かず保存済みを返す。
//   → コスト削減（リロードで再課金しない）＋再現性（その日の結果が変わらない）。
//   サーバー側KVキャッシュ（本番向け）は別途。設計書 docs/ai-api-design.md §7-1 参照。
// ======================================================
(function () {
  'use strict';

  var CACHE_KEY = 'xten.fortune.cache';
  var CACHE_VERSION = 'v1'; // プロンプト/スキーマ変更時にここを上げると全キャッシュ無効化

  // 簡易ハッシュ（calculated/tier の同一性判定用）
  function hashStr(s) {
    var h = 0;
    s = String(s);
    for (var i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
    return (h >>> 0).toString(36);
  }

  function cacheKeyOf(payload) {
    var date = (payload && payload.date) || '';
    var sig = hashStr(JSON.stringify((payload && payload.calculated) || {}) + '|' + ((payload && payload.tier) || ''));
    return CACHE_VERSION + ':' + (payload && payload.layer) + ':' + date + ':' + sig;
  }

  function readMap() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }

  function getCached(date, key) {
    var m = readMap();
    var e = m[key];
    return (e && e.date === date) ? e.data : null;
  }

  function setCached(date, key, data) {
    try {
      var m = readMap();
      var next = {};
      // 同じ日付のエントリだけ残す（前日以前のキャッシュは破棄してサイズを抑える）
      for (var k in m) { if (m[k] && m[k].date === date) next[k] = m[k]; }
      next[key] = { date: date, data: data };
      localStorage.setItem(CACHE_KEY, JSON.stringify(next));
    } catch (e) { /* 保存失敗は無視（容量超過など） */ }
  }

  window.xtenFetchFortune = async function (payload) {
    // ローカルファイル直開き時は API を叩かない（フォールバック）
    if (location.protocol === 'file:') return null;

    var date = (payload && payload.date) || '';
    var key = cacheKeyOf(payload);

    // 1) キャッシュヒット → API を叩かず即返す
    var cached = getCached(date, key);
    if (cached) return cached;

    // 2) キャッシュミス → API へ
    try {
      var res = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) return null;
      var data = await res.json();
      if (!data || !Array.isArray(data.sections)) return null;
      setCached(date, key, data);
      return data;
    } catch (e) {
      // ネットワーク不通・CORS・JSON破損など何が起きてもテンプレにフォールバック
      return null;
    }
  };
})();
