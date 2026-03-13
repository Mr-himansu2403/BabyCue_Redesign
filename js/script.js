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

// ============================================================
// ENHANCED SCROLL ANIMATION SYSTEM WITH INTERSECTION OBSERVER
// ============================================================

// Enhanced scroll animation with stagger support
const enhancedObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
// Trigger number counter animation if element has data-counter
if (entry.target.hasAttribute('data-counter')) {
const target = parseInt(entry.target.getAttribute('data-counter'));
animateCounter(entry.target, target);
}
}
});
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => enhancedObserver.observe(el));

// Staggered card animations
document.querySelectorAll('.team-card, .product-mockup, .ai-feature-item').forEach((card, index) => {
card.style.setProperty('--stagger-delay', `${index * 0.1}s`);
});

// ============================================================
// PARALLAX EFFECT FOR HERO SECTION
// ============================================================

let ticking = false;
let lastScrollY = window.scrollY;

function updateParallax() {
const scrollY = window.scrollY;
const heroContent = document.querySelector('.hero-content > div:first-child');
const floatingOrbs = document.querySelectorAll('.floating-orb');
  
if (heroContent && scrollY < 800) {
// Subtle parallax movement
const translateY = scrollY * 0.3;
heroContent.style.transform = `translateY(${translateY}px)`;
}

// Animate floating orbs with parallax
floatingOrbs.forEach((orb, index) => {
if (scrollY < 800) {
const speed = 0.15 + (index * 0.05);
const translateY = scrollY * speed;
orb.style.transform = `translateY(${translateY}px)`;
}
});

ticking = false;
}

window.addEventListener('scroll', () => {
lastScrollY = window.scrollY;
if (!ticking) {
window.requestAnimationFrame(updateParallax);
ticking = true;
}
});

// ============================================================
// ENHANCED COUNTER ANIMATION WITH EASING
// ============================================================

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


// ============================================================
// CONTACT FORM VALIDATION & SUBMISSION
// ============================================================

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

if (contactForm) {
// Form validation
const validateField = (field) => {
const value = field.value.trim();
const fieldName = field.name;
const errorElement = document.getElementById(`${fieldName}Error`);
const formGroup = field.closest('.form-group');
let isValid = true;
let errorMessage = '';

// Remove previous error state
formGroup.classList.remove('error');
errorElement.textContent = '';

// Validation rules
switch (fieldName) {
case 'fullName':
if (value === '') {
errorMessage = 'Full name is required';
isValid = false;
} else if (value.length < 2) {
errorMessage = 'Name must be at least 2 characters';
isValid = false;
}
break;

case 'email':
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (value === '') {
errorMessage = 'Email address is required';
isValid = false;
} else if (!emailRegex.test(value)) {
errorMessage = 'Please enter a valid email address';
isValid = false;
}
break;

case 'phone':
const phoneRegex = /^[\d\s\+\-\(\)]+$/;
if (value === '') {
errorMessage = 'Phone number is required';
isValid = false;
} else if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
errorMessage = 'Please enter a valid phone number';
isValid = false;
}
break;

case 'reason':
if (value === '') {
errorMessage = 'Please select a reason for contact';
isValid = false;
}
break;

case 'message':
if (value === '') {
errorMessage = 'Message is required';
isValid = false;
} else if (value.length < 10) {
errorMessage = 'Message must be at least 10 characters';
isValid = false;
}
break;
}

// Show error if invalid
if (!isValid) {
formGroup.classList.add('error');
errorElement.textContent = errorMessage;
}

return isValid;
};

// Validate on blur
const formFields = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
formFields.forEach(field => {
field.addEventListener('blur', () => validateField(field));
field.addEventListener('input', () => {
if (field.closest('.form-group').classList.contains('error')) {
validateField(field);
}
});
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
e.preventDefault();

// Validate all fields
let isFormValid = true;
formFields.forEach(field => {
if (!validateField(field)) {
isFormValid = false;
}
});

if (!isFormValid) {
// Scroll to first error
const firstError = contactForm.querySelector('.form-group.error');
if (firstError) {
firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
return;
}

// Show loading state
submitBtn.classList.add('loading');
submitBtn.disabled = true;

// Simulate form submission (replace with actual API call)
try {
// Simulate API delay
await new Promise(resolve => setTimeout(resolve, 2000));

// Get form data
const formData = {
fullName: document.getElementById('fullName').value,
email: document.getElementById('email').value,
phone: document.getElementById('phone').value,
reason: document.getElementById('reason').value,
message: document.getElementById('message').value,
timestamp: new Date().toISOString()
};

// Log form data (replace with actual API call)
console.log('Form submitted:', formData);

// Here you would typically send the data to your backend:
// const response = await fetch('/api/contact', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(formData)
// });

// Show success message
successMessage.classList.add('show');
contactForm.reset();

// Hide success message after 5 seconds
setTimeout(() => {
successMessage.classList.remove('show');
}, 5000);

} catch (error) {
console.error('Form submission error:', error);
alert('There was an error submitting your message. Please try again or contact us directly via email.');
} finally {
// Remove loading state
submitBtn.classList.remove('loading');
submitBtn.disabled = false;
}
});
}

