/**
 * Modern Portfolio - Optimized JavaScript
 * Author: Vidish Kumar
 * Version: 3.0.0
 */

'use strict';

// ===== IMMEDIATE PRELOADER FAILSAFE =====
(function() {
    const hidePreloader = () => {
        const preloader = document.getElementById('preloader') || document.querySelector('.preloader');
        if (preloader) {
            console.log('Hiding preloader...');
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            preloader.style.pointerEvents = 'none';
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
                preloader.remove(); // Completely remove from DOM
            }, 300);
        }
    };
    
    // Hide immediately if DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        hidePreloader();
    }
    
    // Multiple fallbacks to ensure loader hides
    setTimeout(hidePreloader, 100);  // Very quick
    setTimeout(hidePreloader, 500);  // Quick fallback
    setTimeout(hidePreloader, 1000); // Medium fallback
    setTimeout(hidePreloader, 2000); // Emergency fallback
    
    // Also hide on load event
    window.addEventListener('load', hidePreloader);
    
    // Hide on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', hidePreloader);
    
    // Hide on any user interaction
    document.addEventListener('click', hidePreloader, { once: true });
    document.addEventListener('keydown', hidePreloader, { once: true });
    document.addEventListener('scroll', hidePreloader, { once: true });
})();

// ===== UTILITY FUNCTIONS =====
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Invalid selector: ${selector}`);
            return null;
        }
    },

    safeQuerySelectorAll(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.warn(`Invalid selector: ${selector}`);
            return [];
        }
    },

    isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.themeToggle = Utils.safeQuerySelector('#themeToggle');
        this.root = document.documentElement;
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        if (!this.themeToggle) return;

        this.loadTheme();
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light');
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        this.root.setAttribute('data-theme', theme);
        this.updateIcon(theme);
    }

    updateIcon(theme) {
        if (!this.themeToggle) return;
        const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
        this.themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
    }
}


// ===== ADDITIONAL ENHANCEMENTS =====

// Page loading animations and additional effects
document.addEventListener('DOMContentLoaded', function() {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Remove loading class after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 500);
    });
    
    // Update copyright year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Enhanced cursor effects for desktop
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(99, 102, 241, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX - 10 + 'px';
            cursor.style.top = cursorY - 10 + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .btn');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursor.style.background = 'rgba(236, 72, 153, 0.8)';
            });

            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'rgba(99, 102, 241, 0.8)';
            });
        });
    }
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.tech-badge, .stat-item, .social-link');
    animateElements.forEach(el => observer.observe(el));
    
    // Add parallax effect to floating shapes
    const shapes = document.querySelectorAll('.shape');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            shape.style.transform = `translateY(${rate * speed}px)`;
        });
    }, { passive: true });
});

// ===== MOBILE NAVIGATION =====
class MobileNavigation {
    constructor() {
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.navToggle || !this.navMenu) return;

        this.navToggle.addEventListener('click', () => this.toggle());

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isOpen) this.close();
            });
        });

        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.navMenu.classList.add('active');
        this.navToggle.classList.add('active');
        if (this.navToggle) this.navToggle.setAttribute('aria-expanded', 'true');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        if (this.navToggle) this.navToggle.setAttribute('aria-expanded', 'false');
        this.isOpen = false;
        document.body.style.overflow = '';
    }
}

// ===== SCROLL MANAGER =====
class ScrollManager {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.backToTopBtn = document.getElementById('backToTop');
        this.navbar = document.querySelector('.navbar');
        this.scrollProgress = document.getElementById('scrollProgress');
        this.init();
    }

    init() {
        const throttledScroll = Utils.throttle(() => {
            this.updateActiveLink();
            this.updateBackToTop();
            this.updateScrollProgress();
            this.updateNavbar();
        }, 16);

        window.addEventListener('scroll', throttledScroll, { passive: true });

        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const navbarHeight = this.navbar ? this.navbar.offsetHeight : 80;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });
    }

    updateActiveLink() {
        let current = '';
        const scrollPosition = window.pageYOffset;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    updateBackToTop() {
        if (!this.backToTopBtn) return;
        const scrollTop = window.pageYOffset;
        if (scrollTop > 300) {
            this.backToTopBtn.classList.add('visible');
        } else {
            this.backToTopBtn.classList.remove('visible');
        }
    }

    updateScrollProgress() {
        if (!this.scrollProgress) return;
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        this.scrollProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

    updateNavbar() {
        if (!this.navbar) return;
        const scrollTop = window.pageYOffset;
        if (scrollTop > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
}

// ===== TYPEWRITER EFFECT =====
class Typewriter {
    constructor(element, options = {}) {
        this.element = element;
        if (!this.element) return;
        
        this.texts = this.element.getAttribute('data-text').split(',');
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.typeOnce = options.typeOnce || false;
        this.callback = options.callback || null;
        this.speed = options.speed || 80;
        this.deleteSpeed = options.deleteSpeed || 30;
        this.pauseTime = options.pauseTime || 2000;
        
        // Clear initial content for smooth typing
        this.element.textContent = '';
        this.init();
    }

    init() {
        setTimeout(() => this.type(), this.typeOnce ? 500 : 1000);
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let speed = this.isDeleting ? this.deleteSpeed : this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            if (this.typeOnce) {
                // Mark as complete and remove cursor
                this.element.classList.add('typing-complete');
                if (this.callback) this.callback();
                return;
            }
            speed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
        }

        setTimeout(() => this.type(), speed);
    }
}

// ===== 3D MODEL INTERACTION =====
class Model3DInteraction {
    constructor() {
        this.modelViewer = document.querySelector('model-viewer');
        this.init();
    }

    init() {
        if (!this.modelViewer) return;

        // Add loading and error handling
        this.modelViewer.addEventListener('load', () => {
            console.log('3D Model loaded successfully');
            this.addInteractionEffects();
        });

        this.modelViewer.addEventListener('error', (error) => {
            console.warn('3D Model failed to load:', error);
            this.showFallback();
        });

        // Add mouse interaction effects
        this.addHoverEffects();
    }

    addInteractionEffects() {
        const container = this.modelViewer.closest('.model-3d-container');
        if (!container) return;

        // Add glow effect on model interaction
        this.modelViewer.addEventListener('camera-change', () => {
            container.style.boxShadow = `
                0 25px 50px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.2),
                0 0 60px rgba(99, 102, 241, 0.4)
            `;
            
            setTimeout(() => {
                container.style.boxShadow = '';
            }, 1000);
        });
    }

    addHoverEffects() {
        const container = this.modelViewer.closest('.model-3d-container');
        if (!container) return;

        container.addEventListener('mouseenter', () => {
            this.modelViewer.style.filter = 'brightness(1.1) contrast(1.1)';
        });

        container.addEventListener('mouseleave', () => {
            this.modelViewer.style.filter = '';
        });
    }

    showFallback() {
        const container = this.modelViewer.closest('.model-3d-container');
        if (!container) return;

        container.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: white;
                text-align: center;
                padding: 2rem;
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                    animation: pulse 2s infinite;
                ">
                    <i class="fas fa-robot" style="font-size: 2rem;"></i>
                </div>
                <h3 style="margin-bottom: 0.5rem;">AI Engineer</h3>
                <p style="opacity: 0.8; font-size: 0.9rem;">Interactive 3D Model</p>
            </div>
        `;
    }
}
class CodeEditorAnimation {
    constructor() {
        this.codeLines = document.querySelectorAll('.code-line');
        this.typingLine = document.querySelector('.typing-line .code-text');
        this.init();
    }

