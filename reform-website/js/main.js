// reform. V8 - Editorial Feminine Theme + Full Cart System

// ==================== CART MANAGEMENT ====================

const FREE_SHIPPING_THRESHOLD = 1500; // NT$

function getCart() {
  return JSON.parse(localStorage.getItem('reformCart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('reformCart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
  });
  document.querySelectorAll('.cart-icon').forEach(el => {
    el.setAttribute('data-cart-count', count);
  });
}

function addToCart(productId, name, nameEn, price, size, color, image) {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId && item.size === size && item.color === color);
  
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      id: productId,
      name: name,
      nameEn: nameEn,
      price: price,
      size: size,
      color: color,
      image: image,
      qty: 1
    });
  }
  
  saveCart(cart);
  showCartNotification(name, nameEn);
}

function removeFromCart(productId, size, color) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === productId && item.size === size && item.color === color));
  saveCart(cart);
  updateCartUI();
}

function updateCartItemQty(productId, size, color, newQty) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === productId && item.size === size && item.color === color);
  
  if (index > -1) {
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = newQty;
    }
    saveCart(cart);
    updateCartUI();
  }
}

function showCartNotification(name, nameEn) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
    <div class="cart-notification-content">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <div>
        <p class="notification-title">Added to cart 已加入購物車</p>
        <p class="notification-product">${name}</p>
      </div>
      <a href="cart.html" class="notification-link">View Cart 查看</a>
    </div>
  `;
  
  const style = document.createElement('style');
  style.id = 'cart-notification-style';
  style.textContent = `
    .cart-notification {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 1000;
      background: var(--black);
      color: var(--white);
      padding: 1.2rem 1.5rem;
      min-width: 320px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      animation: slideUpNotif 0.3s ease;
    }
    @keyframes slideUpNotif {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .cart-notification-content { display: flex; align-items: center; gap: 1rem; }
    .cart-notification-content svg { color: var(--gold); flex-shrink: 0; }
    .notification-title { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.7; margin-bottom: 0.3rem; }
    .notification-product { font-size: 0.95rem; font-weight: 500; }
    .notification-link { 
      margin-left: auto; font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.1em; 
      text-transform: uppercase; color: var(--gold); text-decoration: none; border-bottom: 1px solid var(--gold);
    }
    .notification-link:hover { color: var(--rose); border-color: var(--rose); }
  `;
  if (!document.getElementById('cart-notification-style')) {
    document.head.appendChild(style);
  }
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideUpNotif 0.3s ease reverse';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function calculateSubtotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// ==================== UI UPDATES ====================

function updateCartUI() {
  const cart = getCart();
  const cartEmpty = document.getElementById('cartEmpty');
  const cartContent = document.getElementById('cartContent');
  
  if (!cartEmpty || !cartContent) return;
  
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartContent.classList.remove('active');
  } else {
    cartEmpty.style.display = 'none';
    cartContent.classList.add('active');
    
    const subtotal = calculateSubtotal();
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 150;
    const total = subtotal + shippingCost;
    
    const itemCountEl = document.getElementById('itemCount');
    if (itemCountEl) {
      itemCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    }
    
    const cartItemsEl = document.getElementById('cartItems');
    if (cartItemsEl) {
      cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-name-en">${item.nameEn}</div>
            <div class="cart-item-variant">${item.size} / ${item.color}</div>
            <div class="cart-item-price">NT$${item.price.toLocaleString()}</div>
          </div>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button class="qty-btn qty-minus" aria-label="Decrease">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn qty-plus" aria-label="Increase">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.id}', '${item.size}', '${item.color}')">Remove 移除</button>
          </div>
        </div>
      `).join('');
      
      cartItemsEl.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const cartItem = this.closest('.cart-item');
          const id = cartItem.dataset.id;
          const size = cartItem.dataset.size;
          const color = cartItem.dataset.color;
          const currentQty = parseInt(cartItem.querySelector('.qty-value').textContent);
          
          if (this.classList.contains('qty-plus')) {
            updateCartItemQty(id, size, color, currentQty + 1);
          } else {
            updateCartItemQty(id, size, color, currentQty - 1);
          }
        });
      });
    }
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const discountEl = document.getElementById('discount');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `NT$${subtotal.toLocaleString()}`;
    if (shippingEl) shippingEl.textContent = shippingCost === 0 ? 'Free 免費' : `NT$${shippingCost}`;
    if (discountEl) discountEl.textContent = '-NT$0';
    if (totalEl) totalEl.textContent = `NT$${total.toLocaleString()}`;
    
    const shippingBar = document.getElementById('shippingBar');
    const shippingMsg = document.getElementById('shippingMsg');
    const shippingProgress = document.getElementById('shippingProgress');
    const shippingProgressText = document.getElementById('shippingProgressText');
    
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      if (shippingBar) shippingBar.style.display = 'none';
    } else {
      if (shippingBar) shippingBar.style.display = 'block';
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      const progress = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;
      
      if (shippingMsg) shippingMsg.textContent = `Add NT$${remaining.toLocaleString()} to unlock free shipping 累積 NT$${remaining.toLocaleString()} 解鎖免運`;
      if (shippingProgress) shippingProgress.style.width = `${progress}%`;
      if (shippingProgressText) shippingProgressText.textContent = `${Math.round(progress)}%`;
    }
  }
  
  updateCartCount();
}

