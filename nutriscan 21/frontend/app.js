/* ==========================================================================
   NutriScan AI — Apple Experience Single Page Application
   Inspired by Apple.com, iOS 18, macOS Sonoma & Apple Vision Pro
   ========================================================================== */
'use strict';

/* -------------------------------------------------- Apple Audio Feedback */
const AudioFX = {
  ctx: null,
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  play(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.06) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (_) {}
  },
  click() { this.play(800, 'sine', 0.04, 0.03); },
  snap() { this.play(1200, 'triangle', 0.06, 0.04); },
  chime() {
    this.play(523.25, 'sine', 0.15, 0.05);
    setTimeout(() => this.play(659.25, 'sine', 0.18, 0.05), 80);
    setTimeout(() => this.play(783.99, 'sine', 0.25, 0.06), 160);
  },
  alert() {
    this.play(300, 'sawtooth', 0.1, 0.04);
  }
};

/* -------------------------------------------------- Apple SVG Icons */
const I = {
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/>',
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3.5"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  plan: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 15l2 2 4-4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>',
  cloud: '<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2M12 12v9M16 16l-4-4-4 4"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  dumbbell: '<path d="M14.4 14.4 9.6 9.6M18.66 21.51a2 2 0 1 1-2.83-2.83l-1.77 1.77a2 2 0 1 1-2.83-2.83l6.37-6.37a2 2 0 1 1 2.83 2.83l-1.77 1.77a2 2 0 1 1 2.83 2.83zM21.5 21.5l-1.4-1.4M3.9 3.9 2.5 2.5M6.4 12.77a2 2 0 1 1-2.83-2.83l1.77-1.77a2 2 0 1 1-2.83-2.83l2.83-2.83a2 2 0 1 1 2.83 2.83l1.77-1.77a2 2 0 1 1 2.83 2.83z"/>',
  wheat: '<path d="M2 22 16 8M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94zM7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94zM11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94zM20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4z"/>',
  drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7z"/>',
  sprout: '<path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8zM14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  sparkles: '<path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2zM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/>',
  brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4M17.6 6.5A3 3 0 0 0 18 5M6 5a3 3 0 0 0 .4 1.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  swap: '<path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M9.9 4.24A9 9 0 0 1 12 4c6.5 0 10 7 10 7a18 18 0 0 1-2.16 3.19M6.6 6.6A18 18 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M2 2l20 20M14.1 14.1a3 3 0 1 1-4.2-4.2"/>',
  more: '<circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8M21 3v5h-5"/>',
  alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'
};

const ic = (name, extra = '') => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${I[name] || ''}</svg>`;

/* -------------------------------------------------- Helpers */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const TZ = -new Date().getTimezoneOffset();
const round = (n, d = 0) => { const f = 10 ** d; return Math.round((Number(n) || 0) * f) / f; };
const fmt = (n, d = 0) => round(n, d).toLocaleString(undefined, { maximumFractionDigits: d });
const clamp = (n, a, b) => Math.min(Math.max(n, a), b);
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

const COLORS = ['#30D158', '#0A84FF', '#BF5AF2', '#FF9F0A', '#FF453A', '#64D2FF', '#FFD60A', '#FF375F'];
const CAT_EMOJI = {
  bread: '🫓', grains: '🍚', south_indian: '🥞', legumes: '🥣', dairy: '🥛',
  curry: '🍛', protein: '🍗', vegetables: '🥗', drinks: '☕', fruit: '🍎',
  nuts: '🥜', fats: '🧈', snack: '🥟', fast_food: '🍔', sweets: '🍨', unknown: '🍽️'
};

const NUT = {
  calories: { label: 'Calories', unit: 'kcal', color: 'var(--apple-kcal)', icon: 'flame', goal: 'calorie_goal' },
  protein_g: { label: 'Protein', unit: 'g', color: 'var(--apple-protein)', icon: 'dumbbell', goal: 'protein_goal_g' },
  carbs_g: { label: 'Carbs', unit: 'g', color: 'var(--apple-carbs)', icon: 'wheat', goal: 'carbs_goal_g' },
  fat_g: { label: 'Fat', unit: 'g', color: 'var(--apple-fat)', icon: 'drop', goal: 'fat_goal_g' },
  fiber_g: { label: 'Fiber', unit: 'g', color: 'var(--apple-fiber)', icon: 'sprout', goal: 'fiber_goal_g' }
};

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

/* -------------------------------------------------- Application State */
const S = {
  token: localStorage.getItem('ns_token'),
  theme: localStorage.getItem('ns_apple_theme') || 'dark',
  user: null,
  engine: null,
  scan: null,
  analysis: null,
  results: { hot: null, showBoxes: true, saveName: '', mealType: null },
  plan: { tab: 'summary', days: 7 },
  history: { q: '', type: '' }
};

// Set initial theme
document.documentElement.setAttribute('data-theme', S.theme);
const metaThemeColor = $('#theme-color-meta');
if (metaThemeColor) metaThemeColor.content = S.theme === 'dark' ? '#000000' : '#FFFFFF';

function toggleTheme() {
  AudioFX.click();
  S.theme = S.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', S.theme);
  localStorage.setItem('ns_apple_theme', S.theme);
  if (metaThemeColor) metaThemeColor.content = S.theme === 'dark' ? '#000000' : '#FFFFFF';
  router();
}

/* -------------------------------------------------- Dynamic Island Toast */
function toast(msg, type = 'ok') {
  if (type === 'error') AudioFX.alert();
  else AudioFX.snap();
  const el = document.createElement('div');
  el.className = `dynamic-island-toast ${type === 'error' ? 'error' : ''}`;
  el.innerHTML = `${ic(type === 'error' ? 'alert' : 'check')}<span>${esc(msg)}</span>`;
  $('#toasts').appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-15px) scale(0.9)';
    setTimeout(() => el.remove(), 250);
  }, type === 'error' ? 4200 : 2800);
}

/* -------------------------------------------------- API Client */
async function api(path, { method = 'GET', body, signal } = {}) {
  let res;
  try {
    res = await fetch(path, {
      method, signal,
      headers: {
        'Content-Type': 'application/json',
        ...(S.token ? { Authorization: `Bearer ${S.token}` } : {})
      },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new Error('The NutriScan server is not reachable. Make sure it is running.');
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !path.includes('/auth/')) {
    clearSession();
    go('#/login');
    throw new Error('Your session expired. Log in again.');
  }
  if (!res.ok) {
    const err = new Error(data.error?.message || `Request failed (${res.status}).`);
    err.code = data.error?.code;
    throw err;
  }
  return data;
}

const imgSrc = (url) => (url ? `${url}?token=${encodeURIComponent(S.token)}` : '');

function setSession({ token, user }) {
  S.token = token;
  S.user = user;
  localStorage.setItem('ns_token', token);
}

function clearSession() {
  S.token = null;
  S.user = null;
  localStorage.removeItem('ns_token');
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

const firstName = () => (S.user?.name || '').split(' ')[0] || 'User';
const initials = () => (S.user?.name || 'NS').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

function dayLabel(iso) {
  const d = new Date(iso); const t = new Date();
  const k = (x) => x.toDateString();
  const y = new Date(); y.setDate(t.getDate() - 1);
  if (k(d) === k(t)) return 'Today';
  if (k(d) === k(y)) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

const timeLabel = (iso) => new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

/* -------------------------------------------------- Apple Activity Rings SVG */
function renderAppleActivityRings({ calories = 0, calorie_goal = 2000, protein = 0, protein_goal = 120, carbs = 0, carbs_goal = 250, fat = 0, fat_goal = 65 }, size = 160) {
  const strokeWidth = 11;
  const gap = 3.5;
  const center = size / 2;

  // 4 Concentric Rings: Move (Calories), Exercise (Protein), Fuel (Carbs), Fat
  const rings = [
    { radius: center - strokeWidth / 2 - 2, value: calories, goal: calorie_goal, color: '#FF375F', glow: 'rgba(255,55,95,0.4)', name: 'Calories', unit: 'kcal' },
    { radius: center - strokeWidth * 1.5 - gap - 2, value: protein, goal: protein_goal, color: '#30D158', glow: 'rgba(48,209,88,0.4)', name: 'Protein', unit: 'g' },
    { radius: center - strokeWidth * 2.5 - gap * 2 - 2, value: carbs, goal: carbs_goal, color: '#BF5AF2', glow: 'rgba(191,90,242,0.4)', name: 'Carbs', unit: 'g' },
    { radius: center - strokeWidth * 3.5 - gap * 3 - 2, value: fat, goal: fat_goal, color: '#FF9F0A', glow: 'rgba(255,159,10,0.4)', name: 'Fat', unit: 'g' }
  ];

  const svgRings = rings.map((r) => {
    const circ = 2 * Math.PI * r.radius;
    const pct = clamp(r.value / (r.goal || 1), 0, 1);
    const offset = circ * (1 - pct);
    return `
      <!-- Track ${r.name} -->
      <circle cx="${center}" cy="${center}" r="${r.radius}" stroke="${r.color}" stroke-opacity="0.16" stroke-width="${strokeWidth}" fill="none" />
      <!-- Fill ${r.name} with Quick Smooth Animation -->
      <circle class="ring-fill-circle" cx="${center}" cy="${center}" r="${r.radius}" stroke="${r.color}" stroke-width="${strokeWidth}" fill="none"
        stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ}" data-target-offset="${offset}"
        transform="rotate(-90 ${center} ${center})"
        style="transition: stroke-dashoffset 0.4s var(--ease-apple); filter: drop-shadow(0 0 5px ${r.glow});" />
    `;
  }).join('');

  return `
    <div class="apple-activity-widget">
      <div class="rings-svg-container" style="width:${size}px; height:${size}px;">
        <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
          ${svgRings}
        </svg>
      </div>
      <div class="rings-legend">
        ${rings.map((r) => {
          const reached = r.value >= r.goal && r.value > 0;
          return `
            <div class="ring-row ${reached ? 'goal-reached' : ''}">
              <div class="ring-label-wrap">
                <span class="ring-dot" style="background:${r.color}; box-shadow:0 0 8px ${r.glow};"></span>
                <span class="ring-name">${r.name}</span>
                ${reached ? `<span class="goal-check-badge" title="${r.name} Target Reached!">${ic('check', 'width="10" height="10"')}</span>` : ''}
              </div>
              <span class="ring-metric">${fmt(r.value, r.name === 'Calories' ? 0 : 1)} <small>/ ${fmt(r.goal)} ${r.unit}</small></span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function triggerRingAnimations() {
  requestAnimationFrame(() => {
    setTimeout(() => {
      $$('.ring-fill-circle').forEach((c) => {
        if (c.dataset.targetOffset) c.style.strokeDashoffset = c.dataset.targetOffset;
      });
    }, 40);
  });
}

/* -------------------------------------------------- Number Count-Up Animator */
function animateNumber(el, target, duration = 380, decimals = 0, suffix = '') {
  if (!el) return;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    el.innerHTML = `${fmt(target, decimals)}${suffix}`;
    return;
  }
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = start + (target - start) * ease;
    el.innerHTML = `${fmt(current, decimals)}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.innerHTML = `${fmt(target, decimals)}${suffix}`;
    }
  }
  requestAnimationFrame(update);
}

/* -------------------------------------------------- Router */
const ROUTES = {};
function go(hash) {
  AudioFX.click();
  if (location.hash === hash) router();
  else location.hash = hash;
}

