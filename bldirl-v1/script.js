// Slider
let current = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const track = document.getElementById('slidesTrack');
let autoTimer;

function goToSlide(n) {
  if (!slides.length || !dots.length || !track) return;

  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
  track.style.transform = `translateX(-${current * 100}%)`;
  resetAuto();
}

function changeSlide(dir) {
  if (!slides.length) return;
  goToSlide(current + dir);
}

function resetAuto() {
  if (!slides.length) return;

  clearInterval(autoTimer);
  autoTimer = setInterval(() => changeSlide(1), 5500);
}

if (slides.length && dots.length && track) {
  resetAuto();

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  });

  const hero = document.getElementById('home');
  let touchStartX = 0;

  if (hero) {
    hero.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    hero.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) changeSlide(dx < 0 ? 1 : -1);
    }, { passive: true });
  }
}

// Nav scroll
const nav = document.getElementById('main-nav');
const scrollProgressBar = document.getElementById('scrollProgressBar');

function updateScrollProgress() {
  if (!scrollProgressBar) return;

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

window.addEventListener('scroll', () => {
  if (nav) {
    nav.style.background = window.scrollY > 40
      ? 'rgba(42,30,18,0.97)'
      : 'rgba(59,42,26,0.96)';
  }

  updateScrollProgress();
});

window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// Hamburger menu
function toggleMenu() {
  const navLinksMenu = document.getElementById('nav-links');
  if (navLinksMenu) navLinksMenu.classList.toggle('open');
}

// Active nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navLinks.forEach(link => {
        if (!link.classList.contains('nav-current')) link.style.color = '';
      });

      const active = Array.from(navLinks).find(link => (
        link.getAttribute('href') === `#${entry.target.id}` ||
        link.dataset.sectionTarget === entry.target.id
      ));

      if (active && !active.classList.contains('nav-cta') && !active.classList.contains('nav-current')) {
        active.style.color = 'var(--linen)';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
}

// Gallery lightbox
const galleryTriggers = document.querySelectorAll('.gallery-trigger');

if (galleryTriggers.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.innerHTML = `
    <button class="gallery-lightbox-close" type="button" aria-label="Close image preview">&times;</button>
    <div class="gallery-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Gallery image preview">
      <img class="gallery-lightbox-image" alt="" />
      <p class="gallery-lightbox-caption"></p>
    </div>
  `;

  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector('.gallery-lightbox-image');
  const lightboxCaption = lightbox.querySelector('.gallery-lightbox-caption');
  const lightboxClose = lightbox.querySelector('.gallery-lightbox-close');

  function openLightbox(trigger) {
    const source = trigger.dataset.full || trigger.querySelector('img')?.getAttribute('src') || '';
    const alt = trigger.querySelector('img')?.getAttribute('alt') || '';
    const caption = trigger.dataset.caption || alt;

    if (!source || !lightboxImage || !lightboxCaption) return;

    lightboxImage.src = source;
    lightboxImage.alt = alt;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('open');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    if (!lightboxImage || !lightboxCaption) return;

    lightbox.classList.remove('open');
    document.body.classList.remove('lightbox-open');
    lightboxCaption.textContent = '';
    window.setTimeout(() => {
      lightboxImage.src = '';
      lightboxImage.alt = '';
    }, 180);
  }

  galleryTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}
