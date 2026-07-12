/**
 * 1AI YPSMA Website - Main JavaScript
 * Handles: Navigation, Animations, Program Filtering, Calendar, Contact Form, Scroll effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initProgramFilters();
  initCalendar();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
  initArticleTocHighlight();
});

/* ============================
   NAVIGATION
   ============================ */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.navbar__toggle');
  const mobileMenu = document.querySelector('.navbar__mobile-menu');
  const mobileLinks = document.querySelectorAll('.navbar__mobile-link');

  // Scroll effect: add 'scrolled' class on scroll
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
  }

  // Mobile toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active page highlighting
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar__link, .navbar__mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
      link.classList.add('active');
    }
  });
}

/* ============================
   SCROLL ANIMATIONS
   ============================ */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });

  // Stagger children animations
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      child.style.animationDelay = `${i * 0.1}s`;
      observer.observe(child);
    });
  });
}

/* ============================
   PROGRAM FILTERING
   ============================ */
function initProgramFilters() {
  const tabs = document.querySelectorAll('.program-category-tab');
  const cards = document.querySelectorAll('.program-card');
  const searchInput = document.querySelector('.program-search');
  const sortSelect = document.querySelector('.program-sort');

  if (!tabs.length || !cards.length) return;

  let activeCategory = 'all';

  // Category tab click
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category;
      filterPrograms();
    });
  });

  // Search
  if (searchInput) {
    searchInput.addEventListener('input', debounce(filterPrograms, 300));
  }

  // Sort
  if (sortSelect) {
    sortSelect.addEventListener('change', filterPrograms);
  }

  function filterPrograms() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    let visibleCards = Array.from(cards).filter(card => {
      const category = card.dataset.category || '';
      const title = (card.querySelector('.program-card__title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.program-card__desc')?.textContent || '').toLowerCase();
      
      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm);
      
      return matchesCategory && matchesSearch;
    });

    // Sort
    if (sortSelect) {
      const sortBy = sortSelect.value;
      visibleCards.sort((a, b) => {
        if (sortBy === 'name') {
          return (a.querySelector('.program-card__title')?.textContent || '').localeCompare(
            b.querySelector('.program-card__title')?.textContent || ''
          );
        }
        if (sortBy === 'popular') {
          return parseInt(b.dataset.popularity || 0) - parseInt(a.dataset.popularity || 0);
        }
        return 0;
      });
    }

    // Hide all, then show matching
    cards.forEach(card => card.style.display = 'none');
    visibleCards.forEach(card => {
      card.style.display = '';
      card.classList.add('animate-fadeIn');
    });

    // Update count
    const countEl = document.querySelector('.program-count');
    if (countEl) {
      countEl.textContent = `Menampilkan ${visibleCards.length} program`;
    }
  }
}

/* ============================
   CALENDAR
   ============================ */
