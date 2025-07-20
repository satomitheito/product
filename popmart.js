// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize floating animation
    initFloatingAnimation();
    
    // Initialize indicator hover effects
    initIndicatorHover();
    
    // Initialize chart toggle functionality
    initChartToggle();
});

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe scroll reveal elements
    const scrollElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-stagger');
    scrollElements.forEach(element => {
        observer.observe(element);
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'linear-gradient(135deg, #E60021, #B8001A)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #E60021, #B8001A)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Enhanced floating animation
function initFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Add slight delay for multiple elements
        element.style.animationDelay = `${index * 0.5}s`;
        
        // Add mouse interaction
        element.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'translateY(-30px) scale(1.05)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = '';
        });
    });
}

// Smooth scroll for anchor links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Utility function for scroll-triggered animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Add scroll event listener for custom animations
window.addEventListener('scroll', animateOnScroll);

// Performance optimization: throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(animateOnScroll, 100));

// Initialize indicator hover effects
function initIndicatorHover() {
    const existingPoints = document.querySelectorAll('.existing-point');
    const existingPageMain = document.querySelector('.existing-page-main');
    
    if (existingPoints.length > 0 && existingPageMain) {
        // First point (5 minutes)
        existingPoints[0].addEventListener('mouseenter', function() {
            existingPageMain.classList.add('show-indicator-1');
        });
        
        existingPoints[0].addEventListener('mouseleave', function() {
            existingPageMain.classList.remove('show-indicator-1');
        });
        
        // Second point (hints)
        if (existingPoints[1]) {
            existingPoints[1].addEventListener('mouseenter', function() {
                existingPageMain.classList.add('show-indicator-2');
            });
            
            existingPoints[1].addEventListener('mouseleave', function() {
                existingPageMain.classList.remove('show-indicator-2');
            });
        }
    }
}

// Initialize chart toggle functionality
function initChartToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const chart = this.getAttribute('data-chart');
            const state = this.getAttribute('data-state');
            
            // Get all buttons for this chart
            const chartButtons = document.querySelectorAll(`[data-chart="${chart}"]`);
            
            // Remove active class from all buttons of this chart
            chartButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show/hide chart placeholders
            const chartPlaceholders = document.querySelectorAll(`[id^="${chart}-chart-"]`);
            chartPlaceholders.forEach(placeholder => {
                placeholder.classList.remove('active');
            });
            
            // Show the selected chart
            const selectedChart = document.getElementById(`${chart}-chart-${state}`);
            if (selectedChart) {
                selectedChart.classList.add('active');
            }
            
            // Show/hide chart descriptions
            const chartDescriptions = document.querySelectorAll(`[id^="${chart}-description-"]`);
            chartDescriptions.forEach(description => {
                description.classList.remove('active');
            });
            
            // Show the selected description
            const selectedDescription = document.getElementById(`${chart}-description-${state}`);
            if (selectedDescription) {
                selectedDescription.classList.add('active');
            }
        });
    });
    
    // Add hover effect for explanation-2 to highlight filled button
    const explanation2 = document.querySelector('.explanation-2');
    const filledButton = document.querySelector('[data-state="filled"]');
    
    if (explanation2 && filledButton) {
        explanation2.addEventListener('mouseenter', function() {
            filledButton.classList.add('highlight-connection');
        });
        
        explanation2.addEventListener('mouseleave', function() {
            filledButton.classList.remove('highlight-connection');
        });
    }
} 