async function router() {
  const [name = '', arg] = location.hash.replace(/^#\/?/, '').split('/');
  const route = name || (S.token ? 'home' : 'login');
  closeOverlays();
  if (!S.token && !['login', 'signup'].includes(route)) return go('#/login');
  if (S.token && ['login', 'signup'].includes(route)) return go('#/home');
  if (S.token && !S.user) {
    try {
      const me = await api('/api/v1/me');
      S.user = me.user;
      S.engine = me.engine;
    } catch (e) { return; }
  }
  const view = ROUTES[route] || ROUTES.home;
  window.scrollTo(0, 0);
  await view(arg);
}
window.addEventListener('hashchange', router);

/* Focus-preserving paint */
function paint(html) {
  const active = document.activeElement;
  const key = active?.dataset?.focus;
  const sel = key && active.selectionStart != null ? [active.selectionStart, active.selectionEnd] : null;
  $('#app').innerHTML = html;
  if (key) {
    const el = $(`[data-focus="${CSS.escape(key)}"]`);
    if (el) {
      el.focus();
      if (sel && el.setSelectionRange) {
        try { el.setSelectionRange(...sel); } catch (_) {}
      }
    }
  }
}

/* -------------------------------------------------- Apple Shell Layout */
function shell(active, content) {
  const navItems = [
    ['home', 'Home', 'home'],
    ['scan', 'Scan Meal', 'scan'],
    ['history', 'History', 'history'],
    ['plan', 'Trends & Goals', 'plan'],
    ['profile', 'Profile', 'user']
  ];

  const isVision = S.engine?.mode === 'vision';

  return `
    <div class="apple-navbar-wrap">
      <nav class="apple-navbar">
        <a href="#/home" class="nav-brand">
          <div class="nav-brand-icon">${ic('leaf')}</div>
          <span>NutriScan AI</span>
        </a>
        <div class="nav-links">
          ${navItems.map(([r, l, icon]) => `
            <a href="#/${r}" class="nav-link ${active === r ? 'active' : ''}" ${active === r ? 'aria-current="page"' : ''}>
              ${ic(icon)}
              <span>${l}</span>
            </a>
          `).join('')}
        </div>
        <div class="nav-actions">
          <a class="engine-pill" href="#/profile" title="${isVision ? 'Local Neural Vision AI Active' : 'Demo Mode Active'}">
            <span class="engine-dot" style="${isVision ? '' : 'background:var(--accent-amber);box-shadow:0 0 8px var(--accent-amber)'}"></span>
            <span>${isVision ? 'Vision AI' : 'Demo Mode'}</span>
          </a>
          <button class="theme-toggle-btn" id="theme-btn" aria-label="Toggle Dark/Light Mode">
            ${ic(S.theme === 'dark' ? 'sun' : 'moon')}
          </button>
          <div style="position:relative">
            <button class="user-btn" data-action="user-menu" aria-haspopup="true">
              <span class="user-avatar">${esc(initials())}</span>
              <span>${esc(firstName())}</span>
              ${ic('chevron', 'width="14" height="14"')}
            </button>
          </div>
        </div>
      </nav>
    </div>
    <main class="container page-view">
      ${content}
    </main>
  `;
}

/* Document Click Delegations */
document.addEventListener('click', async (e) => {
  const a = e.target.closest('[data-action]');
  const themeBtn = e.target.closest('#theme-btn');
  if (themeBtn) {
    toggleTheme();
    return;
  }

  const openMenu = $('.user-menu-popover');
  if (openMenu && !e.target.closest('.user-menu-popover') && a?.dataset.action !== 'user-menu') {
    openMenu.remove();
  }

  if (!a) return;
  const act = a.dataset.action;

  if (act === 'logout') {
    e.preventDefault();
    try { await api('/api/v1/auth/logout', { method: 'POST' }); } catch (_) {}
    clearSession();
    toast('Logged out successfully.');
    go('#/login');
  } else if (act === 'user-menu') {
    if (openMenu) return openMenu.remove();
    AudioFX.click();
    a.parentElement.insertAdjacentHTML('beforeend', `
      <div class="user-menu-popover" role="menu">
        <a href="#/profile" role="menuitem">${ic('user')} Account & Engine</a>
        <a href="#/plan" role="menuitem">${ic('target')} Nutrition Targets</a>
        <a href="#/history" role="menuitem">${ic('history')} Meal History</a>
        <button class="danger-item" data-action="logout" role="menuitem">${ic('logout')} Log Out</button>
      </div>
    `);
  } else if (act === 'pick-file') {
    AudioFX.click();
    $('#file-input').click();
  } else if (act === 'camera') {
    AudioFX.click();
    openCamera();
  } else if (act === 'load-sample') {
    const filename = a.dataset.sample;
    const name = a.dataset.name;
    loadSampleDish(filename, name);
  }
});

/* -------------------------------------------------- Load Sample Dish */
async function loadSampleDish(filename, name) {
  try {
    AudioFX.snap();
    toast(`Loading ${name}…`);
    const res = await fetch(`/samples/${filename}`);
    if (!res.ok) throw new Error('Sample not found');
    const blob = await res.blob();
    const reader = new FileReader();
    reader.onload = () => {
      setScanImage(reader.result, filename, blob.size);
    };
    reader.readAsDataURL(blob);
  } catch (err) {
    toast(`Could not load sample: ${err.message}`, 'error');
  }
}

/* ================================================================ Auth Views */
ROUTES.login = () => {
  paint(`
    <div class="apple-auth-wrap">
      <div class="apple-auth-card">
        <div class="auth-brand-badge">
          <div class="auth-brand-logo">${ic('leaf')}</div>
        </div>
        <div>
          <h1 class="auth-title">NutriScan AI</h1>
          <p class="auth-subtitle">Sign in to experience precision nutrition.</p>
        </div>
        <div id="auth-error"></div>
        <form id="auth-form" style="display:flex; flex-direction:column; gap:1.1rem;">
          <div class="field">
            <label for="email">Email</label>
            <div class="input-wrap">
              ${ic('mail')}
              <input class="input" id="email" type="email" placeholder="name@example.com" autocomplete="email" required>
            </div>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <div class="input-wrap">
              ${ic('lock')}
              <input class="input" id="password" type="password" placeholder="••••••••" autocomplete="current-password" required>
              <button type="button" class="icon-btn" data-toggle-pw aria-label="Toggle password" style="width:28px;height:28px">
                ${ic('eye')}
              </button>
            </div>
          </div>
          <button class="btn btn-emerald btn-lg btn-block" type="submit" style="margin-top:0.4rem">
            Sign In
          </button>
        </form>
        <div class="divider-or">or continue with</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.8rem;">
          <button type="button" class="btn btn-secondary btn-block" data-social="Google">
            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3.1-3.1A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg>
            Google
          </button>
          <button type="button" class="btn btn-secondary btn-block" data-social="Apple">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.6 1.3-.1 1.7-.8 3.3-.8s2 .8 3.4.8c1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.6-1-2.6-4.1zM13.9 5c.7-.9 1.2-2 1-3.2-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5z"/></svg>
            Apple
          </button>
        </div>
        <p style="text-align:center; font-size:0.9rem; color:var(--text-secondary)">
          Don't have an account? <a class="link" href="#/signup" style="color:var(--accent-blue); font-weight:600">Create one</a>
        </p>
      </div>
    </div>
  `);
  bindAuth('login');
};

ROUTES.signup = () => {
  paint(`
    <div class="apple-auth-wrap">
      <div class="apple-auth-card">
        <div class="auth-brand-badge">
          <div class="auth-brand-logo">${ic('leaf')}</div>
        </div>
        <div>
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Join NutriScan AI in less than a minute.</p>
        </div>
        <div id="auth-error"></div>
        <form id="auth-form" style="display:flex; flex-direction:column; gap:1.1rem;">
          <div class="field">
            <label for="name">Your Name</label>
            <div class="input-wrap">
              ${ic('user')}
              <input class="input" id="name" placeholder="John Appleseed" autocomplete="name" required>
            </div>
          </div>
          <div class="field">
            <label for="email">Email</label>
            <div class="input-wrap">
              ${ic('mail')}
              <input class="input" id="email" type="email" placeholder="name@example.com" autocomplete="email" required>
            </div>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <div class="input-wrap">
              ${ic('lock')}
              <input class="input" id="password" type="password" placeholder="At least 6 characters" autocomplete="new-password" minlength="6" required>
              <button type="button" class="icon-btn" data-toggle-pw aria-label="Toggle password" style="width:28px;height:28px">
                ${ic('eye')}
              </button>
            </div>
          </div>
          <button class="btn btn-emerald btn-lg btn-block" type="submit" style="margin-top:0.4rem">
            Create Account
          </button>
        </form>
        <p style="text-align:center; font-size:0.9rem; color:var(--text-secondary)">
          Already have an account? <a class="link" href="#/login" style="color:var(--accent-blue); font-weight:600">Sign in</a>
        </p>
      </div>
    </div>
  `);
  bindAuth('signup');
};

function bindAuth(mode) {
  const form = $('#auth-form');
  $('[data-toggle-pw]').onclick = (e) => {
    AudioFX.click();
    const input = $('#password');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    e.currentTarget.innerHTML = ic(show ? 'eyeOff' : 'eye');
  };

  $$('[data-social]').forEach((b) => {
    b.onclick = () => toast(`${b.dataset.social} OAuth requires cloud credentials. Please sign in with email.`, 'error');
  });

  form.onsubmit = async (e) => {
    e.preventDefault();
    AudioFX.snap();
    const btn = form.querySelector('[type=submit]');
    const origText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>';
    const body = { email: $('#email').value, password: $('#password').value };
    if (mode === 'signup') body.name = $('#name').value;
    try {
      const res = await api(`/api/v1/auth/${mode}`, { method: 'POST', body });
      setSession(res);
      const me = await api('/api/v1/me');
      S.engine = me.engine;
      AudioFX.chime();
      toast(mode === 'signup' ? `Welcome, ${firstName()}!` : `Welcome back, ${firstName()}!`);
      go('#/home');
    } catch (err) {
      $('#auth-error').innerHTML = `<div style="padding:0.75rem 1rem; border-radius:10px; background:rgba(255,69,58,0.15); color:var(--accent-red); font-size:0.85rem; font-weight:500;">${esc(err.message)}</div>`;
      btn.disabled = false;
      btn.textContent = origText;
    }
  };
}

/* ================================================================ Home View */
ROUTES.home = async () => {
  paint(shell('home', `
    <!-- Apple Keynote Hero Banner -->
    <section class="apple-card hero-showcase home-hero">
      <div class="hero-content">
        <span class="eyebrow">${ic('sparkles')} A clearer picture of what’s on your plate</span>
        <h1 class="headline-hero headline-gradient">Know your meal.<br><span class="headline-aurora">Feel your best.</span></h1>
        <p class="subheadline">A quick photo turns your meal into a thoughtful nutrition breakdown. Simple to explore, easy to make your own.</p>
        <div class="hero-actions">
          <button class="btn btn-emerald btn-lg" data-action="pick-file">
            ${ic('upload')} Scan your meal
          </button>
          <a class="btn btn-secondary btn-lg home-explore-link" href="#sample-meals">Explore sample meals ${ic('arrowRight')}</a>
        </div>
        <div class="home-trust-row"><span>${ic('shield')} Your photos stay on this device</span><span>${ic('sparkles')} Built for everyday meals</span></div>
      </div>
      <div class="hero-preview-phone">
        <div class="phone-mockup">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            <div class="viewfinder-box" style="height:100%; border-radius:24px;">
              <img src="/samples/thali_special.jpg" class="viewfinder-image" alt="AI Food Scanner Viewfinder">
              <div class="vf-corner vf-tl"></div>
              <div class="vf-corner vf-tr"></div>
              <div class="vf-corner vf-bl"></div>
              <div class="vf-corner vf-br"></div>
              <div class="laser-beam"></div>
              <div class="spatial-bbox" style="top:25%; left:20%; width:35%; height:30%; --box-color:#30D158;">
              <span class="spatial-tag" style="--box-color:#30D158;">A closer look at your plate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bento Grid Showcase -->
    <div class="bento-grid">
      <!-- Apple Activity Rings Bento -->
      <section class="apple-card col-7 interactive" onclick="location.hash='#/plan'">
        <div class="card-header">
          <h2 class="card-title">${ic('target')} Today's Activity Rings</h2>
          <span class="text-secondary" style="font-size:0.85rem">View targets →</span>
        </div>
        <div id="home-rings-widget">
          <div style="height:160px; display:grid; place-items:center;"><span class="spinner"></span></div>
        </div>
      </section>

      <!-- Neural Engine Bento -->
      <section class="apple-card col-5 interactive" onclick="location.hash='#/profile'">
        <div class="card-header">
          <h2 class="card-title">${ic('brain')} Neural Vision Engine</h2>
          <span class="engine-pill"><span class="engine-dot"></span> Active</span>
        </div>
        <p class="text-secondary" style="font-size:0.92rem; line-height:1.5;">
          Hybrid architecture pairing <b>YOLOv8n</b> for spatial bounding box localization with <b>MobileNetV3</b> for deep visual classification.
        </p>
        <div style="display:flex; gap:0.6rem; margin-top:1.2rem; flex-wrap:wrap;">
          <span class="chip on">70+ Foods Catalog</span>
          <span class="chip on">IFCT 2017 & USDA</span>
          <span class="chip on">Local Privacy</span>
        </div>
      </section>

      <!-- 1-Click Sample Meals Quick-Try Shelf -->
      <section class="apple-card col-12 home-samples" id="sample-meals">
        <div class="card-header">
          <div>
            <h2 class="card-title">${ic('sparkles')} Take a closer look</h2>
            <p class="text-secondary" style="font-size:0.88rem">Choose a sample meal to see how a scan becomes a nutrition breakdown.</p>
          </div>
        </div>
        <div class="sample-shelf">
          <div class="sample-dish-card" data-action="load-sample" data-sample="thali_special.jpg" data-name="North Indian Thali">
            <img src="/samples/thali_special.jpg" class="sample-dish-thumb" alt="North Indian Thali">
            <div class="sample-dish-info">
              <span class="sample-dish-name">North Indian Thali</span>
              <span class="sample-dish-meta"><span>Roti, Dal, Paneer, Rice</span> <span>540 kcal</span></span>
            </div>
          </div>
          <div class="sample-dish-card" data-action="load-sample" data-sample="chicken_biryani.jpg" data-name="Chicken Biryani">
            <img src="/samples/chicken_biryani.jpg" class="sample-dish-thumb" alt="Chicken Biryani">
            <div class="sample-dish-info">
              <span class="sample-dish-name">Chicken Biryani</span>
              <span class="sample-dish-meta"><span>Spiced Rice & Chicken</span> <span>620 kcal</span></span>
            </div>
          </div>
          <div class="sample-dish-card" data-action="load-sample" data-sample="chole_bhature.jpg" data-name="Chole Bhature">
            <img src="/samples/chole_bhature.jpg" class="sample-dish-thumb" alt="Chole Bhature">
            <div class="sample-dish-info">
              <span class="sample-dish-name">Chole Bhature</span>
              <span class="sample-dish-meta"><span>Chickpea Curry & Puri</span> <span>580 kcal</span></span>
            </div>
          </div>
          <div class="sample-dish-card" data-action="load-sample" data-sample="paneer_roti.jpg" data-name="Paneer Sabzi & Roti">
            <img src="/samples/paneer_roti.jpg" class="sample-dish-thumb" alt="Paneer Sabzi & Roti">
            <div class="sample-dish-info">
              <span class="sample-dish-name">Paneer Sabzi & Roti</span>
              <span class="sample-dish-meta"><span>Cottage Cheese & Flatbread</span> <span>490 kcal</span></span>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Meals Timeline Card -->
      <section class="apple-card col-12">
        <div class="card-header">
          <h2 class="card-title">${ic('history')} Recent Meal Log</h2>
          <a href="#/history" class="btn btn-secondary btn-sm">View Timeline →</a>
        </div>
        <div id="home-recent-meals">
          <div style="height:100px; display:grid; place-items:center;"><span class="spinner"></span></div>
        </div>
      </section>
    </div>
  `));

  // Load live statistics
  try {
    const [sum, mealsData] = await Promise.all([
      api(`/api/v1/summary?days=7&tz=${TZ}`),
      api('/api/v1/meals?limit=4')
    ]);

    const g = sum.goals;
    const t = sum.today;

    $('#home-rings-widget').innerHTML = renderAppleActivityRings({
      calories: t.calories,
      calorie_goal: g.calorie_goal,
      protein: t.protein_g,
      protein_goal: g.protein_goal_g,
      carbs: t.carbs_g,
      carbs_goal: g.carbs_goal_g,
      fat: t.fat_g,
      fat_goal: g.fat_goal_g
    }, 160);

    const meals = mealsData.meals;
    const recentEl = $('#home-recent-meals');
    if (!meals.length) {
      recentEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-emoji">🥗</div>
          <h3>No meals logged today yet</h3>
          <p class="text-secondary">Scan a meal photo or load a sample week to preview your nutritional trends.</p>
          <div style="display:flex; gap:0.8rem; margin-top:0.5rem">
            <button class="btn btn-emerald" data-action="pick-file">${ic('upload')} Scan First Meal</button>
            <button class="btn btn-secondary" data-seed>Load Sample Week</button>
          </div>
        </div>
      `;
    } else {
      recentEl.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:0.8rem;">
          ${meals.map(mealRow).join('')}
        </div>
      `;
      bindMealRows(meals);
    }
    bindSeed();
  } catch (err) {
    toast(err.message, 'error');
  }
};

/* -------------------------------------------------- Meal Seeder */
function bindSeed() {
  $$('[data-seed]').forEach((b) => {
    b.onclick = async () => {
      AudioFX.snap();
      b.disabled = true;
      b.innerHTML = '<span class="spinner"></span>';
      try {
        const r = await api('/api/v1/demo/seed', { method: 'POST', body: { tz: TZ } });
        AudioFX.chime();
        toast(`Generated ${r.created} sample meals!`);
        router();
      } catch (e) {
        toast(e.message, 'error');
        b.disabled = false;
        b.textContent = 'Load Sample Week';
      }
    };
  });
}

/* ================================================================ Scan View */
$('#file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (file) acceptFile(file);
});

