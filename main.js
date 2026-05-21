gsap.registerPlugin(ScrollTrigger);

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navOverlay = document.getElementById('nav-overlay');

hamburger.addEventListener('click', () => {
  if (hamburger.classList.contains('is-open')) {
    closeOverlay();
  } else {
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('is-open');
  }
});

document.getElementById('nav-close').addEventListener('click', closeOverlay);

document.querySelectorAll('.nav-overlay-link').forEach(link => {
  link.addEventListener('click', closeOverlay);
});

function closeOverlay() {
  navOverlay.classList.remove('open');
  navOverlay.setAttribute('aria-hidden', 'true');
  hamburger.classList.remove('is-open');
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== HERO ENTRANCE TIMELINE =====
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTl
  .fromTo('#hero-greeting',
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.8 }
  )
  .fromTo('#hero-photo',
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1, duration: 1 },
    '-=0.4'
  )
  .fromTo('#hero-word-left',
    { clipPath: 'inset(0 0 100% 0)', opacity: 1 },
    { clipPath: 'inset(0 0 0% 0)', duration: 0.8 },
    '-=0.6'
  )
  .fromTo('#hero-word-right',
    { clipPath: 'inset(0 0 100% 0)', opacity: 1 },
    { clipPath: 'inset(0 0 0% 0)', duration: 0.8 },
    '-=0.65'
  )
  .fromTo('#hero-sub-left',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.6 },
    '-=0.5'
  )
  .fromTo('#hero-sub-right',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.6 },
    '-=0.6'
  )
  .fromTo('#hero-location',
    { opacity: 0 },
    { opacity: 1, duration: 0.6 },
    '-=0.3'
  )
  .fromTo('#scroll-indicator',
    { opacity: 0 },
    { opacity: 1, duration: 0.6 },
    '-=0.5'
  );

// ===== GENERIC REVEAL (.reveal) =====
// service cards are excluded — handled separately with stagger below
gsap.utils.toArray('.reveal').forEach(el => {
  if (el.classList.contains('service-card')) return;
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    }
  );
});

// ===== TIMELINE CARDS — slide from sides =====
gsap.utils.toArray('.reveal-left').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    }
  );
});

gsap.utils.toArray('.reveal-right').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    }
  );
});

// ===== PROJECT CARDS — title reveal on scroll =====
gsap.utils.toArray('.project-card').forEach(card => {
  const title = card.querySelector('.project-card__title');
  gsap.from(title, {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 65%',
      once: true
    }
  });
});

// ===== PROJECT CARDS — scale down as next card slides in =====
const projectCards = gsap.utils.toArray('.project-card');
const cardStickyTop = window.innerWidth <= 639 ? 250 : 270;
projectCards.forEach((card, i) => {
  if (i === projectCards.length - 1) return;
  const nextCard = projectCards[i + 1];
  gsap.to(card, {
    scale: 0.9,
    ease: 'none',
    scrollTrigger: {
      trigger: nextCard,
      start: 'top bottom',
      end: `top ${cardStickyTop}px`,
      scrub: true
    }
  });
});

// ===== PROJECTS INTRO — scroll up once last card reaches its final position =====
const projectsIntro = document.querySelector('.projects__intro');
const lastProjectCard = projectCards[projectCards.length - 1];
gsap.to(projectsIntro, {
  y: -400,
  ease: 'none',
  scrollTrigger: {
    trigger: lastProjectCard,
    start: `top ${cardStickyTop}px`,
    end: 'top -50px',
    scrub: true
  }
});

// ===== WORKS MARQUEE — overlay + categories =====
// NOTE: aria-hidden groups are the FIRST visible items in reversed rows (animation starts
// at the "to" keyframe, so Group1 is off-screen left and Group2 is on-screen at load time).
// Both groups need overlays, categories, and pointer events.
const workCategories = {
  '1': 'ia',  '2': 'uxui', '3': 'ia',  '4': 'web', '5': 'web',
  '6': 'uxui','7': 'web',  '8': 'ia',  '9': 'web', '10': 'ia'
};
const workLabels = {
  '1': 'EMI Ranking',  '2': 'NutriHaus',    '3': 'Automatización Presupuestos',
  '4': 'Contadores Net','5': 'Club Sportivo','6': 'Ciudadano App',
  '7': 'Punto Estético','8': 'Smart Bot Finanzas','9': 'Industrias Olivícolas',
  '10': 'EMI App'
};

