// Matter.js physics simulation for interactive landing page

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Matter.js aliases
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Mouse = Matter.Mouse;
    const MouseConstraint = Matter.MouseConstraint;
    const Events = Matter.Events;

    // Create engine
    const engine = Engine.create();
    const world = engine.world;

    // Get canvas element
    const canvas = document.getElementById('world');
    const getStartedBtn = document.getElementById('get-started-btn');

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
        render: { fillStyle: 'transparent' }
    });

    // Create walls (invisible)
    const leftWall = Bodies.rectangle(-30, window.innerHeight / 2, 60, window.innerHeight, { 
        isStatic: true,
        render: { fillStyle: 'transparent' }
    });
    const rightWall = Bodies.rectangle(window.innerWidth + 30, window.innerHeight / 2, 60, window.innerHeight, { 
        isStatic: true,
        render: { fillStyle: 'transparent' }
    });

    // Add walls to world
    World.add(world, [ground, leftWall, rightWall]);

    // Store physics objects
    let physicsObjects = [];
    let animationStarted = false;

    // Helper function to create pills
    function createPill(x, y, width, height, text, className) {
        const pill = Bodies.rectangle(x, y, width, height, {
            restitution: 0.6,
            friction: 0.3,
            render: {
                fillStyle: 'transparent'
            }
        });

        // Create HTML element for the pill
        const pillElement = document.createElement('div');
        pillElement.className = `pill ${className}`;
        pillElement.textContent = text;
        pillElement.style.position = 'absolute';
        pillElement.style.width = width + 'px';
        pillElement.style.height = height + 'px';
        pillElement.style.pointerEvents = 'none';
        pillElement.style.zIndex = '100';
        document.body.appendChild(pillElement);

        // Store reference
        pill.htmlElement = pillElement;
        physicsObjects.push(pill);

        return pill;
    }

    // Helper function to create balls
    function createBall(x, y, radius, icon, className) {
        const ball = Bodies.circle(x, y, radius, {
            restitution: 0.8,
            friction: 0.2,
            render: {
                fillStyle: 'transparent'
            }
        });

        // Create HTML element for the ball
        const ballElement = document.createElement('div');
        ballElement.className = `ball ${className}`;
        ballElement.innerHTML = icon;
        ballElement.style.position = 'absolute';
        ballElement.style.width = radius * 2 + 'px';
        ballElement.style.height = radius * 2 + 'px';
        ballElement.style.pointerEvents = 'none';
        ballElement.style.zIndex = '100';
        document.body.appendChild(ballElement);

        // Store reference
        ball.htmlElement = ballElement;
        physicsObjects.push(ball);

        return ball;
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

        // Create and drop "Hello!" pill
        setTimeout(() => {
            const helloPill = createPill(
                window.innerWidth / 2, 
                -200, 
                800, 
                200, 
                'Hello!', 
                'hello'
            );
            World.add(world, helloPill);
        }, 100);

        // Create and drop "Lets" pill
        setTimeout(() => {
            const letsPill = createPill(
                window.innerWidth / 2 - 300, 
                -200, 
                650, 
                200, 
                'Lets', 
                'lets'
            );
            World.add(world, letsPill);
        }, 800);

        // Create and drop "Adopt" pill
        setTimeout(() => {
            const adoptPill = createPill(
                window.innerWidth / 2 + 80, 
                -200, 
                720, 
                200, 
                'Adopt', 
                'adopt'
            );
            World.add(world, adoptPill);
        }, 1300);

        // Create and drop paw ball
        setTimeout(() => {
            const pawBall = createBall(
                window.innerWidth / 3, 
                -200, 
                100, 
                '🐾', 
                'paw'
            );
            World.add(world, pawBall);
        }, 1800);

        // Create and drop house ball
        setTimeout(() => {
            const houseBall = createBall(
                window.innerWidth * 2 / 3, 
                -200, 
                100, 
                '<svg viewBox="0 0 24 24" fill="white" width="100" height="100"><path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/></svg>', 
                'house'
            );
            World.add(world, houseBall);
        }, 2100);
    }

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    World.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

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

    // Start animation automatically after a short delay
    setTimeout(() => {
        startAnimation();
    }, 500);

    // Get Started button click event
    getStartedBtn.addEventListener('click', () => {
        showSpeciesPage();
    });
    
    // Function to show species selection page
    function showSpeciesPage() {
        const speciesPage = document.getElementById('species-page');
        const slideUpElements = document.querySelectorAll('.slide-up-element');
        
        // Show the species page
        speciesPage.classList.remove('hidden');
        
        // Trigger sliding animations after a short delay
        setTimeout(() => {
            slideUpElements.forEach(element => {
                element.classList.add('animate');
            });
        }, 100);
    }
    
    // Add click handlers for species buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.species-btn')) {
            const speciesBtn = e.target.closest('.species-btn');
            const species = speciesBtn.dataset.species;
            
            // Add visual feedback
            speciesBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                speciesBtn.style.transform = '';
            }, 50);
            
            // Handle selection/deselection with animation
            if (speciesBtn.classList.contains('selected')) {
                // Deselecting: animate from right to left
                speciesBtn.classList.remove('selected');
                speciesBtn.classList.add('deselecting');
                
                setTimeout(() => {
                    speciesBtn.classList.remove('deselecting');
                }, 400);
            } else {
                // Selecting: animate from left to right
                speciesBtn.classList.add('selected');
            }
            
            // Handle species selection
            setTimeout(() => {
                const selectedSpecies = Array.from(document.querySelectorAll('.species-btn.selected'))
                    .map(btn => btn.dataset.species);
                console.log(`Selected species: ${selectedSpecies}`);
            }, 50);
            
            // You can add your next page logic here
            // For example: showBreedSelection(selectedSpecies);
        }
    });

    // Show Get Started button after all physics objects have fallen
    setTimeout(() => {
        getStartedBtn.style.opacity = '1';
        getStartedBtn.style.animation = 'fadeInPulse 1s ease-in-out forwards';
        
        // Continue pulsing after fade-in completes
        setTimeout(() => {
            getStartedBtn.style.animation = 'redPulse 2s infinite';
        }, 1000);
    }, 3500); // Wait until after all objects have dropped and settled

    // Run the engine
    Engine.run(engine);

    // Run the renderer
    Render.run(render);

    // Add some particles for background effect
    function createParticles() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * window.innerWidth + 'px';
                particle.style.top = Math.random() * window.innerHeight + 'px';
                particle.style.animationDelay = Math.random() * 3 + 's';
                document.body.appendChild(particle);

                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 5000);
            }, i * 200);
        }
    }

    // Start particle effect
    createParticles();
    setInterval(createParticles, 10000);

    // Welcome message removed
}); 