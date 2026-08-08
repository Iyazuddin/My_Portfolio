document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================================================
  // NAVIGATION & MOBILE MENU
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  // Sticky Navbar on Scroll
  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    // Navbar background class
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Progress Bar
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }

    // Back to top button visibility
    if (scrollY > 600) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // Back to top click handler
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Mobile menu toggle
  hamburgerToggle.addEventListener('click', () => {
    const isExpanded = hamburgerToggle.getAttribute('aria-expanded') === 'true';
    hamburgerToggle.setAttribute('aria-expanded', !isExpanded);
    hamburgerToggle.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    
    // Prevent background scrolling when mobile menu is open
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close mobile menu when links are clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerToggle.setAttribute('aria-expanded', 'false');
      hamburgerToggle.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Active section indicator in Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update Desktop Navbar
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });

        // Update Mobile Navbar
        mobileNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -70% 0px' // Trigger active when section occupies center of screen
  });

  sections.forEach(section => activeLinkObserver.observe(section));


  // ==========================================================================
  // INTERACTIVE PARTICLE CANVAS BACKGROUND
  // ==========================================================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  const maxParticles = 45; // Subtle on the new dark-gray palette
  
  // Track Mouse Position
  const mouse = {
    x: null,
    y: null,
    radius: 120 // Interaction distance
  };

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1; // particle size (1px to 3px)
      this.speedX = (Math.random() - 0.5) * 0.4; // slow drift
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.baseColor = Math.random() > 0.5 ? 'rgba(0, 230, 101,' : 'rgba(0, 200, 230,'; // neon green or cyan
      this.alpha = Math.random() * 0.3 + 0.15; // static opacity
    }

    update() {
      // Move particles
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off borders
      if (this.x < 0 || this.x > canvas.width) {
        this.speedX = -this.speedX;
      }
      if (this.y < 0 || this.y > canvas.height) {
        this.speedY = -this.speedY;
      }

      // Mouse interactive push/pull effect
      if (mouse.x != null && mouse.y != null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.hypot(dx, dy);
        
        if (distance < mouse.radius) {
          // Push particles slightly away from cursor
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = dx / distance;
          const directionY = dy / distance;
          
          this.x += directionX * force * 1.2;
          this.y += directionY * force * 1.2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.baseColor}${this.alpha})`;
      ctx.fill();
    }
  }

  // Set Canvas Dimensions
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Re-initialize particles
    particlesArray = [];
    for (let i = 0; i < maxParticles; i++) {
      particlesArray.push(new Particle());
    }
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // Initial call

  // Connection Lines between Particles
  const drawLines = () => {
    for (let i = 0; i < particlesArray.length; i++) {
      for (let j = i + 1; j < particlesArray.length; j++) {
        const dx = particlesArray[i].x - particlesArray[j].x;
        const dy = particlesArray[i].y - particlesArray[j].y;
        const distance = Math.hypot(dx, dy);

        if (distance < 120) {
          // Opacity fade based on distance
          const lineAlpha = (120 - distance) / 120 * 0.08;
          ctx.beginPath();
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.strokeStyle = `rgba(0, 230, 101, ${lineAlpha})`; // neon-green connections
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  };

  // Animation Loop
  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particlesArray.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    drawLines();
    requestAnimationFrame(animateParticles);
  };
  
  animateParticles();


  // ==========================================================================
  // SCROLL-REVEAL ON SCROLL INTERSECTION OBSERVER
  // ==========================================================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before it enters full viewport
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  // ==========================================================================
  // PROJECTS FILTER SYSTEM
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hide');
          // Add entrance animation trigger
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          // Wait for fade out animation before display none
          setTimeout(() => {
            card.classList.add('hide');
          }, 300);
        }
      });
    });
  });


  // ==========================================================================
  // CONTACT FORM SUBMISSION
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;

      // Validate all fields
      if (!name || !email || !subject || !message) {
        formStatus.textContent = 'Oops! Please fill in all fields before sending.';
        formStatus.className = 'form-status-message error';
        return;
      }

      // Update button state to loading
      submitBtn.disabled = true;
      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending Message... <i data-lucide="loader" class="animate-spin"></i>';
      if (typeof lucide !== 'undefined') {
        lucide.createIcons(); // refresh icon
      }

      formStatus.textContent = '';
      formStatus.className = 'form-status-message';

      try {
        const formData = new FormData(contactForm);
        const jsonData = Object.fromEntries(formData);

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(jsonData)
        });

        const result = await response.json();

        if (result.success) {
          formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
          formStatus.classList.add('success');
          contactForm.reset();
        } else {
          formStatus.textContent = result.message || 'Something went wrong. Please try again later.';
          formStatus.classList.add('error');
        }
      } catch (error) {
        formStatus.textContent = 'Network error. Please check your connection and try again.';
        formStatus.classList.add('error');
      }

      // Restore button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons(); // refresh icon
      }
      
      // Remove status message after 6 seconds
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status-message';
      }, 6000);
    });
  }


  // ==========================================================================
  // PREMIUM INTERACTION EFFECTS
  // ==========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // Magnetic buttons — elements drift subtly toward the cursor, then glide back
  const initMagnetic = () => {
    const elements = document.querySelectorAll('.magnetic');
    if (!elements.length) return;

    const strength = 0.3;
    const maxShift = 8;

    elements.forEach(el => {
      let targetX = 0, targetY = 0, currentX = 0, currentY = 0, running = false;

      const loop = () => {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
        el.style.translate = `${currentX.toFixed(2)}px ${currentY.toFixed(2)}px`;

        if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
          requestAnimationFrame(loop);
        } else {
          running = false;
        }
      };

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        targetX = (e.clientX - (rect.left + rect.width / 2)) * strength;
        targetY = (e.clientY - (rect.top + rect.height / 2)) * strength;
        targetX = Math.max(-maxShift, Math.min(maxShift, targetX));
        targetY = Math.max(-maxShift, Math.min(maxShift, targetY));

        if (!running) {
          running = true;
          requestAnimationFrame(loop);
        }
      });

      el.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        if (!running) {
          running = true;
          requestAnimationFrame(loop);
        }
      });
    });
  };

  // 3D tilt + specular glare on the hero profile card
  const initTilt = () => {
    const wrap = document.getElementById('hero-tilt');
    if (!wrap) return;

    const card = wrap.querySelector('.image-glass-card');
    if (!card) return;

    const maxTilt = 10;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, running = false;

    const loop = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      card.style.transform = `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      targetY = (px - 0.5) * maxTilt;
      targetX = (0.5 - py) * maxTilt;

      card.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);

      if (!running) {
        running = true;
        requestAnimationFrame(loop);
      }
    });

    wrap.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      if (!running) {
        running = true;
        requestAnimationFrame(loop);
      }
    });
  };

  // Ambient cursor spotlight
  const initCursorGlow = () => {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    const offset = 260; // half of the 520px glow
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const loop = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      glow.style.transform = `translate(${currentX - offset}px, ${currentY - offset}px)`;
      requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      glow.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => {
      glow.classList.remove('visible');
    });

    requestAnimationFrame(loop);
  };

  // Animated stat counters
  const initCounters = () => {
    const counters = document.querySelectorAll('.stat-num[data-count]');
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';

      if (prefersReducedMotion) {
        el.textContent = `${target}${suffix}`;
        return;
      }

      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(counter => observer.observe(counter));
  };

  // Cursor spotlight that follows the mouse across project cards
  const initCardSpotlight = () => {
    if (!finePointer) return;
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });
  };

  // Custom velocity-rotating cursor — mirrors the pointer on abdulrehmanwaseem.me.
  // A teardrop arrow follows the mouse with spring physics, rotates to point in
  // the direction of travel, and dips to 0.95 scale while moving.
  const initCustomCursor = () => {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    const needle = cursor.querySelector('svg');
    const root = document.documentElement;

    // Damped spring integrator (matches Framer Motion's default spring model)
    const createSpring = (stiffness, damping, initial) => {
      const s = {
        value: initial,
        velocity: 0,
        target: initial,
        step(dt) {
          const force = -stiffness * (s.value - s.target) - damping * s.velocity;
          s.velocity += force * dt;
          s.value += s.velocity * dt;
          return s.value;
        }
      };
      return s;
    };

    const springX = createSpring(400, 45, 0);      // position — tight follow
    const springY = createSpring(400, 45, 0);
    const springRot = createSpring(300, 60, 0);    // rotation — smooth ease
    const springScale = createSpring(400, 30, 0);  // scale — entrance + move dip

    let lastX = 0, lastY = 0, lastTime = 0;
    let currentAngle = 0, accumulated = 0;
    let scaleTimer = null;
    let entrancePlayed = false;
    let visible = false;
    let lastFrame = performance.now();

    const show = () => {
      if (visible) return;
      visible = true;
      cursor.classList.add('visible');
      if (!entrancePlayed) {
        entrancePlayed = true;
        springScale.value = 0;
        springScale.velocity = 0;
        springScale.target = 1;
      }
    };

    const hide = () => {
      visible = false;
      cursor.classList.remove('visible');
    };

    const tick = (now) => {
      const dt = Math.min((now - lastFrame) / 1000, 0.033);
      lastFrame = now;

      const x = springX.step(dt);
      const y = springY.step(dt);
      const rot = springRot.step(dt);
      const s = springScale.step(dt);

      cursor.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      needle.style.transform = `translate(-50%, -50%) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(3)})`;

      requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dtMs = now - lastTime;

      springX.target = e.clientX;
      springY.target = e.clientY;

      show();

      // First event — just settle position, skip the (huge) fake velocity
      if (lastTime === 0) {
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;
        return;
      }

      if (dtMs > 0) {
        const speed = Math.hypot(dx, dy) / dtMs; // px/ms
        if (speed > 0.1) {
          // Direction of travel; +90° so the arrow tip leads the movement
          const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
          let delta = angle - currentAngle;
          if (delta > 180) delta -= 360;
          else if (delta < -180) delta += 360;
          accumulated += delta;
          currentAngle = angle;

          springRot.target = accumulated;
          springScale.target = 0.95;
          clearTimeout(scaleTimer);
          scaleTimer = setTimeout(() => { springScale.target = 1; }, 150);
        }
      }

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    };

    root.classList.add('custom-cursor');
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);
    requestAnimationFrame(tick);
  };

  if (!prefersReducedMotion && finePointer) {
    initMagnetic();
    initTilt();
    initCursorGlow();
    initCustomCursor();
  }
  initCounters();
  initCardSpotlight();
});