// ==================== PRODUCT PAGE ADD TO CART ====================

function initProductPage() {
  const addToCartBtn = document.querySelector('.btn-add-cart');
  if (!addToCartBtn) return;
  
  addToCartBtn.addEventListener('click', function() {
    // Get product info from the page - use direct selectors matching actual HTML
    // The h1 contains product name like "Classic 經典款"
    const nameEl = document.querySelector('.product-info-detail h1');
    const priceEl = document.querySelector('.product-price-detail');
    const imageEl = document.querySelector('.product-main-image img');
    const selectedSizeEl = document.querySelector('.size-option.selected');
    const selectedColorEl = document.querySelector('.color-option.selected');
    
    if (!nameEl || !priceEl || !imageEl) {
      alert('Product information not found. 找不到商品資訊。');
      return;
    }
    
    if (!selectedSizeEl) {
      alert('Please select a size. 請選擇尺寸。');
      return;
    }
    
    // Get product name - split Chinese and English
    const fullName = nameEl.textContent.trim();
    const parts = fullName.split(/\s+/);
    const name = parts[0]; // Chinese name
    const nameEn = parts.slice(1).join(' ') || name;
    
    // Get price - extract numbers only
    const priceText = priceEl.textContent.replace(/[^0-9]/g, '');
    const price = parseInt(priceText) || 0;
    
    // Get image source
    const image = imageEl.src;
    
    // Get selected size
    const size = selectedSizeEl.textContent.trim();
    
    // Get selected color or default
    const color = selectedColorEl ? selectedColorEl.getAttribute('title') || 'Default' : 'Default';
    
    // Generate product ID from current page filename
    const productId = window.location.pathname.split('/').pop().replace('.html', '');
    
    // Add to cart
    addToCart(productId, name, nameEn, price, size, color, image);
  });
}

// ==================== MAIN INIT ====================

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  const menuBtn = document.querySelector('.nav-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in, .slide-left, .slide-right').forEach(el => {
    revealObserver.observe(el);
  });

  const dots = document.querySelectorAll('.testimonial-dot');
  let currentDot = 0;

  if (dots.length > 0) {
    setInterval(() => {
      dots[currentDot].classList.remove('active');
      currentDot = (currentDot + 1) % dots.length;
      dots[currentDot].classList.add('active');
    }, 5000);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        dots[currentDot].classList.remove('active');
        currentDot = index;
        dots[currentDot].classList.add('active');
      });
    });
  }

  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const button = newsletterForm.querySelector('button');
      
      if (input.value) {
        button.textContent = 'Subscribed! ✓';
        button.style.background = 'var(--rose)';
        input.value = '';
        
        setTimeout(() => {
          button.textContent = 'Subscribe 訂閱';
          button.style.background = '';
        }, 3000);
      }
    });
  }

  // Product size selection
  const sizeOptions = document.querySelectorAll('.size-option');
  sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
      sizeOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    });
  });

  // Product color selection
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      colorOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    });
  });

  // Product thumbnail click
  const thumbnails = document.querySelectorAll('.product-thumb');
  const mainImage = document.querySelector('.product-main-image img');
  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImage.src = thumb.querySelector('img').src;
      });
    });
  }

  // Initialize product page cart functionality
  initProductPage();
  
  // Update cart count on all pages
  updateCartCount();

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const text = counter.textContent;
      const numMatch = text.match(/[0-9.]+/);
      if (!numMatch) return;
      const target = parseFloat(numMatch[0]);
      const suffix = text.replace(numMatch[0], '');
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = text;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current) + suffix;
        }
      }, 30);
    });
  }

  const statsSection = document.querySelector('.stats-row');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.unobserve(statsSection);
      }
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
  }
});