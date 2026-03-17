# BabyCue - Precision Pediatric Diagnostics

> Clinical Precision meets Human Warmth

Premium single-page application for BabyCue's precision diagnostics platform for pediatric gut health.

## 🚀 Quick Start

```bash
# Start local server
python -m http.server 8000

# Open browser
http://localhost:8000
```

## 🎨 Design System

**Colors:**
- Navy: `#0A0F1E` (Primary background)
- Mint: `#00E5A0` (Primary accent)
- Cream: `#FDF6EC` (Contrast sections)

**Typography:**
- Instrument Sans (Google Fonts)

**Aesthetic:**
"Clinical Precision meets Human Warmth" - Bloomberg Terminal meets premium children's healthcare

## ✨ Features

### Must-Have Upgrades (All Implemented)
1. ✅ **Hero Section** - Full-screen with animated floating DiaCue product, staggered text reveal, live stats ticker, animated mesh background
2. ✅ **Animated Impact Metrics** - Numbers count up from 0 using IntersectionObserver + requestAnimationFrame
3. ✅ **Working Contact Form** - EmailJS integration with loading states, success confetti, toast notifications
4. ✅ **DiaCue Product Page** - Bento-grid style showcase with glowing hover effects
5. ✅ **GI-BUD App Mockup** - CSS-only animated phone mockup cycling through 3 screens every 3 seconds
6. ✅ **Team Cards** - Premium glassmorphism cards with gradient borders, floating animation for advisors
7. ✅ **Scroll Progress Indicator** - Mint-green line showing reading progress
8. ✅ **Smooth Page Transitions** - Clip-path wipe animation for section changes
9. ✅ **Press/Trust Section** - Horizontally scrolling ticker with grayscale logos (colored on hover)
10. ✅ **Footer Upgrade** - Dark navy footer with mint accent links, newsletter signup, micro-stats

## 📋 Sections

All sections included with proper IDs:
- `#home` - Hero with animated background
- `#about` - Team (6 members) + Medical Advisory Board (5 advisors)
- `#product` - Product overview with bento grid
- `#diacue` - DiaCue product details
- `#gibud` - GI-BUD app showcase
- `#growgut` - GrowGut (coming soon)
- `#technology` - Technology & innovation
- `#achievements` - Achievements & recognition
- `#contact` - Contact form with EmailJS
- `#partner` - Partnership opportunities

## 🔧 Configuration

### EmailJS Setup

Open `index.html` and replace these placeholders in the JavaScript:

```javascript
emailjs.init("YOUR_PUBLIC_KEY");
// ...
await emailjs.send('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID',formData);
```

Get your keys from: https://emailjs.com

## 👥 Team

**Leadership:**
- Manish Kumar Swain - Founder & CEO
- Dr. Swati Sagarika Panda - Co-founder & CSO
- Saumyashree Swain - Chief Administrative Officer
- Rishika Kedia - Chief Operating Officer
- Sefali Maurya - Head R&D
- Sibasis Pradhan - Clinical Validation Assistant

**Medical Advisory Board:**
- Dr. Anil Patel, MD - Pediatric Gastroenterologist, AIIMS
- Dr. Meera Reddy, MBBS, MPH - Infectious Disease Specialist, WHO
- Dr Amit Asthana - Scientific Advisor, NIPER Hyderabad
- Dr. Nirmal Mahakud - Clinical Advisor, KIMS Bhubaneswar
- Dr. Soumya Sunder Dash - Mentor cum Investor, Sleepiz AG

## 📊 Products

### DiaCue
- **Type:** Rapid Diarrhea Diagnostic Kit
- **Speed:** 15-20 minutes
- **Accuracy:** 96% sensitivity, 94% specificity
- **Features:** No lab required, home-based collection, ambient storage

### GI-BUD
- **Type:** AI-Powered Gut Health App
- **Features:** DiaCue result scanner, AI tongue hydration analysis, personalized gut health score

### GrowGut
- **Type:** Pediatric Nutrition Monitor
- **Status:** Coming Soon

## 🎯 Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, animations, glassmorphism
- **Vanilla JavaScript** - No frameworks
- **EmailJS** - Contact form integration
- **Canvas Confetti** - Success animations

## 📱 Responsive Design

Mobile-first approach with breakpoints:
- Mobile: 0-640px
- Tablet: 641-968px
- Desktop: 969px+

## ♿ Accessibility

- WCAG AA compliant
- Keyboard navigation support
- Semantic HTML structure
- ARIA labels on interactive elements

## 🚀 Performance

- Single HTML file (self-contained)
- Minified CSS (inline)
- Optimized animations (60fps)
- GPU-accelerated transforms
- No external dependencies (except fonts & EmailJS)

## 📄 License

Copyright © 2026 BabyCue. All rights reserved.

## 📞 Contact

- **Email:** info@babycue.com
- **Phone:** +91 123 456 7890
- **Website:** https://babycue.com

---

**Built with precision. Designed for impact.**
