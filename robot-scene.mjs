import { Application } from '@splinetool/runtime';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// 1. Smooth Momentum Scroll Engine (Lenis)
// ==========================================================================
let lenis = null;
try {
  lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
} catch (err) {
  console.warn('Lenis could not initialize', err);
}

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
// 2. Cybernetic Pixel Matrix Background (Digital Rain & Slow Cursor Interaction)
// ==========================================================================
const initPixelMatrixBackground = () => {
  const bgCanvas = document.querySelector('#pixel-matrix-canvas');
  if (!bgCanvas) return;
  const ctx = bgCanvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let animationId = null;
  let isVisible = true;

  // Grid sizing: crisp pixel squares matching the reference image
  const gap = 15;
  const pixelSize = 4.2;
  let cols = 0;
  let rows = 0;

  // Columns for matrix digital rain
  let columns = [];

  // Dormant & clustered ambient pixels with gentle harmonic breathing
  let ambientPixels = [];

  // Interactive cursor state with buttery smooth inertia
  let targetX = -500;
  let targetY = -500;
  let cursorX = -500;
  let cursorY = -500;
  let hasInteracted = false;
  let globalTime = 0;

  // Scroll velocity tracking for warp acceleration
  let lastScrollY = window.scrollY || 0;
  let scrollSpeed = 0;

  // Energy cell grid for decaying cursor trails
  let cellEnergy = [];

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    bgCanvas.width = width * dpr;
    bgCanvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    cols = Math.ceil(width / gap);
    rows = Math.ceil(height / gap);

    // Initialize columns
    columns = [];
    for (let c = 0; c < cols; c++) {
      columns.push({
        active: Math.random() < 0.35,
        headY: Math.random() * -rows,
        baseSpeed: Math.random() * 0.18 + 0.12,
        speed: 0.2,
        length: Math.floor(Math.random() * 16 + 8),
        cooldown: Math.floor(Math.random() * 90 + 20),
        colorType: Math.random() > 0.45 ? 'mint' : Math.random() > 0.5 ? 'cyan' : 'emerald',
      });
    }

    // Initialize ambient background pixels & clusters (matching the reference image)
    ambientPixels = [];
    const totalCells = cols * rows;
    const ambientCount = Math.floor(totalCells * 0.18);
    for (let i = 0; i < ambientCount; i++) {
      ambientPixels.push({
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
        baseAlpha: Math.random() * 0.16 + 0.08,
        pulseSpeed: Math.random() * 1.6 + 0.7,
        phase: Math.random() * Math.PI * 2,
        colorType: Math.random() > 0.4 ? 'mint' : Math.random() > 0.4 ? 'cyan' : 'emerald',
      });
    }

    // Seed tech clusters / constellations
    const clusterCount = Math.floor(cols * 0.45);
    for (let k = 0; k < clusterCount; k++) {
      const centerCol = Math.floor(Math.random() * cols);
      const centerRow = Math.floor(Math.random() * rows);
      const clusterLen = Math.floor(Math.random() * 5 + 3);
      const isHorizontal = Math.random() > 0.4;
      for (let s = 0; s < clusterLen; s++) {
        const c = isHorizontal ? Math.min(cols - 1, centerCol + s) : centerCol;
        const r = !isHorizontal ? Math.min(rows - 1, centerRow + s) : centerRow;
        ambientPixels.push({
          col: c,
          row: r,
          baseAlpha: Math.random() * 0.2 + 0.14,
          pulseSpeed: Math.random() * 1.2 + 0.8,
          phase: Math.random() * Math.PI * 2,
          colorType: Math.random() > 0.3 ? 'mint' : 'cyan',
        });
      }
    }

    cellEnergy = new Float32Array(cols * rows);
  };

  resize();
  window.addEventListener('resize', () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    resize();
  });

  // Track cursor position with capture to ensure event delivery through 3D canvas
  const handlePointer = (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    hasInteracted = true;
  };

  window.addEventListener('pointermove', handlePointer, { passive: true, capture: true });
  window.addEventListener('pointerdown', handlePointer, { passive: true, capture: true });
  window.addEventListener('pointerleave', () => {
    hasInteracted = false;
  });

  window.addEventListener(
    'scroll',
    () => {
      const currentScrollY = window.scrollY || 0;
      scrollSpeed = Math.min(Math.abs(currentScrollY - lastScrollY) * 0.06, 2.5);
      lastScrollY = currentScrollY;
    },
    { passive: true }
  );

  const getColor = (type, alpha) => {
    switch (type) {
      case 'mint':
        return `rgba(118, 255, 215, ${alpha})`;
      case 'emerald':
        return `rgba(46, 229, 157, ${alpha})`;
      case 'teal':
        return `rgba(32, 178, 170, ${alpha})`;
      case 'violet':
        return `rgba(180, 92, 255, ${alpha})`;
      case 'white':
        return `rgba(255, 255, 255, ${alpha})`;
      case 'cyan':
      default:
        return `rgba(75, 227, 255, ${alpha})`;
    }
  };

  const render = (time) => {
    if (!isVisible) return;
    globalTime = time * 0.001;

    // Decay scroll warp velocity back to 0
    scrollSpeed *= 0.94;

    // Organic harmonic drift when idle
    if (!hasInteracted) {
      targetX = width * 0.5 + Math.sin(globalTime * 0.42) * (width * 0.32);
      targetY = height * 0.45 + Math.cos(globalTime * 0.55) * (height * 0.24);
    }

    // Slow, luxurious cursor damping (0.05 lerp)
    cursorX += (targetX - cursorX) * 0.05;
    cursorY += (targetY - cursorY) * 0.05;

    ctx.clearRect(0, 0, width, height);

    // 1. Render ambient subtle dormant pixels and clusters
    for (let i = 0; i < ambientPixels.length; i++) {
      const p = ambientPixels[i];
      const pulse = Math.sin(globalTime * p.pulseSpeed + p.phase) * 0.07 + p.baseAlpha;
      if (pulse > 0.02) {
        ctx.fillStyle = getColor(p.colorType, Math.min(pulse, 0.45));
        ctx.fillRect(p.col * gap, p.row * gap, pixelSize, pixelSize);
      }
    }

    // 2. Render & update matrix digital rain columns
    for (let c = 0; c < cols; c++) {
      const col = columns[c];

      if (col.active) {
        col.headY += col.baseSpeed + scrollSpeed;

        const startRow = Math.max(0, Math.floor(col.headY - col.length));
        const endRow = Math.min(rows, Math.floor(col.headY));

        for (let r = startRow; r <= endRow; r++) {
          const distFromHead = col.headY - r;
          if (distFromHead >= 0 && distFromHead <= col.length) {
            const progress = 1 - distFromHead / col.length;
            const isHead = distFromHead < 1.1;

            const alpha = isHead ? 0.92 : progress * 0.55;
            const colorType = isHead ? 'white' : col.colorType;

            ctx.fillStyle = getColor(colorType, alpha);
            ctx.fillRect(c * gap, r * gap, pixelSize, pixelSize);
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
          col.length = Math.floor(Math.random() * 16 + 8);
          col.colorType = Math.random() > 0.45 ? 'mint' : Math.random() > 0.5 ? 'cyan' : 'emerald';
        }
      }
    }

    // 3. Render interactive cursor-activated pixel matrix with magnetic excitation
    const cursorRadius = 220;
    const startCol = Math.max(0, Math.floor((cursorX - cursorRadius) / gap));
    const endCol = Math.min(cols - 1, Math.ceil((cursorX + cursorRadius) / gap));
    const startRow = Math.max(0, Math.floor((cursorY - cursorRadius) / gap));
    const endRow = Math.min(rows - 1, Math.ceil((cursorY + cursorRadius) / gap));

    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        const px = c * gap;
        const py = r * gap;
        const dx = cursorX - px;
        const dy = cursorY - py;
        const dist = Math.hypot(dx, dy);

        if (dist < cursorRadius) {
          const proximity = 1 - dist / cursorRadius;
          const energy = Math.pow(proximity, 1.7) * 0.85;

          const idx = r * cols + c;
          if (idx >= 0 && idx < cellEnergy.length) {
            cellEnergy[idx] = Math.max(cellEnergy[idx], energy);
          }
        }
      }
    }

    // Render & decay cell energy with elastic tactile deflection
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const idx = r * cols + c;
        const e = cellEnergy[idx];
        if (e > 0.02) {
          const px = c * gap;
          const py = r * gap;
          const dx = px - cursorX;
          const dy = py - cursorY;
          const dist = Math.hypot(dx, dy);

          // Subtle physical deflection away from cursor
          let offsetX = 0;
          let offsetY = 0;
          if (dist > 0 && dist < 85) {
            const repel = (1 - dist / 85) * 3;
            offsetX = (dx / dist) * repel;
            offsetY = (dy / dist) * repel;
          }

          const color = e > 0.5 ? 'mint' : e > 0.25 ? 'cyan' : 'emerald';
          ctx.fillStyle = getColor(color, Math.min(e, 0.88));
          ctx.fillRect(px + offsetX, py + offsetY, pixelSize, pixelSize);

          cellEnergy[idx] = e * 0.93;
        } else if (e > 0) {
          cellEnergy[idx] = 0;
        }
      }
    }

    animationId = requestAnimationFrame(render);
  };

  animationId = requestAnimationFrame(render);

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible && !animationId) {
      animationId = requestAnimationFrame(render);
    }
  });
};
initPixelMatrixBackground();

