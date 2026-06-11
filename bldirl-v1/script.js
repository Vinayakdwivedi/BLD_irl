// ── SLIDER ──
let current = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const track = document.getElementById('slidesTrack');
let autoTimer;

function goToSlide(n) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
  track.style.transform = `translateX(-${current * 100}%)`;
  resetAuto();
}

function changeSlide(dir) { goToSlide(current + dir); }

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => changeSlide(1), 5500);
}

resetAuto();

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') changeSlide(-1);
  if (e.key === 'ArrowRight') changeSlide(1);
});

// Touch / swipe support
let touchStartX = 0;
const hero = document.getElementById('home');
hero.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });
hero.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) changeSlide(dx < 0 ? 1 : -1);
}, { passive: true });

// ── NAV SCROLL ──
const nav = document.getElementById('main-nav');
const scrollProgressBar = document.getElementById('scrollProgressBar');

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 40
    ? 'rgba(42,30,18,0.97)'
    : 'rgba(59,42,26,0.96)';
  updateScrollProgress();
});

window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// ── HAMBURGER MENU ──
function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

// ── ACTIVE NAV HIGHLIGHT ON SCROLL ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active && !active.classList.contains('nav-cta')) {
        active.style.color = 'var(--linen)';
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));
