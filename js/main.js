/* =============================================
   NAVIGATION
   ============================================= */
(function () {
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');

  // Scroll state
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Burger toggle
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
    });
  }

  // Active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* =============================================
   FAQ ACCORDION
   ============================================= */
(function () {
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item__question.open').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
      });

      // Open clicked (unless it was already open)
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
})();

/* =============================================
   PROJECT FILTER
   ============================================= */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

/* =============================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ============================================= */
(function () {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index
        const siblings = entry.target.parentElement.querySelectorAll('.fade-up');
        let delay = 0;
        siblings.forEach((sib, idx) => {
          if (sib === entry.target) delay = idx * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();

/* =============================================
   BEFORE / AFTER SLIDER
   ============================================= */
(function () {
  const slider   = document.getElementById('baSlider');
  const before   = document.getElementById('baBefore');
  const handle   = document.getElementById('baHandle');
  if (!slider) return;

  let dragging = false;

  function setPosition(x) {
    const rect  = slider.getBoundingClientRect();
    let pct     = (x - rect.left) / rect.width;
    pct         = Math.min(Math.max(pct, 0.02), 0.98);
    const pctPx = pct * 100;
    before.style.width       = pctPx + '%';
    handle.style.left        = pctPx + '%';
  }

  slider.addEventListener('mousedown',  (e) => { dragging = true; setPosition(e.clientX); });
  slider.addEventListener('touchstart', (e) => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });

  window.addEventListener('mousemove',  (e) => { if (dragging) setPosition(e.clientX); });
  window.addEventListener('touchmove',  (e) => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });

  window.addEventListener('mouseup',  () => { dragging = false; });
  window.addEventListener('touchend', () => { dragging = false; });

  // Subtle auto-animate on load to hint interactivity
  let pos = 0.5;
  let dir = -1;
  let animFrame;
  function autoHint() {
    pos += dir * 0.003;
    if (pos < 0.3) { dir = 1; }
    if (pos > 0.7) { dir = -1; clearAnimation(); return; }
    before.style.width = (pos * 100) + '%';
    handle.style.left  = (pos * 100) + '%';
    animFrame = requestAnimationFrame(autoHint);
  }
  function clearAnimation() {
    cancelAnimationFrame(animFrame);
    before.style.width = '50%';
    handle.style.left  = '50%';
  }
  // Start hint after 1.5s, stop on first interaction
  const hintTimer = setTimeout(autoHint, 1500);
  slider.addEventListener('mousedown',  () => { clearTimeout(hintTimer); cancelAnimationFrame(animFrame); }, { once: true });
  slider.addEventListener('touchstart', () => { clearTimeout(hintTimer); cancelAnimationFrame(animFrame); }, { once: true, passive: true });
})();

/* =============================================
   CONTACT FORM SUBMIT
   ============================================= */
(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '✓ Nachricht gesendet!';
    btn.style.background = '#22C55E';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 5000);
  });
})();