function acceptFile(file) {
  const okType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  S.scan = { filename: file.name, size: file.size, dataUrl: null, quality: null, checking: false, error: null };
  if (!okType) S.scan.error = `${file.name} isn't supported. Please use JPG, PNG, or WEBP.`;
  else if (file.size > 5 * 1024 * 1024) S.scan.error = `File size is ${(file.size / 1048576).toFixed(1)} MB. The maximum is 5 MB.`;
  if (S.scan.error) {
    S.scan.dataUrl = null;
    return location.hash === '#/scan' ? ROUTES.scan() : go('#/scan');
  }
  const reader = new FileReader();
  reader.onload = () => { setScanImage(reader.result, file.name, file.size); };
  reader.readAsDataURL(file);
}

async function setScanImage(dataUrl, filename, size) {
  S.scan = { dataUrl, filename, size, quality: null, checking: true, error: null };
  if (location.hash !== '#/scan') go('#/scan');
  else ROUTES.scan();
  try {
    const r = await api('/api/v1/quality-check', { method: 'POST', body: { image: dataUrl } });
    if (S.scan?.dataUrl !== dataUrl) return;
    S.scan.quality = r.quality;
    S.scan.format = r.format;
  } catch (e) {
    if (S.scan?.dataUrl !== dataUrl) return;
    S.scan.error = e.message;
  }
  S.scan.checking = false;
  if (location.hash === '#/scan') ROUTES.scan();
}

