# BabyCue Website — Technical Architecture

## Overview

The BabyCue website is a production-grade, single-page application (SPA) built with vanilla web technologies. It serves as the primary marketing and investor-facing platform for BabyCue's AI-powered pediatric diagnostic products.

---

## Architecture

### Type
**Single Page Application (SPA)** — No page reloads, smooth scroll navigation

### Structure
```
Landing Page Architecture
├── Navigation (Fixed)
├── Hero Section (Animated)
├── Content Sections (10 sections)
├── Footer
└── Floating Chatbot
```

### Technology Stack
- **HTML5**: Semantic markup, accessibility-first
- **CSS3**: Custom design system, animations, responsive
- **Vanilla JavaScript**: No frameworks, pure DOM manipulation

---

## Design System

### CSS Architecture

#### 1. Design Tokens (CSS Variables)
Located at `:root` in `styles.css`:

```css
/* Color Palette */
--primary: #7c3aed        /* Deep Purple */
--violet-600: #7c3aed
--violet-500: #8b5cf6
--violet-400: #a78bfa
--accent: #c4b5fd         /* Lavender */

/* Spacing Scale */
--s1 to --s24             /* 4px to 96px */

/* Typography */
--font-display: 'DM Serif Display'
--font-body: 'Sora'
--font-mono: 'JetBrains Mono'

/* Shadows & Effects */
--shadow-glow-purple
--shadow-glow-violet
```

#### 2. Component-Based CSS
Each section has isolated styles:
- `.hero` — Hero section
- `.nav` — Navigation
- `.diacue-section` — Product showcase
- `.gibud-section` — AI app section
- `.dashboard-section` — Dashboard preview
- `.footer` — Footer

#### 3. Utility Classes
- Layout: `.container`, `.grid-2`, `.flex`
- Typography: `.text-h1`, `.text-body`, `.text-gradient-purple`
- Spacing: `.mt-6`, `.mb-8`, `.gap-4`
- Animations: `.animate-on-scroll`, `.animate-delay-2`

---

## Animation System

