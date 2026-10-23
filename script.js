// Seul réglage à changer pour une nouvelle version ou un autre hébergement.
// Si les fichiers sont hébergés ailleurs (par exemple une « Release » GitHub),
// remplace les deux chemins par leurs adresses complètes.
// (la date au format année-mois-jour, la taille en Mo : elles s'affichent dans la langue choisie)
const RELEASE = {
  version: '1.43.0',
  date: '2026-10-21',
  setup: { url: 'https://github.com/gracefieldhouse/gracefieldhouse.github.io/releases/latest/download/GraceFieldHouse-Setup.exe', sizeMb: 107 },
  portable: { url: 'https://github.com/gracefieldhouse/gracefieldhouse.github.io/releases/latest/download/GraceFieldHouse-Portable.exe', sizeMb: 107 },
};

const root = document.documentElement;

document.querySelectorAll('[data-download="setup"]').forEach((a) => { a.href = RELEASE.setup.url; });
document.querySelectorAll('[data-download="portable"]').forEach((a) => { a.href = RELEASE.portable.url; });
document.querySelectorAll('[data-version]').forEach((el) => { el.textContent = RELEASE.version; });

// Ouverte depuis un téléphone ou un Mac : on prévient que l'app est pour Windows
const ua = navigator.userAgent;
if (!/Windows/i.test(ua)) root.classList.add('not-windows');

/* ───────────── Langues ───────────── */
const LANGS = ['fr', 'en', 'ja', 'zh', 'ar'];
const LOCALES = { fr: 'fr-FR', en: 'en-GB', ja: 'ja-JP', zh: 'zh-CN', ar: 'ar' };

function storedLang() {
  try { return localStorage.getItem('gfh-site-lang'); } catch { return null; }
}

function applyLang(lang) {
  const t = I18N[lang] || I18N.fr;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = t[el.dataset.i18n];
    if (v != null) el.textContent = v;
  });
  // Textes avec mise en forme : ils viennent uniquement de i18n.js, jamais du visiteur
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const v = t[el.dataset.i18nHtml];
    if (v != null) el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const v = t[el.dataset.i18nAlt];
    if (v != null) el.alt = v;
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const v = t[el.dataset.i18nTitle];
    if (v != null) { el.title = v; el.setAttribute('aria-label', v); }
  });
  // Titre de l'onglet propre à chaque page (index.html : « page », grace.html : « hub »)
  const page = document.body.dataset.page || 'page';
  document.title = t[`${page}.title`];
  document.querySelector('meta[name="description"]').content = t[`${page}.desc`];

  // Date et taille au format de la langue (« 21 octobre 2026 », « 2026年10月21日 »…)
  const locale = LOCALES[lang] || 'fr-FR';
  const date = new Date(`${RELEASE.date}T12:00:00`);
  let dateText;
  try { dateText = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(date); } catch { dateText = RELEASE.date; }
  document.querySelectorAll('[data-date]').forEach((el) => { el.textContent = dateText; });
  const size = (mb) => `${new Intl.NumberFormat(locale).format(mb)} ${t['unit.mb']}`;
  document.querySelectorAll('[data-size="setup"]').forEach((el) => { el.textContent = size(RELEASE.setup.sizeMb); });
  document.querySelectorAll('[data-size="portable"]').forEach((el) => { el.textContent = size(RELEASE.portable.sizeMb); });

  document.getElementById('lang-current').textContent = lang.toUpperCase();
  // Coche sur la langue retenue (aucune tant que le visiteur n'a pas choisi)
  const chosen = storedLang();
  document.querySelectorAll('.picker [data-lang]').forEach((b) => b.setAttribute('aria-current', String(b.dataset.lang === chosen)));
}

// Fenêtre de choix de la langue : affichée à la première visite, puis via le bouton de l'en-tête
const picker = document.getElementById('picker');
const langBtn = document.getElementById('lang-btn');

function openPicker() {
  root.classList.add('choosing');
  const current = picker.querySelector(`[data-lang="${root.lang}"]`) || picker.querySelector('[data-lang]');
  setTimeout(() => current.focus({ preventScroll: true }), 50);
}

function closePicker() {
  if (!root.classList.contains('choosing')) return;
  root.classList.remove('choosing'); // l'animation d'accueil, en pause jusque-là, démarre
}

