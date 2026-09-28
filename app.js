const storedTheme = localStorage.getItem('mda-theme');
const allowedThemes = ['forest', 'ocean', 'burgundy'];
const initialTheme = allowedThemes.includes(storedTheme) ? storedTheme : 'forest';
document.documentElement.dataset.theme = initialTheme;

const setTheme = (theme) => {
  if (!allowedThemes.includes(theme)) return;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('mda-theme', theme);
  document.querySelectorAll('[data-theme-choice]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
  });
};

document.querySelectorAll('[data-theme-choice]').forEach((button) => {
  button.addEventListener('click', () => setTheme(button.dataset.themeChoice));
});
setTheme(initialTheme);

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

document.querySelectorAll('.nav-group > button').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.closest('.nav-group');
    const open = group.classList.toggle('submenu-open');
    button.setAttribute('aria-expanded', String(open));
  });
});

const heroSlider = document.querySelector('[data-hero-slider]');
if (heroSlider) {
  const slides = [...heroSlider.querySelectorAll('[data-hero-slide]')];
  const dots = [...heroSlider.querySelectorAll('[data-slider-dot]')];
  const previous = heroSlider.querySelector('[data-slider-prev]');
  const next = heroSlider.querySelector('[data-slider-next]');
  const status = heroSlider.querySelector('[data-slider-status]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
  let timer = null;
  let touchStartX = 0;

  const showSlide = (index, announce = false) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.querySelectorAll('a, button').forEach((control) => {
        control.tabIndex = active ? 0 : -1;
      });
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', String(active));
    });
    if (status && announce) status.textContent = `Showing slide ${current + 1} of ${slides.length}`;
  };

  const stopSlider = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };
  const startSlider = () => {
    stopSlider();
    if (!reducedMotion.matches && !document.hidden) {
      timer = window.setInterval(() => showSlide(current + 1), 6500);
    }
  };
  const moveSlider = (direction) => {
    showSlide(current + direction, true);
    startSlider();
  };

  previous?.addEventListener('click', () => moveSlider(-1));
  next?.addEventListener('click', () => moveSlider(1));
  dots.forEach((dot) => dot.addEventListener('click', () => {
    showSlide(Number(dot.dataset.sliderDot), true);
    startSlider();
  }));
  heroSlider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveSlider(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveSlider(1); }
  });
  heroSlider.addEventListener('mouseenter', stopSlider);
  heroSlider.addEventListener('mouseleave', startSlider);
  heroSlider.addEventListener('focusin', stopSlider);
  heroSlider.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!heroSlider.contains(document.activeElement) && !heroSlider.matches(':hover')) startSlider();
    }, 0);
  });
  heroSlider.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? 0;
    stopSlider();
  }, { passive: true });
  heroSlider.addEventListener('touchend', (event) => {
    const distance = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
    if (Math.abs(distance) > 55) showSlide(current + (distance < 0 ? 1 : -1), true);
    startSlider();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => document.hidden ? stopSlider() : startSlider());
  reducedMotion.addEventListener?.('change', startSlider);
  showSlide(current);
  startSlider();
}

document.querySelectorAll('.giving-card.zelle').forEach((card) => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Copy Zelle email memphisdawah@gmail.com');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText('memphisdawah@gmail.com');
      const note = card.querySelector('small');
      if (note) {
        const original = note.textContent;
        note.textContent = 'Copied — paste it into your banking app';
        setTimeout(() => { note.textContent = original; }, 2200);
      }
    } catch (_) { /* Clipboard may be unavailable on local file previews. */ }
  };
  card.addEventListener('click', copy);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); copy(); }
  });
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const formStatus = document.querySelector('[data-form-status]');
if (formStatus) {
  const status = new URLSearchParams(location.search).get('status');
  const messages = {
    sent: ['success', 'Thank you. Your message was sent to MDA.'],
    failed: ['error', 'Your message could not be sent. Please email admin@whitehavenkulliye.org directly.'],
    setup: ['error', 'The website email service is not configured yet. Please email admin@whitehavenkulliye.org directly.'],
    invalid: ['error', 'Please review the form and try again.'],
  };
  if (messages[status]) {
    formStatus.hidden = false;
    formStatus.classList.add(messages[status][0]);
    formStatus.textContent = messages[status][1];
  }
}
