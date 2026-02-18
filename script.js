/**
 * Zdeněk Podaný - Základní interaktivita
 */

document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal – elementy se zobrazí při vstupu do viewportu
  const revealElements = document.querySelectorAll(
    '.section-title, .section-subtitle, .service-card, .process-step, .testimonial-card, .pricing-card, .pricing-note, .contact-form'
  );

  revealElements.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Metriky – animace čísel při scrollu do viewportu
  const metricNumbers = document.querySelectorAll('.metric-number[data-count]');
  const metricObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const target = parseInt(entry.target.dataset.count, 10);
          const suffix = entry.target.dataset.suffix || '';
          const duration = 1500;
          const start = performance.now();

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * easeOut);
            entry.target.textContent = current + suffix;

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              entry.target.textContent = target + suffix;
            }
          };

          requestAnimationFrame(animate);
        }
      });
    },
    { threshold: 0.5 }
  );

  metricNumbers.forEach((el) => metricObserver.observe(el));

  // Aktivní sekce v navigaci – zvýrazní odkaz podle toho, kde uživatel scrolluje
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const visibleSections = new Map();

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          visibleSections.set(id, entry.intersectionRatio);
        } else {
          visibleSections.delete(id);
        }
      });

      let activeId = null;
      let maxRatio = 0;
      visibleSections.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          activeId = id;
        }
      });

      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${activeId}`);
      });
    },
    { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5], rootMargin: '-88px 0px 0px 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // Aktuální rok v copyrightu
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobilní menu
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });

    // Zavřít menu po kliknutí na odkaz
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => navMenu.classList.remove('active'));
    });
  }

  // Kontaktní formulář – odesílá přes Formspree
  const contactForm = document.querySelector('.contact-form');
  const formFeedback = document.querySelector('.form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const submitText = submitBtn.dataset.submitText || 'Odeslat zprávu';
      const sendingText = submitBtn.dataset.sendingText || 'Odesílám...';

      submitBtn.disabled = true;
      submitBtn.textContent = sendingText;
      formFeedback.hidden = true;
      formFeedback.className = 'form-feedback';

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        const data = await response.json();

        if (data.ok) {
          formFeedback.textContent = 'Zpráva byla odeslána. Děkuji, ozvu se vám co nejdříve.';
          formFeedback.classList.add('form-feedback--success');
          contactForm.reset();
        } else {
          throw new Error(data.error || 'Něco se pokazilo.');
        }
      } catch (err) {
        formFeedback.textContent = 'Něco se pokazilo. Zkuste to prosím znovu nebo mi napište přímo na zdepodany@gmail.com.';
        formFeedback.classList.add('form-feedback--error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = submitText;
        formFeedback.hidden = false;
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
});