document.querySelectorAll('.works-marquee__item').forEach(item => {
  const id  = item.dataset.workId;
  const cat = workCategories[id];
  if (cat) item.dataset.category = cat;

  // Use data-label if present, otherwise look up by work-id (covers aria-hidden clones)
  const labelText = item.dataset.label || workLabels[id];
  if (labelText) {
    const overlay = document.createElement('div');
    overlay.className = 'mq-overlay';
    const labelEl = document.createElement('span');
    labelEl.className = 'mq-label';
    labelEl.textContent = labelText;
    overlay.appendChild(labelEl);
    item.appendChild(overlay);
  }

  item.addEventListener('click', () => {
    document.querySelectorAll('.works-marquee__item').forEach(i => {
      i.classList.toggle('is-selected', i.dataset.workId === id);
    });
  });
});

// ===== MARQUEE DRAG + ARROW NAVIGATION =====
(function () {
  const wrapper  = document.querySelector('.works-marquee-wrapper');
  if (!wrapper) return;

  const allGroups = Array.from(document.querySelectorAll('.works-marquee__group'));

  // Returns the CSS animation for a group element
  function getAnim(group) {
    return group.getAnimations().find(a => a.animationName === 'wm-scroll') || null;
  }

  // True if the group belongs to a reverse row
  function isReverse(group) {
    return !!group.closest('.works-marquee--reverse');
  }

  // ---- Arrow hold-to-scroll ----
  let arrowRaf      = null;
  let arrowScrolling = false;
  let arrowSpeed    = 0;
  const ARROW_ACCEL = 0.25;  // px/frame² ramp-up
  const ARROW_MAX   = 7;     // max px/frame

  function startArrowScroll(dir) {
    if (arrowScrolling) return;
    arrowScrolling = true;
    arrowSpeed     = 0.5;
    allGroups.forEach(g => { const a = getAnim(g); if (a) a.pause(); });

    function tick() {
      arrowSpeed = Math.min(arrowSpeed + ARROW_ACCEL, ARROW_MAX);
      allGroups.forEach(group => {
        const anim = getAnim(group);
        if (!anim) return;
        const duration  = anim.effect.getTiming().duration;
        const totalPx   = group.offsetWidth;
        // No groupDir flip — each row advances its own animation naturally
        const timeDelta = (arrowSpeed / totalPx) * duration * dir;
        let t = (anim.currentTime + timeDelta + duration * 2) % duration;
        anim.currentTime = t;
      });
      arrowRaf = requestAnimationFrame(tick);
    }
    arrowRaf = requestAnimationFrame(tick);
  }

  function stopArrowScroll() {
    if (!arrowScrolling) return;
    arrowScrolling = false;
    arrowSpeed     = 0;
    cancelAnimationFrame(arrowRaf);
    arrowRaf = null;
    allGroups.forEach(g => { const a = getAnim(g); if (a) a.play(); });
  }

  const prevBtn = document.querySelector('.mq-arrow--prev');
  const nextBtn = document.querySelector('.mq-arrow--next');

  function addHoldScroll(btn, dir) {
    if (!btn) return;
    btn.addEventListener('mousedown',   e => { e.preventDefault(); startArrowScroll(dir); });
    btn.addEventListener('touchstart',  () => startArrowScroll(dir), { passive: true });
  }
  addHoldScroll(prevBtn, -1);
  addHoldScroll(nextBtn,  1);

  document.addEventListener('mouseup',     stopArrowScroll);
  document.addEventListener('touchend',    stopArrowScroll);
  document.addEventListener('touchcancel', stopArrowScroll);
})();

// ===== SERVICES CARDS — staggered reveal =====
const serviceCards = gsap.utils.toArray('.service-card');
if (serviceCards.length) {
  gsap.fromTo(serviceCards,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 85%',
        once: true
      }
    }
  );
}
