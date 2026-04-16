// ========================================
// reform. - Main JavaScript
// Uses minimal vanilla JS (no frameworks)
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // Mobile Navigation Toggle
  // ========================================
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
    });

    // Close mobile menu when clicking a link
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
      });
    });
  }

  // ========================================
  // Header scroll behavior
  // ========================================
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.transform = currentScroll > lastScroll
        ? 'translateY(-100%)'
        : 'translateY(0)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

  // ========================================
  // Scroll Reveal Animation
  // ========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========================================
  // Staggered animations for grids
  // ========================================
  const gridItems = document.querySelectorAll('.product-card, .blog-card');

  gridItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 100}ms`;
  });

  // ========================================
  // Newsletter form handling
  // ========================================
  const newsletterForm = document.querySelector('.newsletter__form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      alert(`感謝訂閱！我們會把最新資訊寄到 ${email}`);
      newsletterForm.reset();
    });
  }

  // ========================================
  // Smooth scroll for anchor links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ========================================
  // Parallax effect on hero
  // ========================================
  const hero = document.querySelector('.hero');

  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;

      if (scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${rate}px)`;
      }
    });
  }

  // ========================================
  // Button ripple effect
  // ========================================
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Simple visual feedback
      this.style.transform = 'scale(0.97)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });

  // ========================================
  // Video autoplay on visibility
  // ========================================
  const video = document.getElementById('heroVideo');
  if (video) {
    // Check if video source exists, otherwise show gradient
    video.addEventListener('error', () => {
      video.style.display = 'none';
    });

    // Try to play (muted autoplay required for mobile)
    video.play().catch(() => {
      video.style.display = 'none';
    });
  }

  // ========================================
  // Lazy load images (if we add real images)
  // ========================================
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.src = img.dataset.src;
    });
  }

});

console.log('reform. website loaded');