function initCalendar() {
  const calendarGrid = document.querySelector('.calendar-grid');
  const monthDisplay = document.querySelector('.calendar-month');
  const prevBtn = document.querySelector('.calendar-prev');
  const nextBtn = document.querySelector('.calendar-next');

  if (!calendarGrid) return;

  const events = JSON.parse(calendarGrid.dataset.events || '[]');
  const today = new Date();
  let currentDate = new Date(today.getFullYear(), today.getMonth(), 1);

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    if (monthDisplay) {
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      monthDisplay.textContent = `${monthNames[month]} ${year}`;
    }

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    let html = '';

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<div class="calendar-day calendar-day--other-month">${daysInPrevMonth - i}</div>`;
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const hasEvent = events.some(e => e.date === dateStr);
      const classes = [
        'calendar-day',
        isToday ? 'calendar-day--today' : '',
        hasEvent ? 'calendar-day--has-event' : ''
      ].filter(Boolean).join(' ');

      html += `<div class="${classes}" data-date="${dateStr}">
        <span class="calendar-day__number">${day}</span>
        ${hasEvent ? '<span class="calendar-day__dot"></span>' : ''}
      </div>`;
    }

    // Next month leading days
    const totalCells = firstDay + daysInMonth;
    const remaining = 7 - (totalCells % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        html += `<div class="calendar-day calendar-day--other-month">${i}</div>`;
      }
    }

    calendarGrid.innerHTML = html;

    // Click handlers for days with events
    calendarGrid.querySelectorAll('.calendar-day--has-event').forEach(dayEl => {
      dayEl.addEventListener('click', () => {
        const date = dayEl.dataset.date;
        const dayEvents = events.filter(e => e.date === date);
        showEventPopup(dayEl, dayEvents);
      });
    });
  }

  function showEventPopup(element, events) {
    // Remove existing popup
    const existing = document.querySelector('.calendar-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.className = 'calendar-popup';
    popup.innerHTML = events.map(e => `
      <a href="${e.url || '#'}" class="calendar-popup__item">
        <strong>${e.title}</strong>
        <span>${e.time || ''}</span>
      </a>
    `).join('');

    element.style.position = 'relative';
    element.appendChild(popup);

    // Auto-remove on click outside
    setTimeout(() => {
      document.addEventListener('click', function handler(ev) {
        if (!popup.contains(ev.target) && ev.target !== element) {
          popup.remove();
          document.removeEventListener('click', handler);
        }
      });
    }, 100);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  }

  renderCalendar();
}

/* ============================
   CONTACT FORM
   ============================ */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.contact-form__submit');
    const originalText = submitBtn?.textContent;
    
    // Simple validation
    const name = form.querySelector('#name')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const message = form.querySelector('#message')?.value.trim();

    if (!name || !email || !message) {
      showFormMessage('error', 'Mohon lengkapi semua field yang wajib diisi.');
      return;
    }

    if (!isValidEmail(email)) {
      showFormMessage('error', 'Format email tidak valid.');
      return;
    }

    // Simulate submission
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    showFormMessage('success', 'Pesan berhasil dikirim! Kami akan membalas dalam 1x24 jam.');
    form.reset();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  // Floating label effect
  form.querySelectorAll('.contact-form__input, .contact-form__textarea, .contact-form__select').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement?.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement?.classList.remove('focused');
      }
    });
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMessage(type, message) {
    // Remove existing
    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = `form-message form-message--${type}`;
    el.textContent = message;
    form.insertBefore(el, form.firstChild);

    setTimeout(() => el.remove(), 5000);
  }
}

/* ============================
   FAQ ACCORDION
   ============================ */
document.addEventListener('click', (e) => {
  const question = e.target.closest('.contact-faq__question');
  if (!question) return;

  const item = question.closest('.contact-faq__item');
  const answer = item?.querySelector('.contact-faq__answer');
  const toggle = question.querySelector('.contact-faq__toggle');

  const isOpen = item?.classList.contains('active');

  // Close all others
  document.querySelectorAll('.contact-faq__item.active').forEach(openItem => {
    if (openItem !== item) {
      openItem.classList.remove('active');
      openItem.querySelector('.contact-faq__answer').style.maxHeight = '0';
      openItem.querySelector('.contact-faq__toggle').textContent = '+';
    }
  });

  // Toggle current
  if (item) {
    item.classList.toggle('active');
    if (answer) {
      answer.style.maxHeight = isOpen ? '0' : `${answer.scrollHeight}px`;
    }
    if (toggle) {
      toggle.textContent = isOpen ? '+' : '−';
    }
  }
});

/* ============================
   BACK TO TOP
   ============================ */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================
   SMOOTH SCROLL
   ============================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================
   ARTICLE TOC HIGHLIGHT
   ============================ */
function initArticleTocHighlight() {
  const tocLinks = document.querySelectorAll('.article-detail__toc-link');
  if (!tocLinks.length) return;

  const headings = Array.from(tocLinks).map(link => {
    const id = link.getAttribute('href')?.slice(1);
    return id ? document.getElementById(id) : null;
  }).filter(Boolean);

  if (!headings.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.5, rootMargin: '-80px 0px -50% 0px' });

  headings.forEach(heading => observer.observe(heading));
}

/* ============================
   UTILITIES
   ============================ */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Lazy loading images
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}
