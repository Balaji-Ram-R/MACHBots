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
// 2. Interactive 3D Robot Spline Hero (Guaranteed Autoplay on Load)
// ==========================================================================
const canvas = document.querySelector('#robot-canvas');
if (canvas) {
  const status = document.querySelector('#scene-status');
  const button = document.querySelector('#motion-toggle');
  let spline = null;
  // Always start with motion ACTIVE (autoplay every time user visits)
  let paused = false;

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const promptText = isTouch ? 'Interactive 3D · Drag to explore' : 'Interactive 3D · Move cursor';

  const updateControlsUI = () => {
    if (button) {
      button.textContent = paused ? 'Resume motion' : 'Pause motion';
      button.setAttribute('aria-pressed', String(paused));
    }
    if (status) {
      status.textContent = paused ? 'Motion paused' : promptText;
    }
    if (spline) {
      try {
        if (paused) {
          spline.stop();
        } else {
          spline.play();
        }
      } catch (err) {
        // safe guard
      }
    }
  };

  const initSplineRobot = async () => {
    try {
      spline = new Application(canvas);

      // Load local robot.splinecode with fallback to remote Spline scene URL
      try {
        await spline.load('/assets/robot.splinecode');
      } catch (localErr) {
        await spline.load('https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode');
      }

      // Explicitly ensure animation is running and active
      paused = false;
      try {
        spline.play();
      } catch (e) {}

      updateControlsUI();

      if (status) {
        status.textContent = promptText;
        status.classList.add('ready');
      }

      if (button) {
        button.addEventListener('click', () => {
          paused = !paused;
          updateControlsUI();
        });
      }

      // When browser tab visibility toggles, keep animation running smoothly
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !paused && spline) {
          try {
            spline.play();
          } catch (e) {}
        }
      });
    } catch (error) {
      console.warn('Spline robot could not load, fallback active', error);
      if (status) status.textContent = '3D preview offline. Explore models below.';
      if (button) button.hidden = true;
    }
  };

  initSplineRobot();

  // Hero exit parallax scrub: 3D depth dissolve as user scrolls down
  const heroSection = canvas.closest('.robot-hero') || canvas;
  gsap.to(canvas, {
    y: 110,
    scale: 0.94,
    opacity: 0.35,
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
    },
  });

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
// 3. Multi-Layer Parallax Background Elements
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
// 4. Creative MacBook Opening 3D Animations on Robot Cards
// ==========================================================================
const initMacbookOpeningCards = () => {
  const macbookCards = document.querySelectorAll('[data-macbook-card], .robot-card');
  macbookCards.forEach((card, i) => {
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
// 5. Professional Float-In & Kinetic Scroll Animations
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

  // D. Process Steps: Sequential 3D Domino Float-In
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
