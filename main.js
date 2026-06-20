// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#home') {
            lenis.scrollTo(0, { duration: 1.5 });
            return;
        }
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            lenis.scrollTo(targetElement, {
                offset: -80, // Offset for navbar
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});

// --- Custom Text Splitter for Advanced Word Animations ---
function splitTextReveal(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        const words = text.split(' ');
        words.forEach((word, index) => {
            if(word.trim() === '') return;
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.overflow = 'hidden';
            wordSpan.style.verticalAlign = 'top';
            
            const innerSpan = document.createElement('span');
            innerSpan.style.display = 'inline-block';
            innerSpan.innerText = word;
            innerSpan.classList.add('split-inner');
            
            wordSpan.appendChild(innerSpan);
            el.appendChild(wordSpan);

            // Add space after word
            if (index < words.length - 1) {
                el.appendChild(document.createTextNode(' '));
            }
        });
    });
}

// Apply text splitting to modern typography
splitTextReveal('.section-title');
splitTextReveal('.hero-subtitle');
splitTextReveal('.section-desc');
splitTextReveal('.footer-title');

// Set Initial States
gsap.set('.split-inner', { y: '110%' });
gsap.set('.hero-cta', { opacity: 0, y: 30 });
gsap.set('.service-card', { opacity: 0, y: 80 });
gsap.set('.project-card', { opacity: 0, y: 100 });
gsap.set('.testimonial-card', { opacity: 0, y: 50 });

// 2. Initial Loader & Hero Animation
const tl = gsap.timeline();
document.body.style.overflow = 'hidden'; // Lock scroll

tl.to('.loader-text', {
    y: 0,
    duration: 1,
    ease: 'power4.out',
    delay: 0.2
})
.to('.loader-text', {
    opacity: 0,
    duration: 0.5,
    delay: 0.5
})
.to('.loader', {
    yPercent: -100,
    duration: 1,
    ease: 'power4.inOut',
    onComplete: () => {
        document.body.style.overflow = ''; // Unlock scroll
        ScrollTrigger.refresh(); // Crucial for layout recalculation
    }
})
.fromTo('.hero-img', 
    { scale: 1.2, filter: 'brightness(0.3)' }, 
    { scale: 1, filter: 'brightness(1)', duration: 2.5, ease: 'power3.out' },
    "-=0.5"
)
.to('.hero-title .line span', {
    y: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: 'power4.out'
}, "-=1.8")
.to('.hero-subtitle .split-inner', {
    y: '0%',
    duration: 1,
    stagger: 0.03,
    ease: 'power4.out'
}, "-=1.2")
.to('.hero-cta', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out'
}, "-=0.8");


// 3. Scroll Animations

// Section Titles & Descriptions
document.querySelectorAll('.section-title, .section-desc, .footer-title').forEach(el => {
    gsap.to(el.querySelectorAll('.split-inner'), {
        y: '0%',
        duration: 1.2,
        stagger: 0.03,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: el,
            start: "top 95%",
        }
    });
});

// About Section Parallax Image
gsap.to('.about-img', {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
        trigger: ".about-image-wrapper",
        start: "top bottom", 
        end: "bottom top",
        scrub: true
    }
});

// Projects Cards Reveal
gsap.utils.toArray('.project-card').forEach(card => {
    gsap.to(card, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: card,
            start: "top 90%",
        }
    });
});

// Services Cards Stagger - Fixed the empty issue by using to() from the set() state
gsap.to('.service-card', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: ".services-grid",
        start: "top 90%", // Trigger slightly earlier to ensure they pop in
    }
});

// Testimonials Cards
gsap.to('.testimonial-card', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: ".testimonials-grid",
        start: "top 90%",
    }
});

// Statistics Counter
const stats = document.querySelectorAll('.stat-number');
if (stats.length > 0) {
    ScrollTrigger.create({
        trigger: ".statistics",
        start: "top 85%",
        once: true,
        onEnter: () => {
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                gsap.to(stat, {
                    innerHTML: target,
                    duration: 2,
                    snap: { innerHTML: 1 },
                    ease: "power2.out"
                });
            });
        }
    });
}

// Footer Bottom elements
gsap.fromTo('.footer-bottom > *',
    { y: 30, opacity: 0 },
    {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: ".footer-bottom",
            start: "top 95%",
        }
    }
);

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navbar.classList.toggle('menu-active');
        
        // Change icon
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('ri-menu-line');
            icon.classList.add('ri-close-line');
        } else {
            icon.classList.remove('ri-close-line');
            icon.classList.add('ri-menu-line');
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navbar.classList.remove('menu-active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('ri-close-line');
            icon.classList.add('ri-menu-line');
        });
    });
}