ROUTES.scan = () => {
  const sc = S.scan;
  let scanContent;

  if (!sc?.dataUrl) {
    scanContent = `
      <div class="apple-dropzone" id="dropzone" role="button" tabindex="0">
        <div class="dropzone-icon-circle">${ic('cloud')}</div>
        <h2 style="font-size:1.35rem; font-weight:600">Drag & Drop Meal Photo</h2>
        <p class="text-secondary" style="max-width:420px; font-size:0.92rem;">
          Take a top-down shot of your meal in good lighting for the most accurate spatial detection.
        </p>
        <div style="display:flex; gap:0.8rem; margin-top:0.6rem">
          <button class="btn btn-emerald" data-action="pick-file">${ic('upload')} Select File</button>
          <button class="btn btn-secondary" data-action="camera">${ic('camera')} Live Camera</button>
        </div>
      </div>

      <div style="margin-top:2rem">
        <h3 style="font-size:1.1rem; font-weight:600; margin-bottom:0.8rem">${ic('sparkles')} Or Select A Sample Dish</h3>
        <div class="sample-shelf">
          <div class="sample-dish-card" data-action="load-sample" data-sample="thali_special.jpg" data-name="North Indian Thali">
            <img src="/samples/thali_special.jpg" class="sample-dish-thumb" alt="North Indian Thali">
            <div class="sample-dish-info">
              <span class="sample-dish-name">North Indian Thali</span>
              <span class="sample-dish-meta"><span>Roti, Dal, Paneer, Rice</span> <span>540 kcal</span></span>
            </div>
          </div>
          <div class="sample-dish-card" data-action="load-sample" data-sample="chicken_biryani.jpg" data-name="Chicken Biryani">
            <img src="/samples/chicken_biryani.jpg" class="sample-dish-thumb" alt="Chicken Biryani">
            <div class="sample-dish-info">
              <span class="sample-dish-name">Chicken Biryani</span>
              <span class="sample-dish-meta"><span>Spiced Rice & Chicken</span> <span>620 kcal</span></span>
            </div>
          </div>
          <div class="sample-dish-card" data-action="load-sample" data-sample="chole_bhature.jpg" data-name="Chole Bhature">
            <img src="/samples/chole_bhature.jpg" class="sample-dish-thumb" alt="Chole Bhature">
            <div class="sample-dish-info">
              <span class="sample-dish-name">Chole Bhature</span>
              <span class="sample-dish-meta"><span>Chickpea Curry & Puri</span> <span>580 kcal</span></span>
            </div>
          </div>
          <div class="sample-dish-card" data-action="load-sample" data-sample="paneer_roti.jpg" data-name="Paneer Sabzi & Roti">
            <img src="/samples/paneer_roti.jpg" class="sample-dish-thumb" alt="Paneer Sabzi & Roti">
            <div class="sample-dish-info">
              <span class="sample-dish-name">Paneer Sabzi & Roti</span>
              <span class="sample-dish-meta"><span>Cottage Cheese & Flatbread</span> <span>490 kcal</span></span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    const q = sc.quality;
    scanContent = `
      <div class="bento-grid" style="margin-top:0">
        <div class="col-7">
          <div class="viewfinder-box">
            <img src="${sc.dataUrl}" class="viewfinder-image" alt="Selected meal photo">
            <div class="vf-corner vf-tl"></div>
            <div class="vf-corner vf-tr"></div>
            <div class="vf-corner vf-bl"></div>
            <div class="vf-corner vf-br"></div>
            <div class="laser-beam"></div>
          </div>
        </div>
        <div class="col-5">
          <div class="apple-card" style="height:100%; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <span class="eyebrow">${ic('sparkles')} Ready For Neural Analysis</span>
              <h2 style="font-size:1.6rem; font-weight:700; margin-bottom:1rem">${esc(sc.filename)}</h2>
              
              <div style="display:flex; flex-direction:column; gap:0.8rem; margin-bottom:1.5rem">
                <div style="display:flex; justify-content:space-between; font-size:0.92rem; border-bottom:1px solid var(--border-subtle); padding-bottom:0.4rem">
                  <span class="text-secondary">File Size</span>
                  <span class="mono">${(sc.size / 1024).toFixed(0)} KB</span>
                </div>
                ${q ? `
                  <div style="display:flex; justify-content:space-between; font-size:0.92rem; border-bottom:1px solid var(--border-subtle); padding-bottom:0.4rem">
                    <span class="text-secondary">Dimensions</span>
                    <span class="mono">${q.width} × ${q.height} px</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; font-size:0.92rem; border-bottom:1px solid var(--border-subtle); padding-bottom:0.4rem">
                    <span class="text-secondary">Quality Score</span>
                    <span style="font-weight:600; color:${q.score >= 70 ? 'var(--accent-green)' : 'var(--accent-amber)'}">
                      ${q.label} (${q.score}/100)
                    </span>
                  </div>
                ` : ''}
              </div>

              ${sc.checking ? `
                <div style="display:flex; align-items:center; gap:0.6rem; color:var(--accent-green)">
                  <span class="spinner"></span>
                  <span style="font-size:0.9rem">Validating lighting & contrast…</span>
                </div>
              ` : sc.error ? `
                <div style="color:var(--accent-red); font-size:0.9rem">${esc(sc.error)}</div>
              ` : ''}
            </div>

            <div style="display:flex; gap:0.8rem; flex-wrap:wrap; margin-top:1.5rem">
              <button class="btn btn-emerald btn-lg" id="analyze-btn" ${sc.checking || sc.error ? 'disabled' : ''}>
                ${ic('sparkles')} Run Neural Scan
              </button>
              <button class="btn btn-secondary" data-action="pick-file">Choose Different</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  paint(shell('scan', `
    <div style="margin-bottom:1.5rem">
      <h1 class="headline-hero headline-gradient" style="font-size:2.4rem">Scan Meal</h1>
      <p class="subheadline">Upload or capture your plate to trigger automatic bounding box localization and nutritional mapping.</p>
    </div>
    ${scanContent}
  `));

  const dz = $('#dropzone');
  if (dz) {
    dz.ondragover = (e) => { e.preventDefault(); dz.classList.add('drag'); };
    dz.ondragleave = () => dz.classList.remove('drag');
    dz.ondrop = (e) => {
      e.preventDefault();
      dz.classList.remove('drag');
      const f = e.dataTransfer.files[0];
      if (f) acceptFile(f);
    };
    dz.onclick = (e) => {
      if (!e.target.closest('button')) $('#file-input').click();
    };
  }

  const btn = $('#analyze-btn');
  if (btn) btn.onclick = runAnalysis;
};

/* -------------------------------------------------- Live Camera Viewfinder Modal */
let camStream = null;
function stopCamera() {
  if (camStream) {
    camStream.getTracks().forEach((t) => t.stop());
    camStream = null;
  }
}

function closeOverlays() {
  stopCamera();
  $('#overlay-root').innerHTML = '';
}

async function openCamera() {
  AudioFX.snap();
  if (!navigator.mediaDevices?.getUserMedia) {
    toast('Camera is not supported on this device. Choose a photo file.', 'error');
    return $('#file-input').click();
  }

  $('#overlay-root').innerHTML = `
    <div class="apple-modal-back" id="cam-modal">
      <div class="apple-modal" style="max-width:680px">
        <div class="modal-header">
          <h2 style="font-size:1.15rem; font-weight:600">${ic('camera')} Camera Viewfinder</h2>
          <button class="icon-btn" id="cam-close" aria-label="Close">${ic('x')}</button>
        </div>
        <div class="modal-body" style="padding:1.2rem">
          <div class="viewfinder-box" id="cam-view" style="aspect-ratio:4/3; max-height:420px">
            <span class="spinner" style="color:#fff"></span>
            <div class="vf-corner vf-tl"></div>
            <div class="vf-corner vf-tr"></div>
            <div class="vf-corner vf-bl"></div>
            <div class="vf-corner vf-br"></div>
            <div class="laser-beam"></div>
          </div>
          <p class="text-secondary" style="font-size:0.86rem; text-align:center; margin-top:0.5rem">
            Center your food in the reticle with clear lighting and steady focus.
          </p>
        </div>
        <div class="modal-footer" id="cam-actions">
          <button class="btn btn-secondary" id="cam-cancel">Cancel</button>
          <button class="btn btn-emerald btn-lg" id="cam-shoot" disabled>${ic('camera')} Capture Shot</button>
        </div>
      </div>
    </div>
  `;

  $('#cam-close').onclick = closeOverlays;
  $('#cam-cancel').onclick = closeOverlays;

  try {
    camStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1440 } },
      audio: false
    });
  } catch (e) {
    closeOverlays();
    toast('Camera permission denied or camera unavailable. Upload a photo instead.', 'error');
    return;
  }

  const view = $('#cam-view');
  if (!view) return stopCamera();
  view.innerHTML = `
    <video autoplay playsinline muted style="width:100%; height:100%; object-fit:cover;"></video>
    <div class="vf-corner vf-tl"></div>
    <div class="vf-corner vf-tr"></div>
    <div class="vf-corner vf-bl"></div>
    <div class="vf-corner vf-br"></div>
    <div class="laser-beam"></div>
  `;
  const video = $('video', view);
  video.srcObject = camStream;
  const shoot = $('#cam-shoot');
  shoot.disabled = false;

  shoot.onclick = () => {
    AudioFX.snap();
    const c = document.createElement('canvas');
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    c.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = c.toDataURL('image/jpeg', 0.92);
    stopCamera();
    view.innerHTML = `<img src="${dataUrl}" class="viewfinder-image" alt="Captured photo">`;
    $('#cam-actions').innerHTML = `
      <button class="btn btn-secondary" id="cam-retake">${ic('refresh')} Retake</button>
      <button class="btn btn-emerald btn-lg" id="cam-use">${ic('check')} Analyze This Photo</button>
    `;
    $('#cam-retake').onclick = () => { closeOverlays(); openCamera(); };
    $('#cam-use').onclick = () => {
      closeOverlays();
      const name = `camera_${Date.now()}.jpg`;
      setScanImage(dataUrl, name, Math.round((dataUrl.length * 3) / 4));
    };
  };
}

/* -------------------------------------------------- Processing Overlay */
const STAGES = [
  ['Running Neural Detector', 'YOLOv8 is localizing bounding boxes on detected food entities…'],
  ['Mapping Nutrition Catalog', 'Querying 70+ dishes against USDA & IFCT databases…'],
  ['Synthesizing Results', 'Calculating macronutrient splits and caloric densities…']
];

async function runAnalysis() {
  const sc = S.scan;
  if (!sc?.dataUrl) return;
  AudioFX.snap();
  const ctrl = new AbortController();
  let progress = 5;
  let stageIdx = 0;

  const root = $('#overlay-root');
  const draw = () => {
    root.innerHTML = `
      <div class="processing-screen" role="dialog" aria-modal="true">
        <div class="processing-pulse-ring">
          <div class="processing-core">${ic('brain')}</div>
        </div>
        <span class="eyebrow">${ic('sparkles')} NEURAL RECOGNITION IN PROGRESS</span>
        <h2 style="font-size:1.8rem; font-weight:700; margin:0.4rem 0 0.8rem; color:#FFFFFF">${STAGES[stageIdx][0]}</h2>
        <p style="color:rgba(255,255,255,0.7); font-size:1rem; max-width:480px; margin-bottom:1.5rem">${STAGES[stageIdx][1]}</p>
        <div style="width:280px; height:6px; border-radius:9999px; background:rgba(255,255,255,0.15); overflow:hidden; margin-bottom:1.5rem">
          <div style="height:100%; border-radius:9999px; background:linear-gradient(90deg, #30D158, #0A84FF); width:${progress}%; transition:width 0.3s var(--ease-apple)"></div>
        </div>
        <button class="btn btn-secondary btn-sm" id="cancel-scan">Cancel Scan</button>
      </div>
    `;
    $('#cancel-scan').onclick = () => { ctrl.abort(); };
  };

  draw();
  const timer = setInterval(() => {
    progress = Math.min(progress + (progress < 50 ? 3.5 : 1.5), 90);
    stageIdx = progress < 45 ? 0 : progress < 75 ? 1 : 2;
    draw();
  }, 250);

  try {
    const a = await api('/api/v1/analyze', {
      method: 'POST',
      body: { image: sc.dataUrl, filename: sc.filename },
      signal: ctrl.signal
    });
    clearInterval(timer);
    progress = 100;
    draw();
    AudioFX.chime();
    await new Promise((r) => setTimeout(r, 400));
    S.analysis = a;
    S.results = { hot: null, showBoxes: true, saveName: '', mealType: null };
    S.scan = null;
    root.innerHTML = '';
    go(`#/results/${a.analysis_id}`);
  } catch (e) {
    clearInterval(timer);
    if (e.name === 'AbortError') {
      root.innerHTML = '';
      toast('Scan cancelled.');
      return;
    }
    root.innerHTML = `
      <div class="processing-screen">
        <div class="processing-core" style="background:var(--accent-red); box-shadow:0 0 40px rgba(255,69,58,0.5)">
          ${ic('alert')}
        </div>
        <h2 style="font-size:1.6rem; color:#FFFFFF; margin-top:1.2rem">Analysis Interrupted</h2>
        <p style="color:rgba(255,255,255,0.7); max-width:440px; margin:0.8rem 0 1.5rem">${esc(e.message)}</p>
        <div style="display:flex; gap:0.8rem">
          <button class="btn btn-secondary" id="err-close">Close</button>
          <button class="btn btn-emerald" id="err-retry">${ic('refresh')} Try Again</button>
        </div>
      </div>
    `;
    $('#err-close').onclick = () => { root.innerHTML = ''; };
    $('#err-retry').onclick = () => { root.innerHTML = ''; runAnalysis(); };
  }
}

/* ================================================================ Results View */
ROUTES.results = async (id) => {
  if (!id) return go('#/scan');
  if (S.analysis?.analysis_id !== id) {
    paint(shell('scan', '<div style="height:350px; display:grid; place-items:center;"><span class="spinner"></span></div>'));
    try {
      S.analysis = await api(`/api/v1/analyses/${id}`);
      S.results = { hot: null, showBoxes: true, saveName: '', mealType: null };
    } catch (e) {
      paint(shell('scan', `
        <div class="apple-card empty-state">
          <div class="empty-state-emoji">🔍</div>
          <h2>Analysis Not Found</h2>
          <p class="text-secondary">${esc(e.message)}</p>
          <a class="btn btn-emerald" href="#/scan">Scan Another Meal</a>
        </div>
      `));
      return;
    }
  }
  renderResults();
};

