# BabyCue Website

> AI-Powered Pediatric Diagnostics Platform — Detect Early. Protect Always.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production-success)]()
[![Tech](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-orange)]()

## 🌟 Overview

BabyCue is a premium HealthTech platform combining AI-powered diagnostics and rapid testing to protect children from diarrheal diseases — one of the leading causes of child mortality worldwide. This repository contains the official marketing website showcasing our flagship products: **DiaCue** diagnostic kit and **GI-BUD** AI companion app.

**Live Demo**: [View Website](#) *(Add your deployment URL)*

---

## 🚀 Features

### Products Showcased
- **DiaCue Kit** — Rapid 20-minute diarrhea diagnostic test
- **GI-BUD AI App** — Intelligent gut health companion with AI scoring
- **Clinic Dashboard** — Real-time patient monitoring interface (preview)
- **AI Chatbot** — Interactive assistant for product inquiries

### Technical Highlights
- 🎨 **Premium Purple & White Design System** — Medical-grade aesthetic
- ⚡ **Smooth Animations** — Intersection Observer + CSS keyframes
- 📱 **Fully Responsive** — Mobile-first design
- 🧠 **Interactive UI** — Dynamic charts, dashboards, and data visualizations
- 🔒 **Production-Ready** — Optimized for deployment
- ♿ **Accessible** — Semantic HTML and ARIA compliance

---

## 📁 Project Structure

```
babycue-website/
│
├── index.html                 # Main HTML file
├── README.md                  # Project documentation
├── LICENSE                    # MIT License
├── DEPLOYMENT.md              # Deployment guides
├── .gitignore                 # Git ignore rules
│
├── .vscode/
│   └── settings.json          # VS Code workspace settings
│
├── css/
│   └── styles.css             # Complete CSS (~1,850 lines)
│
├── js/
│   └── script.js              # All JavaScript functionality
│
├── assets/                    # Ready for your media files
│   ├── images/                # Product images, mockups
│   ├── icons/                 # SVG icons, logos
│   ├── fonts/                 # Custom fonts (using Google Fonts CDN)
│   └── favicons/              # Favicon files
│
└── docs/
    └── project-overview.md    # Technical architecture
```

**Clean & Optimized**: All redundant files removed, production-ready structure.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure, accessibility |
| **CSS3** | Design system, animations, responsive layout |
| **Vanilla JavaScript** | Interactions, scroll effects, observers |
| **Google Fonts** | Typography (Sora, DM Serif Display, JetBrains Mono) |

**No frameworks or build tools required** — Pure web technologies for maximum performance and simplicity.

---

## 🏃 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional but recommended)

### Option 1: Direct Open (Simple)
```bash
# Clone the repository
git clone https://github.com/yourusername/babycue-website.git
cd babycue-website

# Open index.html in your browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000

# Then visit: http://localhost:8000
```

---

## 🌐 Deployment

### Deploy to GitHub Pages
```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Enable GitHub Pages
# Go to: Settings → Pages → Source: main branch → Save
# Your site will be live at: https://yourusername.github.io/babycue-website/
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, done!
```

### Deploy to Netlify
```bash
# Drag and drop the entire folder to: https://app.netlify.com/drop
# Or use Netlify CLI:
npm i -g netlify-cli
netlify deploy --prod
```

### Deploy to AWS S3 + CloudFront
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed AWS instructions.

---

## 🎨 Design System

### Color Palette (Premium Purple + White Healthcare)
```css
--primary: #6C4DFF        /* Premium Purple */
--primary-light: #8B5CF6  /* Soft Purple */
--accent: #A78BFA         /* Light Purple */
--bg: #FFFFFF             /* Pure White */
--bg-soft: #F7F9FF        /* Soft Medical Tint */
--border: #EEF1F6         /* Clean Medical Border */
```

### Typography
- **Display**: DM Serif Display (Headlines)
- **Body**: Sora (Content)
- **Mono**: JetBrains Mono (Code, data)

### Spacing Scale
```css
--s1: 4px   --s2: 8px   --s3: 12px  --s4: 16px
--s5: 20px  --s6: 24px  --s8: 32px  --s10: 40px
--s12: 48px --s16: 64px --s20: 80px --s24: 96px
```

---

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Mobile Safari | iOS 14+ | ✅ Fully Supported |
| Chrome Mobile | Latest | ✅ Fully Supported |

---

## 🧩 Key Components

### Sections
1. **Hero** — Animated gradient orbs, stats, visual mockup
2. **About** — Mission statement, credentials
3. **DiaCue Product** — Diagnostic kit showcase with steps
4. **GI-BUD AI** — App features with phone mockup
5. **Technology** — Three-pillar tech stack
6. **Impact & Data** — Charts, statistics, visualizations
7. **Research** — Awards, publications, validation
8. **Dashboard Preview** — Clinic intelligence UI mockup
9. **CTA Section** — Partnership opportunities
10. **Footer** — Links, contact, social

### Interactive Elements
- Scroll-triggered animations (Intersection Observer)
- Animated counters
- Chatbot toggle
- Smooth scroll navigation
- Responsive navigation bar
- Award ticker animation

---

## 📄 Documentation

- **[Project Overview](docs/project-overview.md)** — Technical architecture
- **[DEPLOYMENT.md](DEPLOYMENT.md)** — Deployment guides for various platforms

---

## 🤝 Contributing

This is a production website for BabyCue. For inquiries about partnerships, clinical trials, or investment opportunities:

- **Email**: info@babycue.in
- **Phone**: +91 8637221566
- **Location**: Bhubaneswar, Odisha, India

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Recognition

- 🏆 **iPreneur TISS** — 1st Prize Social Venture
- 🧬 **Pfizer INDovation** — Top Innovator Award
- 🔬 **C-CAMP / CARB-X** — AMR Quest Winner
- 🌟 **Startup India** — DIPP Recognized
- 🤝 **WHO AMR** — Aligned Initiative

---

## 👥 Team

**BabyCue Pvt. Ltd.**  
Improving child health globally through AI-powered diagnostics.

---

## 📊 Project Stats

- **Total Files**: 12 (optimized & production-ready)
- **Lines of CSS**: ~1,850
- **Lines of JS**: ~65
- **CSS Variables**: 50+
- **Animations**: 15+
- **Sections**: 10
- **Load Time**: <2s
- **Size**: Lightweight & optimized

---

**Made with ❤️ for children's health in India**

© 2025 BabyCue Pvt. Ltd. All rights reserved.