// ============================================================
// ENHANCED PRODUCTS SECTION ANIMATIONS
// ============================================================

// Product card hover effects and animations
document.addEventListener('DOMContentLoaded', () => {
// Enhanced product card animations
const productCards = document.querySelectorAll('.product-card');
productCards.forEach((card, index) => {
// Stagger animation delays
card.style.setProperty('--animation-delay', `${index * 0.2}s`);

// Add hover interaction
card.addEventListener('mouseenter', () => {
card.style.transform = 'translateY(-8px) scale(1.02)';
});

card.addEventListener('mouseleave', () => {
card.style.transform = 'translateY(-4px) scale(1)';
});
});

// Enhanced DiaCue kit animation
const kitBoxes = document.querySelectorAll('.kit-box-enhanced');
kitBoxes.forEach(kit => {
kit.addEventListener('mouseenter', () => {
kit.style.transform = 'translateY(-8px) rotate(2deg) scale(1.05)';
kit.style.boxShadow = '0 25px 60px rgba(108,77,255,0.2), 0 10px 24px rgba(0,0,0,0.08)';
});
kit.addEventListener('mouseleave', () => {
kit.style.transform = '';
kit.style.boxShadow = '';
});
});

// Enhanced app phone animation
const appPhones = document.querySelectorAll('.app-phone-premium');
appPhones.forEach(phone => {
phone.addEventListener('mouseenter', () => {
phone.style.transform = 'translateY(-10px) rotateY(10deg) scale(1.02)';
});
phone.addEventListener('mouseleave', () => {
phone.style.transform = '';
});
});

// Product section scroll animations
const productSections = document.querySelectorAll('.product-section');
const productObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('in-view');
// Animate child elements with stagger
const animatedElements = entry.target.querySelectorAll('.animate-on-scroll');
animatedElements.forEach((el, index) => {
setTimeout(() => {
el.classList.add('in-view');
}, index * 100);
});
}
});
}, { threshold: 0.2 });

productSections.forEach(section => {
productObserver.observe(section);
});

// Feature list animations
const featureLists = document.querySelectorAll('.feature-list li');
featureLists.forEach((item, index) => {
item.style.setProperty('--animation-delay', `${index * 0.1}s`);
item.classList.add('animate-feature');
});

// Enhanced floating elements animation
const floatingElements = document.querySelectorAll('.stat-card, .ai-card');
floatingElements.forEach((element, index) => {
element.style.animationDelay = `${index * 0.5}s`;
element.addEventListener('mouseenter', () => {
element.style.transform = 'translateY(-8px) scale(1.05)';
element.style.zIndex = '10';
});
element.addEventListener('mouseleave', () => {
element.style.transform = '';
element.style.zIndex = '';
});
});

// Buy Now button enhanced interaction
const buyNowBtn = document.querySelector('.btn-buy-now');
if (buyNowBtn) {
buyNowBtn.addEventListener('mouseenter', () => {
buyNowBtn.style.transform = 'translateY(-4px) scale(1.05)';
buyNowBtn.style.boxShadow = '0 15px 40px rgba(16,185,129,0.5)';
});
buyNowBtn.addEventListener('mouseleave', () => {
buyNowBtn.style.transform = '';
buyNowBtn.style.boxShadow = '';
});

// Add click tracking
buyNowBtn.addEventListener('click', () => {
console.log('GrowGut purchase button clicked');
buyNowBtn.style.transform = 'scale(0.95)';
setTimeout(() => {
buyNowBtn.style.transform = '';
}, 150);
});
}

// Product images hover effects
const productImages = document.querySelectorAll('.product-img-item, .gallery-item-mini');
productImages.forEach(img => {
img.addEventListener('mouseenter', () => {
img.style.transform = 'translateY(-6px) scale(1.05)';
});
img.addEventListener('mouseleave', () => {
img.style.transform = '';
});
});
});