picker.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-lang]');
  if (btn) {
    const lang = btn.dataset.lang;
    try { localStorage.setItem('gfh-site-lang', lang); } catch { /* navigation privée : choix non retenu */ }
    applyLang(lang);
    closePicker();
    langBtn.focus({ preventScroll: true });
    return;
  }
  // Clic à côté : on ferme seulement si une langue a déjà été choisie
  if (e.target === picker && LANGS.includes(storedLang())) closePicker();
});

document.addEventListener('keydown', (e) => {
  if (!root.classList.contains('choosing')) return;
  if (e.key === 'Escape' && LANGS.includes(storedLang())) { closePicker(); langBtn.focus({ preventScroll: true }); return; }
  // Flèches pour passer d'une langue à l'autre
  const buttons = [...picker.querySelectorAll('[data-lang]')];
  const i = buttons.indexOf(document.activeElement);
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); buttons[(i + 1) % buttons.length].focus(); }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); buttons[(i - 1 + buttons.length) % buttons.length].focus(); }
  // La touche Tab reste dans la fenêtre
  if (e.key === 'Tab') {
    e.preventDefault();
    buttons[(i + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
  }
});

langBtn.addEventListener('click', openPicker);

const initial = storedLang();
applyLang(LANGS.includes(initial) ? initial : 'fr');
if (root.classList.contains('choosing')) openPicker();

/* ───────────── Animations ───────────── */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// En-tête : ombre dès qu'on a fait défiler
// (une seule mise à jour par image, et seulement quand l'état change)
let scrolled = null;
let scrollQueued = false;
const onScroll = () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    scrollQueued = false;
    const now = scrollY > 8;
    if (now !== scrolled) { scrolled = now; root.classList.toggle('scrolled', now); }
  });
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Apparition des blocs au défilement : ceux qui entrent ensemble à l'écran arrivent en cascade
// Vérifié à chaque image de défilement : tout bloc arrivé à l'écran OU déjà dépassé s'affiche,
// même après un défilement très rapide ou un saut vers une section.
if (!reduced) {
  root.classList.add('js');
  let waiting = [...document.querySelectorAll('.section h2, .shot-tabs, .shot-frame, .final h2, .final .btn, .card, .steps li, .list li, details, .note')];
  waiting.forEach((el) => el.classList.add('reveal'));

  const check = () => {
    const limit = innerHeight * 0.92;
    const now = [];
    waiting = waiting.filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < limit) { now.push([el, r]); return false; }
      return true;
    });
    now
      .sort((a, b) => a[1].top - b[1].top || a[1].left - b[1].left)
      .forEach(([el], n) => {
        el.style.setProperty('--d', `${Math.min(n, 6) * 80}ms`);
        el.classList.add('visible');
        // Une fois arrivé, le bloc retrouve ses transitions normales (survol, inclinaison…).
        // Le minuteur couvre les cas où la fin de transition n'est jamais signalée (onglet caché…).
        const done = (ev) => {
          if (ev && (ev.target !== el || ev.propertyName !== 'transform')) return;
          el.removeEventListener('transitionend', done);
          clearTimeout(timer);
          el.classList.remove('reveal');
        };
        const timer = setTimeout(done, 1600);
        el.addEventListener('transitionend', done);
      });
    if (!waiting.length) {
      removeEventListener('scroll', queueCheck);
      removeEventListener('resize', queueCheck);
    }
  };

  // Au plus une vérification toutes les 50 ms pendant le défilement (un minuteur, et non
  // requestAnimationFrame, qui est suspendu quand l'onglet n'est pas affiché)
  let checkQueued = false;
  const queueCheck = () => {
    if (checkQueued) return;
    checkQueued = true;
    setTimeout(() => { checkQueued = false; check(); }, 50);
  };
  addEventListener('scroll', queueCheck, { passive: true });
  addEventListener('resize', queueCheck, { passive: true });
  // Premier passage après la mise en page
  setTimeout(check, 0);
  addEventListener('load', queueCheck);
}

