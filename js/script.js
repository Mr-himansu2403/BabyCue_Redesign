// Nav scroll effect
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Scroll animation
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
}
});
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// Counter animation for impact numbers
function animateCounter(el, target, duration = 2000) {
const start = performance.now();
const update = (time) => {
const elapsed = time - start;
const progress = Math.min(elapsed / duration, 1);
const eased = 1 - Math.pow(1 - progress, 3);
el.textContent = Math.round(target * eased).toLocaleString();
if (progress < 1) requestAnimationFrame(update);
};
requestAnimationFrame(update);
}

// Chat toggle
const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
chatToggle.addEventListener('click', () => {
chatPanel.classList.toggle('open');
});

// Bar chart stagger animations on load
document.querySelectorAll('.bar-fill').forEach((bar, i) => {
bar.style.animationDelay = `${i * 0.15}s`;
});

// Step animations
document.querySelectorAll('.step-item').forEach((step, i) => {
step.style.animationDelay = `${i * 0.1}s`;
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(a => {
a.addEventListener('click', e => {
const target = document.querySelector(a.getAttribute('href'));
if (target) {
e.preventDefault();
const offset = 80;
window.scrollTo({
top: target.getBoundingClientRect().top + window.scrollY - offset,
behavior: 'smooth'
});
}
});
});