// ==========================================================================
// 3. Interactive 3D Robot Spline Hero (Continuous Live Motion)
// ==========================================================================
const canvas = document.querySelector('#robot-canvas');
if (canvas) {
  let spline = null;

  const initSplineRobot = async () => {
    try {
      spline = new Application(canvas);

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

      // Maintain continuous motion when tab visibility toggles
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && spline) {
          try {
            spline.play();
          } catch (e) {}
        }
      });
    } catch (error) {
      console.warn('Spline robot could not load', error);
    }
  };

  initSplineRobot();

  // Hero exit parallax scrub: 3D depth dissolve as user scrolls down
  const heroSection = canvas.closest('.robot-hero') || canvas;
  gsap.to(canvas, {
    y: 130,
    scale: 0.9,
    opacity: 0.3,
    filter: 'blur(5px)',
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
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
        scrub: 0.6,
      },
    });
  }

  const badgeLeft = document.querySelector('.hero-badge-left');
  if (badgeLeft) {
    gsap.to(badgeLeft, {
      x: -70,
      y: 70,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom 45%',
        scrub: 0.5,
      },
    });
  }

  const badgeRight = document.querySelector('.hero-badge-right');
  if (badgeRight) {
    gsap.to(badgeRight, {
      x: 70,
      y: 70,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom 45%',
        scrub: 0.5,
      },
    });
  }

  const hudTop = document.querySelector('.hero-hud-top');
  if (hudTop) {
    gsap.to(hudTop, {
      y: -35,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom 50%',
        scrub: 0.5,
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
        scrub: 0.3,
      },
    });
  }

  const wordmark = document.querySelector('.scene-word');
  if (wordmark) {
    gsap.to(wordmark, {
      y: 140,
      scale: 1.06,
      opacity: 0.12,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
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
      { layer: '1', yPercent: 45 },
      { layer: '2', yPercent: 30 },
      { layer: '4', yPercent: -12 },
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
// 5. Creative MacBook Opening 3D Animations on Robot Cards
// ==========================================================================
const initMacbookOpeningCards = () => {
  const macbookCards = document.querySelectorAll('[data-macbook-card], .robot-card');
  macbookCards.forEach((card) => {
    const sheen = card.querySelector('.card-sheen');
    const img = card.querySelector('.product-image img');

    // 3D MacBook Lid Opening Animation
    const cardTl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 92%',
        end: 'top 48%',
        scrub: 1.1,
      },
    });

    cardTl.fromTo(
      card,
      {
        rotateX: 46,
        scale: 0.86,
        y: 80,
        opacity: 0.28,
        transformOrigin: '50% 100%',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.85)',
      },
      {
        rotateX: 0,
        scale: 1,
        y: 0,
        opacity: 1,
        boxShadow: '0 28px 75px rgba(10, 5, 25, 0.75)',
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
          opacity: 0.75,
          ease: 'power1.inOut',
        },
        0
      );
      cardTl.to(
        sheen,
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power1.out',
        },
        '>-0.2'
      );
    }

    // 3D Product pop-out depth
    if (img) {
      cardTl.fromTo(
        img,
        {
          y: 40,
          scale: 0.9,
          filter: 'brightness(0.7) drop-shadow(0 6px 12px rgba(0,0,0,0.6))',
        },
        {
          y: -10,
          scale: 1.04,
          filter: 'brightness(1.04) drop-shadow(0 25px 35px rgba(75, 227, 255, 0.3))',
          ease: 'power2.out',
        },
        0
      );
    }

    // Interactive 3D cursor tilt once unfolded
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 10,
        rotateX: -y * 10,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power1.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    });
  });
};
initMacbookOpeningCards();