function renderResults() {
  const a = S.analysis;
  const R = S.results;
  const locked = a.status === 'SAVED';
  const t = a.total;
  const fiberGoal = S.user?.preferences?.fiber_goal_g || 28;

  // Bounding Boxes HTML
  const boxes = a.items.map((it, i) => {
    if (!it.bbox) return '';
    const color = COLORS[i % COLORS.length];
    return `
      <div class="spatial-bbox ${R.hot === it.id ? 'hot' : ''}" data-hot="${it.id}"
        style="--box-color:${color}; left:${it.bbox[0] * 100}%; top:${it.bbox[1] * 100}%; width:${it.bbox[2] * 100}%; height:${it.bbox[3] * 100}%">
        <span class="spatial-tag" style="--box-color:${color}">
          ${i + 1}. ${esc(it.label)} • ${it.confidence ? Math.round(it.confidence * 100) + '%' : 'Manual'}
        </span>
      </div>
    `;
  }).join('');

  const defaultName = a.items.slice(0, 3).map((i) => i.label).join(' + ') || 'Nutritious Meal';
  const currentMealType = R.mealType || guessMealType();

  paint(shell('scan', `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem">
      <div>
        <span class="eyebrow">${ic('check')} ANALYSIS COMPLETE</span>
        <h1 class="headline-hero headline-gradient" style="font-size:2.4rem">Meal Breakdown</h1>
        <p class="subheadline">Review recognized items, calibrate portion weights, and log this meal.</p>
      </div>
      <a class="btn btn-secondary" href="#/scan">${ic('scan')} Scan Another</a>
    </div>

    ${statusBanner(a)}

    <div class="bento-grid" style="margin-top:1.2rem">
      <!-- Left Column: Spatial Viewfinder & Items List -->
      <div class="col-7" style="display:flex; flex-direction:column; gap:1.2rem;">
        <!-- Visual Viewfinder with Bounding Boxes -->
        <section class="apple-card" style="padding:0.8rem">
          <div class="viewfinder-box ${R.showBoxes ? '' : 'hide-boxes'}">
            ${a.image_url ? `<img src="${imgSrc(a.image_url)}" class="viewfinder-image" alt="Meal">` : '<div style="font-size:3rem">🍽️</div>'}
            ${boxes}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; padding:0.8rem 0.5rem 0.2rem">
            <span class="text-secondary" style="font-size:0.85rem">
              ${a.items.length} item${a.items.length === 1 ? '' : 's'} identified
            </span>
            ${a.items.some((i) => i.bbox) ? `
              <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer; font-weight:500;">
                <input type="checkbox" id="toggle-boxes" ${R.showBoxes ? 'checked' : ''}>
                Show spatial boxes
              </label>
            ` : ''}
          </div>
        </section>

        <!-- Detected Food Items & Tactile Sliders -->
        <section class="apple-card">
          <div class="card-header">
            <h2 class="card-title">${ic('leaf')} Recognized Items</h2>
            ${locked ? '<span class="engine-pill">Saved & Locked</span>' : '<span class="text-secondary" style="font-size:0.85rem">Live Portion Calibrator</span>'}
          </div>
          <div style="display:flex; flex-direction:column; gap:0.8rem;" id="items-list">
            ${a.items.map((it, i) => renderItemCard(it, i, locked)).join('')}
          </div>

          ${locked ? '' : `
            <div style="position:relative; margin-top:1.2rem">
              <div class="input-wrap">
                ${ic('plus')}
                <input class="input" id="add-food" placeholder="Type to add extra food (e.g., banana, curd, roti)…" autocomplete="off">
              </div>
            </div>
          `}
        </section>
      </div>

      <!-- Right Column: Nutritional Metrics, Rings & Save -->
      <div class="col-5" style="display:flex; flex-direction:column; gap:1.2rem;">
        <!-- 4-Grid Macro Overview -->
        <section class="apple-card">
          <div class="card-header">
            <h2 class="card-title">${ic('flame')} Total Nutrition</h2>
            <span style="font-size:1.3rem; font-weight:700; color:var(--apple-kcal)">${fmt(t.calories)} <small style="font-size:0.85rem">kcal</small></span>
          </div>
          <div class="macro-grid-4">
            <div class="macro-card">
              <span class="macro-card-header">${ic('dumbbell')} Protein</span>
              <span class="macro-val">${fmt(t.protein_g, 1)} <small>g</small></span>
              <div class="macro-bar"><div class="macro-bar-fill" style="width:${clamp((t.protein_g / 60) * 100, 5, 100)}%; background:var(--apple-protein);"></div></div>
            </div>
            <div class="macro-card">
              <span class="macro-card-header">${ic('wheat')} Carbs</span>
              <span class="macro-val">${fmt(t.carbs_g, 1)} <small>g</small></span>
              <div class="macro-bar"><div class="macro-bar-fill" style="width:${clamp((t.carbs_g / 100) * 100, 5, 100)}%; background:var(--apple-carbs);"></div></div>
            </div>
            <div class="macro-card">
              <span class="macro-card-header">${ic('drop')} Fat</span>
              <span class="macro-val">${fmt(t.fat_g, 1)} <small>g</small></span>
              <div class="macro-bar"><div class="macro-bar-fill" style="width:${clamp((t.fat_g / 40) * 100, 5, 100)}%; background:var(--apple-fat);"></div></div>
            </div>
            <div class="macro-card">
              <span class="macro-card-header">${ic('sprout')} Fiber</span>
              <span class="macro-val">${fmt(t.fiber_g, 1)} <small>g</small></span>
              <div class="macro-bar"><div class="macro-bar-fill" style="width:${clamp((t.fiber_g / fiberGoal) * 100, 5, 100)}%; background:var(--apple-fiber);"></div></div>
            </div>
          </div>
        </section>

        <!-- Save Meal Section -->
        ${locked ? `
          <div class="apple-card" style="border-color:rgba(48,209,88,0.3)">
            <h3 style="font-weight:600; margin-bottom:0.4rem; color:var(--accent-green)">${ic('check')} Saved to History</h3>
            <p class="text-secondary" style="font-size:0.9rem">This meal is logged to your local database. View your daily rhythm in the trends dashboard.</p>
            <div style="margin-top:0.8rem">
              <a href="#/history" class="btn btn-secondary btn-sm">Open History →</a>
            </div>
          </div>
        ` : `
          <section class="apple-card">
            <div class="card-header">
              <h2 class="card-title">${ic('check')} Log This Meal</h2>
            </div>
            <div style="display:flex; flex-direction:column; gap:1rem">
              <div class="field">
                <label for="meal-name">Meal Title</label>
                <div class="input-wrap">
                  <input class="input" id="meal-name" value="${esc(R.saveName)}" placeholder="${esc(defaultName)}" maxlength="80">
                </div>
              </div>
              <div class="field">
                <label>Meal Category</label>
                <div class="chips">
                  ${MEAL_TYPES.map((m) => `
                    <button class="chip ${m === currentMealType ? 'on' : ''}" data-meal-type="${m}">${m}</button>
                  `).join('')}
                </div>
              </div>
              <button class="btn btn-emerald btn-lg btn-block" id="save-meal" ${t.calories > 0 ? '' : 'disabled'}>
                ${ic('check')} Save to Daily Log
              </button>
            </div>
          </section>
        `}

        <!-- Technical Verification Specs -->
        <section class="apple-card">
          <details>
            <summary style="cursor:pointer; font-weight:600; font-size:0.92rem; display:flex; justify-content:space-between; align-items:center;">
              <span>Technical Verification Details</span>
              ${ic('chevron')}
            </summary>
            <div style="display:flex; flex-direction:column; gap:0.6rem; margin-top:1rem; font-size:0.85rem;" class="text-secondary">
              <div style="display:flex; justify-content:space-between"><span>Model</span> <b>${esc(a.model.name)} (${esc(a.model.version)})</b></div>
              <div style="display:flex; justify-content:space-between"><span>Nutrition Source</span> <b>${esc(a.nutrition_source.name)} v${esc(a.nutrition_source.version)}</b></div>
              <div style="display:flex; justify-content:space-between"><span>Photo Lighting</span> <b>${a.quality ? `${a.quality.label} (${a.quality.score}/100)` : 'Optimal'}</b></div>
              <div style="display:flex; justify-content:space-between"><span>Audit ID</span> <span class="mono">${esc(a.analysis_id.slice(0, 12))}…</span></div>
            </div>
          </details>
        </section>
      </div>
    </div>
  `));

  bindResults();
}

function statusBanner(a) {
  if (a.status === 'FAILED') {
    return `
      <div style="padding:1rem 1.4rem; border-radius:var(--radius-md); background:rgba(255,69,58,0.15); border:1px solid rgba(255,69,58,0.3); display:flex; align-items:center; justify-content:space-between; gap:1rem">
        <div style="display:flex; align-items:center; gap:0.6rem; color:var(--accent-red)">
          ${ic('alert')}
          <span><b>Detection Alert:</b> ${esc(a.failure_reason)}</span>
        </div>
        <a class="btn btn-secondary btn-sm" href="#/scan">Try Another</a>
      </div>
    `;
  }
  return '';
}

function renderItemCard(it, i, locked) {
  const color = COLORS[i % COLORS.length];
  const n = it.nutrition;
  return `
    <div class="item-card ${S.results.hot === it.id ? 'hot' : ''}" data-hot="${it.id}" style="--box-color:${color}">
      <div class="item-top">
        <div class="item-title-wrap">
          <span class="item-badge-idx">${i + 1}</span>
          <span class="item-name">${esc(it.label)}</span>
          ${it.confidence != null ? `<span class="item-conf">${Math.round(it.confidence * 100)}% Match</span>` : ''}
        </div>
        <div style="font-weight:700; font-size:1.05rem; color:var(--text-primary)">
          ${n ? `${fmt(n.calories)} <small style="font-weight:400; color:var(--text-secondary)">kcal</small>` : '–'}
        </div>
      </div>

      <div class="item-controls-row">
        <!-- Tactile Portion Stepper & Continuous Slider -->
        ${locked ? `
          <span style="font-weight:600; font-size:0.92rem">${fmt(it.portion_g)} g (${esc(it.serving_text)})</span>
        ` : `
          <div style="display:flex; align-items:center; gap:1rem; flex:1">
            <div class="portion-stepper-wrap">
              <button class="portion-btn" data-step="-" data-id="${it.id}">–</button>
              <input type="number" class="portion-input" value="${it.portion_g}" data-grams="${it.id}" min="1" max="2500">
              <span style="font-size:0.8rem; color:var(--text-secondary)">g</span>
              <button class="portion-btn" data-step="+" data-id="${it.id}">+</button>
            </div>
            <input type="range" class="apple-slider" min="10" max="800" step="5" value="${it.portion_g}" data-slider="${it.id}">
          </div>
        `}

        ${locked ? '' : `
          <div style="display:flex; gap:0.4rem">
            <button class="icon-btn" data-swap="${it.id}" title="Swap Food" aria-label="Swap Food">${ic('swap')}</button>
            <button class="icon-btn" data-remove="${it.id}" title="Remove Item" aria-label="Remove Item">${ic('trash')}</button>
          </div>
        `}
      </div>

      ${n ? `
        <div style="display:flex; gap:0.6rem; font-size:0.8rem; color:var(--text-secondary)">
          <span><b>${fmt(n.protein_g, 1)}g</b> Protein</span> •
          <span><b>${fmt(n.carbs_g, 1)}g</b> Carbs</span> •
          <span><b>${fmt(n.fat_g, 1)}g</b> Fat</span> •
          <span><b>${fmt(n.fiber_g, 1)}g</b> Fiber</span>
        </div>
      ` : ''}
    </div>
  `;
}

/* -------------------------------------------------- Corrections & Search Bindings */
let correcting = Promise.resolve();
function editItems(mutate) {
  correcting = correcting.then(async () => {
    const items = S.analysis.items.map((i) => ({ id: i.id, food_id: i.food_id, portion_g: i.portion_g }));
    mutate(items);
    try {
      S.analysis = await api(`/api/v1/analyses/${S.analysis.analysis_id}/corrections`, {
        method: 'POST',
        body: { items }
      });
      AudioFX.click();
    } catch (e) {
      toast(e.message, 'error');
    }
    if (location.hash.startsWith('#/results')) renderResults();
  });
  return correcting;
}

const pendingGrams = {};
const flushGrams = debounce(() => editItems((items) => {
  Object.entries(pendingGrams).forEach(([id, g]) => {
    const it = items.find((x) => x.id === id);
    if (it) it.portion_g = g;
    delete pendingGrams[id];
  });
}), 300);

function commitGrams(id, grams) {
  pendingGrams[id] = grams;
  flushGrams();
}

