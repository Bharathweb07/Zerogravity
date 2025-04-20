// Loading Animation
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loader').classList.add('loaded');
    }, 2000);
});

// Mobile Navigation
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
};

navSlide();

// Smooth Scrolling - Use passive event listeners for better performance
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    }, { passive: false });
});

// Active Navigation Links - Throttle scroll event for better performance
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

let scrollThrottleTimer;
window.addEventListener('scroll', () => {
    if (!scrollThrottleTimer) {
        scrollThrottleTimer = setTimeout(() => {
            scrollThrottleTimer = null;
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                }
            });
        }, 100);
    }
}, { passive: true });

// Three.js Background - Optimized for performance
const initThreeJSBackground = () => {
    // Only initialize Three.js if WebGL is supported
    if (!THREE || !document.getElementById('bg')) return;
    
    const canvas = document.getElementById('bg');
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: window.innerWidth > 768, // Only use antialias on larger screens
        alpha: true,
        powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xff3e3e, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x3e8aff, 1);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);
    
    // Stars - Reduced number for better performance
    const starGeometry = new THREE.SphereGeometry(0.1, 12, 12); // Reduced polygon count
    const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    function addStar() {
        const star = new THREE.Mesh(starGeometry, starMaterial);
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
        star.position.set(x, y, z);
        scene.add(star);
        return star;
    }
    
    // Reduce stars on mobile
    const starCount = window.innerWidth < 768 ? 100 : 150;
    const stars = Array(starCount).fill().map(addStar);
    
    // Floating Objects - Create shared geometries and materials for better performance
    const octahedronGeometrySmall = new THREE.OctahedronGeometry(1, 0);
    const octahedronGeometryMedium = new THREE.OctahedronGeometry(1.5, 0);
    const materialRed = new THREE.MeshStandardMaterial({ 
        color: 0xff3e3e,
        metalness: 0.7,
        roughness: 0.2,
        wireframe: true
    });
    const materialBlue = new THREE.MeshStandardMaterial({ 
        color: 0x3e8aff,
        metalness: 0.7,
        roughness: 0.2,
        wireframe: true
    });
    
    const createFloatingObject = (size, color, speed) => {
        // Use shared resources based on size and color
        const geometry = size <= 1 ? octahedronGeometrySmall : octahedronGeometryMedium;
        const material = color === 0xff3e3e ? materialRed : materialBlue;
        
        const object = new THREE.Mesh(geometry, material);
        object.scale.set(size, size, size);
        
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(50));
        object.position.set(x, y, z);
        object.userData.speed = speed;
        object.userData.rotationSpeed = THREE.MathUtils.randFloat(0.005, 0.02);
        
        scene.add(object);
        return object;
    };
    
    const floatingObjects = [];
    
    // Reduce objects on mobile
    const objectCount = window.innerWidth < 768 ? 8 : 15;
    for (let i = 0; i < objectCount; i++) {
        const size = THREE.MathUtils.randFloat(0.5, 2);
        const color = i % 2 === 0 ? 0xff3e3e : 0x3e8aff;
        const speed = THREE.MathUtils.randFloat(0.01, 0.05);
        floatingObjects.push(createFloatingObject(size, color, speed));
    }
    
    // Camera Position
    camera.position.z = 30;
    
    // Mouse Movement for Parallax Effect - with debouncing
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    let mouseMoveThrottle;
    document.addEventListener('mousemove', (event) => {
        if (!mouseMoveThrottle) {
            mouseMoveThrottle = setTimeout(() => {
                mouseMoveThrottle = null;
                mouseX = (event.clientX - windowHalfX);
                mouseY = (event.clientY - windowHalfY);
            }, 50);
        }
    }, { passive: true });
    
    // Handle Resize - with debouncing
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }, 250);
    }, { passive: true });
    
    // Check if animation frame is needed
    let isAnimationNeeded = true;
    
    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
        isAnimationNeeded = !document.hidden;
        if (isAnimationNeeded) animate();
    });
    
    // Animation Loop with performance optimization
    let lastFrameTime = 0;
    const targetFPS = 30; // Target FPS for better performance
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime = 0) => {
        if (!isAnimationNeeded) return;
        
        const deltaTime = currentTime - lastFrameTime;
        
        if (deltaTime > frameInterval) {
            lastFrameTime = currentTime - (deltaTime % frameInterval);
            
            // Smooth camera movement based on mouse
            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;
            
            camera.rotation.y += 0.05 * (targetX - camera.rotation.y);
            camera.rotation.x += 0.05 * (targetY - camera.rotation.x);
            
            // Optimize star rotation by updating fewer stars per frame
            for (let i = 0; i < stars.length; i += 3) { // Update only every third star
                if (stars[i]) {
                    stars[i].rotation.x += 0.001;
                    stars[i].rotation.y += 0.001;
                }
            }
            
            // Animate floating objects
            floatingObjects.forEach(obj => {
                obj.rotation.x += obj.userData.rotationSpeed;
                obj.rotation.y += obj.userData.rotationSpeed;
                
                // Floating motion
                obj.position.y += Math.sin(Date.now() * 0.001 * obj.userData.speed) * 0.01;
            });
            
            renderer.render(scene, camera);
        }
        
        requestAnimationFrame(animate);
    };
    
    animate();
};

// Initialize Three.js with a slight delay after page load
window.addEventListener('load', () => {
    // Small delay to prioritize visible content rendering first
    setTimeout(initThreeJSBackground, 500);
});

// Fade-in animations for elements using Intersection Observer
const fadeInElements = () => {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers that don't support IntersectionObserver
        const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-text, .about-image, .contact-form, .contact-info');
        elements.forEach(element => {
            element.classList.add('fade-in-visible');
        });
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
    });

    const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-text, .about-image, .contact-form, .contact-info');
    elements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
};

// Add fade-in class to elements
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fadeInElements);
} else {
    fadeInElements();
} 