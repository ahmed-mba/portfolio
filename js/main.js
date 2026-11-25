'use strict';
document.documentElement.classList.add('js');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Menu mobile */
const toggle = document.querySelector('.menu-toggle');
const links = document.getElementById('nav-links');
toggle?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links?.addEventListener('click', e => {
  if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
});

/* Année du footer */
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* Terminal animé */
(function terminal() {
  const body = document.getElementById('termBody');
  if (!body) return;
  const P = '<span class="prompt">ahmed@namur</span><span class="path2">:~$ </span>';
  const lines = [
    { cmd: 'whoami' },
    { out: 'Ahmed Mebarki — étudiant en Réseau & Système (Namur, Belgique)' },
    { cmd: 'cat statut.log' },
    { ok: '[OK] Disponible pour un stage' }
  ];
  const render = (l, text = l.cmd ?? l.out ?? l.ok) =>
    l.cmd ? P + `<span>${text}</span>` : `<span class="${l.ok ? 'ok' : 'out'}">${text}</span>`;
  const add = () => { const p = document.createElement('p'); p.className = 'ln'; body.appendChild(p); return p; };

  if (reduced) { lines.forEach(l => { add().innerHTML = render(l); }); return; }

  let i = 0;
  (function next() {
    if (i >= lines.length) return;
    const l = lines[i++], p = add();
    if (!l.cmd) { p.innerHTML = render(l); return setTimeout(next, 320); }
    let n = 0;
    const iv = setInterval(() => {
      n++;
      p.innerHTML = render(l, l.cmd.slice(0, n)) + (n < l.cmd.length ? '<span class="caret"></span>' : '');
      if (n >= l.cmd.length) { clearInterval(iv); setTimeout(next, 260); }
    }, 42);
  })();
})();

/* Apparition au scroll */
(function reveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-visible')); return; }
  const obs = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); }
  }), { threshold: 0.12 });
  els.forEach(e => obs.observe(e));
})();

/* Effet d'inclinaison des cartes (souris uniquement) */
(function tilt() {
  if (reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.proj-card, .skill-card').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${(y * -6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();
