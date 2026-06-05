/* ==========================================================================
   x-TEN — Hack Analytics 円環レーダーチャート
   --------------------------------------------------------------------------
   - 一般的なポリゴン型レーダーではなく「天体の軌道」を模した円形グラフ
   - Focus / Aggressive / Resilience の3軸を 120° ずつ配置
   - 中央リングに OVERALL スコア
   - 外周リングは 24 時間時計：最適アクション時間帯を弧で色分け表示
   - 公開 API:
       XTenRadar.render(container, {
         scores: { focus: 0-100, aggressive: 0-100, resilience: 0-100 },
         optimalHours: [{ from: 6, to: 9, level: 'peak'|'good'|'caution' }, ...],
         date: 'YYYY-MM-DD'   // 任意。指定なければ今日
       })
   - 引数なし呼び出し時はサンプルデータでセルフレンダリング
   ========================================================================== */

(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';

  // --- SVG ヘルパ ---------------------------------------------------------
  function el(tag, attrs, text) {
    const node = document.createElementNS(NS, tag);
    if (attrs) {
      for (const k in attrs) node.setAttribute(k, attrs[k]);
    }
    if (text != null) node.textContent = text;
    return node;
  }

  // 極座標 → 直交座標。angleDeg は北 (12時方向) を 0°、時計回り正。
  function polar(cx, cy, r, angleDeg) {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  // 円弧パス（外側リング塗り分け用）。startDeg/endDeg は北 0°時計回り。
  function arcPath(cx, cy, rInner, rOuter, startDeg, endDeg) {
    const large = endDeg - startDeg <= 180 ? 0 : 1;
    const p1 = polar(cx, cy, rOuter, startDeg);
    const p2 = polar(cx, cy, rOuter, endDeg);
    const p3 = polar(cx, cy, rInner, endDeg);
    const p4 = polar(cx, cy, rInner, startDeg);
    return [
      `M ${p1.x} ${p1.y}`,
      `A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x} ${p2.y}`,
      `L ${p3.x} ${p3.y}`,
      `A ${rInner} ${rInner} 0 ${large} 0 ${p4.x} ${p4.y}`,
      'Z'
    ].join(' ');
  }

  // --- 既定値 -------------------------------------------------------------
  const DEFAULT_SCORES = { focus: 72, aggressive: 48, resilience: 64 };
  const DEFAULT_HOURS  = [
    { from: 6,  to: 9,  level: 'good'    },
    { from: 11, to: 13, level: 'caution' },
    { from: 14, to: 17, level: 'peak'    },
    { from: 21, to: 23, level: 'good'    }
  ];

  const AXES = [
    { key: 'focus',      label: 'FOCUS',      angle:   0, cls: 'xt-orbit-node--focus' },
    { key: 'aggressive', label: 'AGGR',       angle: 120, cls: 'xt-orbit-node--aggressive' },
    { key: 'resilience', label: 'RESILIENCE', angle: 240, cls: 'xt-orbit-node--resilience' }
  ];

  const LEVEL_FILL = {
    peak:    'rgba(212, 175, 55, 0.55)',  // Metallic Gold = 特異点
    good:    'rgba(0, 240, 255, 0.30)',   // Cyber Cyan
    caution: 'rgba(239, 68, 68, 0.28)'    // Aggressive Red
  };

  // --- レンダリング本体 ---------------------------------------------------
  function render(container, options) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (!container) return;

    const opts = options || {};
    const scores = Object.assign({}, DEFAULT_SCORES, opts.scores || {});
    const hours  = Array.isArray(opts.optimalHours) && opts.optimalHours.length
      ? opts.optimalHours
      : DEFAULT_HOURS;
    const date = opts.date || formatDate(new Date());

    container.classList.add('xt-hack-radar');
    container.innerHTML = '';

    // Header
    const head = document.createElement('div');
    head.className = 'xt-hack-radar__head';
    head.innerHTML =
      '<span class="xt-hack-radar__title">Hack Analytics</span>' +
      '<span class="xt-hack-radar__date">' + date + ' · UTC+9</span>';
    container.appendChild(head);

    // Stage (SVG)
    const stage = document.createElement('div');
    stage.className = 'xt-hack-radar__stage';
    container.appendChild(stage);

    const svg = el('svg', { viewBox: '0 0 320 320', role: 'img', 'aria-label': 'Hack Analytics radar' });
    stage.appendChild(svg);

    const cx = 160, cy = 160;
    const rOuter = 150;   // 24時間リング外周
    const rInner = 130;   // 24時間リング内周
    const rDataMax = 110; // データプロットの最大半径
    const rAxisLabel = 122;

    // --- 24h リング塗り分け (外周) ---
    hours.forEach(seg => {
      if (seg.from === seg.to) return;
      const startDeg = (seg.from % 24) * 15;
      const endDeg   = (seg.to   % 24) * 15;
      const fill = LEVEL_FILL[seg.level] || LEVEL_FILL.good;
      // 24h を跨ぐケースは分割
      const segments = startDeg < endDeg
        ? [[startDeg, endDeg]]
        : [[startDeg, 360], [0, endDeg]];
      segments.forEach(([s, e]) => {
        if (e - s < 0.5) return;
        svg.appendChild(el('path', {
          d: arcPath(cx, cy, rInner, rOuter, s, e),
          fill,
          stroke: 'rgba(212,175,55,0.25)',
          'stroke-width': '0.5'
        }));
      });
    });

    // 24h リングの内外境界
    svg.appendChild(el('circle', { class: 'xt-orbit-ring', cx, cy, r: rOuter }));
    svg.appendChild(el('circle', { class: 'xt-orbit-ring', cx, cy, r: rInner }));

    // 24h ティック (1時間刻み) と数字 (主要4時刻)
    for (let h = 0; h < 24; h++) {
      const deg = h * 15;
      const isMajor = h % 6 === 0;          // 0/6/12/18 強調
      const isHour3 = h % 3 === 0;          // 3時間ごとに数字
      const inner  = polar(cx, cy, rOuter - 4, deg);
      const outer  = polar(cx, cy, rOuter + (isMajor ? 6 : 3), deg);
      svg.appendChild(el('line', {
        class: 'xt-orbit-tick',
        x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y,
        'stroke-width': isMajor ? '1.5' : '0.8',
        opacity: isMajor ? '1' : (isHour3 ? '0.7' : '0.4')
      }));
      if (isHour3) {
        const lp = polar(cx, cy, rOuter + 16, deg);
        const tx = el('text', {
          x: lp.x, y: lp.y + 3,
          'text-anchor': 'middle',
          class: isMajor ? 'xt-orbit-cardinal' : 'xt-orbit-label'
        }, String(h).padStart(2, '0'));
        svg.appendChild(tx);
      }
    }

    // --- 軌道リング (3層) ---
    [40, 70, 100].forEach(r => {
      svg.appendChild(el('circle', { class: 'xt-orbit-ring', cx, cy, r }));
    });

    // --- 3軸の軸線とラベル ---
    AXES.forEach(axis => {
      const end = polar(cx, cy, rDataMax + 6, axis.angle);
      svg.appendChild(el('line', {
        class: 'xt-orbit-axis',
        x1: cx, y1: cy, x2: end.x, y2: end.y
      }));
      const labelPos = polar(cx, cy, rAxisLabel, axis.angle);
      svg.appendChild(el('text', {
        x: labelPos.x,
        y: labelPos.y + 3,
        'text-anchor': 'middle',
        class: 'xt-orbit-label'
      }, axis.label));
    });

    // --- データプロット (三角形 + ノード) ---
    const points = AXES.map(axis => {
      const v = clamp(scores[axis.key], 0, 100) / 100;
      return Object.assign(polar(cx, cy, rDataMax * v, axis.angle), { axis, v });
    });
    const dStr = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ') + ' Z';
    svg.appendChild(el('path', { class: 'xt-orbit-data', d: dStr }));

    points.forEach(p => {
      svg.appendChild(el('circle', {
        class: 'xt-orbit-node ' + p.axis.cls,
        cx: p.x, cy: p.y, r: 4.5
      }));
    });

    // --- 軌道上の "惑星" (今日の時刻インジケータ) ---
    const now = new Date();
    const nowDeg = ((now.getHours() + now.getMinutes() / 60) % 24) * 15;
    const planetPos = polar(cx, cy, (rInner + rOuter) / 2, nowDeg);
    svg.appendChild(el('circle', {
      cx: planetPos.x, cy: planetPos.y, r: 3.5,
      class: 'xt-orbit-planet'
    }));

    // --- 中央 OVERALL ---
    const overall = Math.round(
      (scores.focus + scores.aggressive + scores.resilience) / 3
    );
    svg.appendChild(el('text', {
      x: cx, y: cy - 8,
      'text-anchor': 'middle',
      class: 'xt-orbit-center-title'
    }, 'OVERALL'));
    svg.appendChild(el('text', {
      x: cx, y: cy + 18,
      'text-anchor': 'middle',
      class: 'xt-orbit-center-value'
    }, String(overall)));

    // --- Legend (3メトリクス) ---
    const legend = document.createElement('div');
    legend.className = 'xt-hack-radar__legend';
    AXES.forEach(axis => {
      const v = Math.round(clamp(scores[axis.key], 0, 100));
      const item = document.createElement('div');
      item.className = 'xt-hack-radar__metric';
      item.setAttribute('data-metric', axis.key);
      item.innerHTML =
        '<div class="xt-hack-radar__metric-label">' + axis.label + '</div>' +
        '<div class="xt-hack-radar__metric-value">' + String(v).padStart(2, '0') + '</div>' +
        '<div class="xt-hack-radar__metric-bar"><i></i></div>';
      legend.appendChild(item);
      // 次フレームで bar を伸ばす
      requestAnimationFrame(() => {
        const fill = item.querySelector('i');
        if (fill) fill.style.right = (100 - v) + '%';
      });
    });
    container.appendChild(legend);

    // --- Caption ---
    const peakHour = hours.find(h => h.level === 'peak');
    const caption = document.createElement('div');
    caption.className = 'xt-hack-radar__caption';
    if (peakHour) {
      caption.innerHTML = '// OPTIMAL WINDOW &nbsp;<strong>'
        + pad2(peakHour.from) + ':00 — ' + pad2(peakHour.to) + ':00</strong>';
    } else {
      caption.innerHTML = '// OPTIMAL WINDOW &nbsp;<strong>—</strong>';
    }
    container.appendChild(caption);
  }

  // --- ユーティリティ -----------------------------------------------------
  function clamp(n, lo, hi) {
    n = Number(n);
    if (isNaN(n)) return lo;
    return Math.max(lo, Math.min(hi, n));
  }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function formatDate(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  // --- 自動初期化 ---------------------------------------------------------
  // [data-xt-radar] 属性のついた要素があれば自動レンダリング
  function autoInit() {
    const targets = document.querySelectorAll('[data-xt-radar]');
    targets.forEach(t => {
      let opts = {};
      const raw = t.getAttribute('data-xt-radar');
      if (raw && raw !== 'auto') {
        try { opts = JSON.parse(raw); } catch (e) { /* noop */ }
      }
      render(t, opts);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  // --- 公開 ---------------------------------------------------------------
  global.XTenRadar = { render, autoInit };
})(window);