function bindResults() {
  const a = S.analysis;

  // Hover highlighting between bounding boxes and items
  $$('[data-hot]').forEach((el) => {
    el.onmouseenter = () => {
      $$(`[data-hot="${el.dataset.hot}"]`).forEach((x) => x.classList.add('hot'));
    };
    el.onmouseleave = () => {
      $$(`[data-hot="${el.dataset.hot}"]`).forEach((x) => x.classList.remove('hot'));
    };
  });

  const tb = $('#toggle-boxes');
  if (tb) {
    tb.onchange = () => {
      AudioFX.click();
      S.results.showBoxes = tb.checked;
      $('.viewfinder-box').classList.toggle('hide-boxes', !tb.checked);
    };
  }

  // Steppers
  $$('[data-step]').forEach((b) => {
    b.onclick = () => {
      AudioFX.click();
      const input = $(`[data-grams="${b.dataset.id}"]`);
      const slider = $(`[data-slider="${b.dataset.id}"]`);
      const cur = Number(input.value) || 0;
      const step = cur >= 200 ? 25 : 10;
      const next = clamp(b.dataset.step === '+' ? cur + step : cur - step, 1, 3000);
      input.value = next;
      if (slider) slider.value = next;
      commitGrams(b.dataset.id, next);
    };
  });

  // Numeric inputs
  $$('[data-grams]').forEach((inp) => {
    inp.onchange = () => {
      const v = clamp(Math.round(Number(inp.value) || 1), 1, 3000);
      inp.value = v;
      const slider = $(`[data-slider="${inp.dataset.grams}"]`);
      if (slider) slider.value = v;
      commitGrams(inp.dataset.grams, v);
    };
  });

  // Range Sliders
  $$('[data-slider]').forEach((slider) => {
    slider.oninput = () => {
      const v = Number(slider.value);
      const input = $(`[data-grams="${slider.dataset.slider}"]`);
      if (input) input.value = v;
      commitGrams(slider.dataset.slider, v);
    };
  });

  // Remove
  $$('[data-remove]').forEach((b) => {
    b.onclick = () => {
      editItems((items) => {
        const idx = items.findIndex((x) => x.id === b.dataset.remove);
        if (idx >= 0) items.splice(idx, 1);
      }).then(() => toast('Item removed.'));
    };
  });

  // Swap
  $$('[data-swap]').forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      openSpotlight((food) => {
        editItems((items) => {
          const it = items.find((x) => x.id === b.dataset.swap);
          if (it) {
            it.food_id = food.id;
            it.portion_g = food.serving.grams;
          }
        }).then(() => toast(`Changed to ${food.name}.`));
      });
    };
  });

  // Add Food Input
  const add = $('#add-food');
  if (add) {
    add.onclick = () => {
      openSpotlight((food) => {
        editItems((items) => {
          items.push({ food_id: food.id, portion_g: food.serving.grams });
        }).then(() => toast(`Added ${food.name}.`));
      });
    };
  }

  // Meal Name & Type
  const nameInput = $('#meal-name');
  if (nameInput) {
    nameInput.oninput = () => { S.results.saveName = nameInput.value; };
  }

  $$('[data-meal-type]').forEach((b) => {
    b.onclick = () => {
      AudioFX.click();
      S.results.mealType = b.dataset.mealType;
      renderResults();
    };
  });

  // Save Meal
  const save = $('#save-meal');
  if (save) {
    save.onclick = async () => {
      AudioFX.snap();
      save.disabled = true;
      save.innerHTML = '<span class="spinner"></span>';
      await correcting;
      try {
        await api('/api/v1/meals', {
          method: 'POST',
          body: {
            analysis_id: a.analysis_id,
            name: S.results.saveName,
            meal_type: S.results.mealType || guessMealType(),
            tz: TZ
          }
        });
        AudioFX.chime();
        S.analysis = await api(`/api/v1/analyses/${a.analysis_id}`);
        toast('Meal successfully saved to log!');
        renderResults();
      } catch (e) {
        toast(e.message, 'error');
        save.disabled = false;
        save.textContent = 'Save to Daily Log';
      }
    };
  }
}

/* -------------------------------------------------- Spotlight Search Modal */
function openSpotlight(onPick) {
  AudioFX.click();
  const root = $('#spotlight-root');
  root.innerHTML = `
    <div class="spotlight-backdrop" id="sp-back">
      <div class="spotlight-modal" role="dialog" aria-modal="true">
        <div class="spotlight-input-wrap">
          ${ic('search')}
          <input class="spotlight-input" id="sp-input" placeholder="Search 70+ foods (e.g. roti, paneer, dal, rice, salad)…" autocomplete="off" autofocus>
        </div>
        <div class="spotlight-results" id="sp-results">
          <div style="padding:1rem; text-align:center; color:var(--text-secondary)">Type to search catalog…</div>
        </div>
      </div>
    </div>
  `;

  const input = $('#sp-input');
  const resBox = $('#sp-results');
  let results = [];
  let kb = 0;

  const render = () => {
    if (!results.length) {
      resBox.innerHTML = '<div style="padding:1rem; text-align:center; color:var(--text-secondary)">No dishes match your query.</div>';
      return;
    }
    resBox.innerHTML = results.map((f, i) => `
      <div class="spotlight-item ${i === kb ? 'active' : ''}" data-idx="${i}">
        <div style="display:flex; align-items:center; gap:0.6rem">
          <span style="font-size:1.3rem">${CAT_EMOJI[f.category] || '🍽️'}</span>
          <span style="font-weight:600">${esc(f.name)}</span>
        </div>
        <span class="text-secondary" style="font-size:0.85rem">
          ${fmt((f.per_100g.calories * f.serving.grams) / 100)} kcal / ${f.serving.unit}
        </span>
      </div>
    `).join('');

    $$('.spotlight-item', resBox).forEach((el) => {
      el.onclick = () => {
        const item = results[Number(el.dataset.idx)];
        root.innerHTML = '';
        if (item) onPick(item);
      };
    });
  };

  const doSearch = debounce(async () => {
    try {
      const q = input.value.trim();
      const r = await api(`/api/v1/foods?q=${encodeURIComponent(q)}&limit=10`);
      results = r.foods;
      kb = 0;
      render();
    } catch (_) {}
  }, 120);

  input.oninput = doSearch;
  input.onkeydown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      kb = Math.min(kb + 1, results.length - 1);
      render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      kb = Math.max(kb - 1, 0);
      render();
    } else if (e.key === 'Enter' && results.length) {
      e.preventDefault();
      const item = results[kb];
      root.innerHTML = '';
      if (item) onPick(item);
    } else if (e.key === 'Escape') {
      root.innerHTML = '';
    }
  };

  $('#sp-back').onclick = (e) => {
    if (e.target.id === 'sp-back') root.innerHTML = '';
  };

  doSearch();
}

function guessMealType() {
  const h = new Date().getHours();
  return h >= 5 && h < 11 ? 'breakfast' : h < 16 && h >= 11 ? 'lunch' : h >= 16 && h < 19 ? 'snack' : 'dinner';
}

/* ================================================================ Trends & Plan View */
ROUTES.plan = async () => {
  const P_ = S.plan;
  paint(shell('plan', `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem">
      <div>
        <span class="eyebrow">${ic('plan')} HEALTH METRICS & RHYTHMS</span>
        <h1 class="headline-hero headline-gradient" style="font-size:2.4rem">Nutrition Trends</h1>
        <p class="subheadline">Visualize caloric intake trends, macronutrient balance, and metabolic targets.</p>
      </div>
      <div class="chips">
        <button class="chip ${P_.tab === 'summary' ? 'on' : ''}" data-plan-tab="summary">Trends & Analytics</button>
        <button class="chip ${P_.tab === 'goals' ? 'on' : ''}" data-plan-tab="goals">Targets & Calculator</button>
      </div>
    </div>
    <div id="plan-body">
      <div style="height:350px; display:grid; place-items:center;"><span class="spinner"></span></div>
    </div>
  `));

  $$('[data-plan-tab]').forEach((b) => {
    b.onclick = () => {
      AudioFX.click();
      S.plan.tab = b.dataset.planTab;
      ROUTES.plan();
    };
  });

  try {
    const sum = await api(`/api/v1/summary?days=${P_.days}&tz=${TZ}`);
    if (P_.tab === 'summary') renderPlanSummary(sum);
    else renderPlanGoals(sum);
  } catch (e) {
    toast(e.message, 'error');
  }
};

function renderPlanSummary(sum) {
  const g = sum.goals;
  if (!sum.total_meals) {
    $('#plan-body').innerHTML = `
      <div class="apple-card empty-state">
        <div class="empty-state-emoji">📊</div>
        <h2>No Recorded Meals in the Last ${sum.days} Days</h2>
        <p class="text-secondary">Scan a meal to start graphing your caloric intake, or load a sample week.</p>
        <div style="display:flex; gap:0.8rem; margin-top:0.6rem">
          <a class="btn btn-emerald" href="#/scan">${ic('scan')} Scan a Meal</a>
          <button class="btn btn-secondary" data-seed>Load Sample Week</button>
        </div>
      </div>
    `;
    return bindSeed();
  }

  $('#plan-body').innerHTML = `
    <div class="bento-grid" style="margin-top:0">
      <!-- Calorie Bar Chart Bento -->
      <section class="apple-card col-8">
        <div class="card-header">
          <h2 class="card-title">${ic('flame')} Daily Caloric Intake</h2>
          <select class="input" id="range-sel" style="width:auto; height:34px; border:1px solid var(--border-subtle); border-radius:var(--radius-pill); padding:0 0.8rem;">
            ${[7, 14, 30].map((d) => `<option value="${d}" ${d === sum.days ? 'selected' : ''}>Last ${d} Days</option>`).join('')}
          </select>
        </div>
        <div class="bar-chart-container">
          ${renderAppleBarChart(sum.series, g.calorie_goal)}
        </div>
      </section>

      <!-- Macronutrient Donut Distribution Bento -->
      <section class="apple-card col-4">
        <div class="card-header">
          <h2 class="card-title">${ic('target')} Macro Split</h2>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0.5rem 0">
          ${renderAppleDonut(sum.energy_split, fmt(sum.average.calories))}
        </div>
        <div style="display:flex; justify-content:space-around; margin-top:1rem; font-size:0.85rem">
          <span style="color:var(--apple-carbs)">● Carbs ${sum.energy_split.carbs}%</span>
          <span style="color:var(--apple-protein)">● Protein ${sum.energy_split.protein}%</span>
          <span style="color:var(--apple-fat)">● Fat ${sum.energy_split.fat}%</span>
        </div>
      </section>

      <!-- Today's Activity Rings Card -->
      <section class="apple-card col-12">
        <div class="card-header">
          <h2 class="card-title">${ic('target')} Today's Targets vs Intake</h2>
          <span class="text-secondary" style="font-size:0.85rem">${sum.today.meals} meal${sum.today.meals === 1 ? '' : 's'} logged today</span>
        </div>
        ${renderAppleActivityRings({
          calories: sum.today.calories,
          calorie_goal: g.calorie_goal,
          protein: sum.today.protein_g,
          protein_goal: g.protein_goal_g,
          carbs: sum.today.carbs_g,
          carbs_goal: g.carbs_goal_g,
          fat: sum.today.fat_g,
          fat_goal: g.fat_goal_g
        }, 160)}
      </section>
    </div>
  `;

  $('#range-sel').onchange = (e) => {
    S.plan.days = Number(e.target.value);
    ROUTES.plan();
  };

  bindChartTooltips(sum);
}