// ==========================================================================
// 6. Professional Float-In & Kinetic Scroll Animations
// ==========================================================================
const initFloatInAnimations = () => {
  // A. Section Headings: Smooth blur-to-crisp floating reveal
  const headings = gsap.utils.toArray('.section-heading, .page-intro');
  headings.forEach((heading) => {
    gsap.fromTo(
      heading,
      {
        y: 45,
        opacity: 0,
        filter: 'blur(8px)',
      },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // B. Eyebrow labels: Sleek tracking-in float
  const eyebrows = gsap.utils.toArray('.eyebrow');
  eyebrows.forEach((eyebrow) => {
    gsap.fromTo(
      eyebrow,
      {
        y: 18,
        opacity: 0,
        letterSpacing: '0.24em',
      },
      {
        y: 0,
        opacity: 1,
        letterSpacing: '0.14em',
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: eyebrow,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // C. Manifesto: 3D Perspective elevation
  const manifesto = document.querySelector('.manifesto');
  if (manifesto) {
    const title = manifesto.querySelector('h2');
    const bottom = manifesto.querySelector('.manifesto-bottom');

    if (title) {
      gsap.fromTo(
        title,
        { y: 55, opacity: 0, rotateX: 18, transformOrigin: 'top center' },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.15,
          ease: 'power3.out',
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
        { y: 45, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
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
        y: 40,
        opacity: 0,
        scale: 0.92,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.edu-stats-grid',
          start: 'top 86%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // E. Academic Lab Feature Cards: 3D Elevation
  const eduCards = gsap.utils.toArray('.edu-card');
  if (eduCards.length) {
    gsap.fromTo(
      eduCards,
      {
        y: 55,
        opacity: 0,
        rotateX: 12,
        transformOrigin: 'top center',
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.05,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.edu-features-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // F. Academic Consultation Banner: Glow Expansion
  const eduBanner = document.querySelector('.edu-banner');
  if (eduBanner) {
    gsap.fromTo(
      eduBanner,
      {
        y: 45,
        opacity: 0,
        scale: 0.96,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: 'power3.out',
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
        y: 50,
        opacity: 0,
        scale: 0.94,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.95,
        stagger: 0.14,
        ease: 'power3.out',
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
        y: 60,
        opacity: 0,
        rotateY: 14,
        scale: 0.94,
        transformOrigin: 'left center',
      },
      {
        y: 0,
        opacity: 1,
        rotateY: 0,
        scale: 1,
        duration: 1.05,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.process-grid',
          start: 'top 84%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // E. Use Cases: Glass Dock Magnetic Elevation
  const useSection = document.querySelector('.use-section');
  if (useSection) {
    const tabs = useSection.querySelector('.use-tabs');
    const panel = useSection.querySelector('#use-panel');
    const link = useSection.querySelector('.text-link');

    if (tabs) {
      gsap.fromTo(
        tabs.children,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
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
        { y: 40, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.05,
          ease: 'power3.out',
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
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
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

  // F. Kinetic Typography: Horizontal Velocity Scroll Scrub
  const actionType = document.querySelector('.action-type');
  if (actionType) {
    gsap.fromTo(
      actionType,
      { x: 120, opacity: 0.45, scale: 0.96 },
      {
        x: -80,
        opacity: 1,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: {
          trigger: '.action-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.1,
        },
      }
    );
  }

  // G. End CTA: Holographic Expansion & Radiant Pulse
  const endCta = document.querySelector('.end-cta');
  if (endCta) {
    gsap.fromTo(
      endCta,
      { y: 55, opacity: 0.4, scale: 0.97 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.1,
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
