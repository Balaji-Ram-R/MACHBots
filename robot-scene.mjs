import { Application } from '@splinetool/runtime';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// 1. Smooth Momentum Scroll Engine (Lenis) — Highly Responsive & Instant
// ==========================================================================
let lenis = null;
try {
  lenis = new Lenis({
    duration: 0.65, // Snappy & immediate response (eliminates 1.2s laggy inertia)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1.05,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  // Cap delta at 33ms if paused for >500ms to eliminate tab-switch freeze & stutter
  gsap.ticker.lagSmoothing(500, 33);
} catch (err) {
  console.warn('Lenis could not initialize', err);
}

// Seamlessly manage scroll engine across tab visibility states
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    lenis?.stop();
  } else {
    lenis?.start();
    ScrollTrigger.refresh();
  }
});

// Smooth anchor scrolling integrated with Lenis
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#' || href === '#main') return;
    const targetEl = document.querySelector(href);
    if (targetEl) {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: -70 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ==========================================================================
// 2. High-Performance Cybernetic Pixel Matrix (Batched Paths & Zero Reflow)
// ==========================================================================
const initPixelMatrixBackground = () => {
  const bgCanvas = document.querySelector('#pixel-matrix-canvas');
  if (!bgCanvas) return;
  const ctx = bgCanvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const dpr = 1; // Locked to 1.0 for background canvas to eliminate multi-million pixel overhead
  let animationId = null;
  let isVisible = true;

  // Grid sizing: crisp pixel squares matching the reference image
  const gap = 16;
  const pixelSize = 4;
  let cols = 0;
  let rows = 0;

  // Columns for matrix digital rain
  let columns = [];

  // Grouped ambient pixels by color for single-pass path drawing
  let ambientByColor = {};
  let globalTime = 0;

  // Scroll velocity tracking for warp acceleration
  let lastScrollY = window.scrollY || 0;
  let scrollSpeed = 0;

  // Static color map for powder blue and soft lavender white palette
  const COLORS = {
    powder: '#8DB9F0',
    lavender: '#E9E8F8',
    ice: '#B8D4F7',
    sky: '#9EC4F5',
    periwinkle: '#A4BCE8',
    pearl: '#F4F3FC',
    white: '#FFFFFF',
  };

  const colColorTypes = ['powder', 'lavender', 'ice', 'sky', 'periwinkle'];
  const ambientColorTypes = ['powder', 'lavender', 'ice', 'sky', 'periwinkle', 'pearl', 'white'];

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    bgCanvas.width = width * dpr;
    bgCanvas.height = height * dpr;

    cols = Math.ceil(width / gap);
    rows = Math.ceil(height / gap);

    // Initialize columns
    columns = [];
    for (let c = 0; c < cols; c++) {
      columns.push({
        active: Math.random() < 0.32,
        headY: Math.random() * -rows,
        baseSpeed: Math.random() * 0.18 + 0.12,
        length: Math.floor(Math.random() * 14 + 6),
        cooldown: Math.floor(Math.random() * 80 + 20),
        colorType: colColorTypes[Math.floor(Math.random() * colColorTypes.length)],
      });
    }

    // Initialize ambient background pixels grouped by color (refined count for max performance)
    ambientByColor = {};
    ambientColorTypes.forEach((type) => {
      ambientByColor[type] = [];
    });

    const ambientCount = Math.min(220, Math.floor(cols * rows * 0.035));
    for (let i = 0; i < ambientCount; i++) {
      const type = ambientColorTypes[Math.floor(Math.random() * ambientColorTypes.length)];
      ambientByColor[type].push({
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
        baseAlpha: Math.random() * 0.16 + 0.08,
        pulseSpeed: Math.random() * 1.5 + 0.7,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Seed tech clusters / constellations
    const clusterCount = Math.min(28, Math.floor(cols * 0.25));
    for (let k = 0; k < clusterCount; k++) {
      const centerCol = Math.floor(Math.random() * cols);
      const centerRow = Math.floor(Math.random() * rows);
      const clusterLen = Math.floor(Math.random() * 4 + 3);
      const isHorizontal = Math.random() > 0.45;
      const type = ambientColorTypes[Math.floor(Math.random() * ambientColorTypes.length)];
      for (let s = 0; s < clusterLen; s++) {
        const c = isHorizontal ? Math.min(cols - 1, centerCol + s) : centerCol;
        const r = !isHorizontal ? Math.min(rows - 1, centerRow + s) : centerRow;
        ambientByColor[type].push({
          col: c,
          row: r,
          baseAlpha: Math.random() * 0.18 + 0.12,
          pulseSpeed: Math.random() * 1.2 + 0.8,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener(
    'scroll',
    () => {
      const currentScrollY = window.scrollY || 0;
      scrollSpeed = Math.min(Math.abs(currentScrollY - lastScrollY) * 0.05, 2.0);
      lastScrollY = currentScrollY;
    },
    { passive: true }
  );

  const render = (time) => {
    if (!isVisible) {
      animationId = null;
      return;
    }
    animationId = requestAnimationFrame(render);
    globalTime = time * 0.001;

    // Decay scroll warp velocity
    scrollSpeed *= 0.92;

    ctx.clearRect(0, 0, width, height);

    // 1. Render ambient subtle dormant pixels grouped by color (1 path fill per color!)
    ctx.globalAlpha = 0.36;
    for (let k = 0; k < ambientColorTypes.length; k++) {
      const type = ambientColorTypes[k];
      const list = ambientByColor[type];
      if (!list || !list.length) continue;

      ctx.fillStyle = COLORS[type];
      ctx.beginPath();
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        const pulse = Math.sin(globalTime * p.pulseSpeed + p.phase) * 0.08 + p.baseAlpha;
        if (pulse > 0.03) {
          ctx.rect(p.col * gap, p.row * gap, pixelSize, pixelSize);
        }
      }
      ctx.fill();
    }

    // 2. Render & update matrix digital rain columns (batched paths)
    const colCoordsByColor = {};
    colColorTypes.forEach((t) => (colCoordsByColor[t] = []));
    const heads = [];

    for (let c = 0; c < cols; c++) {
      const col = columns[c];

      if (col.active) {
        col.headY += col.baseSpeed + scrollSpeed;

        const startRow = Math.max(0, Math.floor(col.headY - col.length));
        const endRow = Math.min(rows, Math.floor(col.headY));

        for (let r = startRow; r <= endRow; r++) {
          const distFromHead = col.headY - r;
          if (distFromHead >= 0 && distFromHead <= col.length) {
            if (distFromHead < 1.1) {
              heads.push(c * gap, r * gap);
            } else {
              colCoordsByColor[col.colorType].push(c * gap, r * gap);
            }
          }
        }

        if (col.headY - col.length > rows) {
          col.active = false;
          col.headY = Math.random() * -10 - 2;
          col.cooldown = Math.floor(Math.random() * 70 + 15);
        }
      } else {
        col.cooldown--;
        if (col.cooldown <= 0) {
          col.active = true;
          col.headY = Math.random() * -12;
          col.baseSpeed = Math.random() * 0.18 + 0.12;
          col.length = Math.floor(Math.random() * 14 + 6);
          col.colorType = colColorTypes[Math.floor(Math.random() * colColorTypes.length)];
        }
      }
    }

    // Draw stream column bodies in single paths per color
    ctx.globalAlpha = 0.5;
    for (let k = 0; k < colColorTypes.length; k++) {
      const type = colColorTypes[k];
      const coords = colCoordsByColor[type];
      if (!coords || !coords.length) continue;
      ctx.fillStyle = COLORS[type];
      ctx.beginPath();
      for (let i = 0; i < coords.length; i += 2) {
        ctx.rect(coords[i], coords[i + 1], pixelSize, pixelSize);
      }
      ctx.fill();
    }

    // Draw stream column heads in single path
    if (heads.length) {
      ctx.fillStyle = COLORS.white;
      ctx.globalAlpha = 0.92;
      ctx.beginPath();
      for (let i = 0; i < heads.length; i += 2) {
        ctx.rect(heads[i], heads[i + 1], pixelSize, pixelSize);
      }
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  };

  const startLoop = () => {
    if (animationId) cancelAnimationFrame(animationId);
    isVisible = true;
    lastScrollY = window.scrollY || 0;
    scrollSpeed = 0;
    animationId = requestAnimationFrame(render);
  };

  const stopLoop = () => {
    isVisible = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  startLoop();

  // Instant freeze prevention on tab switch & window focus
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop();
    } else {
      startLoop();
    }
  });

  window.addEventListener('focus', () => {
    if (!document.hidden && !animationId) {
      startLoop();
    }
  });
};
initPixelMatrixBackground();

// ==========================================================================
// 3. Interactive 3D Robot Spline Hero (Continuous Live Motion & Smart Viewport Throttling)
// ==========================================================================
const canvas = document.querySelector('#robot-canvas');
if (canvas) {
  let spline = null;
  let isRobotInView = true;

  const initSplineRobot = async () => {
    try {
      spline = new Application(canvas, {
        renderMode: 'continuous',
      });

      // Load new 3D robot animation scene
      try {
        await spline.load('https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode');
      } catch (remoteErr) {
        await spline.load('/assets/robot.splinecode');
      }

      // Ensure live continuous motion is active at all times
      try {
        spline.play();
      } catch (e) {}

      // High-performance IntersectionObserver:
      // Stops Spline's heavy WebGL render loop when scrolled past the hero,
      // freeing 100% GPU/CPU for buttery scrolling across the rest of the site!
      const heroSection = canvas.closest('.robot-hero') || canvas;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isRobotInView = entry.isIntersecting;
            if (entry.isIntersecting) {
              try {
                spline?.play();
                spline?.requestRender();
              } catch (e) {}
            } else {
              try {
                spline?.stop();
              } catch (e) {}
            }
          });
        },
        { rootMargin: '100px 0px 100px 0px', threshold: 0.02 }
      );
      observer.observe(heroSection);

      // Maintain continuous motion & prevent freeze on tab switch
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          try {
            spline?.stop();
          } catch (e) {}
        } else if (isRobotInView) {
          try {
            spline?.play();
            spline?.requestRender();
          } catch (e) {}
        }
      });

      window.addEventListener('focus', () => {
        if (!document.hidden && isRobotInView && spline) {
          try {
            spline.play();
            spline.requestRender();
          } catch (e) {}
        }
      });
    } catch (error) {
      console.warn('Spline robot could not load', error);
    }
  };

  initSplineRobot();

  // Hero exit parallax scrub: GPU-composited scale, translateY and opacity (NO filter blur!)
  const heroSection = canvas.closest('.robot-hero') || canvas;
  gsap.to(canvas, {
    y: 110,
    scale: 0.92,
    opacity: 0.3,
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.25,
    },
  });

  const horizon = document.querySelector('.hero-horizon-layer');
  if (horizon) {
    gsap.to(horizon, {
      scale: 1.35,
      rotate: 35,
      opacity: 0.1,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.25,
      },
    });
  }

  const badgeLeft = document.querySelector('.hero-badge-left');
  if (badgeLeft) {
    gsap.to(badgeLeft, {
      x: -50,
      y: 50,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom 45%',
        scrub: 0.25,
      },
    });
  }

  const badgeRight = document.querySelector('.hero-badge-right');
  if (badgeRight) {
    gsap.to(badgeRight, {
      x: 50,
      y: 50,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom 45%',
        scrub: 0.25,
      },
    });
  }

  const hudTop = document.querySelector('.hero-hud-top');
  if (hudTop) {
    gsap.to(hudTop, {
      y: -30,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom 50%',
        scrub: 0.25,
      },
    });
  }

  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    gsap.to(scrollHint, {
      opacity: 0,
      y: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'top -15%',
        scrub: 0.2,
      },
    });
  }

  const wordmark = document.querySelector('.scene-word');
  if (wordmark) {
    gsap.to(wordmark, {
      y: 120,
      scale: 1.05,
      opacity: 0.12,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.25,
      },
    });
  }
}