function renderAppleBarChart(series, goal) {
  const W = 620;
  const H = 220;
  const pad = { l: 40, r: 15, t: 20, b: 30 };
  const max = Math.max(goal * 1.15, ...series.map((d) => d.calories), 500);
  const step = (W - pad.l - pad.r) / series.length;
  const bw = Math.min(30, step * 0.65);
  const y = (v) => pad.t + (H - pad.t - pad.b) * (1 - v / max);

  const goalY = y(goal);

  return `
    <svg viewBox="0 0 ${W} ${H}" width="100%" height="220" role="img" aria-label="Calorie Chart" style="overflow:visible">
      <line x1="${pad.l}" x2="${W - pad.r}" y1="${goalY}" y2="${goalY}" stroke="rgba(255,255,255,0.2)" stroke-dasharray="4 4" stroke-width="1.5" />
      <text x="${W - pad.r}" y="${goalY - 6}" text-anchor="end" font-size="11" font-weight="600" fill="var(--text-secondary)">Goal ${fmt(goal)}</text>
      ${series.map((d, i) => {
        const x = pad.l + i * step + (step - bw) / 2;
        const over = d.calories > goal * 1.1;
        const dt = new Date(`${d.date}T12:00:00`);
        const barH = Math.max(0, H - pad.b - y(d.calories));
        return `
          <rect class="chart-bar-rect" data-idx="${i}" x="${x}" y="${y(d.calories)}" width="${bw}" height="${barH}" rx="6"
            fill="${over ? 'var(--apple-kcal)' : d.meals ? 'var(--accent-green)' : 'rgba(120,120,128,0.2)'}" />
          <text x="${x + bw / 2}" y="${H - 10}" text-anchor="middle" font-size="11" fill="var(--text-secondary)">
            ${dt.toLocaleDateString(undefined, { weekday: 'narrow' })}
          </text>
        `;
      }).join('')}
    </svg>
  `;
}

