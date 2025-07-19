// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    // Add click event listeners for smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to navbar
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - show navbar
            navbar.style.transform = 'translateY(0)';
            navbar.classList.add('scrolled');
        } else if (scrollTop < lastScrollTop) {
            // Scrolling up - hide navbar
            navbar.style.transform = 'translateY(-100%)';
            navbar.classList.remove('scrolled');
        }
        
        // Show navbar at the very top
        if (scrollTop <= 50) {
            navbar.style.transform = 'translateY(0)';
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Interactive Spectrum Tooltips
    initializeSpectrumTooltips();
    
    // Initialize video autoplay when in view
    initializeVideoAutoplay();
    
    // Initialize interactive image highlights
    initializeImageHighlights();
    
    // Initialize scroll animations
    initializeScrollAnimations();
});

function initializeSpectrumTooltips() {
    const spectrumPoints = document.querySelectorAll('.spectrum-point');
    const tooltip = document.getElementById('tooltip');

    spectrumPoints.forEach(point => {
        point.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            if (tooltipText && tooltip) {
                tooltip.textContent = tooltipText;
                tooltip.classList.add('show');
                
                // Position tooltip
                positionTooltip(e, tooltip);
            }
        });

        point.addEventListener('mousemove', function(e) {
            if (tooltip.classList.contains('show')) {
                positionTooltip(e, tooltip);
            }
        });

        point.addEventListener('mouseleave', function() {
            if (tooltip) {
                tooltip.classList.remove('show');
            }
        });
    });

    function positionTooltip(e, tooltip) {
        const rect = e.currentTarget.getBoundingClientRect();
        
        // Get tooltip dimensions after it becomes visible
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate initial position (centered above the point)
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 20; // 20px gap for better spacing
        
        // Prevent tooltip from going off the left edge
        if (left < 20) {
            left = 20;
        }
        
        // Prevent tooltip from going off the right edge
        if (left + tooltipRect.width > viewportWidth - 20) {
            left = viewportWidth - tooltipRect.width - 20;
        }
        
        // If tooltip would go above viewport, show it below the point instead
        if (top < 20) {
            top = rect.bottom + 20;
        }
        
        // Additional check for bottom overflow
        if (top + tooltipRect.height > viewportHeight - 20) {
            top = rect.top - tooltipRect.height - 20;
        }
        
        // Apply the calculated position
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }
}

// Video autoplay when in view
function initializeVideoAutoplay() {
    const video = document.querySelector('.solution-video');
    
    if (!video) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(error => {
                    console.log('Video autoplay failed:', error);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Video will play when 50% is visible
    });
    
    observer.observe(video);
}

// Interactive Image Highlights
function initializeImageHighlights() {
    const featureItems = document.querySelectorAll('.feature-item[data-highlight]');
    
    featureItems.forEach(item => {
        const highlightId = item.getAttribute('data-highlight');
        const highlightElement = document.getElementById(highlightId);
        
        if (highlightElement) {
            // Mouse enter - show highlight
            item.addEventListener('mouseenter', function() {
                highlightElement.classList.add('active');
            });
            
            // Mouse leave - hide highlight
            item.addEventListener('mouseleave', function() {
                highlightElement.classList.remove('active');
            });
            
            // Optional: Add click event for touch devices
            item.addEventListener('click', function(e) {
                // Toggle highlight on click for mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    highlightElement.classList.toggle('active');
                    
                    // Hide other highlights
                    document.querySelectorAll('.highlight-overlay').forEach(overlay => {
                        if (overlay !== highlightElement) {
                            overlay.classList.remove('active');
                        }
                    });
                    
                    // Auto-hide after 3 seconds on mobile
                    setTimeout(() => {
                        highlightElement.classList.remove('active');
                    }, 3000);
                }
            });
        }
    });
}

// Scroll Animation System
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Handle staggered animations for groups
                if (entry.target.classList.contains('scroll-stagger-parent')) {
                    const children = entry.target.querySelectorAll('.scroll-stagger');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('revealed');
                        }, index * 100); // 100ms delay between each item
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all elements with scroll animation classes
    const scrollElements = document.querySelectorAll([
        '.scroll-reveal',
        '.scroll-reveal-left', 
        '.scroll-reveal-right',
        '.scroll-reveal-scale',
        '.scroll-reveal-fade',
        '.scroll-stagger-parent'
    ].join(', '));

    scrollElements.forEach(element => {
        observer.observe(element);
    });

    // Special handling for individual stagger items that aren't in a parent
    const staggerItems = document.querySelectorAll('.scroll-stagger');
    staggerItems.forEach(element => {
        observer.observe(element);
    });
} 