### 1. Scroll-Triggered Animations
**Technology**: Intersection Observer API

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
```

**Usage**: Elements with `.animate-on-scroll` fade in when scrolled into view

### 2. CSS Keyframe Animations
- `@keyframes float` — Floating orbs in hero
- `@keyframes fadeInUp` — Fade and slide up
- `@keyframes ticker` — Award ticker scroll
- `@keyframes barGrow` — Chart bar animations
- `@keyframes pulse` — Pulsing dots
- `@keyframes chatPulse` — Chatbot pulse ring

### 3. Counter Animations
**Technology**: RequestAnimationFrame

```javascript
function animateCounter(el, target, duration = 2000) {
  // Smooth number counting animation
}
```

---

## UI Components

### 1. Navigation Bar
- **Type**: Fixed position, glassmorphism effect
- **Behavior**: Changes background on scroll
- **Features**: Smooth scroll to sections

### 2. Hero Section
- **Layout**: Two-column grid (content + visual)
- **Effects**: 
  - Animated gradient orbs (floating)
  - Glassmorphic card with dashboard mockup
  - Floating data pills
  - Stats counter
- **Background**: Gradient mesh with animated grid

### 3. Product Sections (DiaCue & GI-BUD)
- **DiaCue**: Product mockup with floating stats
- **GI-BUD**: Dark theme with phone mockup, floating cards
- **Features**: Step-by-step guides, feature badges

### 4. Dashboard Preview
- **Type**: Dark UI mockup
- **Components**:
  - Sidebar navigation
  - Metric cards
  - Sparkline charts
  - Patient list
  - Heatmap visualization

### 5. Data Visualizations
- **Bar Charts**: Animated horizontal bars
- **Donut Chart**: SVG-based circular chart
- **Sparklines**: SVG line graphs
- **Heatmaps**: Grid-based activity visualization

### 6. AI Chatbot
- **Type**: Fixed floating button (bottom-right)
- **Features**:
  - Toggle panel
  - Pulse animation
  - Chat interface mockup

### 7. Awards Ticker
- **Type**: Infinite horizontal scroll
- **Technology**: CSS animation with duplicated content

---

## Responsive Design

### Breakpoints
```css
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px)  { /* Mobile */ }
@media (max-width: 480px)  { /* Small Mobile */ }
```

### Strategy
- **Desktop-first** approach
- Grid layouts collapse to single column
- Navigation simplifies on mobile
- Visual mockups hidden on small screens
- Touch-friendly button sizes

---

## JavaScript Functionality

### Core Features

#### 1. Navigation Scroll Effect
```javascript
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});
```

#### 2. Smooth Scroll
```javascript
document.querySelectorAll('a[href^="#"]').forEach(a => {
  // Smooth scroll with offset
});
```

#### 3. Intersection Observer
Triggers animations when elements enter viewport

#### 4. Chatbot Toggle
```javascript
chatToggle.addEventListener('click', () => {
  chatPanel.classList.toggle('open');
});
```

#### 5. Staggered Animations
```javascript
document.querySelectorAll('.bar-fill').forEach((bar, i) => {
  bar.style.animationDelay = `${i * 0.15}s`;
});
```

---

## Performance Optimizations

### 1. CSS
- CSS variables for theme consistency
- Minimal specificity
- Efficient selectors
- Hardware-accelerated animations (`transform`, `opacity`)

### 2. JavaScript
- Event delegation where possible
- RequestAnimationFrame for smooth animations
- Intersection Observer (lazy animation loading)
- No external libraries (zero dependencies)

### 3. Assets
- Google Fonts with `display=swap`
- SVG for icons and charts
- No image dependencies (mockups are CSS-based)

### 4. Loading
- `defer` attribute on script tag
- Critical CSS inline (optional)
- Minimal HTTP requests

---

## Browser Compatibility

### Modern Features Used
- CSS Grid & Flexbox
- CSS Variables (Custom Properties)
- Intersection Observer API
- RequestAnimationFrame
- Backdrop Filter (with vendor prefixes)

### Fallbacks
- Vendor prefixes for Safari (`-webkit-backdrop-filter`)
- Graceful degradation for older browsers

---

## Accessibility

### Features
- Semantic HTML5 elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- Sufficient color contrast (WCAG AA)
- Alt text for visual elements

---

## File Organization

### CSS Structure
```
styles.css
├── Design Tokens (Variables)
├── Reset & Base Styles
├── Layout Utilities
├── Typography System
├── Component Styles
│   ├── Navigation
│   ├── Hero
│   ├── Sections
│   ├── Cards
│   ├── Buttons
│   └── Footer
├── Animations
└── Responsive Media Queries
```

### JavaScript Structure
```
script.js
├── Navigation scroll effect
├── Intersection Observer setup
├── Counter animations
├── Chatbot toggle
├── Staggered animations
└── Smooth scroll
```

---

## Deployment Considerations

### Static Hosting
- No server-side processing required
- Can be hosted on:
  - GitHub Pages
  - Vercel
  - Netlify
  - AWS S3 + CloudFront
  - Any static host

### CDN Requirements
- Google Fonts (external CDN)
- No other external dependencies

### Environment
- No build process required
- No environment variables
- Pure static files

---

## Future Enhancements

### Potential Additions
1. **Analytics**: Google Analytics / Plausible
2. **SEO**: Structured data (JSON-LD)
3. **Performance**: Image optimization (when images added)
4. **PWA**: Service worker for offline support
5. **Forms**: Contact form with backend integration
6. **CMS**: Headless CMS for content management

### Scalability
- Easy to convert to React/Vue if needed
- Component structure ready for framework migration
- Design system can be extracted to separate package

---

## Maintenance

### Code Quality
- Clean, readable code
- Consistent naming conventions
- Well-commented sections
- Modular structure

### Updates
- CSS variables make theme changes easy
- Component isolation simplifies updates
- No framework dependencies = no breaking changes

---

## Contact

For technical questions or contributions:
- **Email**: info@babycue.in
- **GitHub**: [Repository URL]

---

**Last Updated**: 2025  
**Version**: 1.0.0 (Production)  
**Status**: ✅ Production-Ready