// Cartes : légère inclinaison qui suit la souris
if (!reduced && matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.card').forEach((card) => {
    // Position de la carte mesurée une fois à l'entrée de la souris, inclinaison
    // appliquée au plus une fois par image
    let rect = null;
    let pending = null;
    card.addEventListener('pointerenter', () => {
      rect = card.getBoundingClientRect();
      card.classList.add('tilting');
    });
    card.addEventListener('pointermove', (e) => {
      if (!rect) return;
      const first = !pending;
      pending = e;
      if (!first) return;
      requestAnimationFrame(() => {
        if (!pending || !rect) return;
        const x = (pending.clientX - rect.left) / rect.width - 0.5;
        const y = (pending.clientY - rect.top) / rect.height - 0.5;
        pending = null;
        card.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
      });
    });
    card.addEventListener('pointerleave', () => {
      rect = null;
      pending = null;
      card.classList.remove('tilting');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
    });
  });
  // La page a défilé sous la souris : la position mémorisée n'est plus bonne
  addEventListener('scroll', () => {
    document.querySelectorAll('.card.tilting').forEach((c) => c.dispatchEvent(new Event('pointerenter')));
  }, { passive: true });
}

/* ───────────── Aperçu : captures de l'application ───────────── */
(() => {
  const tabs = [...document.querySelectorAll('.shot-tab')];
  const shots = [...document.querySelectorAll('.shot')];
  const caption = document.getElementById('shot-caption');
  const frame = document.querySelector('.shot-frame');
  if (!tabs.length || !shots.length) return;

  const DELAY = 5000; // durée d'affichage de chaque capture en défilement automatique
  let current = 0;
  let timer = null;
  let auto = !reduced; // s'arrête dès que le visiteur choisit lui-même un onglet

  function show(n, fromUser) {
    current = (n + shots.length) % shots.length;
    shots.forEach((img, i) => img.classList.toggle('is-active', i === current));
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === current));
      tab.tabIndex = i === current ? 0 : -1;
    });
    // La légende suit la capture, dans la langue choisie
    caption.dataset.i18n = `shots.${current + 1}n`;
    caption.textContent = (I18N[root.lang] || I18N.fr)[caption.dataset.i18n];
    if (fromUser) { auto = false; stop(); frame.classList.remove('playing'); }
    else restartProgress();
  }

  // Barre de progression du défilement automatique (relancée à chaque capture)
  function restartProgress() {
    if (!auto) return;
    frame.classList.remove('playing');
    void frame.offsetWidth;
    frame.classList.add('playing');
  }

  function start() {
    if (!auto || timer) return;
    restartProgress();
    timer = setInterval(() => show(current + 1, false), DELAY);
  }
  function stop() { clearInterval(timer); timer = null; }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => show(i, true)));
  // Flèches gauche / droite entre les onglets (inversées en arabe)
  document.querySelector('.shot-tabs').addEventListener('keydown', (e) => {
    const dir = root.dir === 'rtl' ? -1 : 1;
    let n = null;
    if (e.key === 'ArrowRight') n = current + dir;
    if (e.key === 'ArrowLeft') n = current - dir;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = shots.length - 1;
    if (n === null) return;
    e.preventDefault();
    show(n, true);
    tabs[current].focus();
  });

  // Défilement automatique seulement quand l'aperçu est à l'écran et que l'onglet est affiché
  let onScreen = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !document.hidden) start(); else { stop(); frame.classList.remove('playing'); }
    }, { threshold: 0.35 }).observe(frame);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stop(); frame.classList.remove('playing'); } else if (onScreen) start();
  });
  // Souris sur la capture : pause, pour prendre le temps de regarder
  frame.addEventListener('pointerenter', () => { stop(); frame.classList.remove('playing'); });
  frame.addEventListener('pointerleave', () => { if (onScreen) start(); });

  // Plein écran au clic
  const box = document.getElementById('lightbox');
  const boxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const view = document.getElementById('shot-view');
  function openBox() {
    const img = shots[current];
    boxImg.src = img.currentSrc || img.src;
    boxImg.alt = img.alt;
    box.hidden = false;
    void box.offsetWidth; // fait partir le fondu depuis l'état fermé
    box.classList.add('open');
    root.classList.add('lightbox-open');
    stop();
    closeBtn.focus({ preventScroll: true });
  }
  function closeBox() {
    if (box.hidden) return;
    box.classList.remove('open');
    root.classList.remove('lightbox-open');
    setTimeout(() => { box.hidden = true; }, reduced ? 0 : 300);
    view.focus({ preventScroll: true });
  }
  view.addEventListener('click', openBox);
  closeBtn.addEventListener('click', closeBox);
  box.addEventListener('click', (e) => { if (e.target === box) closeBox(); });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') closeBox();
    if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); } // le focus reste dans la vue agrandie
  });
})();
