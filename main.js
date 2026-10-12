/* ============================================================
   NAVBAR BEHAVIOR
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const navbar    = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');
    const navLinks  = document.querySelectorAll('.nav-link');

    /* --- 1. Scrolled state --- */
    const onScroll = () => {
        if (window.scrollY > 30) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* --- 2. Mobile menu toggle --- */
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* --- 3. Close mobile menu on link click --- */
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    /* --- 4. Active link highlighting on scroll --- */
    const sections = [...document.querySelectorAll('section[id]')];
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
            }
        });
    }, { rootMargin: '-45% 0px -55% 0px' });

    sections.forEach(sec => observer.observe(sec));
});

/* ============================================================
   FAQ ACCORDION
   - Click question to expand/collapse answer
   - Only one open at a time (optional — remove to allow multi-open)
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer   = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            /* Close all others (single-open mode) */
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('open');
                    other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    other.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            /* Toggle current */
            if (isOpen) {
                item.classList.remove('open');
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
                /* Set explicit max-height for smooth slide */
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* Recalculate on resize (so open answers don't clip) */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const openItem = document.querySelector('.faq-item.open .faq-answer');
            if (openItem) openItem.style.maxHeight = openItem.scrollHeight + 'px';
        }, 150);
    });
});


/* ============================================================
   CONTACT FORM
   - Client-side validation
   - Opens mailto: with pre-filled subject + body on submit
   - Shows inline success/error message
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const note = document.getElementById('formNote');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        /* --- Collect values --- */
        const name    = form.name.value.trim();
        const phone   = form.phone.value.trim();
        const car     = form.car.value.trim();
        const service = form.service.value;
        const message = form.message.value.trim();

        /* --- Validate --- */
        if (!name || !phone || !car || !service || !message) {
            note.textContent = 'Please fill in all fields before submitting.';
            note.className = 'form-note error';
            return;
        }

        /* --- Build mailto link --- */
        const subject = encodeURIComponent(`Service Request — ${service}`);
        const body = encodeURIComponent(
            `Name: ${name}\n` +
            `Phone: ${phone}\n` +
            `Car Model: ${car}\n` +
            `Service Required: ${service}\n\n` +
            `Message:\n${message}`
        );

        const mailtoLink =
            `mailto:abdurrehmanawan928@gmail.com?subject=${subject}&body=${body}`;

        /* --- Open user's mail client --- */
        window.location.href = mailtoLink;

        /* --- Feedback --- */
        note.textContent = 'Opening your email app… If nothing happens, please call 03707110330 directly.';
        note.className = 'form-note success';
        form.reset();

        /* Optional: also offer a WhatsApp fallback link in console for dev */
        // console.log('WhatsApp fallback:', `https://wa.me/923707110330?text=${body}`);
    });
});