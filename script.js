/* ============================================
   MV ACEROS INOXIDABLE — JAVASCRIPT
   Interactions, Animations & Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // === LOADING SCREEN ===
  const loadingScreen = document.getElementById('loadingScreen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = '';
      initCounters();
    }, 800);
  });
  // Fallback if load event already fired
  if (document.readyState === 'complete') {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      initCounters();
    }, 800);
  }

  // === NAVBAR SCROLL ===
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // === MOBILE MENU ===
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });

  // === ACTIVE NAV LINK ON SCROLL ===
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 150;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.querySelectorAll('a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // === PARTICLE SYSTEM (SPARKS) ===
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resizeCanvas() {
    const hero = document.querySelector('.hero');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.3 - 0.2;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.life = Math.random() * 200 + 100;
      this.maxLife = this.life;
      // Steel-blue color palette
      const colors = [
        [126, 184, 218],  // steel blue
        [168, 212, 239],  // light steel
        [212, 212, 224],  // chrome
        [201, 168, 76],   // gold accent
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;
      
      if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      const fadeRatio = this.life / this.maxLife;
      const alpha = this.opacity * fadeRatio;
      const [r, g, b] = this.color;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fill();
      
      // Glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`;
      ctx.fill();
    }
  }

  function initParticles() {
    resizeCanvas();
    const count = Math.min(Math.floor(canvas.width * 0.06), 60);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
    animateParticles();
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animationId = requestAnimationFrame(animateParticles);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationId);
    initParticles();
  });

  initParticles();

  // === SCROLL REVEAL ANIMATIONS ===
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // === COUNTER ANIMATION ===
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-count'));
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const suffix = element.textContent.includes('%') ? '%' : '+';
    
    function update() {
      current += step;
      if (current >= target) {
        current = target;
        element.textContent = target + suffix;
        return;
      }
      element.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(update);
    }
    
    update();
  }

  // === GALLERY FILTER ===
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      galleryItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'todos' || category === filter) {
          item.style.display = '';
          item.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s forwards`;
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // === LIGHTBOX ===
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentLightboxIndex = 0;
  let visibleItems = [];

  function getVisibleItems() {
    return Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = visibleItems[currentLightboxIndex];
    if (!item) return;
    
    const img = item.querySelector('img');
    const title = item.querySelector('h4');
    const desc = item.querySelector('.gallery-item-overlay p');
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxTitle.textContent = title ? title.textContent : '';
    lightboxDesc.textContent = desc ? desc.textContent : '';
  }

  function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
    updateLightboxContent();
  }

  function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxContent();
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const visible = getVisibleItems();
      const visibleIndex = visible.indexOf(item);
      openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', nextLightbox);
  lightboxPrev.addEventListener('click', prevLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });

  // === PRIVACY MODAL ===
  const privacyModal = document.getElementById('privacyModal');
  const openPrivacyBtn = document.getElementById('openPrivacyBtn');
  const privacyClose = document.getElementById('privacyClose');
  const privacyAcceptBtn = document.getElementById('privacyAcceptBtn');
  const privacyCheckbox = document.getElementById('quote-privacy');

  function openPrivacy(e) {
    if (e) e.preventDefault();
    privacyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePrivacy() {
    privacyModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openPrivacyBtn.addEventListener('click', openPrivacy);
  privacyClose.addEventListener('click', closePrivacy);
  privacyAcceptBtn.addEventListener('click', () => {
    privacyCheckbox.checked = true;
    closePrivacy();
  });

  // === OBFUSCATED WA LINKS (BOT PROTECTION) ===
  // We generate the number in runtime so bots scanning HTML won't find it easily
  const getWaNum = () => {
    const parts = ['57', '301', '233', '9553'];
    return parts.join('');
  };

  document.querySelectorAll('.wa-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const type = link.getAttribute('data-type');
      let msg = type === 'quote' ? 'Hola, me interesa cotizar un trabajo en acero inoxidable' : 'Hola MV Aceros';
      const url = `https://wa.me/${getWaNum()}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  });

  // === FORM HANDLING ===
  const cotizacionForm = document.getElementById('cotizacionForm');
  
  cotizacionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Bot Protection: Honeypot Check
    const honeypot = document.getElementById('bot-trap-field').value;
    if (honeypot !== '') {
      // It's a bot. Silently fail.
      console.log('Bot detected');
      cotizacionForm.reset();
      return;
    }

    // 2. Data Privacy: Checkbox Check
    if (!privacyCheckbox.checked) {
      alert('Por favor acepta la Política de Privacidad para continuar.');
      return;
    }

    // 3. Cloudflare Turnstile Validation Check
    const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]');
    if (!turnstileResponse || !turnstileResponse.value) {
      alert('Por favor, espera a que se complete la verificación de seguridad.');
      return;
    }
    
    const name = document.getElementById('quote-name').value;
    let phone = document.getElementById('quote-phone').value.trim();
    const city = document.getElementById('quote-city').value;
    const service = document.getElementById('quote-service').value;
    const project = document.getElementById('quote-project').value;
    const details = document.getElementById('quote-details').value;

    // Auto-prepend country code if not present
    phone = phone.replace(/\s+/g, '').replace(/^0+/, '');
    if (!phone.startsWith('+') && !phone.startsWith('57')) {
      phone = '+57 ' + phone;
    } else if (phone.startsWith('57')) {
      phone = '+' + phone;
    }

    const serviceLabels = {
      'fabricacion': 'Fabricación',
      'instalacion': 'Instalación',
      'mantenimiento': 'Mantenimiento',
      'fabricacion-instalacion': 'Fabricación + Instalación'
    };

    const projectLabels = {
      'barandas': 'Barandas y Pasamanos',
      'escaleras': 'Escaleras',
      'portones': 'Puertas y Portones',
      'rejas': 'Rejas de Seguridad',
      'estructuras': 'Estructuras Metálicas',
      'mobiliario': 'Mobiliario Industrial',
      'otro': 'Otro'
    };

    let message = `🔩 *SOLICITUD DE COTIZACIÓN — MV Aceros Inoxidable*\n\n`;
    message += `👤 *Nombre:* ${name}\n`;
    message += `📱 *Teléfono:* ${phone}\n`;
    if (city) message += `📍 *Ciudad:* ${city}\n`;
    message += `🔧 *Servicio:* ${serviceLabels[service] || service}\n`;
    message += `📋 *Proyecto:* ${projectLabels[project] || project}\n`;
    if (details) message += `\n💬 *Detalles:*\n${details}\n`;

    // Send to owner's personal WhatsApp
    const waUrl = `https://wa.me/${getWaNum()}?text=${encodeURIComponent(message)}`;
    
    const submitBtn = document.getElementById('form-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '✅ ¡Cotización enviada!';
    submitBtn.style.background = 'linear-gradient(135deg, #128c7e 0%, #25d366 100%)';
    
    setTimeout(() => {
      window.open(waUrl, '_blank');
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      cotizacionForm.reset();
    }, 1000);
  });

  // === SMOOTH SCROLL FOR ANCHOR LINKS ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
