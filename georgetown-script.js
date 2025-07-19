// Georgetown University Mobile App Project JavaScript
// Interactive functionality for georgetown-project.html

document.addEventListener('DOMContentLoaded', function() {
    // Create scroll progress indicator
    createScrollProgress();
    
    // Initialize enhanced scroll animations
    initializeScrollAnimations();
    
    // Initialize parallax effects
    initializeParallax();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Initialize simple hero animation (no typing)
    initializeSimpleHeroAnimation();
    
    // Initialize problem card interactions
    initializeProblemCards();
    
    // Video autoplay functionality
    initializeVideoAutoplay();
    
    // Smooth scrolling for anchor links
    initializeSmoothScrolling();

    // Problem section button functionality
    const problemButtons = document.querySelectorAll('.problem-btn');
    const problemCards = document.querySelectorAll('.problem-card');
    const progressDots = document.querySelectorAll('.progress-dots .dot');

    problemButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetProblem = this.getAttribute('data-problem');
            
            // Update active button
            problemButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active card with smooth transition
            problemCards.forEach(card => {
                card.classList.remove('active');
                if (card.id === targetProblem + '-problem') {
                    setTimeout(() => {
                        card.classList.add('active');
                    }, 100);
                }
            });
            
            // Update progress dots
            progressDots.forEach(dot => dot.classList.remove('active'));
            const targetDot = document.querySelector(`.dot[data-problem="${targetProblem}"]`);
            if (targetDot) {
                targetDot.classList.add('active');
            }
        });
    });
});

// Create scroll progress indicator
function createScrollProgress() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Enhanced scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Special handling for different animation types
                if (entry.target.classList.contains('image-grid-two') || 
                    entry.target.classList.contains('image-grid-three') || 
                    entry.target.classList.contains('image-grid-four')) {
                    entry.target.classList.add('revealed');
                }
                
                // Staggered text reveals
                if (entry.target.classList.contains('text-reveal-parent')) {
                    const children = entry.target.querySelectorAll('.text-reveal');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('revealed');
                        }, index * 150);
                    });
                }
                
                // Counter animation for rating
                if (entry.target.classList.contains('rating-number')) {
                    animateCounter(entry.target, 1.6, 2000);
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll([
        '.scroll-reveal',
        '.scroll-reveal-left', 
        '.scroll-reveal-right',
        '.scroll-reveal-scale',
        '.scroll-reveal-stagger',
        '.image-grid-two',
        '.image-grid-three', 
        '.image-grid-four',
        '.figma-embed',
        '.section-header',
        '.improvement-item',
        '.rating-showcase',
        '.text-reveal-parent'
    ].join(', '));

    animatableElements.forEach(element => {
        observer.observe(element);
    });
}

// Parallax effects
function initializeParallax() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        const floatingElements = document.querySelectorAll('.floating-element');
        
        // Hero parallax
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        // Floating elements
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Interactive elements
function initializeInteractiveElements() {
    // Enhanced hover effects for issue items
    const issueItems = document.querySelectorAll('.issue-item');
    issueItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(12px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
    
    // Interactive project images
    const projectImages = document.querySelectorAll('.project-image');
    projectImages.forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(1deg)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
        
        image.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = '';
        });
    });
    
    // Button ripple effect
    const buttons = document.querySelectorAll('.problem-btn, .nav-link');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

// Simple hero animation (no typing)
function initializeSimpleHeroAnimation() {
    const heroTitle = document.querySelector('.hero-title .main-title');
    if (heroTitle) {
        heroTitle.style.opacity = '1';
    }
}

// Problem cards interaction
function initializeProblemCards() {
    const cards = document.querySelectorAll('.problem-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (this.classList.contains('active')) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// Video autoplay functionality
function initializeVideoAutoplay() {
    const projectVideo = document.querySelector('.project-video');
    let videoPlayTimeout;

    if (projectVideo) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    videoPlayTimeout = setTimeout(() => {
                        projectVideo.play().catch(error => {
                            console.log('Video autoplay failed:', error);
                        });
                    }, 1500);
                } else {
                    if (videoPlayTimeout) {
                        clearTimeout(videoPlayTimeout);
                    }
                    projectVideo.pause();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(projectVideo);
    }
}

// Smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Counter animation
function animateCounter(element, targetValue, duration) {
    let startValue = 0;
    const increment = targetValue / (duration / 16);
    
    const counter = () => {
        startValue += increment;
        element.textContent = startValue.toFixed(1);
        
        if (startValue < targetValue) {
            requestAnimationFrame(counter);
        } else {
            element.textContent = targetValue.toFixed(1);
        }
    };
    
    counter();
}

// Ripple effect for buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        background-color: rgba(255, 255, 255, 0.7);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
} 