    init() {
        if (!this.codeLines.length) return;
        
        // Animate code lines appearing
        this.codeLines.forEach((line, index) => {
            if (!line.classList.contains('typing-line')) {
                line.style.opacity = '0';
                line.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    line.style.transition = 'all 0.5s ease';
                    line.style.opacity = '1';
                    line.style.transform = 'translateX(0)';
                }, index * 200 + 1000);
            }
        });

        // Animate the typing line
        if (this.typingLine) {
            setTimeout(() => {
                this.animateTypingLine();
            }, this.codeLines.length * 200 + 1500);
        }
    }

    animateTypingLine() {
        const text = 'return "Innovation"';
        const cursor = this.typingLine.querySelector('.cursor');
        let index = 0;
        
        // Clear initial content except cursor
        this.typingLine.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span> <span class="string">"</span><span class="cursor">|</span>';
        
        const typeChar = () => {
            if (index < 10) { // "Innovation".length
                const currentText = "Innovation".substring(0, index + 1);
                this.typingLine.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span> <span class="string">"${currentText}</span><span class="cursor">|</span>`;
                index++;
                setTimeout(typeChar, 100);
            } else {
                // Add closing quote
                this.typingLine.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span> <span class="string">"Innovation"</span><span class="cursor">|</span>`;
            }
        };
        
        typeChar();
    }
}

// ===== COUNTER ANIMATION =====
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
}

// ===== SKILLS MANAGER =====
class SkillsManager {
    constructor() {
        this.categories = document.querySelectorAll('.skill-category');
        this.skillGroups = document.querySelectorAll('.skills-group');
        this.init();
    }

    init() {
        if (!this.categories.length) return;

        this.categories.forEach(category => {
            category.addEventListener('click', () => {
                const targetCategory = category.getAttribute('data-category');
                this.switchCategory(targetCategory);
            });
        });

        this.initSkillBars();
    }

    switchCategory(targetCategory) {
        this.categories.forEach(cat => cat.classList.remove('active'));
        const activeCategory = document.querySelector(`[data-category="${targetCategory}"]`);
        if (activeCategory) activeCategory.classList.add('active');

        this.skillGroups.forEach(group => group.classList.remove('active'));
        const activeGroup = document.getElementById(targetCategory);
        if (activeGroup) {
            activeGroup.classList.add('active');
            this.animateSkillBars(activeGroup);
        }
    }

    initSkillBars() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBars(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        this.skillGroups.forEach(group => observer.observe(group));
    }

    animateSkillBars(container) {
        const progressBars = container.querySelectorAll('.skill-progress');
        progressBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            if (width) {
                setTimeout(() => {
                    bar.style.width = width;
                }, index * 150);
            }
        });
    }
}

// ===== PROJECTS FILTER =====
class ProjectsFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        if (!this.filterButtons.length) return;

        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterProjects(filter);
                this.updateActiveButton(button);
            });
        });
    }

    filterProjects(filter) {
        this.projectCards.forEach(card => {
            const categories = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    updateActiveButton(activeButton) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
}

// ===== FORM VALIDATION =====
class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }

        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
        }

        field.style.borderColor = isValid ? '' : 'var(--error)';
        return isValid;
    }

    clearError(field) {
        field.style.borderColor = '';
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    handleSubmit() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();
        } else {
            this.showNotification('Please fill all required fields correctly.', 'error');
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.01;
                particle.vy -= (dy / distance) * force * 0.01;
            }
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${(100 - distance) / 100 * 0.2})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }

    init() {
        if (!this.elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(element);
        });
    }
}

// ===== INITIALIZATION =====
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            new ThemeManager();
            new MobileNavigation();
            new ScrollManager();
            
            // Initialize name typewriter (types once)
            const nameElement = document.querySelector('.typewriter-name');
            if (nameElement) {
                new Typewriter(nameElement, { 
                    typeOnce: true,
                    speed: 100,
                    callback: () => {
                        // Start role typewriter after name is done
                        const roleElement = document.querySelector('.typewriter-role');
                        if (roleElement) {
                            new Typewriter(roleElement, {
                                speed: 60,
                                deleteSpeed: 40,
                                pauseTime: 3000
                            });
                        }
                    }
                });
            }
            
            // Initialize code editor animation
            new CodeEditorAnimation();
            
            // Initialize 3D model interaction
            new Model3DInteraction();
            
            new CounterAnimation();
            new SkillsManager();
            new ProjectsFilter();
            new FormValidator('#contactForm');
            new ScrollAnimations();
            
            // Only initialize particle system on larger screens
            if (window.innerWidth > 768) {
                new ParticleSystem();
            }

            console.log('✅ Portfolio initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio:', error);
        }
    }
}

// Start the application
new PortfolioApp();
