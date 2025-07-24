// Matter.js physics simulation for portfolio landing page
document.addEventListener('DOMContentLoaded', function() {
    // Matter.js aliases
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Mouse = Matter.Mouse;
    const MouseConstraint = Matter.MouseConstraint;
    const Events = Matter.Events;

    // Create engine with precise collision settings
    const engine = Engine.create();
    const world = engine.world;
    
    // Adjust engine settings for better collision precision
    engine.world.gravity.y = 1;
    engine.positionIterations = 6;
    engine.velocityIterations = 4;
    engine.constraintIterations = 2;

    // Get canvas element and other UI elements
    const canvas = document.getElementById('world');
    const navbar = document.querySelector('.navbar');
    const scrollIndicator = document.getElementById('scroll-indicator');

    // Create renderer
    const render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent',
            showAngleIndicator: false,
            showVelocity: false
        }
    });

    // Create ground (invisible)
    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 30, window.innerWidth, 60, { 
        isStatic: true,
        friction: 0.8,
        render: { fillStyle: 'transparent' }
    });

    // Create walls (invisible)
    const leftWall = Bodies.rectangle(-30, window.innerHeight / 2, 60, window.innerHeight, { 
        isStatic: true,
        friction: 0.8,
        render: { fillStyle: 'transparent' }
    });
    const rightWall = Bodies.rectangle(window.innerWidth + 30, window.innerHeight / 2, 60, window.innerHeight, { 
        isStatic: true,
        friction: 0.8,
        render: { fillStyle: 'transparent' }
    });

    // Add walls to world
    World.add(world, [ground, leftWall, rightWall]);

    // Store physics objects
    let physicsObjects = [];
    let animationStarted = false;

    // Helper function to get responsive sizes (medium-sized pills)
    function getResponsiveSizes() {
        const isTablet = window.innerWidth <= 768;
        const isMobile = window.innerWidth <= 480;
        
        if (isMobile) {
            return {
                hello: { width: 450, height: 120 },
                im: { width: 350, height: 120 },
                name: { width: 500, height: 120 }
            };
        } else if (isTablet) {
            return {
                hello: { width: 550, height: 150 },
                im: { width: 450, height: 150 },
                name: { width: 600, height: 150 }
            };
        } else {
            return {
                hello: { width: 700, height: 170 },
                im: { width: 550, height: 170 },
                name: { width: 750, height: 170 }
            };
        }
    }

    // Helper function to create pills
    function createPill(x, y, width, height, text, className) {
        // Create a rounded rectangle (capsule) that matches the visual appearance
        const pill = Bodies.rectangle(x, y, width, height, {
            restitution: 0.4,
            friction: 0.5,
            chamfer: { radius: Math.min(width, height) / 2 }, // Make it perfectly rounded
            render: {
                fillStyle: 'transparent'
            }
        });

        // Create HTML element for the pill
        const pillElement = document.createElement('div');
        pillElement.className = `pill ${className}`;
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        pillElement.appendChild(textSpan);
        pillElement.style.position = 'absolute';
        pillElement.style.width = width + 'px';
        pillElement.style.height = height + 'px';
        pillElement.style.pointerEvents = 'none';
        pillElement.style.zIndex = '100';
        // Ensure box-sizing matches physics body
        pillElement.style.boxSizing = 'border-box';
        document.body.appendChild(pillElement);

        // Store reference
        pill.htmlElement = pillElement;
        physicsObjects.push(pill);

        // Add interaction after a short delay to ensure physics is set up
        setTimeout(() => {
            addPillInteraction(pill);
        }, 100);

        return pill;
    }

    // Update HTML elements position to match physics bodies
    function updateHTMLElements() {
        physicsObjects.forEach(body => {
            if (body.htmlElement) {
                const pos = body.position;
                const angle = body.angle;
                
                body.htmlElement.style.left = (pos.x - body.htmlElement.offsetWidth / 2) + 'px';
                body.htmlElement.style.top = (pos.y - body.htmlElement.offsetHeight / 2) + 'px';
                body.htmlElement.style.transform = `rotate(${angle}rad)`;
            }
        });
    }

    // Animation sequence
    function startAnimation() {
        if (animationStarted) return;
        animationStarted = true;

        const sizes = getResponsiveSizes();

        // Calculate center position for stacking
        const centerX = window.innerWidth / 2;
        
        // Create and drop "Satomi Ito" pill FIRST
        setTimeout(() => {
            const namePill = createPill(
                centerX, 
                -200, 
                sizes.name.width, 
                sizes.name.height, 
                'Satomi Ito', 
                'name'
            );
            World.add(world, namePill);
        }, 100);

        // Create and drop "I'm" pill SECOND (slightly to the right)
        setTimeout(() => {
            const imPill = createPill(
                centerX + 80, 
                -200, 
                sizes.im.width, 
                sizes.im.height, 
                "I'm", 
                'im'
            );
            World.add(world, imPill);
        }, 600);

        // Create and drop "Hello" pill LAST (slightly to the left)
        setTimeout(() => {
            const helloPill = createPill(
                centerX - 80, 
                -200, 
                sizes.hello.width, 
                sizes.hello.height, 
                'Hello', 
                'hello'
            );
            World.add(world, helloPill);
        }, 1100);

        // Show navbar after ALL pills have dropped and settled
        setTimeout(() => {
            navbar.classList.add('visible');
            // Show scroll indicator when navbar appears
            if (scrollIndicator) {
                scrollIndicator.classList.add('visible');
            }
        }, 2500);

        // Show the rest of the page sections after navbar appears
        setTimeout(() => {
            const selectedWorksSection = document.querySelector('.selected-works');
            const contactSection = document.querySelector('.contact');
            
            if (selectedWorksSection) selectedWorksSection.classList.add('visible');
            if (contactSection) contactSection.classList.add('visible');
        }, 2800);
    }

    // Create mouse but don't add constraint initially - this allows scrolling
    const mouse = Mouse.create(render.canvas);
    
    // Make canvas completely transparent to pointer events to allow scrolling
    canvas.style.pointerEvents = 'none';
    
    // Add interaction directly to the pill HTML elements instead
    let draggedPill = null;
    let dragOffset = { x: 0, y: 0 };
    
    function addPillInteraction(pill) {
        const htmlElement = pill.htmlElement;
        
        htmlElement.style.pointerEvents = 'auto';
        htmlElement.style.cursor = 'grab';
        
        htmlElement.addEventListener('mousedown', function(e) {
            e.preventDefault();
            draggedPill = pill;
            htmlElement.style.cursor = 'grabbing';
            
            const rect = htmlElement.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
        });
    }
    
    document.addEventListener('mousemove', function(e) {
        if (draggedPill) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            
            // Update physics body position
            Matter.Body.setPosition(draggedPill, { 
                x: newX + draggedPill.htmlElement.offsetWidth / 2, 
                y: newY + draggedPill.htmlElement.offsetHeight / 2 
            });
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (draggedPill) {
            draggedPill.htmlElement.style.cursor = 'grab';
            draggedPill = null;
        }
    });

    // Ensure proper scrolling behavior
    document.body.style.overflowY = 'auto';

    // Update HTML elements after each engine update
    Events.on(engine, 'afterUpdate', updateHTMLElements);

    // Handle window resize
    window.addEventListener('resize', () => {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight;
        render.options.width = window.innerWidth;
        render.options.height = window.innerHeight;
        
        // Update ground and walls
        Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 30 });
        Matter.Body.setPosition(rightWall, { x: window.innerWidth + 30, y: window.innerHeight / 2 });
    });

    // Add scroll detection to show navbar and sections immediately
    let hasScrolled = false;
    
    function showContentOnScroll() {
        if (!hasScrolled) {
            hasScrolled = true;
            navbar.classList.add('visible');
            const selectedWorksSection = document.querySelector('.selected-works');
            const contactSection = document.querySelector('.contact');
            
            if (selectedWorksSection) selectedWorksSection.classList.add('visible');
            if (contactSection) contactSection.classList.add('visible');
        }
        
        // Hide scroll indicator when user scrolls
        if (scrollIndicator) {
            scrollIndicator.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', showContentOnScroll);
    window.addEventListener('wheel', showContentOnScroll);
    window.addEventListener('touchmove', showContentOnScroll);

    // Start animation automatically after a short delay
    setTimeout(() => {
        startAnimation();
    }, 500);

    // Run the engine
    Engine.run(engine);

    // Run the renderer
    Render.run(render);

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