function bindChartTooltips(sum) {
  const chartBox = $('.bar-chart-container');
  if (!chartBox) return;
  $$('.chart-bar-rect', chartBox).forEach((b) => {
    b.onmouseenter = () => {
      const d = sum.series[b.dataset.idx];
      const r = b.getBoundingClientRect();
      const parentR = chartBox.getBoundingClientRect();
      const tip = document.createElement('div');
      tip.className = 'chart-tooltip';
      tip.style.left = `${r.left - parentR.left + r.width / 2}px`;
      tip.style.top = `${r.top - parentR.top}px`;
      tip.innerHTML = `
        <b>${new Date(`${d.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</b><br>
        ${fmt(d.calories)} kcal • ${d.meals} meal${d.meals === 1 ? '' : 's'}<br>
        P: ${fmt(d.protein_g)}g • C: ${fmt(d.carbs_g)}g • F: ${fmt(d.fat_g)}g
      `;
      chartBox.appendChild(tip);
    };
    b.onmouseleave = () => {
      $$('.chart-tooltip', chartBox).forEach((x) => x.remove());
    };
  });
}

function renderAppleDonut(split, centerVal) {
  const r = 65;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const segs = [
    { key: 'carbs', color: 'var(--apple-carbs)' },
    { key: 'protein', color: 'var(--apple-protein)' },
    { key: 'fat', color: 'var(--apple-fat)' }
  ];
  const total = segs.reduce((s, seg) => s + (split[seg.key] || 0), 0) || 1;

  return `
    <svg viewBox="0 0 170 170" width="170" height="170">
      <circle cx="85" cy="85" r="${r}" stroke="rgba(120,120,128,0.15)" stroke-width="18" fill="none" />
      ${segs.map((seg) => {
        const len = ((split[seg.key] || 0) / total) * c;
        const res = `
          <circle cx="85" cy="85" r="${r}" stroke="${seg.color}" stroke-width="18" fill="none"
            stroke-dasharray="${len} ${c - len}" stroke-dashoffset="${-offset}"
            transform="rotate(-90 85 85)" style="transition:stroke-dashoffset 0.8s var(--ease-apple);" />
        `;
        offset += len;
        return res;
      }).join('')}
      <text x="85" y="82" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text-primary)">${centerVal}</text>
      <text x="85" y="100" text-anchor="middle" font-size="11" fill="var(--text-secondary)">avg kcal / day</text>
    </svg>
  `;
}

function renderPlanGoals() {
  const g = S.user.preferences;
  const p = { sex: 'male', age: 28, height: 170, weight: 68, activity: '1.375', goal: 'maintain', ...(g.profile || {}) };

  $('#plan-body').innerHTML = `
    <div class="bento-grid" style="margin-top:0">
      <!-- Daily Targets Manual Inputs -->
      <section class="apple-card col-6">
        <div class="card-header">
          <h2 class="card-title">${ic('target')} Custom Nutritional Targets</h2>
        </div>
        <form id="goals-form" style="display:flex; flex-direction:column; gap:1.1rem">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.9rem">
            ${Object.entries(NUT).map(([k, n]) => `
              <div class="field">
                <label for="g-${k}">${n.label} (${n.unit})</label>
                <div class="input-wrap">
                  <input class="input" type="number" id="g-${k}" name="${n.goal}" value="${g[n.goal]}">
                </div>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-emerald btn-lg btn-block" type="submit">${ic('check')} Save Targets</button>
        </form>
      </section>

      <!-- Mifflin-St Jeor Metabolic Calculator -->
      <section class="apple-card col-6">
        <div class="card-header">
          <h2 class="card-title">${ic('brain')} Metabolic TDEE Calculator</h2>
        </div>
        <p class="text-secondary" style="font-size:0.86rem; margin-bottom:1rem">
          Calculates your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on physiological equations.
        </p>
        <div id="calc" style="display:grid; grid-template-columns:1fr 1fr; gap:0.9rem">
          <div class="field">
            <label>Sex</label>
            <div class="input-wrap">
              <select class="input" id="c-sex"><option value="male">Male</option><option value="female">Female</option></select>
            </div>
          </div>
          <div class="field">
            <label>Age</label>
            <div class="input-wrap"><input class="input" type="number" id="c-age" value="${p.age}"></div>
          </div>
          <div class="field">
            <label>Height (cm)</label>
            <div class="input-wrap"><input class="input" type="number" id="c-height" value="${p.height}"></div>
          </div>
          <div class="field">
            <label>Weight (kg)</label>
            <div class="input-wrap"><input class="input" type="number" id="c-weight" value="${p.weight}"></div>
          </div>
          <div class="field" style="grid-column:span 2">
            <label>Activity Level</label>
            <div class="input-wrap">
              <select class="input" id="c-activity">
                <option value="1.2">Sedentary (mostly sitting)</option>
                <option value="1.375">Light Exercise (1–3 days/week)</option>
                <option value="1.55">Moderate Exercise (3–5 days/week)</option>
                <option value="1.725">Heavy Training (6–7 days/week)</option>
              </select>
            </div>
          </div>
        </div>
        <div id="calc-out" style="margin-top:1.2rem"></div>
      </section>
    </div>
  `;

  $('#c-sex').value = p.sex;
  $('#c-activity').value = p.activity;

  const read = () => ({
    sex: $('#c-sex').value,
    age: $('#c-age').value,
    height: $('#c-height').value,
    weight: $('#c-weight').value,
    activity: $('#c-activity').value,
    goal: p.goal || 'maintain'
  });

  const update = () => {
    const r = calcTargets(read());
    const out = $('#calc-out');
    if (!out) return;
    if (r) {
      out.innerHTML = `
        <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1rem; display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.6rem; text-align:center;">
          <div><div style="font-weight:700; font-size:1.2rem">${fmt(r.bmr)}</div><div class="text-secondary" style="font-size:0.75rem">BMR kcal</div></div>
          <div><div style="font-weight:700; font-size:1.2rem">${fmt(r.tdee)}</div><div class="text-secondary" style="font-size:0.75rem">TDEE kcal</div></div>
          <div><div style="font-weight:700; font-size:1.2rem; color:var(--accent-green)">${fmt(r.calorie_goal)}</div><div class="text-secondary" style="font-size:0.75rem">Target kcal</div></div>
        </div>
        <button class="btn btn-secondary btn-block" id="use-calc" style="margin-top:0.8rem">
          ${ic('target')} Apply Calculated Targets
        </button>
      `;
      $('#use-calc').onclick = () => {
        saveGoals({
          calorie_goal: r.calorie_goal,
          protein_goal_g: r.protein_goal_g,
          carbs_goal_g: r.carbs_goal_g,
          fat_goal_g: r.fat_goal_g,
          fiber_goal_g: r.fiber_goal_g,
          profile: read()
        });
      };
    } else {
      out.innerHTML = '<span class="text-secondary" style="font-size:0.85rem">Fill in metrics to calculate metabolic output.</span>';
    }
  };

  $$('#calc input, #calc select').forEach((el) => { el.oninput = update; });
  update();

  $('#goals-form').onsubmit = (e) => {
    e.preventDefault();
    const prefs = {};
    new FormData(e.target).forEach((v, k) => { prefs[k] = Number(v) || v; });
    saveGoals(prefs);
  };
}

function calcTargets(p) {
  const w = Number(p.weight); const h = Number(p.height); const age = Number(p.age);
  if (!(w > 25 && h > 100 && age >= 14)) return null;
  const bmr = 10 * w + 6.25 * h - 5 * age + (p.sex === 'female' ? -161 : 5);
  const tdee = bmr * Number(p.activity);
  const kcal = Math.round((tdee + (p.goal === 'lose' ? -400 : p.goal === 'gain' ? 300 : 0)) / 10) * 10;
  const protein = Math.round(w * 1.5);
  const fat = Math.round((kcal * 0.28) / 9);
  const carbs = Math.max(50, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorie_goal: Math.max(1000, kcal),
    protein_goal_g: protein,
    fat_goal_g: fat,
    carbs_goal_g: carbs,
    fiber_goal_g: Math.round((kcal / 1000) * 14)
  };
}

async function saveGoals(prefs) {
  try {
    AudioFX.snap();
    const r = await api('/api/v1/me', { method: 'PUT', body: { preferences: prefs } });
    S.user = r.user;
    AudioFX.chime();
    toast('Nutritional targets saved.');
    ROUTES.plan();
  } catch (e) {
    toast(e.message, 'error');
  }
}

/* ================================================================ History View */
ROUTES.history = async () => {
  const H = S.history;
  paint(shell('history', `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem">
      <div>
        <span class="eyebrow">${ic('history')} LIFETIME ARCHIVE</span>
        <h1 class="headline-hero headline-gradient" style="font-size:2.4rem">Meal History</h1>
        <p class="subheadline">Complete timeline of your meals, calculated macros, and photos.</p>
      </div>
      <a class="btn btn-emerald" href="#/scan">${ic('scan')} Scan Meal</a>
    </div>

    <!-- Search & Filter Controls -->
    <div style="display:flex; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap">
      <div class="input-wrap" style="flex:1; min-width:240px">
        ${ic('search')}
        <input class="input" id="h-search" placeholder="Search by meal or dish name…" value="${esc(H.q)}">
      </div>
      <div class="chips">
        ${[['', 'All'], ...MEAL_TYPES.map((m) => [m, m])].map(([v, l]) => `
          <button class="chip ${H.type === v ? 'on' : ''}" data-type="${v}">${l}</button>
        `).join('')}
      </div>
    </div>

    <div id="h-list">
      <div style="height:250px; display:grid; place-items:center;"><span class="spinner"></span></div>
    </div>
  `));

  $('#h-search').oninput = debounce((e) => {
    S.history.q = e.target.value;
    loadHistory();
  }, 200);

  $$('[data-type]').forEach((b) => {
    b.onclick = () => {
      AudioFX.click();
      S.history.type = b.dataset.type;
      $$('[data-type]').forEach((x) => x.classList.toggle('on', x === b));
      loadHistory();
    };
  });

  loadHistory();
};

async function loadHistory() {
  const H = S.history;
  try {
    const { meals } = await api(`/api/v1/meals?q=${encodeURIComponent(H.q)}&meal_type=${H.type}`);
    const list = $('#h-list');
    if (!list) return;

    if (!meals.length) {
      list.innerHTML = `
        <div class="apple-card empty-state">
          <div class="empty-state-emoji">🍽️</div>
          <h2>No Meals Found</h2>
          <p class="text-secondary">${H.q || H.type ? 'Try another search term or clear the filter.' : 'Scan and save your first meal to start logging your habits.'}</p>
          <div style="display:flex; gap:0.8rem; margin-top:0.6rem">
            <a class="btn btn-emerald" href="#/scan">${ic('scan')} Scan a Meal</a>
            <button class="btn btn-secondary" data-seed>Load Sample Week</button>
          </div>
        </div>
      `;
      return bindSeed();
    }

    const groups = {};
    meals.forEach((m) => {
      const k = new Date(m.captured_at).toDateString();
      (groups[k] = groups[k] || []).push(m);
    });

    list.innerHTML = Object.values(groups).map((ms) => {
      const totalDayKcal = ms.reduce((s, m) => s + m.totals.calories, 0);
      return `
        <div class="timeline-day">
          <div class="timeline-day-header">
            <span class="timeline-day-title">${dayLabel(ms[0].captured_at)}</span>
            <span class="timeline-day-pill">${fmt(totalDayKcal)} kcal</span>
          </div>
          ${ms.map(mealRow).join('')}
        </div>
      `;
    }).join('');

    bindMealRows(meals);
  } catch (e) {
    toast(e.message, 'error');
  }
}

function mealRow(m) {
  const t = m.totals;
  return `
    <div class="meal-row-card" data-meal="${m.id}" role="button" tabindex="0">
      ${m.image_url ? `<img src="${imgSrc(m.image_url)}" class="meal-thumb" alt="" loading="lazy">` : `<div class="meal-thumb-emoji">${CAT_EMOJI[m.items[0]?.category] || '🍽️'}</div>`}
      <div class="meal-details">
        <span class="meal-name">${esc(m.name)}</span>
        <div class="meal-chips-row">
          <span class="macro-pill k">${fmt(t.calories)} kcal</span>
          <span class="macro-pill p">${fmt(t.protein_g, 1)}g P</span>
          <span class="macro-pill c">${fmt(t.carbs_g, 1)}g C</span>
          <span class="macro-pill f">${fmt(t.fat_g, 1)}g F</span>
        </div>
        <span class="text-secondary" style="font-size:0.78rem">
          ${m.meal_type} • ${timeLabel(m.captured_at)}
        </span>
      </div>
      <div>
        <button class="icon-btn" data-meal-menu="${m.id}" aria-label="Meal Actions">${ic('more')}</button>
      </div>
    </div>
  `;
}

function bindMealRows(meals) {
  $$('[data-meal]').forEach((row) => {
    const m = meals.find((x) => x.id === row.dataset.meal);
    row.onclick = (e) => {
      if (!e.target.closest('[data-meal-menu]')) openMealModal(m);
    };
  });

  $$('[data-meal-menu]').forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      AudioFX.click();
      const m = meals.find((x) => x.id === b.dataset.mealMenu);
      if (m) deleteMeal(m);
    };
  });
}

function openMealModal(m) {
  AudioFX.snap();
  const t = m.totals;
  $('#overlay-root').innerHTML = `
    <div class="apple-modal-back" id="meal-modal-back">
      <div class="apple-modal" style="max-width:620px">
        <div class="modal-header">
          <div>
            <h2 style="font-size:1.25rem; font-weight:700">${esc(m.name)}</h2>
            <span class="text-secondary" style="font-size:0.85rem; text-transform:capitalize">
              ${m.meal_type} • ${dayLabel(m.captured_at)} at ${timeLabel(m.captured_at)}
            </span>
          </div>
          <button class="icon-btn" id="modal-close">${ic('x')}</button>
        </div>
        <div class="modal-body">
          ${m.image_url ? `<img src="${imgSrc(m.image_url)}" style="width:100%; max-height:260px; object-fit:cover; border-radius:var(--radius-md);" alt="">` : ''}
          <div class="macro-grid-4">
            <div class="macro-card"><span class="macro-card-header">Calories</span><span class="macro-val">${fmt(t.calories)}</span></div>
            <div class="macro-card"><span class="macro-card-header">Protein</span><span class="macro-val">${fmt(t.protein_g, 1)}g</span></div>
            <div class="macro-card"><span class="macro-card-header">Carbs</span><span class="macro-val">${fmt(t.carbs_g, 1)}g</span></div>
            <div class="macro-card"><span class="macro-card-header">Fat</span><span class="macro-val">${fmt(t.fat_g, 1)}g</span></div>
          </div>
          <div class="table-responsive">
            <table class="apple-table">
              <thead><tr><th>Food</th><th>Portion</th><th>kcal</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr></thead>
              <tbody>
                ${m.items.map((i) => `
                  <tr>
                    <td>${CAT_EMOJI[i.category] || '🍽️'} ${esc(i.label)}</td>
                    <td>${i.portion_g ? `${fmt(i.portion_g)}g` : '–'}</td>
                    <td>${i.nutrition ? fmt(i.nutrition.calories) : '–'}</td>
                    <td>${i.nutrition ? fmt(i.nutrition.protein_g, 1) + 'g' : '–'}</td>
                    <td>${i.nutrition ? fmt(i.nutrition.carbs_g, 1) + 'g' : '–'}</td>
                    <td>${i.nutrition ? fmt(i.nutrition.fat_g, 1) + 'g' : '–'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger" id="m-del-btn">${ic('trash')} Delete Meal</button>
          <button class="btn btn-secondary" id="m-done-btn">Done</button>
        </div>
      </div>
    </div>
  `;

  $('#modal-close').onclick = closeOverlays;
  $('#m-done-btn').onclick = closeOverlays;
  $('#meal-modal-back').onclick = (e) => { if (e.target.id === 'meal-modal-back') closeOverlays(); };
  $('#m-del-btn').onclick = () => { closeOverlays(); deleteMeal(m); };
}

async function deleteMeal(m) {
  AudioFX.snap();
  if (!confirm(`Are you sure you want to delete “${m.name}”?`)) return;
  try {
    await api(`/api/v1/meals/${m.id}`, { method: 'DELETE' });
    toast('Meal deleted.');
    router();
  } catch (e) {
    toast(e.message, 'error');
  }
}

/* ================================================================ Profile View */
ROUTES.profile = async () => {
  const u = S.user;
  paint(shell('profile', `
    <div style="margin-bottom:1.5rem">
      <span class="eyebrow">${ic('user')} SYSTEM & ACCOUNT PREFERENCES</span>
      <h1 class="headline-hero headline-gradient" style="font-size:2.4rem">Profile & Engine</h1>
      <p class="subheadline">Manage your profile, configure the vision engine, and control local data.</p>
    </div>

    <div class="bento-grid" style="margin-top:0">
      <!-- Account Info Bento -->
      <section class="apple-card col-6">
        <div class="card-header">
          <h2 class="card-title">${ic('user')} Account Details</h2>
        </div>
        <form id="profile-form" style="display:flex; flex-direction:column; gap:1.1rem">
          <div style="display:flex; align-items:center; gap:1.2rem; margin-bottom:0.5rem">
            <span class="user-avatar" style="width:58px; height:58px; font-size:1.4rem;">${esc(initials())}</span>
            <div>
              <div style="font-weight:700; font-size:1.1rem">${esc(u.name)}</div>
              <div class="text-secondary" style="font-size:0.86rem">${esc(u.email)}</div>
            </div>
          </div>
          <div class="field">
            <label for="p-name">Full Name</label>
            <div class="input-wrap">
              <input class="input" id="p-name" value="${esc(u.name)}">
            </div>
          </div>
          <button class="btn btn-secondary" type="submit">Update Name</button>
        </form>
      </section>

      <!-- Vision Engine Settings Bento -->
      <section class="apple-card col-6" id="engine-card">
        <div style="height:200px; display:grid; place-items:center;"><span class="spinner"></span></div>
      </section>

      <!-- Local Data & Maintenance Bento -->
      <section class="apple-card col-12">
        <div class="card-header">
          <h2 class="card-title">${ic('shield')} Local Data & Storage</h2>
        </div>
        <p class="text-secondary" style="font-size:0.92rem; max-width:650px; line-height:1.5">
          NutriScan operates offline and stores all food photos, meal entries, and sqlite records locally on your system. Zero telemetry is broadcast.
        </p>
        <div style="display:flex; gap:0.8rem; margin-top:1.2rem; flex-wrap:wrap">
          <button class="btn btn-secondary" data-seed>${ic('sparkles')} Load Sample Week of Meals</button>
          <button class="btn btn-danger" id="wipe-data-btn">${ic('trash')} Erase All Meal Data</button>
          <button class="btn btn-ghost" data-action="logout">${ic('logout')} Log Out</button>
        </div>
      </section>
    </div>
  `));

  $('#profile-form').onsubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await api('/api/v1/me', { method: 'PUT', body: { name: $('#p-name').value } });
      S.user = r.user;
      AudioFX.chime();
      toast('Name updated.');
      ROUTES.profile();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  $('#wipe-data-btn').onclick = async () => {
    if (!confirm('Are you sure you want to delete all saved meal logs and photos? Your user login will remain.')) return;
    try {
      const r = await api('/api/v1/me/data', { method: 'DELETE' });
      toast(`Deleted ${r.deleted_meals} meals.`);
      router();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  bindSeed();
  renderEngineCard();
};

async function renderEngineCard() {
  const card = $('#engine-card');
  try {
    const e = await api('/api/v1/settings/engine');
    S.engine = e.engine;
    const isVision = e.engine.mode === 'vision';

    card.innerHTML = `
      <div class="card-header">
        <h2 class="card-title">${ic('brain')} Vision Recognition Engine</h2>
        <span class="engine-pill"><span class="engine-dot"></span> ${isVision ? 'Vision AI Ready' : 'Demo Mode'}</span>
      </div>
      <p class="text-secondary" style="font-size:0.88rem; line-height:1.5; margin-bottom:1rem">
        Currently operating in <b>${esc(e.engine.model)}</b> mode. Object bounding boxes and categories are resolved locally.
      </p>
      <div class="field" style="margin-bottom:1rem">
        <label for="k-model">Model Identifier</label>
        <div class="input-wrap">
          <input class="input" id="k-model" value="${esc(e.model)}">
        </div>
      </div>
      <div class="field" style="margin-bottom:1.2rem">
        <label for="k-key">Anthropic API Key (Optional Cloud Fallback)</label>
        <div class="input-wrap">
          ${ic('key')}
          <input class="input" id="k-key" type="password" placeholder="${e.api_key_masked ? esc(e.api_key_masked) : 'sk-ant-...'}" autocomplete="off">
        </div>
      </div>
      <button class="btn btn-emerald" id="k-save-btn">${ic('check')} Save Engine Config</button>
    `;

    $('#k-save-btn').onclick = async () => {
      AudioFX.snap();
      const body = { model: $('#k-model').value };
      const key = $('#k-key').value.trim();
      if (key) body.api_key = key;
      try {
        const r = await api('/api/v1/settings/engine', { method: 'PUT', body });
        S.engine = r.engine;
        AudioFX.chime();
        toast('Engine settings updated.');
        ROUTES.profile();
      } catch (err) {
        toast(err.message, 'error');
      }
    };
  } catch (err) {
    card.innerHTML = `<div style="color:var(--accent-red)">${esc(err.message)}</div>`;
  }
}

/* -------------------------------------------------- Apple Background Parallax */
let parallaxFrame;
window.addEventListener('pointermove', (e) => {
  if (parallaxFrame) return;
  parallaxFrame = requestAnimationFrame(() => {
    const x = (e.clientX / window.innerWidth - 0.5) * 36;
    const y = (e.clientY / window.innerHeight - 0.5) * 36;
    const bg = document.getElementById('animated-bg');
    if (bg) {
      bg.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    parallaxFrame = null;
  });
}, { passive: true });

/* -------------------------------------------------- Boot Application */
router();
