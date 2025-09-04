// Metronova Scientific Research Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation Toggle for Mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
    
    // Typewriter Effect for Hero Title
    const typewriterElements = document.querySelectorAll('.typewriter, .typewriter-delay');
    
    typewriterElements.forEach((element, index) => {
        const text = element.textContent;
        element.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 100);
        }, index * 500);
    });
    
    // Parallax Effect for Hero Background
    const heroBackground = document.querySelector('.tech-pattern');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Counter Animation for Risk Numbers
    const riskNumbers = document.querySelectorAll('.risk-number');
    
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = String(Math.floor(current)).padStart(2, '0');
        }, 30);
    };
    
    // Animate counters when they come into view
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = parseInt(entry.target.textContent);
                animateCounter(entry.target, number);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    riskNumbers.forEach(number => counterObserver.observe(number));
    
    // Form Handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Sending message...', 'info');
            
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
            }, 2000);
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00C896' : type === 'error' ? '#FF6B6B' : '#007BFF'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Add to page
        document.body.appendChild(notification);
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Smooth reveal animation for solution cards
    const solutionCards = document.querySelectorAll('.solution-card');
    
    solutionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Industry cards hover effect
    const industryCards = document.querySelectorAll('.industry-card');
    
    industryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 25px 50px rgba(10, 31, 68, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(10, 31, 68, 0.1)';
        });
    });
    
    // Highlight items animation
    const highlightItems = document.querySelectorAll('.highlight-item');
    
    highlightItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Feature items animation
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 123, 255, 0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Risk items animation
    const riskItems = document.querySelectorAll('.risk-item');
    
    riskItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (this.classList.contains('btn-primary')) {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (this.classList.contains('btn-primary')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Lazy loading for images (if any are added later)
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // Update navbar scroll state
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update parallax
        if (heroBackground) {
            const rate = window.pageYOffset * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    // Initialize tooltips for better UX (if needed)
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function(e) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = this.dataset.tooltip;
                tooltip.style.cssText = `
                    position: absolute;
                    background: var(--primary);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    font-size: 14px;
                    z-index: 1000;
                    pointer-events: none;
                    white-space: nowrap;
                `;
                
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
                
                this.tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', function() {
                if (this.tooltip) {
                    this.tooltip.remove();
                    this.tooltip = null;
                }
            });
        });
    }
    
    // Initialize tooltips
    initTooltips();
    
    // Add loading state to form submission
    function setFormLoading(form, loading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            if (loading) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                submitBtn.style.opacity = '0.7';
            } else {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                submitBtn.style.opacity = '1';
            }
        }
    }
    
    // Enhanced form handling with loading states
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            setFormLoading(this, true);
            
            // Simulate API call
            setTimeout(() => {
                setFormLoading(this, false);
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                this.reset();
            }, 2000);
        });
    }
    
    console.log('Metronova Scientific Research website loaded successfully!');
});
