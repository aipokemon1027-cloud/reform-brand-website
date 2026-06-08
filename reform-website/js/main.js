/* ============================================
   reform. — Cinematic Brand Experience JS
   Version 5.0
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // ============================================
  // Mobile Menu Toggle
  // ============================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('active', menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';
      
      const spans = menuToggle.querySelectorAll('span');
      if (menuOpen && spans.length >= 2) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.transform = 'rotate(-45deg) translate(0, 0)';
        if (spans[2]) spans[2].style.opacity = '0';
      } else if (spans.length >= 2) {
        spans[0].style.transform = '';
        spans[1].style.transform = '';
        if (spans[2]) spans[2].style.opacity = '';
      }
    });

    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        const spans = menuToggle.querySelectorAll('span');
        if (spans.length >= 2) {
          spans[0].style.transform = '';
          spans[1].style.transform = '';
          if (spans[2]) spans[2].style.opacity = '';
        }
      });
    });
  }

  // ============================================
  // Navigation Scroll Effect
  // ============================================
  const nav = document.getElementById('mainNav');
  if (nav) {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Add scrolled class for background
      if (currentScroll > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      
      // Optional: hide/show nav on scroll direction
      // if (currentScroll > lastScroll && currentScroll > 100) {
      //   nav.style.transform = 'translateY(-100%)';
      // } else {
      //   nav.style.transform = 'translateY(0)';
      // }
      // lastScroll = currentScroll;
    }, { passive: true });
  }

  // ============================================
  // Scroll Reveal Animation
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add stagger delay based on index
          const delay = entry.target.style.animationDelay || `${index * 100}ms`;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, 0);
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  // ============================================
  // Parallax Effect for Hero
  // ============================================
  const hero = document.querySelector('.hero');
  if (hero) {
    const heroBg = hero.querySelector('.hero-bg-image');
    
    if (heroBg) {
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const windowHeight = window.innerHeight;
        
        if (scrolled < windowHeight * 1.5) {
          heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
      }, { passive: true });
    }
  }

  // ============================================
  // Philosophy Cards 3D Tilt Effect
  // ============================================
  const philosophyItems = document.querySelectorAll('.philosophy-item');
  
  philosophyItems.forEach(item => {
    item.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      this.style.transition = 'transform 0.1s ease-out';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      this.style.transition = 'transform 0.4s ease';
    });
  });

  // ============================================
  // Horizontal Scroll for Preview Grid
  // ============================================
  const previewGrid = document.querySelector('.preview-grid');
  
  if (previewGrid) {
    let isDown = false;
    let startX;
    let scrollLeft;
    
    previewGrid.addEventListener('mousedown', (e) => {
      isDown = true;
      previewGrid.style.cursor = 'grabbing';
      startX = e.pageX - previewGrid.offsetLeft;
      scrollLeft = previewGrid.scrollLeft;
    });
    
    previewGrid.addEventListener('mouseleave', () => {
      isDown = false;
      previewGrid.style.cursor = 'grab';
    });
    
    previewGrid.addEventListener('mouseup', () => {
      isDown = false;
      previewGrid.style.cursor = 'grab';
    });
    
    previewGrid.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - previewGrid.offsetLeft;
      const walk = (x - startX) * 2;
      previewGrid.scrollLeft = scrollLeft - walk;
    });
    
    // Set initial cursor style
    previewGrid.style.cursor = 'grab';
    
    // Make it touch-friendly
    previewGrid.style.scrollSnapType = 'x mandatory';
    previewGrid.style.webkitOverflowScrolling = 'touch';
  }

  // ============================================
  // Products Filter
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productItems = document.querySelectorAll('.product-item');

  if (filterBtns.length > 0 && productItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter products with animation
        productItems.forEach(item => {
          const category = item.getAttribute('data-category');
          const show = filter === 'all' || category === filter;

          if (show) {
            item.style.opacity = '0';
            item.style.transform = 'translateY(12px)';
            item.style.display = '';
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          } else {
            item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            item.style.opacity = '0';
            item.style.transform = 'translateY(12px)';
            setTimeout(() => {
              if (item.style.opacity === '0') {
                item.style.display = 'none';
              }
            }, 220);
          }
        });
      });
    });
  }

  // ============================================
  // FAQ Accordion
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(fi => {
          fi.classList.remove('open');
          const ans = fi.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = '0';
        });
        // Open clicked if it was closed
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
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

  // ============================================
  // Contact Form — Formspree Integration
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerText = 'Sending...';
      btn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          contactForm.style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'block';
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert('Something went wrong. Please email us directly at hello@reform-brand.com');
      }
    });
  }

  // ============================================
  // Color Swatch Copy Functionality (Dashboard)
  // ============================================
  const colorSwatches = document.querySelectorAll('.color-swatch');
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', function() {
      const color = this.getAttribute('data-color');
      if (color && navigator.clipboard) {
        navigator.clipboard.writeText(color).then(() => {
          // Visual feedback
          const originalTransform = this.style.transform;
          this.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.style.transform = originalTransform;
          }, 150);
          
          // Show copied feedback
          const feedback = document.createElement('div');
          feedback.textContent = 'Copied!';
          feedback.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(61, 44, 61, 0.95);
            color: #FAF8F5;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
          `;
          this.appendChild(feedback);
          setTimeout(() => feedback.remove(), 1000);
        });
      }
    });
  });

  // ============================================
  // Motion Demos Animation Trigger (Dashboard)
  // ============================================
  const motionSection = document.querySelector('.dashboard-section');
  if (motionSection && motionSection.querySelector('.motion-ball')) {
    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const balls = entry.target.querySelectorAll('.motion-ball');
          balls.forEach((ball, index) => {
            setTimeout(() => {
              ball.style.opacity = '1';
              ball.style.transform = 'translateY(0)';
            }, 300 + (index * 200));
          });
          motionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    motionObserver.observe(motionSection);
  }

  // ============================================
  // Lazy Load Images
  // ============================================
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.5s ease';
          
          img.onload = () => {
            img.style.opacity = '1';
          };
          
          if (img.complete) {
            img.style.opacity = '1';
          }
          
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // Page Load Animation
  // ============================================
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

}); // End DOMContentLoaded