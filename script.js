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
  // TYPEWRITER EFFECT
  // ==========================================================================
  const typewriterElement = document.getElementById('typewriter');
  const words = ['Frontend Developer.', 'BCA Student.', 'React Enthusiast.', 'Problem Solver.'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  const type = () => {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Remove char
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // faster deletion
    } else {
      // Add char
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // standard typing
    }

    // Handle word switching logic
    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // brief pause before next word
    }

    setTimeout(type, typingSpeed);
  };

  if (typewriterElement) {
    setTimeout(type, 1000); // Start after 1 second delay
  }


  // ==========================================================================
  // INTERACTIVE PARTICLE CANVAS BACKGROUND
  // ==========================================================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  const maxParticles = 65; // Balanced performance & aesthetics
  
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
      this.baseColor = Math.random() > 0.5 ? 'rgba(6, 182, 212,' : 'rgba(139, 92, 246,'; // cyan or violet
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
          ctx.strokeStyle = `rgba(94, 234, 212, ${lineAlpha})`; // teal/cyan connections
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
});
