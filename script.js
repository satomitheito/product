// Typing animation function
function typeWriter(element, text, speed = 150) {
    return new Promise((resolve) => {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        
        type();
    });
}

// Initialize typing animation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Start typing animation
    const typingElement = document.getElementById('typing-name');
    const helloElement = document.querySelector('.hello');
    const navbar = document.querySelector('.navbar');
    
    // Start the typing animation for "Satomi Ito"
    typeWriter(typingElement, 'Satomi Ito', 100).then(() => {
        // Remove cursor and show "Hello! I'm"
        typingElement.classList.add('finished');
        
        // Delay before showing other elements
        setTimeout(() => {
            helloElement.classList.add('visible');
            navbar.classList.add('visible');
            
            // Show the rest of the page sections
            const selectedWorksSection = document.querySelector('.selected-works');
            const contactSection = document.querySelector('.contact');
            
            setTimeout(() => {
                if (selectedWorksSection) selectedWorksSection.classList.add('visible');
                if (contactSection) contactSection.classList.add('visible');
            }, 300);
        }, 500);
    });

    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle navigation click events
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed navbar
                const offsetTop = targetSection.offsetTop - 80;
                
                // Smooth scroll to section
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active navigation based on scroll position
        updateActiveNavigation();
    });
    
    // Function to update active navigation based on scroll position
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150; // Increased offset for better detection
        
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // Check if we're in this section
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });
        
        // Special handling for the last section (contact)
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
            const lastSectionTop = lastSection.offsetTop;
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            
            // If we're near the bottom of the page, highlight the last section
            if (window.scrollY + windowHeight >= documentHeight - 100) {
                currentSectionId = lastSection.getAttribute('id');
            }
        }
        
        // Update active navigation
        if (currentSectionId) {
            // Remove active class from all nav links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to corresponding nav link
            const activeLink = document.querySelector(`.nav-link[href="#${currentSectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // Add hover effects to work cards
    const workCards = document.querySelectorAll('.work-card');
    
    workCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click event for future functionality
        card.addEventListener('click', function() {
            // You can add navigation to project details here
            console.log('Project card clicked:', this.querySelector('.work-title').textContent);
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation (excluding hero-title since it has its own typing animation)
    const animatedElements = document.querySelectorAll('.work-card, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Remove the original hero title animation since we handle it with typing effect
}); 