// Add CSS animations via JavaScript for better performance
const style = document.createElement('style');
style.textContent = `
.animate-feature {
opacity: 0;
transform: translateX(-20px);
animation: slideInLeft 0.6s ease-out forwards;
animation-delay: var(--animation-delay, 0s);
}

@keyframes slideInLeft {
to {
opacity: 1;
transform: translateX(0);
}
}

.product-section.in-view .product-card {
animation: cardSlideIn 0.8s ease-out forwards;
animation-delay: var(--animation-delay, 0s);
}

@keyframes cardSlideIn {
from {
opacity: 0;
transform: translateY(40px) scale(0.95);
}
to {
opacity: 1;
transform: translateY(0) scale(1);
}
}

.product-content {
opacity: 0;
transform: translateX(30px);
transition: all 0.8s ease-out;
transition-delay: 0.2s;
}

.product-section.in-view .product-content {
opacity: 1;
transform: translateX(0);
}

.product-layout--reverse .product-content {
transform: translateX(-30px);
}

.product-layout--reverse.in-view .product-content {
transform: translateX(0);
}

.animate-on-scroll {
opacity: 0;
transform: translateY(20px);
transition: all 0.6s var(--ease);
}

.animate-on-scroll.in-view {
opacity: 1;
transform: translateY(0);
}
`;
document.head.appendChild(style);
// ============================================================
// ENHANCED PRODUCT INTERACTIONS AND ANIMATIONS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
// Enhanced DiaCue kit animation
const kitBoxes = document.querySelectorAll('.kit-box-enhanced');
kitBoxes.forEach(kit => {
kit.addEventListener('mouseenter', () => {
kit.style.transform = 'translateY(-8px) rotate(2deg) scale(1.05)';
kit.style.boxShadow = '0 25px 60px rgba(108,77,255,0.2), 0 10px 24px rgba(0,0,0,0.08)';
});
kit.addEventListener('mouseleave', () => {
kit.style.transform = '';
kit.style.boxShadow = '';
});
});

// Enhanced app phone animation
const appPhones = document.querySelectorAll('.app-phone-premium');
appPhones.forEach(phone => {
phone.addEventListener('mouseenter', () => {
phone.style.transform = 'translateY(-10px) rotateY(10deg) scale(1.02)';
});
phone.addEventListener('mouseleave', () => {
phone.style.transform = '';
});
});

// Roadmap step animations
const roadmapSteps = document.querySelectorAll('.roadmap-step');
const roadmapObserver = new IntersectionObserver((entries) => {
entries.forEach((entry, index) => {
if (entry.isIntersecting) {
setTimeout(() => {
entry.target.style.opacity = '1';
entry.target.style.transform = 'translateX(0)';
}, index * 200);
}
});
}, { threshold: 0.3 });

roadmapSteps.forEach((step, index) => {
step.style.opacity = '0';
step.style.transform = 'translateX(-30px)';
step.style.transition = 'all 0.6s ease-out';
roadmapObserver.observe(step);
});

// Buy Now button enhanced interaction
const buyNowBtn = document.querySelector('.btn-buy-now');
if (buyNowBtn) {
buyNowBtn.addEventListener('mouseenter', () => {
buyNowBtn.style.transform = 'translateY(-4px) scale(1.05)';
buyNowBtn.style.boxShadow = '0 15px 40px rgba(16,185,129,0.5)';
});
buyNowBtn.addEventListener('mouseleave', () => {
buyNowBtn.style.transform = '';
buyNowBtn.style.boxShadow = '';
});

// Add click tracking
buyNowBtn.addEventListener('click', () => {
// Add analytics tracking here if needed
console.log('GrowGut purchase button clicked');

// Add a subtle success animation
buyNowBtn.style.transform = 'scale(0.95)';
setTimeout(() => {
buyNowBtn.style.transform = '';
}, 150);
});
}

// Enhanced floating elements animation
const floatingElements = document.querySelectorAll('.stat-card, .ai-card');
floatingElements.forEach((element, index) => {
element.style.animationDelay = `${index * 0.5}s`;
element.addEventListener('mouseenter', () => {
element.style.transform = 'translateY(-8px) scale(1.05)';
element.style.zIndex = '10';
});
element.addEventListener('mouseleave', () => {
element.style.transform = '';
element.style.zIndex = '';
});
});

// Chart bars animation enhancement
const chartBars = document.querySelectorAll('.chart-bar');
chartBars.forEach((bar, index) => {
bar.style.animationDelay = `${index * 0.1}s`;
bar.addEventListener('mouseenter', () => {
bar.style.opacity = '1';
bar.style.boxShadow = '0 0 15px rgba(139,92,246,0.6)';
});
bar.addEventListener('mouseleave', () => {
bar.style.opacity = '';
bar.style.boxShadow = '';
});
});

