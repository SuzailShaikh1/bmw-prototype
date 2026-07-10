const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---------- Mobile burger (simple toggle of nav links as dropdown) ----------
const burger = document.getElementById('burger');
const navlinks = document.querySelector('.navlinks');
burger.addEventListener('click', () => {
  const open = navlinks.style.display === 'flex';
  navlinks.style.display = open ? 'none' : 'flex';
  navlinks.style.cssText += open ? '' : `
    position:fixed; top:64px; left:0; right:0; background:rgba(4,5,8,.97);
    flex-direction:column; padding:26px 32px; gap:22px; border-bottom:1px solid #1c2230;
  `;
});

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ---------- Animated counters ----------
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = el.dataset.decimal ? parseInt(el.dataset.decimal) : 0;
  const suffix = el.dataset.suffix || '';
  const suffixSpan = el.querySelector('span');
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.childNodes[0].nodeValue = val.toFixed(decimals);
    if (p < 1) requestAnimationFrame(tick);
    else el.childNodes[0].nodeValue = target.toFixed(decimals);
  }
  requestAnimationFrame(tick);
}
const countEls = document.querySelectorAll('[data-count]');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      countIO.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
countEls.forEach(el => countIO.observe(el));

// ---------- Marquee content ----------
const words = ['M2','M3','M4','M5','M8','X3 M','X5 M','X6 M','THE ULTIMATE DRIVING MACHINE'];
const track = document.getElementById('marqueeTrack');
let html = '';
for (let i = 0; i < 2; i++) {
  words.forEach((w, idx) => {
    html += `<span class="${idx % 3 === 0 ? 'hl' : ''}">${w}</span>`;
  });
}
track.innerHTML = html;

// ---------- Color swatches & 3D Model Color Controller ----------
// const swatches = document.querySelectorAll('.swatch');
// const colorName = document.getElementById('colorName');
// const heroModel = document.getElementById('heroModel');

// function hexToRgbaArray(hex) {
//   hex = hex.replace('#', '');
//   const r = parseInt(hex.substring(0, 2), 16) / 255;
//   const g = parseInt(hex.substring(2, 4), 16) / 255;
//   const b = parseInt(hex.substring(4, 6), 16) / 255;
//   return [r, g, b, 1.0];
// }

// const BODY_PAINT_MATERIAL_KEYWORDS = ['doorcolor', 'bodyshell'];

// function getBodyPaintMaterials(model) {
//   if (!model || !model.materials) return [];
//   return model.materials.filter(mat => {
//     const n = (mat.name || '').toLowerCase();
//     return BODY_PAINT_MATERIAL_KEYWORDS.some(k => n.includes(k));
//   });
// }

// function applyColorToCar(hexOrRgbString) {
//   if (!heroModel || !heroModel.model || !hexOrRgbString) return;

//   let rgbaColor;
//   if (hexOrRgbString.startsWith('#')) {
//     rgbaColor = hexToRgbaArray(hexOrRgbString);
//   } else if (hexOrRgbString.includes('rgb')) {
//     const rgbValues = hexOrRgbString.match(/\d+/g).map(Number);
//     rgbaColor = [rgbValues[0] / 255, rgbValues[1] / 255, rgbValues[2] / 255, 1.0];
//   }
//   if (!rgbaColor) return;

//   const bodyMaterials = getBodyPaintMaterials(heroModel.model);
//   bodyMaterials.forEach(mat => {
//     mat.pbrMetallicRoughness.setBaseColorFactor(rgbaColor);
//     mat.pbrMetallicRoughness.setMetallicFactor(0.6);
//     mat.pbrMetallicRoughness.setRoughnessFactor(0.25);
//   });
// }

// swatches.forEach(s => {
//   s.addEventListener('click', () => {
//     swatches.forEach(x => x.classList.remove('active'));
//     s.classList.add('active');
//     colorName.textContent = s.dataset.name;
//     applyColorToCar(s.style.backgroundColor || s.dataset.hex);
//   });
// });

// // Apply the initially-active swatch's color as soon as the model finishes loading,
// // so the car and the selected swatch always match on first paint.
// heroModel.addEventListener('load', () => {
//   const active = document.querySelector('.swatch.active');
//   if (active) applyColorToCar(active.style.backgroundColor);
// });
// ------------2nd live moodel viewer for configurator section------------ 
const swatches = document.querySelectorAll('.swatch');
const colorName = document.getElementById('colorName');
const configModel = document.getElementById('configModel');

function hexToRgbaArray(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return [r, g, b, 1.0];
}

const BODY_PAINT_MATERIAL_KEYWORDS = ['doorcolor', 'bodyshell'];

function getBodyPaintMaterials(model) {
  if (!model || !model.materials) return [];
  return model.materials.filter(mat => {
    const n = (mat.name || '').toLowerCase();
    return BODY_PAINT_MATERIAL_KEYWORDS.some(k => n.includes(k));
  });
}

function applyColorToCar(hexOrRgbString) {
  if (!configModel || !configModel.model || !hexOrRgbString) return;

  let rgbaColor;
  if (hexOrRgbString.startsWith('#')) {
    rgbaColor = hexToRgbaArray(hexOrRgbString);
  } else if (hexOrRgbString.includes('rgb')) {
    const rgbValues = hexOrRgbString.match(/\d+/g).map(Number);
    rgbaColor = [rgbValues[0] / 255, rgbValues[1] / 255, rgbValues[2] / 255, 1.0];
  }
  if (!rgbaColor) return;

  const bodyMaterials = getBodyPaintMaterials(configModel.model);
  bodyMaterials.forEach(mat => {
    mat.pbrMetallicRoughness.setBaseColorFactor(rgbaColor);
    mat.pbrMetallicRoughness.setMetallicFactor(0.6);
    mat.pbrMetallicRoughness.setRoughnessFactor(0.25);
  });
}

swatches.forEach(s => {
  s.addEventListener('click', () => {
    swatches.forEach(x => x.classList.remove('active'));
    s.classList.add('active');
    colorName.textContent = s.dataset.name;
    applyColorToCar(s.style.backgroundColor || s.dataset.hex);
  });
});

configModel.addEventListener('load', () => {
  const active = document.querySelector('.swatch.active');
  if (active) applyColorToCar(active.style.backgroundColor);
});

// ---------- Speed-line canvas background ----------
const canvas = document.getElementById('speedCanvas');
const ctx = canvas.getContext('2d');
let w, h, lines = [];
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function initLines() {
  lines = [];
  const count = window.innerWidth < 720 ? 22 : 42;
  for (let i = 0; i < count; i++) {
    lines.push({
      y: Math.random() * h,
      x: Math.random() * w,
      len: 60 + Math.random() * 180,
      speed: 1.2 + Math.random() * 3.2,
      opacity: 0.04 + Math.random() * 0.12,
      color: Math.random() > 0.75 ? '79,195,247' : '28,105,212'
    });
  }
}
initLines();

let scrollBoost = 0;
window.addEventListener('scroll', () => { scrollBoost = 6; }, { passive: true });

function draw() {
  ctx.clearRect(0, 0, w, h);
  lines.forEach(l => {
    ctx.strokeStyle = `rgba(${l.color},${l.opacity})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.lineTo(l.x - l.len, l.y);
    ctx.stroke();
    l.x += l.speed + scrollBoost;
    if (l.x - l.len > w) {
      l.x = -20;
      l.y = Math.random() * h;
    }
  });
  scrollBoost = Math.max(0, scrollBoost - 0.3);
  requestAnimationFrame(draw);
}
draw();