(function () {
  // Mobiel menu: los van prefers-reduced-motion, dit is navigatie, geen animatie.
  var menuToggle = document.getElementById('menuToggle');
  var mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    var openMenu = function () {
      mainNav.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
    };
    var closeMenu = function () {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', function () {
      if (mainNav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Sluit bij klik op een link in het paneel (ook de lessen-sublinks en de mobiele CTA's).
    mainNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    // Sluit bij klik buiten het paneel.
    document.addEventListener('click', function (e) {
      if (!mainNav.classList.contains('open')) return;
      if (mainNav.contains(e.target) || menuToggle.contains(e.target)) return;
      closeMenu();
    });
  }

  // Blogoverzicht: "Lees meer" toont telkens de eerstvolgende 6 verborgen kaarten.
  var loadMoreBtn = document.getElementById('blogLoadMore');
  if (loadMoreBtn) {
    var BLOG_BATCH = 6;
    loadMoreBtn.addEventListener('click', function () {
      var hiddenCards = document.querySelectorAll('.blog-card.is-hidden');
      for (var i = 0; i < Math.min(BLOG_BATCH, hiddenCards.length); i++) {
        hiddenCards[i].classList.remove('is-hidden');
      }
      if (document.querySelectorAll('.blog-card.is-hidden').length === 0) {
        loadMoreBtn.style.display = 'none';
      }
    });
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revealTargets = document.querySelectorAll('section:not(.hero) > .container');

  function showAll() {
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  if (prefersReducedMotion) {
    showAll();
    return;
  }

  // Instellingen gelijk aan nostro-platform (duration/easing) en petervandersteege.com (lerp/smoothWheel).
  var lenis = new Lenis({
    duration: 1.2,
    easing: function (t) {
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    },
    lerp: 0.1,
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  var HEADER_OFFSET = 110;

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -HEADER_OFFSET });
    });
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    showAll();
  }
})();