// Product images hover effects
const productImages = document.querySelectorAll('.product-img-item, .gallery-item-mini');
productImages.forEach(img => {
img.addEventListener('mouseenter', () => {
img.style.transform = 'translateY(-6px) scale(1.05)';
});
img.addEventListener('mouseleave', () => {
img.style.transform = '';
});
});

// Benefit items stagger animation
const benefitItems = document.querySelectorAll('.benefit-item');
const benefitObserver = new IntersectionObserver((entries) => {
entries.forEach((entry, index) => {
if (entry.isIntersecting) {
setTimeout(() => {
entry.target.style.opacity = '1';
entry.target.style.transform = 'translateX(0)';
}, index * 100);
}
});
}, { threshold: 0.5 });

benefitItems.forEach((item, index) => {
item.style.opacity = '0';
item.style.transform = 'translateX(-20px)';
item.style.transition = 'all 0.5s ease-out';
benefitObserver.observe(item);
});

// Trust badges animation
const trustBadges = document.querySelectorAll('.trust-badge');
trustBadges.forEach((badge, index) => {
badge.style.animationDelay = `${index * 0.1}s`;
badge.classList.add('animate-badge');
});

// Enhanced scroll-triggered animations for product sections
const productSections = document.querySelectorAll('.product-section');
const sectionObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('section-visible');

// Trigger child animations
const animatedChildren = entry.target.querySelectorAll('.animate-on-scroll');
animatedChildren.forEach((child, index) => {
setTimeout(() => {
child.classList.add('child-visible');
}, index * 150);
});
}
});
}, { threshold: 0.2 });

productSections.forEach(section => {
sectionObserver.observe(section);
});
});

// Add CSS classes for enhanced animations
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
.animate-badge {
opacity: 0;
transform: translateY(20px);
animation: badgeSlideIn 0.6s ease-out forwards;
animation-delay: var(--animation-delay, 0s);
}

@keyframes badgeSlideIn {
to {
opacity: 1;
transform: translateY(0);
}
}

.section-visible {
animation: sectionFadeIn 1s ease-out forwards;
}

@keyframes sectionFadeIn {
from {
opacity: 0;
transform: translateY(40px);
}
to {
opacity: 1;
transform: translateY(0);
}
}

.child-visible {
opacity: 1 !important;
transform: translateY(0) !important;
}

.product-section .animate-on-scroll {
opacity: 0;
transform: translateY(30px);
transition: all 0.8s ease-out;
}

.chart-bar {
animation: barPulse 3s ease-in-out infinite;
}

@keyframes barPulse {
0%, 100% { opacity: 0.7; }
50% { opacity: 1; }
}

.floating-element {
animation: gentleFloat 6s ease-in-out infinite;
}

@keyframes gentleFloat {
0%, 100% { transform: translateY(0px); }
50% { transform: translateY(-8px); }
}
`;
document.head.appendChild(enhancedStyle);

// ============================================================
// ACHIEVEMENTS GALLERY AUTO-FLOW ANIMATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const achievementsGallery = document.getElementById('achievementsGallery');
    
    if (achievementsGallery) {
        // Force the auto-flow animation to start immediately
        achievementsGallery.style.animation = 'autoFlow 50s linear infinite';
        achievementsGallery.style.animationPlayState = 'running';
        
        // Optional: Pause on hover, resume on leave (remove if you want continuous flow)
        achievementsGallery.addEventListener('mouseenter', () => {
            achievementsGallery.style.animationPlayState = 'paused';
        });
        
        achievementsGallery.addEventListener('mouseleave', () => {
            achievementsGallery.style.animationPlayState = 'running';
        });
        
        // Ensure animation never stops - restart if needed
        setInterval(() => {
            const computedStyle = window.getComputedStyle(achievementsGallery);
            
            // If animation is not running (except when paused by hover), restart it
            if (computedStyle.animationPlayState === 'running' && 
                computedStyle.transform === 'none') {
                console.log('Restarting achievements gallery animation');
                achievementsGallery.style.animation = 'none';
                achievementsGallery.offsetHeight; // Force reflow
                achievementsGallery.style.animation = 'autoFlow 50s linear infinite';
            }
        }, 3000);
        
        // Debug: Log animation status
        console.log('Achievements gallery auto-flow initialized');
        console.log('Animation:', window.getComputedStyle(achievementsGallery).animation);
    } else {
        console.error('Achievements gallery not found!');
    }
    
    // Ensure all images are loaded properly
    const achievementImages = document.querySelectorAll('.achievement-card img');
    achievementImages.forEach((img, index) => {
        img.addEventListener('load', () => {
            console.log(`Achievement image ${index + 1} loaded successfully`);
        });
        
        img.addEventListener('error', () => {
            console.error(`Achievement image ${index + 1} failed to load:`, img.src);
        });
    });
});