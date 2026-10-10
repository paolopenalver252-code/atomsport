/* ATOM SPORT — propuesta de rediseño (Potenaris). JavaScript sin dependencias. */
(() => {
  'use strict';

  document.documentElement.classList.add('js');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sistema de reservas existente (IsMyGym). Se usa el subdominio con HTTPS.
  const SYS = 'https://atomsport.ismygym.com/centro-atom-sport';
  const WA = '34638479194';

  /* ---------- Notas de la propuesta ---------- */
  const notesToggle = $('#notesToggle');
  const notesCount = $('#notesCount');
  if (notesToggle) {
    notesCount.textContent = $$('[data-note]').length;
    const setNotes = (on) => {
      document.body.classList.toggle('notes-on', on);
      notesToggle.setAttribute('aria-pressed', String(on));
      notesToggle.querySelector('.proposal-bar__btn-label').textContent = on ? 'Ocultar notas' : 'Ver notas';
    };
    notesToggle.addEventListener('click', () => setNotes(!document.body.classList.contains('notes-on')));
    if (new URLSearchParams(location.search).has('notas')) setNotes(true);
  }

  /* ---------- Menú móvil ---------- */
  const menuBtn = $('#menuBtn');
  const nav = $('#siteNav');
  const setMenu = (open) => {
    nav.classList.add('is-ready');
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.visually-hidden').textContent = open ? 'Cerrar menú' : 'Abrir menú';
    document.body.classList.toggle('menu-open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
    nav.classList.remove('is-ready');
  });

  /* ---------- Cabecera y sección activa ---------- */
  const header = $('#siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 60);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const navLinks = $$('.site-nav__list a');
  const sections = $$('main > section');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => {
        if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Hero: Levanta / Golpea / Respira ---------- */
  const hero = $('.hero');
  const words = $$('.hero__word', hero);
  const imgs = $$('.hero__media img', hero);
  const captions = $$('.hero__caption', hero);
  const CYCLE_MS = 6000;
  let slide = 0;
  let timer = null;
  let cycles = 0;

  const showSlide = (i) => {
    slide = i;
    words.forEach((w, k) => { w.classList.toggle('is-active', k === i); w.setAttribute('aria-pressed', String(k === i)); });
    imgs.forEach((im, k) => im.classList.toggle('is-active', k === i));
    captions.forEach((c, k) => c.classList.toggle('is-active', k === i));
  };
  const stopCycle = () => { clearTimeout(timer); timer = null; hero.classList.remove('is-cycling'); };
  const tick = () => {
    // Recorre las tres ideas una vez y se detiene en la primera: sin movimiento perpetuo.
    const next = (slide + 1) % words.length;
    if (next === 0) cycles++;
    showSlide(next);
    if (cycles >= 1) { stopCycle(); return; }
    restartProgress();
    timer = setTimeout(tick, CYCLE_MS);
  };
  const restartProgress = () => {
    hero.classList.remove('is-cycling');
    void hero.offsetWidth; // reinicia la animación de la barra
    hero.classList.add('is-cycling');
  };
  hero.style.setProperty('--cycle', CYCLE_MS + 'ms');
  words.forEach((w, k) => w.addEventListener('click', () => { stopCycle(); showSlide(k); }));
  hero.addEventListener('focusin', stopCycle);
  if (!reducedMotion) {
    restartProgress();
    timer = setTimeout(tick, CYCLE_MS);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopCycle(); });
  }

  /* ---------- Explorador de actividades ---------- */
  const tabs = $$('#explorer [role="tab"]');
  const panels = $$('#explorer [role="tabpanel"]');
  const selectTab = (tab, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
    if (focus) tab.focus({ preventScroll: true });
    // En móvil las pestañas son una fila desplazable: centra la activa sin mover la página.
    const row = tab.parentElement;
    if (row.scrollWidth > row.clientWidth) {
      row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t));
    t.addEventListener('keydown', (e) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in keys) { e.preventDefault(); selectTab(tabs[(i + keys[e.key] + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); selectTab(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); selectTab(tabs[tabs.length - 1], true); }
    });
  });
  selectTab(tabs[0]);
  $$('[data-goto-cat]').forEach((a) => a.addEventListener('click', () => {
    const t = tabs.find((x) => x.dataset.cat === a.dataset.gotoCat);
    if (t) selectTab(t);
  }));

  /* ---------- Horario ---------- */
  // Fuente: horario público del sistema de reservas, semana del 5 al 11 de octubre de 2026.
  const ACT = {
    bodypump: ['BodyPump', '33327-bodypump', 'fuerza'],
    pumpheavy: ['BodyPump Heavy', '45757-bodypump-heavy', 'fuerza'],
    fullsup: ['Full Superior', '43318-full-superior', 'fuerza'],
    fulltr: ['Full Training', '41606-full-training', 'fuerza'],
    gap: ['GAP', '32090-gap', 'fuerza'],
    combat: ['BodyCombat', '43045-bodycombat', 'cardio'],
    zumba: ['Zumba', '32432-zumba', 'cardio'],
    ballet: ['Ballet Fit', '41520-ballet-fit', 'cardio'],
    barre: ['Fitbarré', '46599-fitbarre', 'cardio'],
    pilates: ['Pilates', '33018-pilates', 'mente'],
    hatha: ['Yoga Hatha', '45956-yoga-hatha', 'mente'],
    vinyasa: ['Yoga Vinyasa', '45955-yoga-vinyasa', 'mente'],
    yin: ['Yoga Yin', '45957-yoga-yin', 'mente'],
    yinbreath: ['Yoga Yin / Breath', '46453-yoga-yin-breath', 'mente'],
    balance: ['BodyBalance', '36883-bodybalance', 'mente'],
    espalda: ['Espalda sana', '41519-espalda-sana', 'mente'],
    hipo: ['Hipopresivos', '43935-hipopresivos', 'mente']
  };
  const CAT = { fuerza: 'Fuerza', cardio: 'Cardio y baile', mente: 'Cuerpo y mente' };
  // [inicio, fin, actividad, sala]
  const WEEK = [
    [['09:15', '10:00', 'bodypump', 1], ['10:15', '11:00', 'yinbreath', 1], ['16:15', '17:00', 'hipo', 2], ['17:15', '18:00', 'bodypump', 1], ['17:15', '18:00', 'espalda', 2], ['18:15', '19:00', 'combat', 1], ['18:15', '19:00', 'gap', 2], ['19:15', '20:15', 'pumpheavy', 1], ['19:15', '20:15', 'zumba', 2], ['20:15', '21:00', 'yin', 1]],
    [['09:15', '10:00', 'ballet', 2], ['10:15', '11:00', 'espalda', 2], ['16:15', '17:00', 'vinyasa', 2], ['17:15', '18:00', 'fulltr', 1], ['18:15', '19:00', 'hatha', 1], ['18:15', '19:00', 'pilates', 2], ['19:15', '20:00', 'fullsup', 1], ['19:15', '20:00', 'ballet', 2], ['20:00', '21:00', 'balance', 2]],
    [['09:15', '10:00', 'bodypump', 1], ['10:15', '11:00', 'hipo', 2], ['17:15', '18:00', 'pumpheavy', 1], ['17:15', '18:00', 'espalda', 2], ['18:15', '19:00', 'combat', 1], ['18:15', '19:00', 'gap', 2], ['19:15', '20:15', 'bodypump', 1], ['19:15', '20:15', 'zumba', 2]],
    [['09:15', '10:00', 'ballet', 2], ['10:15', '11:00', 'pilates', 2], ['16:15', '17:00', 'fulltr', 2], ['17:15', '18:00', 'zumba', 2], ['18:15', '19:00', 'hatha', 1], ['18:15', '19:00', 'pilates', 2], ['19:15', '20:00', 'balance', 1], ['19:15', '20:00', 'ballet', 2]],
    [['08:15', '09:00', 'bodypump', 1], ['09:15', '10:00', 'barre', 2], ['10:15', '11:00', 'yin', 2], ['16:15', '17:00', 'pumpheavy', 1], ['17:15', '18:00', 'bodypump', 1], ['18:15', '19:00', 'combat', 1], ['18:15', '19:15', 'zumba', 2], ['19:15', '20:00', 'yin', 2]],
    [['09:15', '10:15', 'bodypump', 1], ['10:30', '11:30', 'balance', 2]],
    []
  ];
  const DAY_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const DAY_LONG = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const WEEK_START = new Date(2026, 9, 5); // lunes 5 de octubre de 2026

  const daysEl = $('#days');
  const slotsEl = $('#slots');
  const filterBtns = $$('#filters .chip');
  let day = 0;
  let filter = 'all';

  const today = new Date();
  const todayIdx = (today.getDay() + 6) % 7;
  const inPublishedWeek = (today - WEEK_START) >= 0 && (today - WEEK_START) < 7 * 864e5;
  day = WEEK[todayIdx].length ? todayIdx : 0;

  const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

  DAY_SHORT.forEach((d, i) => {
    const b = document.createElement('button');
    const date = new Date(WEEK_START); date.setDate(date.getDate() + i);
    b.type = 'button';
    b.className = 'day';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `${DAY_LONG[i]} ${date.getDate()}${WEEK[i].length ? '' : ', sin clases dirigidas'}`);
    b.innerHTML = `${d}<b>${date.getDate()}</b>${inPublishedWeek && i === todayIdx ? '<span class="day__today" title="Hoy"></span>' : ''}`;
    if (!WEEK[i].length) b.disabled = true;
    b.addEventListener('click', () => { day = i; render(); });
    b.addEventListener('keydown', (e) => {
      const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!dir) return;
      e.preventDefault();
      let n = i;
      do { n = (n + dir + 7) % 7; } while (!WEEK[n].length);
      day = n; render(); daysEl.children[n].focus();
    });
    daysEl.appendChild(b);
  });

  filterBtns.forEach((b) => b.addEventListener('click', () => {
    filter = b.dataset.filter;
    filterBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    render();
  }));

  function render() {
    [...daysEl.children].forEach((b, i) => { b.setAttribute('aria-selected', String(i === day)); b.tabIndex = i === day ? 0 : -1; });
    const list = WEEK[day].filter(([, , a]) => filter === 'all' || ACT[a][2] === filter);
    slotsEl.innerHTML = '';
    if (!list.length) {
      slotsEl.innerHTML = `<p class="slots__empty"><strong>Sin clases de ${CAT[filter] ? CAT[filter].toLowerCase() : 'este tipo'} el ${DAY_LONG[day]}.</strong>Prueba con otro día o quita el filtro.</p>`;
      return;
    }
    let group = '';
    list.forEach(([start, end, a, sala], n) => {
      const g = mins(start) < 14 * 60 ? 'Mañana' : 'Tarde';
      if (g !== group) {
        group = g;
        const h = document.createElement('p');
        h.className = 'slots__group';
        h.textContent = g;
        slotsEl.appendChild(h);
      }
      const [name, id, cat] = ACT[a];
      const el = document.createElement('div');
      el.className = 'slot';
      el.style.animationDelay = reducedMotion ? '0ms' : `${n * 35}ms`;
      el.innerHTML = `
        <p class="slot__time">${start}<small>${end}</small></p>
        <p class="slot__name">${name}<small>Sala ${sala} · ${mins(end) - mins(start)} min</small></p>
        <span class="slot__cat">${CAT[cat]}</span>
        <a class="slot__book" href="${SYS}/reservas-${id}" rel="noopener" aria-label="Reservar ${name}, ${DAY_LONG[day]} a las ${start}"><span>Reservar</span><svg aria-hidden="true"><use href="#i-ext"/></svg></a>`;
      slotsEl.appendChild(el);
    });
    let next = day;
    do { next = (next + 1) % 7; } while (!WEEK[next].length);
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'slots__next text-link';
    more.innerHTML = `Ver el ${DAY_LONG[next]} <svg aria-hidden="true"><use href="#i-arrow"/></svg>`;
    more.addEventListener('click', () => { day = next; render(); daysEl.children[next].focus(); });
    slotsEl.appendChild(more);
  }
  render();

  /* ---------- Tarifas: mensual / trimestral ---------- */
  const billingBtns = $$('.billing__opt');
  billingBtns.forEach((b) => b.addEventListener('click', () => {
    const mode = b.dataset.billing;
    billingBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$('#plans [data-mensual]').forEach((el) => {
      const value = el.dataset[mode];
      if (el.classList.contains('price')) {
        el.querySelector('.price__num').textContent = value;
        el.classList.remove('is-changing'); void el.offsetWidth; el.classList.add('is-changing');
      } else {
        el.textContent = value;
      }
    });
  }));

  /* ---------- Mapa bajo demanda (sin cookies de Google hasta que se pide) ---------- */
  const mapBtn = $('#mapLoad');
  mapBtn?.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.title = 'Mapa: Carrer Ausiàs March, 7, Inca';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Carrer Ausiàs March 7, 07300 Inca, Illes Balears') + '&z=17&output=embed';
    $('#map').replaceChildren(iframe);
  });

  /* ---------- Formulario → WhatsApp ---------- */
  const form = $('#waForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.nombre.value.trim();
    const err = $('#waNameErr');
    if (!name) {
      form.nombre.setAttribute('aria-invalid', 'true');
      err.hidden = false;
      form.nombre.focus();
      return;
    }
    form.nombre.removeAttribute('aria-invalid');
    err.hidden = true;
    const interest = form.interes.value;
    const msg = form.mensaje.value.trim();
    const text = `Hola ATOM SPORT, soy ${name}. Me gustaría información sobre ${interest}.${msg ? '\n\n' + msg : ''}`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
  form?.nombre.addEventListener('input', () => {
    if (form.nombre.value.trim()) { form.nombre.removeAttribute('aria-invalid'); $('#waNameErr').hidden = true; }
  });

  /* ---------- Barra rápida en móvil ---------- */
  const dock = $('#dock');
  const footer = $('.site-footer');
  let pastHero = false;
  let atFooter = false;
  const updateDock = () => dock.classList.toggle('is-visible', pastHero && !atFooter);
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; updateDock(); }).observe(hero);
  new IntersectionObserver(([e]) => { atFooter = e.isIntersecting; updateDock(); }, { rootMargin: '0px 0px -40% 0px' }).observe(footer);

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
