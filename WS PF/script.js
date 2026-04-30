// Smooth scrolling and animations
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const loadingScreen = document.getElementById('loadingScreen');
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    
    // Theme functionality
    const currentTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => body.style.transition = '', 300);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Loading screen
    setTimeout(() => loadingScreen.classList.add('hidden'), 3000);

    // Navigation functionality
    let ticking = false;
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 100);
        if (!ticking) {
            requestAnimationFrame(updateActiveNavLink);
            ticking = true;
        }
    });

    // Mobile menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const { offsetTop, offsetHeight } = section;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight && correspondingNavLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingNavLink.classList.add('active');
            }
        });
        ticking = false;
    }

    // Intersection Observer for animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
    }, observerOptions);

    const animationElements = [
        { selector: '.section-header', class: 'fade-in' },
        { selector: '.about-text', class: 'slide-in-left' },
        { selector: '.about-image', class: 'slide-in-right' },
        { selector: '.stat-item', class: 'scale-in' },
        { selector: '.skill-category', class: 'fade-in' },
        { selector: '.project-card', class: 'scale-in' },
        { selector: '.timeline-item', class: 'fade-in' },
        { selector: '.contact-item', class: 'slide-in-left' },
        { selector: '.contact-form', class: 'slide-in-right' }
    ];

    animationElements.forEach(({ selector, class: animClass }) => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.classList.add(animClass);
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    });

    // Counter animation for stats
    function animateCounters() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const increment = target / 100;
                    let current = 0;
                    
                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.stat-number').forEach(counter => counterObserver.observe(counter));
    }

    animateCounters();

    // Typing animation for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    setTimeout(() => {
        const heroTitle = document.querySelector('.title-name');
        if (heroTitle) typeWriter(heroTitle, heroTitle.textContent, 150);
    }, 3500);

    // Parallax and visual effects
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-particles');
        if (parallax) parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    });

    // Skill items hover effect
    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('mouseenter', () => item.style.transform = 'scale(1.05) rotateY(10deg)');
        item.addEventListener('mouseleave', () => item.style.transform = 'scale(1) rotateY(0deg)');
    });

    // Project cards tilt effect
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // Contact form handling
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const templateParams = {
                from_name: formData.get('from_name'),
                from_email: formData.get('from_email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                to_email: 'jeeturajput0010@gmail.com'
            };
            
            if (!templateParams.from_name || !templateParams.from_email || !templateParams.subject || !templateParams.message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(templateParams.from_email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            try {
                await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } catch (error) {
                console.error('Contact form error:', error);
                showNotification('Failed to send message. Please try again later.', 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }

    // Initialize EmailJS
    emailjs.init("YOUR_PUBLIC_KEY");

    // Utility functions
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => document.body.removeChild(notification), 300);
        });
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => document.body.removeChild(notification), 300);
            }
        }, 5000);
    }

    // Timeline and additional animations
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
        
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                        entry.target.style.transition = 'all 0.6s ease';
                    }, index * 200);
                    timelineObserver.unobserve(entry.target);
                }
            });
        });
        
        timelineObserver.observe(item);
    });

    // Hero image floating animation
    const heroImage = document.querySelector('.image-placeholder');
    if (heroImage) {
        let floatDirection = 1;
        setInterval(() => {
            floatDirection *= -1;
            heroImage.style.transform = `translateY(${floatDirection * 10}px)`;
        }, 3000);
    }

    // Particle animation system
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(147, 51, 234, 0.8));
            border-radius: 50%;
            pointer-events: none;
            animation: particleFloat 6s linear infinite;
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        const heroParticles = document.querySelector('.hero-particles');
        if (heroParticles) {
            heroParticles.appendChild(particle);
            setTimeout(() => {
                if (heroParticles.contains(particle)) heroParticles.removeChild(particle);
            }, 6000);
        }
    }

    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(particleStyle);

    setInterval(createParticle, 300);

    // Additional interactions
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Enhanced cursor trail effect
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    document.body.appendChild(cursor);

    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorRing);

    // Create cursor trail particles
    const cursorTrail = [];
    const maxTrailLength = 8;
    
    for (let i = 0; i < maxTrailLength; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail-particle';
        trail.style.width = `${8 - i}px`;
        trail.style.height = `${8 - i}px`;
        trail.style.opacity = `${0.3 - (i * 0.03)}`;
        document.body.appendChild(trail);
        cursorTrail.push(trail);
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const trailPositions = Array.from({ length: maxTrailLength }, () => ({ x: 0, y: 0 }));
    let hasMouseMoved = false;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    function isCursorEffectEnabled() {
        return !reduceMotionQuery.matches && !mobileQuery.matches;
    }

    function setCursorEffectVisibility(visible) {
        const displayValue = visible ? '' : 'none';
        cursor.style.display = displayValue;
        cursorRing.style.display = displayValue;
        cursorTrail.forEach(trail => (trail.style.display = displayValue));
    }

    function applyCursorEffectState() {
        setCursorEffectVisibility(isCursorEffectEnabled());
    }

    applyCursorEffectState();

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!hasMouseMoved) {
            hasMouseMoved = true;
            cursorX = mouseX;
            cursorY = mouseY;
            trailPositions.forEach(p => {
                p.x = mouseX;
                p.y = mouseY;
            });
        }
    }, { passive: true });

    let rafId = 0;
    function animateCursor() {
        if (!isCursorEffectEnabled()) {
            rafId = requestAnimationFrame(animateCursor);
            return;
        }

        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        cursorRing.style.left = cursorX + 'px';
        cursorRing.style.top = cursorY + 'px';

        let leadX = cursorX;
        let leadY = cursorY;
        for (let i = 0; i < cursorTrail.length; i++) {
            const p = trailPositions[i];
            const ease = 0.22 - i * 0.015;
            p.x += (leadX - p.x) * ease;
            p.y += (leadY - p.y) * ease;
            cursorTrail[i].style.left = p.x + 'px';
            cursorTrail[i].style.top = p.y + 'px';
            leadX = p.x;
            leadY = p.y;
        }

        rafId = requestAnimationFrame(animateCursor);
    }
    rafId = requestAnimationFrame(animateCursor);

    reduceMotionQuery.addEventListener('change', applyCursorEffectState);
    mobileQuery.addEventListener('change', applyCursorEffectState);
    window.addEventListener('resize', applyCursorEffectState, { passive: true });
    
    // Interactive hover effects with enhanced states
    const interactiveSelector = 'a, button, .btn, .project-card, .skill-item, .stat-item';
    const textInputSelector = 'input[type="text"], input[type="email"], input[type="password"], textarea';

    function setCursorState(className, enabled) {
        cursor.classList.toggle(className, enabled);
        cursorRing.classList.toggle(className, enabled);
    }

    document.addEventListener('pointerover', (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;

        if (target.closest(textInputSelector)) {
            setCursorState('text-mode', true);
            return;
        }
        if (target.closest(interactiveSelector)) {
            setCursorState('link-mode', true);
        }
    }, { passive: true });

    document.addEventListener('pointerout', (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;

        if (target.closest(textInputSelector)) {
            setCursorState('text-mode', false);
        }
        if (target.closest(interactiveSelector)) {
            setCursorState('link-mode', false);
        }
    }, { passive: true });
    
    // Enhanced click effect
    document.addEventListener('click', (e) => {
        setCursorState('click-mode', true);
        
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            document.body.removeChild(ripple);
            setCursorState('click-mode', false);
        }, 600);
    });

    window.addEventListener('beforeunload', () => {
        if (rafId) cancelAnimationFrame(rafId);
    });

    console.log('🚀 Jeetu Rajput Portfolio - Loaded Successfully!');
});