// ==========================================================================
// 4. Multi-Layer Parallax Background Elements
// ==========================================================================
const initParallaxLayers = () => {
  const triggerElements = document.querySelectorAll('[data-parallax-layers]');
  triggerElements.forEach((triggerElement) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: '0% 0%',
        end: '100% 0%',
        scrub: 0,
      },
    });

    const layers = [
      { layer: '1', yPercent: 40 },
      { layer: '2', yPercent: 25 },
      { layer: '4', yPercent: -10 },
    ];

    layers.forEach((layerObj, idx) => {
      const targets = triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`);
      if (targets.length) {
        tl.to(
          targets,
          {
            yPercent: layerObj.yPercent,
            ease: 'none',
          },
          idx === 0 ? undefined : '<'
        );
      }
    });
  });
};
initParallaxLayers();

// ==========================================================================
// 5. Creative MacBook Opening 3D Animations on Robot Cards (Snappy & GPU Composited)
// ==========================================================================
const initMacbookOpeningCards = () => {
  const macbookCards = document.querySelectorAll('[data-macbook-card], .robot-card');
  macbookCards.forEach((card) => {
    const sheen = card.querySelector('.card-sheen');
    const img = card.querySelector('.product-image img');

    // 3D MacBook Lid Opening Animation with fast responsive scrub
    const cardTl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 92%',
        end: 'top 52%',
        scrub: 0.3,
      },
    });

    cardTl.fromTo(
      card,
      {
        rotateX: 36,
        scale: 0.9,
        y: 50,
        opacity: 0.4,
        transformOrigin: '50% 100%',
      },
      {
        rotateX: 0,
        scale: 1,
        y: 0,
        opacity: 1,
        ease: 'power2.out',
      }
    );

    // Specular Light Sheen sweep across the card lid during opening
    if (sheen) {
      cardTl.fromTo(
        sheen,
        {
          xPercent: -80,
          opacity: 0,
        },
        {
          xPercent: 90,
          opacity: 0.65,
          ease: 'power1.inOut',
        },
        0
      );
      cardTl.to(
        sheen,
        {
          opacity: 0,
          duration: 0.2,
          ease: 'power1.out',
        },
        '>-0.1'
      );
    }

    // 3D Product pop-out depth (pure transform, zero filter overhead)
    if (img) {
      cardTl.fromTo(
        img,
        {
          y: 25,
          scale: 0.92,
        },
        {
          y: -8,
          scale: 1.03,
          ease: 'power2.out',
        },
        0
      );
    }

    // High-performance 3D cursor tilt with cached rect (zero layout thrashing)
    let cardRect = null;
    let tiltRaf = null;

    card.addEventListener('mouseenter', () => {
      cardRect = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
      if (!cardRect) cardRect = card.getBoundingClientRect();
      const x = (e.clientX - cardRect.left) / cardRect.width - 0.5;
      const y = (e.clientY - cardRect.top) / cardRect.height - 0.5;

      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      tiltRaf = requestAnimationFrame(() => {
        gsap.to(card, {
          rotateY: x * 8,
          rotateX: -y * 8,
          transformPerspective: 1000,
          duration: 0.25,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      });
    });

    card.addEventListener('mouseleave', () => {
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      cardRect = null;
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  });
};
initMacbookOpeningCards();

// ==========================================================================
// 6. Professional Float-In & Kinetic Scroll Animations (Snappy & Hardware-Accelerated)
// ==========================================================================
const initFloatInAnimations = () => {
  // A. Section Headings: Smooth translateY and opacity reveal (NO filter blur)
  const headings = gsap.utils.toArray('.section-heading, .page-intro');
  headings.forEach((heading) => {
    gsap.fromTo(
      heading,
      {
        y: 35,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // B. Eyebrow labels: Sleek float
  const eyebrows = gsap.utils.toArray('.eyebrow');
  eyebrows.forEach((eyebrow) => {
    gsap.fromTo(
      eyebrow,
      {
        y: 14,
        opacity: 0,
        letterSpacing: '0.2em',
      },
      {
        y: 0,
        opacity: 1,
        letterSpacing: '0.14em',
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: eyebrow,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // C. Manifesto: 3D Elevation
  const manifesto = document.querySelector('.manifesto');
  if (manifesto) {
    const title = manifesto.querySelector('h2');
    const bottom = manifesto.querySelector('.manifesto-bottom');

    if (title) {
      gsap.fromTo(
        title,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    if (bottom) {
      gsap.fromTo(
        bottom,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bottom,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }

  // D. Academic Statistics Counter Elevation
  const statCards = gsap.utils.toArray('.stat-card');
  if (statCards.length) {
    gsap.fromTo(
      statCards,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.edu-stats-grid',
          start: 'top 86%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // E. Academic Lab Feature Cards
  const eduCards = gsap.utils.toArray('.edu-card');
  if (eduCards.length) {
    gsap.fromTo(
      eduCards,
      {
        y: 35,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.edu-features-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // F. Academic Consultation Banner
  const eduBanner = document.querySelector('.edu-banner');
  if (eduBanner) {
    gsap.fromTo(
      eduBanner,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: eduBanner,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // G. Reliability Standards Cards
  const standardCards = gsap.utils.toArray('.standard-card');
  if (standardCards.length) {
    gsap.fromTo(
      standardCards,
      {
        y: 35,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.standards-grid',
          start: 'top 86%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // H. Process Steps: Sequential 3D Domino Float-In
  const processCards = gsap.utils.toArray('.process-grid article');
  if (processCards.length) {
    gsap.fromTo(
      processCards,
      {
        y: 35,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.process-grid',
          start: 'top 84%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // I. Use Cases
  const useSection = document.querySelector('.use-section');
  if (useSection) {
    const tabs = useSection.querySelector('.use-tabs');
    const panel = useSection.querySelector('#use-panel');
    const link = useSection.querySelector('.text-link');

    if (tabs) {
      gsap.fromTo(
        tabs.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: tabs,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    if (panel) {
      gsap.fromTo(
        panel,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 86%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    if (link) {
      gsap.fromTo(
        link,
        { x: -15, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: link,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }

  // J. Kinetic Typography: Horizontal Velocity Scroll Scrub (fast responsive scrub 0.3)
  const actionType = document.querySelector('.action-type');
  if (actionType) {
    gsap.fromTo(
      actionType,
      { x: 90, opacity: 0.45 },
      {
        x: -60,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.action-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.3,
        },
      }
    );
  }

  // K. End CTA
  const endCta = document.querySelector('.end-cta');
  if (endCta) {
    gsap.fromTo(
      endCta,
      { y: 40, opacity: 0.4 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: endCta,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }
};
initFloatInAnimations();
