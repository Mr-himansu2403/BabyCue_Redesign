// Nav scroll effect
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ============================================================
// ENHANCED NAVIGATION FUNCTIONALITY
// ============================================================

// Mobile menu toggle
const navHamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');

if (navHamburger && navLinks) {
navHamburger.addEventListener('click', () => {
navHamburger.classList.toggle('active');
navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('.nav-link').forEach(link => {
link.addEventListener('click', () => {
navHamburger.classList.remove('active');
navLinks.classList.remove('active');
});
});
}

// Dropdown toggle for mobile
const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
dropdownToggles.forEach(toggle => {
toggle.addEventListener('click', (e) => {
// Only prevent default on mobile
if (window.innerWidth <= 968) {
e.preventDefault();
const dropdown = toggle.closest('.nav-dropdown');
dropdown.classList.toggle('active');
}
});
});

// Active link highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link[href^="#"]');

function highlightActiveLink() {
const scrollY = window.pageYOffset;

sections.forEach(section => {
const sectionHeight = section.offsetHeight;
const sectionTop = section.offsetTop - 100;
const sectionId = section.getAttribute('id');

if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
navLinksAll.forEach(link => {
link.classList.remove('active');
if (link.getAttribute('href') === `#${sectionId}`) {
link.classList.add('active');
}
});
}
});
}

window.addEventListener('scroll', highlightActiveLink);
window.addEventListener('load', highlightActiveLink);

// ============================================================
// EXISTING FUNCTIONALITY (PRESERVED)
// ============================================================

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

// Chat toggle (if exists)
const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
if (chatToggle && chatPanel) {
chatToggle.addEventListener('click', () => {
chatPanel.classList.toggle('open');
});
}

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
