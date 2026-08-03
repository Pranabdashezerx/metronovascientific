/* Metronova Scintific Research — site scripts */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Mobile navigation
  --------------------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.querySelector('.nav__menu');
  var backdrop = null;

  var closeMenu = function () {
    if (!header || !header.classList.contains('is-open')) return;
    header.classList.remove('is-open');
    if (toggle) {
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('nav-open');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
  };

  var openMenu = function () {
    if (!header) return;
    header.classList.add('is-open');
    if (toggle) {
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('nav-open');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
  };

  if (header && !header.querySelector('.nav__backdrop')) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav__backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    header.insertBefore(backdrop, header.firstChild);
  } else if (header) {
    backdrop = header.querySelector('.nav__backdrop');
  }

  if (toggle && header) {
    toggle.addEventListener('click', function () {
      if (header.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });

  if (menu) {
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------------------------------------------------------------------
     Header scroll state
  --------------------------------------------------------------------- */
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Active nav link (based on current page)
  --------------------------------------------------------------------- */
  (function setActiveLink() {
    var links = document.querySelectorAll('.nav__menu li:not(.nav__menu-cta) > a[href]');
    var path = window.location.pathname.replace(/\/index\.html$/, '/');
    var current = path.split('/').pop() || 'index.html';

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var target = href.split('/').pop();
      if (target === current || (current === '' && target === 'index.html')) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  })();

  /* ---------------------------------------------------------------------
     Scroll reveal
  --------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if (revealEls.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var delay = entry.target.getAttribute('data-reveal-delay') || 0;
              setTimeout(function () {
                entry.target.classList.add('is-visible');
              }, Number(delay));
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ---------------------------------------------------------------------
     Schematic draw-in animation (hero SVG)
  --------------------------------------------------------------------- */
  var schematic = document.querySelector('.schematic');

  if (schematic) {
    var drawPaths = schematic.querySelectorAll('.draw');
    var nodes = schematic.querySelectorAll('.node');
    var annos = schematic.querySelectorAll('.anno');
    var figure = schematic.closest('[data-schematic-interactive]');
    var tip = figure ? figure.querySelector('.schematic-tip') : null;
    var hotspots = schematic.querySelectorAll('.schematic__hotspot');

    var markDrawn = function () {
      schematic.classList.add('is-drawn');
    };

    if (prefersReducedMotion) {
      nodes.forEach(function (n) { n.classList.add('is-visible'); });
      annos.forEach(function (a) { a.classList.add('is-visible'); });
      markDrawn();
    } else {
      drawPaths.forEach(function (path, i) {
        var length = path.getTotalLength ? path.getTotalLength() : 300;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = 'stroke-dashoffset ' + (900 + i * 80) + 'ms cubic-bezier(0.4,0,0.2,1) ' + (i * 90) + 'ms';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            path.style.strokeDashoffset = '0';
          });
        });
      });

      var totalDraw = drawPaths.length ? 900 + drawPaths.length * 90 : 0;

      nodes.forEach(function (node, i) {
        setTimeout(function () { node.classList.add('is-visible'); }, totalDraw + i * 80);
      });

      annos.forEach(function (a, i) {
        setTimeout(function () { a.classList.add('is-visible'); }, totalDraw + 200 + i * 120);
      });

      setTimeout(markDrawn, totalDraw + 400);
    }

    if (figure) {
      var setTilt = function (x, y, active) {
        if (prefersReducedMotion) return;
        schematic.style.setProperty('--px', String(x * 14));
        schematic.style.setProperty('--py', String(y * 14));
        schematic.style.setProperty('--pr', String(x * 2.5));
        figure.classList.toggle('is-active', active);
      };

      figure.addEventListener('pointerenter', function () {
        setTilt(0, 0, true);
      });

      figure.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        var rect = figure.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt(x, y, true);
      });

      figure.addEventListener('pointerleave', function () {
        schematic.style.setProperty('--px', '0');
        schematic.style.setProperty('--py', '0');
        schematic.style.setProperty('--pr', '0');
        figure.classList.remove('is-active');
        hotspots.forEach(function (h) { h.classList.remove('is-active'); });
        if (tip) {
          tip.classList.remove('is-visible');
          tip.hidden = true;
        }
      });

      hotspots.forEach(function (hotspot) {
        var showTip = function (e) {
          hotspots.forEach(function (h) { h.classList.remove('is-active'); });
          hotspot.classList.add('is-active');
          if (!tip) return;
          tip.textContent = hotspot.getAttribute('data-tip') || '';
          tip.hidden = false;
          tip.classList.add('is-visible');
          if (e && figure) {
            var fr = figure.getBoundingClientRect();
            var left = (e.clientX || 0) - fr.left + 14;
            var top = (e.clientY || 0) - fr.top - 10;
            tip.style.left = Math.min(left, fr.width - tip.offsetWidth - 8) + 'px';
            tip.style.top = Math.max(top, 8) + 'px';
          }
        };

        var hideTip = function () {
          hotspot.classList.remove('is-active');
          if (!tip) return;
          tip.classList.remove('is-visible');
          tip.hidden = true;
        };

        hotspot.addEventListener('pointerenter', showTip);
        hotspot.addEventListener('pointermove', showTip);
        hotspot.addEventListener('pointerleave', hideTip);
        hotspot.addEventListener('focus', function () { showTip(null); });
        hotspot.addEventListener('blur', hideTip);
      });
    }
  }

  /* ---------------------------------------------------------------------
     Contact form
  --------------------------------------------------------------------- */
  var form = document.querySelector('[data-contact-form]');

  if (form) {
    var statusEl = form.querySelector('[data-form-status]');
    var endpoint = form.getAttribute('data-endpoint');

    var showStatus = function (message, type) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.className = 'form__status is-visible form__status--' + type;
    };

    var validators = {
      name: function (v) { return v.trim().length >= 2 || 'Please enter your full name.'; },
      email: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.';
      },
      message: function (v) { return v.trim().length >= 10 || 'Tell us a little more (10+ characters).'; }
    };

    var validateField = function (field) {
      var validator = validators[field.name];
      if (!validator) return true;
      var result = validator(field.value);
      var wrapper = field.closest('.form__field');
      var errorEl = wrapper ? wrapper.querySelector('.form__error') : null;

      if (result === true) {
        if (wrapper) wrapper.classList.remove('has-error');
        return true;
      }

      if (wrapper) wrapper.classList.add('has-error');
      if (errorEl) errorEl.textContent = result;
      return false;
    };

    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields = form.querySelectorAll('input[required], textarea[required]');
      var valid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) valid = false;
      });

      if (!valid) {
        showStatus('Please fix the highlighted fields before sending.', 'error');
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      var finish = function (ok) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
        if (ok) {
          showStatus('Message sent. We\u2019ll get back to you within 1\u20132 business days.', 'success');
          form.reset();
        } else {
          showStatus('Something went wrong. Please email us directly at info@metronovascientific.com.', 'error');
        }
      };

      if (endpoint && endpoint.indexOf('YOUR_FORM_ENDPOINT') === -1) {
        fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        })
          .then(function (res) { finish(res.ok); })
          .catch(function () { finish(false); });
      } else {
        var params = new URLSearchParams();
        new FormData(form).forEach(function (value, key) { params.append(key, String(value)); });
        window.location.href =
          'mailto:info@metronovascientific.com?subject=Website%20enquiry%20from%20' +
          encodeURIComponent(form.name ? form.name.value : '') +
          '&body=' +
          encodeURIComponent(
            Array.from(form.elements)
              .filter(function (el) { return el.name; })
              .map(function (el) { return el.name + ': ' + el.value; })
              .join('\n')
          );
        finish(true);
      }
    });
  }

  /* ---------------------------------------------------------------------
     Footer year
  --------------------------------------------------------------------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
