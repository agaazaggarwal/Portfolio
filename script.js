// Loader animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1000);
});

// Particle Canvas Setup
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Mouse Interaction
const mouse = {
    x: null,
    y: null,
    radius: 100
};

window.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.colorAngle = Math.random() * 360;
        this.colorSpeed = Math.random() * 2 + 0.5;
    }
    
    draw() {
        this.colorAngle += this.colorSpeed;
        const hue = (this.colorAngle % 360);
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    
    update() {
        // Mouse interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirX = dx / distance;
        let forceDirY = dy / distance;
        let maxDist = mouse.radius;
        let force = (maxDist - distance) / maxDist;
        
        if (distance < maxDist) {
            this.x -= forceDirX * force * this.density;
            this.y -= forceDirY * force * this.density;
            this.size = 3 + force * 5;
        } else {
            this.size = Math.max(1, this.size * 0.95);
            if (Math.abs(this.x - this.baseX) > 0.5) {
                this.x -= (this.x - this.baseX) * 0.1;
            }
            if (Math.abs(this.y - this.baseY) > 0.5) {
                this.y -= (this.y - this.baseY) * 0.1;
            }
        }
    }
}

// Create particles
const particles = [];
function init() {
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }
}

// Connection lines
function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.strokeStyle = `rgba(150, 180, 255, ${0.2 - distance/500})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animate);
}

// Handle resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Custom cursor
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });
});

// Scroll animations
const sections = document.querySelectorAll('section');

function checkScroll() {
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight * 0.75) {
            section.classList.add('show');
        }
    });
}

window.addEventListener('scroll', checkScroll);
checkScroll(); // Run once on load

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize
init();
animate();