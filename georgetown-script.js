// Georgetown University Mobile App Project JavaScript
// Interactive functionality for georgetown-project.html

document.addEventListener('DOMContentLoaded', function() {
    // Initialize simplified scroll animations
    initializeScrollAnimations();
    
    // Initialize basic interactive elements
    initializeInteractiveElements();
    
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

// Simplified scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Special handling for image grids
                if (entry.target.classList.contains('image-grid-two') || 
                    entry.target.classList.contains('image-grid-three') || 
                    entry.target.classList.contains('image-grid-four')) {
                    entry.target.classList.add('revealed');
                }
                
                // Simple text reveals
                if (entry.target.classList.contains('text-reveal-parent')) {
                    const children = entry.target.querySelectorAll('.text-reveal');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('revealed');
                        }, index * 100);
                    });
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

// Simplified interactive elements
function initializeInteractiveElements() {
    // Basic hover effects for issue items
    const issueItems = document.querySelectorAll('.issue-item');
    issueItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Basic project image hover effects
    const projectImages = document.querySelectorAll('.project-image');
    projectImages.forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        image.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Simplified problem cards interaction
function initializeProblemCards() {
    const cards = document.querySelectorAll('.problem-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (this.classList.contains('active')) {
                this.style.transform = 'translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// Simplified video autoplay functionality
function initializeVideoAutoplay() {
    const projectVideo = document.querySelector('.project-video');

    if (projectVideo) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        projectVideo.play().catch(error => {
                            console.log('Video autoplay failed:', error);
                        });
                    }, 1000);
                } else {
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