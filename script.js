// Particle System
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, loadingX, loadingY, size, color) {
        this.x = x;
        this.y = y;
        this.loadingX = loadingX;
        this.loadingY = loadingY;
        this.size = size;
        this.color = color;
        this.density = (Math.random() * 30) + 1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        // Check if mouse is close enough
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            // Return to original position (or drift slowly)
            if (this.x !== this.loadingX) {
                let dx = this.x - this.loadingX;
                this.x -= dx / 20;
            }
            if (this.y !== this.loadingY) {
                let dy = this.y - this.loadingY;
                this.y -= dy / 20;
            }
        }

        // Slight Brownian motion
        this.x += (Math.random() - 0.5) * 0.5;
        this.y += (Math.random() - 0.5) * 0.5;

        this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let loadingX = x;
        let loadingY = y;
        let color = 'rgba(62, 39, 35, 0.4)'; // Sepia dust color

        particlesArray.push(new Particle(x, y, loadingX, loadingY, size, color));
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

initParticles();
animateParticles();

window.addEventListener('resize', function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
    initParticles();
});

// Navigation Logic
const sections = {
    home: document.getElementById('home-page'),
    aerobic: document.getElementById('aerobic-sequence'),
    anaerobic: document.getElementById('anaerobic-page')
};

function navigateTo(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
        sec.style.opacity = '0';
        setTimeout(() => {
            if (!sec.classList.contains('active')) sec.style.display = 'none';
        }, 1000); // Match CSS transition
    });

    // Show target section
    const target = document.getElementById(sectionId);

    if (sectionId === 'anaerobic-page') {
        target.style.display = 'block'; // Block for scrolling content
    } else {
        target.style.display = 'flex'; // Flex for centered content (Home/Aerobic)
    }

    // Small delay to allow display change to register before opacity transition
    setTimeout(() => {
        target.classList.add('active');
        target.style.opacity = '1';
    }, 50);

    if (sectionId === 'aerobic-sequence') {
        startAerobicSequence();
    }
}

// Aerobic Sequence Logic
let currentStepIndex = 0;
const aerobicSteps = [
    'step-human',
    'step-glycolysis',
    'step-oxidation',
    'step-krebs',
    'step-ets',
    'step-summary'
];

function startAerobicSequence() {
    currentStepIndex = 0;
    showAerobicStep(0);
}

function showAerobicStep(index) {
    // Hide all steps
    document.querySelectorAll('.aerobic-step').forEach(step => {
        step.classList.add('hidden');
        step.classList.remove('active-step');
    });

    // Show current step
    const stepId = aerobicSteps[index];
    const currentStep = document.getElementById(stepId);
    currentStep.classList.remove('hidden');
    currentStep.classList.add('active-step', 'fade-in');
}

function nextAerobicStep(event) {
    // Zoom effect on current image before switching
    const currentStepEl = document.getElementById(aerobicSteps[currentStepIndex]);
    const zoomTarget = currentStepEl.querySelector('.zoom-target, .krebs-cycle-img, .ets-img'); // Target whatever is main image

    if (zoomTarget) {
        // Dramatic zoom
        zoomTarget.style.transform = 'scale(5)'; // Increased zoom level
        zoomTarget.style.opacity = '0'; // Fade out
    }

    // Smooth transition
    setTimeout(() => {
        currentStepIndex++;
        if (currentStepIndex < aerobicSteps.length) {
            showAerobicStep(currentStepIndex);
        } else {
            // End of sequence
        }
    }, 1500); // Increased wait time to match longer CSS transition (2s is total, but we switch a bit earlier for continuity)
}

// Attach click events for zoom/next
document.querySelectorAll('.zoom-trigger').forEach(trigger => {
    trigger.addEventListener('click', nextAerobicStep);
});

// Modal Logic
function openModal() {
    const modal = document.getElementById('members-modal');
    modal.classList.add('show');
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('members-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.classList.add('hidden'); // Wait for any potential fade out if added later, currently instant hiding on flex removal
    }, 100); 
}

// Close when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('members-modal');
    if (event.target == modal) {
        closeModal();
    }
}

