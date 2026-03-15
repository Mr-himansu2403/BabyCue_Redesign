// ============================================================
// ACCESSIBILITY AND KEYBOARD NAVIGATION SYSTEM
// ============================================================

// Keyboard navigation and accessibility manager
class AccessibilityManager {
  constructor() {
    this.focusableElements = [];
    this.currentFocusIndex = -1;
    this.skipLinks = [];
    this.keyboardShortcuts = new Map();
    this.announcements = [];
    
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupSkipLinks();
    this.setupKeyboardShortcuts();
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
    this.setupTouchTargets();
  }

  setupKeyboardNavigation() {
    // Global keyboard event handler
    document.addEventListener('keydown', (event) => {
      this.handleKeyboardNavigation(event);
    });

    // Tab key navigation enhancement
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        this.handleTabNavigation(event);
      }
    });

    // Arrow key navigation for specific components
    document.addEventListener('keydown', (event) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        this.handleArrowNavigation(event);
      }
    });

    // Enter and Space key activation
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        this.handleActivationKeys(event);
      }
    });

    // Escape key handling
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.handleEscapeKey(event);
      }
    });
  }

  setupSkipLinks() {
    // Create skip navigation links
    const skipNav = document.createElement('nav');
    skipNav.className = 'skip-navigation';
    skipNav.setAttribute('aria-label', 'Skip navigation');
    
    const skipLinks = [
      { href: '#main-content', text: 'Skip to main content' },
      { href: '#mainNav', text: 'Skip to navigation' },
      { href: '#footer', text: 'Skip to footer' }
    ];

    skipLinks.forEach(link => {
      const skipLink = document.createElement('a');
      skipLink.href = link.href;
      skipLink.textContent = link.text;
      skipLink.className = 'skip-link';
      skipNav.appendChild(skipLink);
    });

    // Insert skip links at the beginning of the body
    document.body.insertBefore(skipNav, document.body.firstChild);
  }

  setupKeyboardShortcuts() {
    // Define keyboard shortcuts
    this.keyboardShortcuts.set('Alt+1', () => this.focusElement('#mainNav'));
    this.keyboardShortcuts.set('Alt+2', () => this.focusElement('#main-content'));
    this.keyboardShortcuts.set('Alt+3', () => this.focusElement('#footer'));
    this.keyboardShortcuts.set('Alt+h', () => this.focusElement('#home'));
    this.keyboardShortcuts.set('Alt+m', () => this.toggleMobileMenu());
    this.keyboardShortcuts.set('Alt+s', () => this.focusElement('#search'));
    this.keyboardShortcuts.set('/', () => this.focusElement('#search'));

    // Listen for keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      const shortcut = this.getKeyboardShortcut(event);
      if (this.keyboardShortcuts.has(shortcut)) {
        event.preventDefault();
        this.keyboardShortcuts.get(shortcut)();
      }
    });
  }

  setupFocusManagement() {
    // Enhanced focus indicators
    document.addEventListener('focusin', (event) => {
      this.handleFocusIn(event);
    });

    document.addEventListener('focusout', (event) => {
      this.handleFocusOut(event);
    });

    // Focus trap for modals and mobile menus
    this.setupFocusTraps();
  }

  setupScreenReaderSupport() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    // Announce page changes
    this.announcePageChanges();
  }

  setupTouchTargets() {
    // Ensure minimum touch target sizes
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
    
    interactiveElements.forEach(element => {
      this.ensureMinimumTouchTarget(element);
    });
  }

  handleKeyboardNavigation(event) {
    // Handle specific navigation patterns
    const activeElement = document.activeElement;
    
    // Navigation menu keyboard handling
    if (activeElement && activeElement.closest('.nav-links')) {
      this.handleNavMenuKeyboard(event);
    }
    
    // Dropdown menu keyboard handling
    if (activeElement && activeElement.closest('.nav-dropdown')) {
      this.handleDropdownKeyboard(event);
    }
    
    // Card navigation
    if (activeElement && activeElement.closest('.card, .team-card')) {
      this.handleCardKeyboard(event);
    }
  }

  handleTabNavigation(event) {
    // Update focusable elements list
    this.updateFocusableElements();
    
    // Handle tab navigation in specific contexts
    const activeElement = document.activeElement;
    
    if (activeElement && activeElement.closest('.nav-links.active')) {
      // Tab navigation within mobile menu
      this.handleMobileMenuTabbing(event);
    }
  }

  handleArrowNavigation(event) {
    const activeElement = document.activeElement;
    
    // Arrow navigation in navigation menu
    if (activeElement && activeElement.closest('.nav-links')) {
      event.preventDefault();
      this.navigateMenu(event.key);
    }
    
    // Arrow navigation in grid layouts
    if (activeElement && activeElement.closest('.grid-2, .grid-3, .grid-4, .team-grid')) {
      event.preventDefault();
      this.navigateGrid(event.key);
    }
  }

  handleActivationKeys(event) {
    const activeElement = document.activeElement;
    
    // Handle activation for custom interactive elements
    if (activeElement && activeElement.hasAttribute('role')) {
      const role = activeElement.getAttribute('role');
      
      if (['button', 'tab', 'menuitem'].includes(role)) {
        event.preventDefault();
        activeElement.click();
      }
    }
    
    // Handle dropdown toggles
    if (activeElement && activeElement.classList.contains('nav-dropdown-toggle')) {
      event.preventDefault();
      this.toggleDropdown(activeElement.closest('.nav-dropdown'));
    }
  }

  handleEscapeKey(event) {
    // Close mobile menu
    if (document.body.classList.contains('nav-open')) {
      event.preventDefault();
      if (window.mobileNavigation) {
        window.mobileNavigation.close();
      }
      this.focusElement('#navHamburger');
    }
    
    // Close dropdowns
    const activeDropdowns = document.querySelectorAll('.nav-dropdown.active');
    if (activeDropdowns.length > 0) {
      event.preventDefault();
      activeDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
    
    // Close modals or overlays
    const activeModals = document.querySelectorAll('.modal.active, .overlay.active');
    if (activeModals.length > 0) {
      event.preventDefault();
      activeModals.forEach(modal => {
        modal.classList.remove('active');
      });
    }
  }

  handleNavMenuKeyboard(event) {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentIndex = Array.from(navLinks).indexOf(document.activeElement);
    
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % navLinks.length;
        navLinks[nextIndex].focus();
        break;
        
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
        navLinks[prevIndex].focus();
        break;
        
      case 'Home':
        event.preventDefault();
        navLinks[0].focus();
        break;
        
      case 'End':
        event.preventDefault();
        navLinks[navLinks.length - 1].focus();
        break;
    }
  }

  handleDropdownKeyboard(event) {
    const dropdown = document.activeElement.closest('.nav-dropdown');
    const menuItems = dropdown.querySelectorAll('.nav-dropdown-item');
    const currentIndex = Array.from(menuItems).indexOf(document.activeElement);
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < menuItems.length - 1) {
          menuItems[currentIndex + 1].focus();
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          menuItems[currentIndex - 1].focus();
        } else {
          dropdown.querySelector('.nav-dropdown-toggle').focus();
        }
        break;
    }
  }

  handleCardKeyboard(event) {
    const cards = document.querySelectorAll('.card, .team-card');
    const currentCard = document.activeElement.closest('.card, .team-card');
    const currentIndex = Array.from(cards).indexOf(currentCard);
    
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < cards.length - 1) {
          this.focusCard(cards[currentIndex + 1]);
        }
        break;
        
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          this.focusCard(cards[currentIndex - 1]);
        }
        break;
    }
  }

  focusCard(card) {
    const focusableElement = card.querySelector('a, button, [tabindex="0"]') || card;
    if (focusableElement.tabIndex === -1) {
      focusableElement.tabIndex = 0;
    }
    focusableElement.focus();
  }

  navigateMenu(direction) {
    const menuItems = document.querySelectorAll('.nav-link');
    const currentIndex = Array.from(menuItems).indexOf(document.activeElement);
    let nextIndex;
    
    switch (direction) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % menuItems.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        break;
    }
    
    if (nextIndex !== undefined) {
      menuItems[nextIndex].focus();
    }
  }

  navigateGrid(direction) {
    const grid = document.activeElement.closest('.grid-2, .grid-3, .grid-4, .team-grid');
    const items = grid.querySelectorAll('[tabindex], a, button');
    const currentIndex = Array.from(items).indexOf(document.activeElement);
    
    // Determine grid columns
    const computedStyle = window.getComputedStyle(grid);
    const columns = computedStyle.gridTemplateColumns.split(' ').length;
    
    let nextIndex;
    
    switch (direction) {
      case 'ArrowRight':
        nextIndex = currentIndex + 1;
        break;
      case 'ArrowLeft':
        nextIndex = currentIndex - 1;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + columns;
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - columns;
        break;
    }
    
    if (nextIndex >= 0 && nextIndex < items.length) {
      items[nextIndex].focus();
    }
  }

  toggleDropdown(dropdown) {
    const isActive = dropdown.classList.contains('active');
    
    // Close all other dropdowns
    document.querySelectorAll('.nav-dropdown.active').forEach(d => {
      if (d !== dropdown) d.classList.remove('active');
    });
    
    // Toggle current dropdown
    dropdown.classList.toggle('active', !isActive);
    
    // Focus management
    if (!isActive) {
      const firstMenuItem = dropdown.querySelector('.nav-dropdown-item');
      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    }
  }

  toggleMobileMenu() {
    if (window.mobileNavigation) {
      window.mobileNavigation.toggle();
    }
  }

  focusElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  updateFocusableElements() {
    this.focusableElements = Array.from(document.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }

  setupFocusTraps() {
    // Focus trap for mobile navigation
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab' && document.body.classList.contains('nav-open')) {
        this.trapFocusInMobileMenu(event);
      }
    });
  }

  trapFocusInMobileMenu(event) {
    const mobileMenu = document.getElementById('navLinks');
    if (!mobileMenu) return;
    
    const focusableElements = mobileMenu.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  handleFocusIn(event) {
    // Add focus indicator class
    event.target.classList.add('keyboard-focused');
    
    // Announce focus changes to screen readers
    this.announceFocusChange(event.target);
  }

  handleFocusOut(event) {
    // Remove focus indicator class
    event.target.classList.remove('keyboard-focused');
  }

  announceFocusChange(element) {
    // Announce important focus changes
    if (element.matches('h1, h2, h3, h4, h5, h6')) {
      this.announce(`Heading: ${element.textContent}`);
    } else if (element.matches('[role="button"], button')) {
      this.announce(`Button: ${element.textContent || element.getAttribute('aria-label')}`);
    } else if (element.matches('a[href]')) {
      this.announce(`Link: ${element.textContent || element.getAttribute('aria-label')}`);
    }
  }

  announcePageChanges() {
    // Announce when sections come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          const heading = section.querySelector('h1, h2, h3');
          if (heading) {
            this.announce(`Entered section: ${heading.textContent}`);
          }
        }
      });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
  }

  ensureMinimumTouchTarget(element) {
    const rect = element.getBoundingClientRect();
    const minSize = 44; // 44px minimum touch target
    
    if (rect.width < minSize || rect.height < minSize) {
      element.style.minWidth = `${minSize}px`;
      element.style.minHeight = `${minSize}px`;
      element.classList.add('enhanced-touch-target');
    }
  }

  announce(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  getKeyboardShortcut(event) {
    const parts = [];
    
    if (event.ctrlKey) parts.push('Ctrl');
    if (event.altKey) parts.push('Alt');
    if (event.shiftKey) parts.push('Shift');
    if (event.metaKey) parts.push('Meta');
    
    if (event.key && !['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) {
      parts.push(event.key);
    }
    
    return parts.join('+');
  }

  // Public API
  addKeyboardShortcut(shortcut, callback) {
    this.keyboardShortcuts.set(shortcut, callback);
  }

  removeKeyboardShortcut(shortcut) {
    this.keyboardShortcuts.delete(shortcut);
  }

  getAccessibilityInfo() {
    return {
      focusableElements: this.focusableElements.length,
      keyboardShortcuts: Array.from(this.keyboardShortcuts.keys()),
      currentFocus: document.activeElement.tagName
    };
  }
}

// Initialize accessibility manager
const accessibilityManager = new AccessibilityManager();

// Make it globally available
window.accessibilityManager = accessibilityManager;

// ============================================================
// CROSS-BROWSER COMPATIBILITY AND FEATURE DETECTION
// ============================================================

// Browser feature detection and compatibility manager
class BrowserCompatibilityManager {
  constructor() {
    this.features = {};
    this.browser = {};
    this.polyfills = [];
    
    this.init();
  }

  init() {
    this.detectBrowser();
    this.detectFeatures();
    this.addCompatibilityClasses();
    this.loadPolyfills();
    this.setupFallbacks();
  }

  detectBrowser() {
    const userAgent = navigator.userAgent;
    
    // Detect browser type and version
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      this.browser.name = 'chrome';
      this.browser.version = this.extractVersion(userAgent, /Chrome\/(\d+)/);
    } else if (userAgent.includes('Firefox')) {
      this.browser.name = 'firefox';
      this.browser.version = this.extractVersion(userAgent, /Firefox\/(\d+)/);
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      this.browser.name = 'safari';
      this.browser.version = this.extractVersion(userAgent, /Version\/(\d+)/);
    } else if (userAgent.includes('Edg')) {
      this.browser.name = 'edge';
      this.browser.version = this.extractVersion(userAgent, /Edg\/(\d+)/);
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
      this.browser.name = 'ie';
      this.browser.version = this.extractVersion(userAgent, /(?:MSIE |rv:)(\d+)/);
    } else {
      this.browser.name = 'unknown';
      this.browser.version = 0;
    }

    // Detect mobile browsers
    this.browser.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Detect engine
    if (userAgent.includes('WebKit')) {
      this.browser.engine = 'webkit';
    } else if (userAgent.includes('Gecko')) {
      this.browser.engine = 'gecko';
    } else if (userAgent.includes('Trident')) {
      this.browser.engine = 'trident';
    }
  }

  extractVersion(userAgent, regex) {
    const match = userAgent.match(regex);
    return match ? parseInt(match[1]) : 0;
  }

  detectFeatures() {
    // CSS Features
    this.features.cssGrid = CSS.supports('display', 'grid');
    this.features.cssFlexbox = CSS.supports('display', 'flex');
    this.features.cssCustomProperties = CSS.supports('--test', 'value');
    this.features.cssBackdropFilter = CSS.supports('backdrop-filter', 'blur(10px)') || 
                                     CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
    this.features.cssAspectRatio = CSS.supports('aspect-ratio', '16/9');
    this.features.cssClamp = CSS.supports('width', 'clamp(1rem, 2vw, 3rem)');
    this.features.cssLogicalProperties = CSS.supports('margin-inline-start', '1rem');

    // JavaScript Features
    this.features.intersectionObserver = 'IntersectionObserver' in window;
    this.features.resizeObserver = 'ResizeObserver' in window;
    this.features.mutationObserver = 'MutationObserver' in window;
    this.features.fetch = 'fetch' in window;
    this.features.promises = 'Promise' in window;
    this.features.asyncAwait = this.testAsyncAwait();
    this.features.es6Modules = 'noModule' in HTMLScriptElement.prototype;
    this.features.webComponents = 'customElements' in window;
    this.features.serviceWorker = 'serviceWorker' in navigator;

    // Web APIs
    this.features.localStorage = this.testLocalStorage();
    this.features.sessionStorage = this.testSessionStorage();
    this.features.geolocation = 'geolocation' in navigator;
    this.features.notifications = 'Notification' in window;
    this.features.webGL = this.testWebGL();
    this.features.webRTC = 'RTCPeerConnection' in window;

    // Media Features
    this.features.webP = this.testWebPSupport();
    this.features.avif = this.testAVIFSupport();
    this.features.webM = this.testWebMSupport();

    // Input Features
    this.features.touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.features.pointer = 'PointerEvent' in window;
    this.features.deviceMotion = 'DeviceMotionEvent' in window;

    // Performance Features
    this.features.performanceObserver = 'PerformanceObserver' in window;
    this.features.performanceNavigation = 'performance' in window && 'navigation' in performance;
    this.features.requestIdleCallback = 'requestIdleCallback' in window;
  }

  testAsyncAwait() {
    try {
      eval('(async function() {})');
      return true;
    } catch (e) {
      return false;
    }
  }

  testLocalStorage() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  testSessionStorage() {
    try {
      const test = 'test';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  testWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  testWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => resolve(webP.height === 2);
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  testAVIFSupport() {
    return new Promise((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => resolve(avif.height === 2);
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  }

  testWebMSupport() {
    const video = document.createElement('video');
    return video.canPlayType('video/webm; codecs="vp8, vorbis"') !== '';
  }

  addCompatibilityClasses() {
    const html = document.documentElement;
    
    // Add browser classes
    html.classList.add(`browser-${this.browser.name}`);
    html.classList.add(`browser-version-${this.browser.version}`);
    
    if (this.browser.engine) {
      html.classList.add(`engine-${this.browser.engine}`);
    }
    
    if (this.browser.isMobile) {
      html.classList.add('mobile-browser');
    }

    // Add feature classes
    Object.keys(this.features).forEach(feature => {
      const className = this.features[feature] ? `has-${feature}` : `no-${feature}`;
      html.classList.add(className);
    });

    // Add legacy browser class for older browsers
    if (this.isLegacyBrowser()) {
      html.classList.add('legacy-browser');
    }
  }

  isLegacyBrowser() {
    return (
      (this.browser.name === 'ie' && this.browser.version < 11) ||
      (this.browser.name === 'chrome' && this.browser.version < 60) ||
      (this.browser.name === 'firefox' && this.browser.version < 55) ||
      (this.browser.name === 'safari' && this.browser.version < 12) ||
      (this.browser.name === 'edge' && this.browser.version < 79)
    );
  }

  loadPolyfills() {
    const polyfillsNeeded = [];

    // Intersection Observer polyfill
    if (!this.features.intersectionObserver) {
      polyfillsNeeded.push(this.loadIntersectionObserverPolyfill());
    }

    // Fetch polyfill
    if (!this.features.fetch) {
      polyfillsNeeded.push(this.loadFetchPolyfill());
    }

    // Promise polyfill
    if (!this.features.promises) {
      polyfillsNeeded.push(this.loadPromisePolyfill());
    }

    // CSS Custom Properties polyfill
    if (!this.features.cssCustomProperties) {
      polyfillsNeeded.push(this.loadCSSCustomPropertiesPolyfill());
    }

    // ResizeObserver polyfill
    if (!this.features.resizeObserver) {
      polyfillsNeeded.push(this.loadResizeObserverPolyfill());
    }

    return Promise.all(polyfillsNeeded);
  }

  loadIntersectionObserverPolyfill() {
    return new Promise((resolve) => {
      if ('IntersectionObserver' in window) {
        resolve();
        return;
      }

      // Simple polyfill for basic functionality
      window.IntersectionObserver = class IntersectionObserver {
        constructor(callback, options = {}) {
          this.callback = callback;
          this.options = options;
          this.elements = new Set();
          this.setupPolling();
        }

        observe(element) {
          this.elements.add(element);
        }

        unobserve(element) {
          this.elements.delete(element);
        }

        disconnect() {
          this.elements.clear();
          if (this.pollInterval) {
            clearInterval(this.pollInterval);
          }
        }

        setupPolling() {
          this.pollInterval = setInterval(() => {
            const entries = [];
            this.elements.forEach(element => {
              const rect = element.getBoundingClientRect();
              const isIntersecting = rect.top < window.innerHeight && rect.bottom > 0;
              entries.push({
                target: element,
                isIntersecting,
                boundingClientRect: rect,
                intersectionRatio: isIntersecting ? 1 : 0
              });
            });
            
            if (entries.length > 0) {
              this.callback(entries, this);
            }
          }, 100);
        }
      };

      resolve();
    });
  }

  loadFetchPolyfill() {
    return new Promise((resolve) => {
      if ('fetch' in window) {
        resolve();
        return;
      }

      // Simple fetch polyfill using XMLHttpRequest
      window.fetch = function(url, options = {}) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(options.method || 'GET', url);
          
          if (options.headers) {
            Object.keys(options.headers).forEach(key => {
              xhr.setRequestHeader(key, options.headers[key]);
            });
          }

          xhr.onload = () => {
            resolve({
              ok: xhr.status >= 200 && xhr.status < 300,
              status: xhr.status,
              statusText: xhr.statusText,
              text: () => Promise.resolve(xhr.responseText),
              json: () => Promise.resolve(JSON.parse(xhr.responseText))
            });
          };

          xhr.onerror = () => reject(new Error('Network error'));
          xhr.send(options.body);
        });
      };

      resolve();
    });
  }

  loadPromisePolyfill() {
    return new Promise((resolve) => {
      if ('Promise' in window) {
        resolve();
        return;
      }

      // Simple Promise polyfill
      window.Promise = class Promise {
        constructor(executor) {
          this.state = 'pending';
          this.value = undefined;
          this.handlers = [];

          const resolve = (value) => {
            if (this.state === 'pending') {
              this.state = 'fulfilled';
              this.value = value;
              this.handlers.forEach(handler => handler.onFulfilled(value));
            }
          };

          const reject = (reason) => {
            if (this.state === 'pending') {
              this.state = 'rejected';
              this.value = reason;
              this.handlers.forEach(handler => handler.onRejected(reason));
            }
          };

          try {
            executor(resolve, reject);
          } catch (error) {
            reject(error);
          }
        }

        then(onFulfilled, onRejected) {
          return new Promise((resolve, reject) => {
            const handler = {
              onFulfilled: (value) => {
                try {
                  const result = onFulfilled ? onFulfilled(value) : value;
                  resolve(result);
                } catch (error) {
                  reject(error);
                }
              },
              onRejected: (reason) => {
                try {
                  const result = onRejected ? onRejected(reason) : reason;
                  reject(result);
                } catch (error) {
                  reject(error);
                }
              }
            };

            if (this.state === 'fulfilled') {
              handler.onFulfilled(this.value);
            } else if (this.state === 'rejected') {
              handler.onRejected(this.value);
            } else {
              this.handlers.push(handler);
            }
          });
        }

        catch(onRejected) {
          return this.then(null, onRejected);
        }

        static resolve(value) {
          return new Promise(resolve => resolve(value));
        }

        static reject(reason) {
          return new Promise((resolve, reject) => reject(reason));
        }
      };

      resolve();
    });
  }

  loadCSSCustomPropertiesPolyfill() {
    return new Promise((resolve) => {
      if (CSS.supports('--test', 'value')) {
        resolve();
        return;
      }

      // Add fallback CSS for browsers without custom properties
      const fallbackCSS = `
        .legacy-browser {
          --violet-600: #6C4DFF;
          --violet-500: #8B5CF6;
          --violet-400: #A78BFA;
          --ink-800: #2A3142;
          --ink-700: #3A4556;
          --ink-400: #6B7685;
        }
        
        .legacy-browser .btn-primary {
          background: #6C4DFF !important;
        }
        
        .legacy-browser .text-gradient-purple,
        .legacy-browser .text-gradient-violet,
        .legacy-browser .text-gradient-mixed {
          color: #6C4DFF !important;
        }
      `;

      const style = document.createElement('style');
      style.textContent = fallbackCSS;
      document.head.appendChild(style);

      resolve();
    });
  }

  loadResizeObserverPolyfill() {
    return new Promise((resolve) => {
      if ('ResizeObserver' in window) {
        resolve();
        return;
      }

      // Simple ResizeObserver polyfill
      window.ResizeObserver = class ResizeObserver {
        constructor(callback) {
          this.callback = callback;
          this.elements = new Map();
          this.setupPolling();
        }

        observe(element) {
          const rect = element.getBoundingClientRect();
          this.elements.set(element, {
            width: rect.width,
            height: rect.height
          });
        }

        unobserve(element) {
          this.elements.delete(element);
        }

        disconnect() {
          this.elements.clear();
          if (this.pollInterval) {
            clearInterval(this.pollInterval);
          }
        }

        setupPolling() {
          this.pollInterval = setInterval(() => {
            const entries = [];
            this.elements.forEach((lastSize, element) => {
              const rect = element.getBoundingClientRect();
              if (rect.width !== lastSize.width || rect.height !== lastSize.height) {
                this.elements.set(element, {
                  width: rect.width,
                  height: rect.height
                });
                
                entries.push({
                  target: element,
                  contentRect: rect
                });
              }
            });
            
            if (entries.length > 0) {
              this.callback(entries, this);
            }
          }, 100);
        }
      };

      resolve();
    });
  }

  setupFallbacks() {
    // CSS Grid fallback
    if (!this.features.cssGrid) {
      this.addGridFallback();
    }

    // Flexbox fallback
    if (!this.features.cssFlexbox) {
      this.addFlexboxFallback();
    }

    // Backdrop filter fallback
    if (!this.features.cssBackdropFilter) {
      this.addBackdropFilterFallback();
    }

    // Aspect ratio fallback
    if (!this.features.cssAspectRatio) {
      this.addAspectRatioFallback();
    }

    // Touch event fallbacks
    if (!this.features.touch && this.browser.isMobile) {
      this.addTouchFallbacks();
    }
  }

  addGridFallback() {
    const fallbackCSS = `
      .no-cssgrid .grid-2 {
        display: block;
      }
      
      .no-cssgrid .grid-2 > * {
        display: inline-block;
        width: 48%;
        vertical-align: top;
        margin-right: 2%;
      }
      
      .no-cssgrid .grid-3 > * {
        display: inline-block;
        width: 32%;
        vertical-align: top;
        margin-right: 1%;
      }
      
      .no-cssgrid .grid-4 > * {
        display: inline-block;
        width: 24%;
        vertical-align: top;
        margin-right: 1%;
      }
    `;

    this.addFallbackCSS(fallbackCSS);
  }

  addFlexboxFallback() {
    const fallbackCSS = `
      .no-cssflexbox .flex {
        display: block;
      }
      
      .no-cssflexbox .flex-center {
        text-align: center;
      }
      
      .no-cssflexbox .flex-between > * {
        display: inline-block;
        width: 48%;
      }
      
      .no-cssflexbox .nav-links {
        display: block;
      }
      
      .no-cssflexbox .nav-links li {
        display: inline-block;
        margin-right: 20px;
      }
    `;

    this.addFallbackCSS(fallbackCSS);
  }

  addBackdropFilterFallback() {
    const fallbackCSS = `
      .no-cssbackdropfilter .nav.scrolled {
        background: rgba(255, 255, 255, 0.95) !important;
      }
      
      .no-cssbackdropfilter .nav-links {
        background: rgba(255, 255, 255, 0.95) !important;
      }
      
      .no-cssbackdropfilter .card-glass {
        background: rgba(255, 255, 255, 0.95) !important;
      }
    `;

    this.addFallbackCSS(fallbackCSS);
  }

  addAspectRatioFallback() {
    // Add padding-top hack for aspect ratios
    const elements = document.querySelectorAll('.aspect-ratio-16-9, .aspect-ratio-4-3, .aspect-ratio-1-1');
    
    elements.forEach(element => {
      if (!CSS.supports('aspect-ratio', '1')) {
        const classList = element.classList;
        let paddingTop = '100%'; // Default 1:1
        
        if (classList.contains('aspect-ratio-16-9')) {
          paddingTop = '56.25%'; // 9/16 * 100%
        } else if (classList.contains('aspect-ratio-4-3')) {
          paddingTop = '75%'; // 3/4 * 100%
        }
        
        element.style.position = 'relative';
        element.style.paddingTop = paddingTop;
        
        const content = element.children[0];
        if (content) {
          content.style.position = 'absolute';
          content.style.top = '0';
          content.style.left = '0';
          content.style.width = '100%';
          content.style.height = '100%';
        }
      }
    });
  }

  addTouchFallbacks() {
    // Add click handlers for touch devices without proper touch support
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.nav-dropdown-toggle');
      if (target && this.browser.isMobile) {
        e.preventDefault();
        const dropdown = target.closest('.nav-dropdown');
        dropdown.classList.toggle('active');
      }
    });
  }

  addFallbackCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Public API
  getBrowserInfo() {
    return { ...this.browser };
  }

  getFeatures() {
    return { ...this.features };
  }

  hasFeature(feature) {
    return this.features[feature] || false;
  }

  addCustomPolyfill(name, polyfillFunction) {
    this.polyfills.push({ name, polyfill: polyfillFunction });
    return polyfillFunction();
  }
}

// Initialize browser compatibility manager
const browserCompatibilityManager = new BrowserCompatibilityManager();

// Make it globally available
window.browserCompatibilityManager = browserCompatibilityManager;

// ============================================================
// ACCESSIBILITY PREFERENCES DETECTION AND ADAPTATION
// ============================================================

// Accessibility preferences manager
class AccessibilityPreferencesManager {
  constructor() {
    this.preferences = {
      reducedMotion: false,
      highContrast: false,
      reducedTransparency: false,
      reducedData: false,
      darkMode: false,
      largeFonts: false,
      forcedColors: false
    };
    
    this.init();
  }

  init() {
    this.detectPreferences();
    this.applyPreferences();
    this.setupPreferenceListeners();
    this.addPreferenceControls();
  }

  detectPreferences() {
    // Detect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.preferences.reducedMotion = true;
    }

    // Detect high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.preferences.highContrast = true;
    }

    // Detect reduced transparency preference
    if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) {
      this.preferences.reducedTransparency = true;
    }

    // Detect reduced data preference
    if (window.matchMedia('(prefers-reduced-data: reduce)').matches) {
      this.preferences.reducedData = true;
    }

    // Detect dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.preferences.darkMode = true;
    }

    // Detect forced colors mode (Windows High Contrast)
    if (window.matchMedia('(forced-colors: active)').matches) {
      this.preferences.forcedColors = true;
    }

    // Detect large font preference (custom detection)
    const testElement = document.createElement('div');
    testElement.style.fontSize = '1rem';
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    document.body.appendChild(testElement);
    
    const computedSize = window.getComputedStyle(testElement).fontSize;
    if (parseFloat(computedSize) > 16) {
      this.preferences.largeFonts = true;
    }
    
    document.body.removeChild(testElement);
  }

  applyPreferences() {
    const html = document.documentElement;
    const body = document.body;

    // Apply reduced motion
    if (this.preferences.reducedMotion) {
      html.classList.add('reduced-motion');
      this.disableAnimations();
    }

    // Apply high contrast
    if (this.preferences.highContrast) {
      html.classList.add('high-contrast');
      this.enhanceContrast();
    }

    // Apply reduced transparency
    if (this.preferences.reducedTransparency) {
      html.classList.add('reduced-transparency');
      this.reduceTransparency();
    }

    // Apply reduced data
    if (this.preferences.reducedData) {
      html.classList.add('reduced-data');
      this.optimizeForLowData();
    }

    // Apply dark mode (if not overridden)
    if (this.preferences.darkMode && !body.classList.contains('light-mode-forced')) {
      html.classList.add('dark-mode');
    }

    // Apply large fonts
    if (this.preferences.largeFonts) {
      html.classList.add('large-fonts');
    }

    // Apply forced colors
    if (this.preferences.forcedColors) {
      html.classList.add('forced-colors');
    }
  }

  setupPreferenceListeners() {
    // Listen for preference changes
    const mediaQueries = [
      { query: '(prefers-reduced-motion: reduce)', preference: 'reducedMotion' },
      { query: '(prefers-contrast: high)', preference: 'highContrast' },
      { query: '(prefers-reduced-transparency: reduce)', preference: 'reducedTransparency' },
      { query: '(prefers-reduced-data: reduce)', preference: 'reducedData' },
      { query: '(prefers-color-scheme: dark)', preference: 'darkMode' },
      { query: '(forced-colors: active)', preference: 'forcedColors' }
    ];

    mediaQueries.forEach(({ query, preference }) => {
      const mediaQuery = window.matchMedia(query);
      
      mediaQuery.addEventListener('change', (e) => {
        this.preferences[preference] = e.matches;
        this.applyPreferences();
        this.announcePreferenceChange(preference, e.matches);
      });
    });
  }

  disableAnimations() {
    // Disable CSS animations
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);

    // Disable JavaScript animations
    if (window.lazyImageLoader) {
      window.lazyImageLoader.disableAnimations = true;
    }

    // Stop ticker animation
    const ticker = document.getElementById('ticker');
    if (ticker) {
      ticker.style.animation = 'none';
    }

    // Loading screen removed - no animations to stop
  }

  enhanceContrast() {
    // Add high contrast styles
    const style = document.createElement('style');
    style.textContent = `
      .high-contrast * {
        text-shadow: none !important;
        box-shadow: none !important;
      }
      
      .high-contrast .btn {
        border: 2px solid currentColor !important;
      }
      
      .high-contrast .card {
        border: 2px solid currentColor !important;
      }
    `;
    document.head.appendChild(style);

    // Enhance focus indicators
    document.addEventListener('focusin', (e) => {
      e.target.style.outline = '3px solid currentColor';
      e.target.style.outlineOffset = '2px';
    });
  }

  reduceTransparency() {
    // Remove backdrop filters and transparency
    const style = document.createElement('style');
    style.textContent = `
      .reduced-transparency * {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      
      .reduced-transparency .nav.scrolled {
        background: #ffffff !important;
      }
      
      .reduced-transparency .nav-links {
        background: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
  }

  optimizeForLowData() {
    // Disable non-essential features
    const nonEssentialElements = document.querySelectorAll(
      '.hero-orb, .floating-stats, .awards-ticker, .loading-spinner'
    );
    
    nonEssentialElements.forEach(element => {
      element.style.display = 'none';
    });

    // Disable lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.loading = 'eager';
    });

    // Loading screen removed - no loader to disable
  }

  addPreferenceControls() {
    // Create accessibility preferences panel
    const panel = document.createElement('div');
    panel.id = 'accessibility-panel';
    panel.className = 'accessibility-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'accessibility-panel-title');
    panel.setAttribute('aria-hidden', 'true');
    
    panel.innerHTML = `
      <div class="accessibility-panel-content">
        <h2 id="accessibility-panel-title">Accessibility Preferences</h2>
        <div class="accessibility-controls">
          <label class="accessibility-control">
            <input type="checkbox" id="reduce-motion" ${this.preferences.reducedMotion ? 'checked' : ''}>
            <span>Reduce motion and animations</span>
          </label>
          
          <label class="accessibility-control">
            <input type="checkbox" id="high-contrast" ${this.preferences.highContrast ? 'checked' : ''}>
            <span>Increase contrast</span>
          </label>
          
          <label class="accessibility-control">
            <input type="checkbox" id="large-fonts">
            <span>Use larger fonts</span>
          </label>
          
          <label class="accessibility-control">
            <input type="checkbox" id="focus-visible-only">
            <span>Show focus only when using keyboard</span>
          </label>
        </div>
        
        <div class="accessibility-panel-actions">
          <button type="button" class="btn btn-primary" id="apply-preferences">Apply</button>
          <button type="button" class="btn btn-outline" id="close-panel">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Add toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'accessibility-toggle';
    toggleButton.className = 'accessibility-toggle';
    toggleButton.setAttribute('aria-label', 'Open accessibility preferences');
    toggleButton.innerHTML = '♿';
    document.body.appendChild(toggleButton);
    
    // Setup event listeners
    this.setupPanelListeners();
  }

  setupPanelListeners() {
    const panel = document.getElementById('accessibility-panel');
    const toggleButton = document.getElementById('accessibility-toggle');
    const closeButton = document.getElementById('close-panel');
    const applyButton = document.getElementById('apply-preferences');
    
    // Toggle panel
    toggleButton.addEventListener('click', () => {
      const isHidden = panel.getAttribute('aria-hidden') === 'true';
      panel.setAttribute('aria-hidden', !isHidden);
      panel.classList.toggle('visible', isHidden);
      
      if (isHidden) {
        panel.querySelector('input').focus();
      }
    });
    
    // Close panel
    closeButton.addEventListener('click', () => {
      panel.setAttribute('aria-hidden', 'true');
      panel.classList.remove('visible');
      toggleButton.focus();
    });
    
    // Apply preferences
    applyButton.addEventListener('click', () => {
      this.applyUserPreferences();
      this.announcePreferenceChange('custom', true);
    });
    
    // Escape key to close
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeButton.click();
      }
    });
  }

  applyUserPreferences() {
    const html = document.documentElement;
    
    // Reduce motion
    const reduceMotion = document.getElementById('reduce-motion').checked;
    html.classList.toggle('reduced-motion', reduceMotion);
    if (reduceMotion) this.disableAnimations();
    
    // High contrast
    const highContrast = document.getElementById('high-contrast').checked;
    html.classList.toggle('high-contrast', highContrast);
    if (highContrast) this.enhanceContrast();
    
    // Large fonts
    const largeFonts = document.getElementById('large-fonts').checked;
    html.classList.toggle('large-fonts', largeFonts);
    
    // Focus visible only
    const focusVisibleOnly = document.getElementById('focus-visible-only').checked;
    html.classList.toggle('focus-visible-only', focusVisibleOnly);
    
    // Save preferences
    this.savePreferences();
  }

  savePreferences() {
    const userPreferences = {
      reduceMotion: document.getElementById('reduce-motion').checked,
      highContrast: document.getElementById('high-contrast').checked,
      largeFonts: document.getElementById('large-fonts').checked,
      focusVisibleOnly: document.getElementById('focus-visible-only').checked
    };
    
    localStorage.setItem('accessibility-preferences', JSON.stringify(userPreferences));
  }

  loadSavedPreferences() {
    const saved = localStorage.getItem('accessibility-preferences');
    if (saved) {
      const preferences = JSON.parse(saved);
      
      Object.keys(preferences).forEach(key => {
        const checkbox = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
        if (checkbox) {
          checkbox.checked = preferences[key];
        }
      });
      
      this.applyUserPreferences();
    }
  }

  announcePreferenceChange(preference, enabled) {
    const messages = {
      reducedMotion: enabled ? 'Animations disabled' : 'Animations enabled',
      highContrast: enabled ? 'High contrast mode enabled' : 'High contrast mode disabled',
      reducedTransparency: enabled ? 'Transparency reduced' : 'Transparency restored',
      reducedData: enabled ? 'Data usage optimized' : 'Full features enabled',
      darkMode: enabled ? 'Dark mode enabled' : 'Light mode enabled',
      custom: 'Accessibility preferences updated'
    };
    
    if (window.accessibilityManager) {
      window.accessibilityManager.announce(messages[preference] || 'Preference updated');
    }
  }

  // Public API
  getPreferences() {
    return { ...this.preferences };
  }

  setPreference(preference, value) {
    this.preferences[preference] = value;
    this.applyPreferences();
  }
}

// Initialize accessibility preferences manager
const accessibilityPreferencesManager = new AccessibilityPreferencesManager();

// Make it globally available
window.accessibilityPreferencesManager = accessibilityPreferencesManager;

// Load saved preferences on page load
document.addEventListener('DOMContentLoaded', () => {
  accessibilityPreferencesManager.loadSavedPreferences();
});

// ============================================================
// TOUCH-FRIENDLY INTERACTIONS SYSTEM
// ============================================================

// Touch interaction manager for mobile devices
class TouchInteractionManager {
  constructor() {
    this.touchStartTime = 0;
    this.touchStartPos = { x: 0, y: 0 };
    this.touchThreshold = 10; // pixels
    this.tapTimeout = 300; // milliseconds
    this.swipeThreshold = 50; // pixels
    this.isTouch = false;
    
    this.init();
  }

  init() {
    this.detectTouchCapability();
    this.setupTouchEvents();
    this.enhanceTouchTargets();
    this.setupSwipeGestures();
    this.optimizeHoverEffects();
  }

  detectTouchCapability() {
    // Detect if device supports touch
    this.isTouch = 'ontouchstart' in window || 
                   navigator.maxTouchPoints > 0 || 
                   navigator.msMaxTouchPoints > 0;
    
    if (this.isTouch) {
      document.documentElement.classList.add('touch-device');
    } else {
      document.documentElement.classList.add('no-touch');
    }
  }

  setupTouchEvents() {
    // Enhanced touch event handling for better responsiveness
    document.addEventListener('touchstart', (e) => {
      this.handleTouchStart(e);
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      this.handleTouchEnd(e);
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      this.handleTouchMove(e);
    }, { passive: true });

    // Prevent 300ms click delay on mobile
    document.addEventListener('touchend', (e) => {
      this.preventClickDelay(e);
    });
  }

  handleTouchStart(e) {
    this.touchStartTime = Date.now();
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.touchStartPos = {
        x: touch.clientX,
        y: touch.clientY
      };
    }

    // Add touch feedback
    const target = e.target.closest('.btn, .card, .team-card, .nav-link');
    if (target) {
      target.classList.add('touch-active');
    }
  }

  handleTouchEnd(e) {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - this.touchStartTime;

    // Remove touch feedback
    const activeElements = document.querySelectorAll('.touch-active');
    activeElements.forEach(el => {
      setTimeout(() => {
        el.classList.remove('touch-active');
      }, 150);
    });

    // Handle tap gestures
    if (touchDuration < this.tapTimeout && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const touchEndPos = {
        x: touch.clientX,
        y: touch.clientY
      };

      const distance = Math.sqrt(
        Math.pow(touchEndPos.x - this.touchStartPos.x, 2) +
        Math.pow(touchEndPos.y - this.touchStartPos.y, 2)
      );

      if (distance < this.touchThreshold) {
        this.handleTap(e, touch);
      }
    }
  }

  handleTouchMove(e) {
    // Handle swipe gestures
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const currentPos = {
        x: touch.clientX,
        y: touch.clientY
      };

      const deltaX = currentPos.x - this.touchStartPos.x;
      const deltaY = currentPos.y - this.touchStartPos.y;

      // Detect swipe direction
      if (Math.abs(deltaX) > this.swipeThreshold || Math.abs(deltaY) > this.swipeThreshold) {
        this.handleSwipe(e, deltaX, deltaY);
      }
    }
  }

  handleTap(e, touch) {
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Handle dropdown toggles
    const dropdownToggle = target.closest('.nav-dropdown-toggle');
    if (dropdownToggle) {
      e.preventDefault();
      this.toggleDropdown(dropdownToggle);
      return;
    }

    // Handle mobile menu toggle
    const hamburger = target.closest('.nav-hamburger');
    if (hamburger) {
      e.preventDefault();
      if (window.mobileNavigation) {
        window.mobileNavigation.toggle();
      }
      return;
    }

    // Handle card interactions
    const card = target.closest('.card, .team-card');
    if (card) {
      this.handleCardTap(card, e);
    }
  }

  handleSwipe(e, deltaX, deltaY) {
    const target = e.target;

    // Handle mobile menu swipe
    if (document.body.classList.contains('nav-open')) {
      if (deltaX < -this.swipeThreshold) {
        // Swipe left to close menu
        if (window.mobileNavigation) {
          window.mobileNavigation.close();
        }
      }
    }

    // Handle gallery swipe (if applicable)
    const gallery = target.closest('.achievements-gallery');
    if (gallery) {
      this.handleGallerySwipe(gallery, deltaX);
    }
  }

  toggleDropdown(toggle) {
    const dropdown = toggle.closest('.nav-dropdown');
    const isActive = dropdown.classList.contains('active');
    
    // Close all other dropdowns
    document.querySelectorAll('.nav-dropdown.active').forEach(d => {
      if (d !== dropdown) {
        d.classList.remove('active');
      }
    });
    
    // Toggle current dropdown
    dropdown.classList.toggle('active', !isActive);
    
    // Provide haptic feedback if available
    this.provideTouchFeedback();
  }

  handleCardTap(card, e) {
    // Add ripple effect for touch feedback
    this.createRippleEffect(card, e);
    
    // Handle card-specific interactions
    const link = card.querySelector('a');
    if (link && !e.defaultPrevented) {
      // Delay navigation slightly for visual feedback
      setTimeout(() => {
        link.click();
      }, 100);
    }
  }

  handleGallerySwipe(gallery, deltaX) {
    // Pause auto-scroll on swipe
    const track = gallery.querySelector('.achievements-track');
    if (track) {
      track.style.animationPlayState = 'paused';
      
      // Resume after a delay
      setTimeout(() => {
        track.style.animationPlayState = 'running';
      }, 2000);
    }
  }

  createRippleEffect(element, e) {
    const ripple = document.createElement('div');
    ripple.className = 'touch-ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left - size / 2;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  enhanceTouchTargets() {
    // Ensure minimum touch target sizes (44px x 44px)
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [tabindex]'
    );
    
    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const minSize = 44;
      
      if (rect.width < minSize || rect.height < minSize) {
        element.style.minWidth = minSize + 'px';
        element.style.minHeight = minSize + 'px';
        element.style.display = 'inline-flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
        element.classList.add('enhanced-touch-target');
      }
    });

    // Add touch padding to small elements
    const smallElements = document.querySelectorAll('.nav-link, .btn-sm, .social-icon');
    smallElements.forEach(element => {
      element.style.padding = '12px 16px';
    });
  }

  setupSwipeGestures() {
    // Enable swipe gestures for mobile navigation
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      
      const diffX = startX - currentX;
      const diffY = startY - currentY;
      
      // Horizontal swipe is more significant than vertical
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50) {
          // Swipe left - close mobile menu if open
          if (document.body.classList.contains('nav-open')) {
            if (window.mobileNavigation) {
              window.mobileNavigation.close();
            }
          }
        } else if (diffX < -50) {
          // Swipe right - open mobile menu if closed and near edge
          if (!document.body.classList.contains('nav-open') && startX < 50) {
            if (window.mobileNavigation) {
              window.mobileNavigation.open();
            }
          }
        }
      }
      
      startX = 0;
      startY = 0;
    }, { passive: true });
  }

  optimizeHoverEffects() {
    // Disable hover effects on touch devices to prevent sticky states
    if (this.isTouch) {
      const style = document.createElement('style');
      style.textContent = `
        @media (hover: none) {
          .btn:hover,
          .card:hover,
          .team-card:hover,
          .nav-link:hover {
            transform: none !important;
            box-shadow: inherit !important;
          }
          
          .nav-dropdown:hover .nav-dropdown-menu {
            opacity: 0 !important;
            visibility: hidden !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  preventClickDelay(e) {
    // Prevent 300ms click delay on mobile browsers
    const target = e.target.closest('button, a, [role="button"]');
    if (target && !target.disabled) {
      e.preventDefault();
      
      // Trigger click immediately
      setTimeout(() => {
        target.click();
      }, 0);
    }
  }

  provideTouchFeedback() {
    // Provide haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Short vibration
    }
  }

  // Public API
  addTouchHandler(selector, handler) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.addEventListener('touchend', handler, { passive: true });
    });
  }

  removeTouchHandler(selector, handler) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.removeEventListener('touchend', handler);
    });
  }

  isTouchDevice() {
    return this.isTouch;
  }
}

// Initialize touch interaction manager
const touchInteractionManager = new TouchInteractionManager();

// Make it globally available
window.touchInteractionManager = touchInteractionManager;

// ============================================================
// CONTENT PRESERVATION AND LAYOUT STABILITY SYSTEM
// ============================================================

// Layout preservation manager to ensure content readability across breakpoints
class LayoutPreservationManager {
  constructor() {
    this.breakpoints = {
      mobile: 768,
      tablet: 1200
    };
    this.preservedElements = new Map();
    this.layoutShiftObserver = null;
    this.contentOverflowObserver = null;
    
    this.init();
  }

  init() {
    this.setupLayoutObservers();
    this.preserveNavigationItems();
    this.preventTextOverflow();
    this.maintainImageAspectRatios();
    this.setupResponsiveTextScaling();
    this.preventLayoutShifts();
    this.setupViewportChangeHandling();
  }

  setupLayoutObservers() {
    // Observe layout shifts to prevent content jumping
    if ('LayoutShift' in window) {
      this.layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.value > 0.1) { // Significant layout shift
            this.handleLayoutShift(entry);
          }
        }
      });
      
      this.layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Observe content overflow
    this.setupOverflowObserver();
  }

  setupOverflowObserver() {
    const observer = new ResizeObserver((entries) => {
      entries.forEach(entry => {
        this.checkContentOverflow(entry.target);
      });
    });

    // Observe critical content containers
    const containers = document.querySelectorAll(
      '.container, .nav-links, .hero-content, .card, .team-card'
    );
    
    containers.forEach(container => {
      observer.observe(container);
    });

    this.contentOverflowObserver = observer;
  }

  preserveNavigationItems() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const links = navLinks.querySelectorAll('.nav-link');
    const linkTexts = Array.from(links).map(link => link.textContent.trim());
    
    // Store original navigation structure
    this.preservedElements.set('navigation', {
      items: linkTexts,
      container: navLinks,
      originalHTML: navLinks.innerHTML
    });

    // Ensure all navigation items remain accessible
    this.ensureNavigationAccessibility();
  }

  ensureNavigationAccessibility() {
    const checkNavigation = () => {
      const navLinks = document.querySelector('.nav-links');
      const hamburger = document.querySelector('.nav-hamburger');
      
      if (!navLinks || !hamburger) return;

      const isDesktop = window.innerWidth >= this.breakpoints.tablet;
      const isMobile = window.innerWidth < this.breakpoints.mobile;

      if (isDesktop) {
        // Ensure all nav items are visible on desktop
        navLinks.style.display = 'flex';
        hamburger.style.display = 'none';
        
        // Check if nav items are wrapping
        const navRect = navLinks.getBoundingClientRect();
        const items = navLinks.querySelectorAll('.nav-link');
        let totalWidth = 0;
        
        items.forEach(item => {
          totalWidth += item.getBoundingClientRect().width + 28; // Include gap
        });
        
        if (totalWidth > navRect.width) {
          this.handleNavigationOverflow();
        }
      } else if (isMobile) {
        // Ensure hamburger menu is available on mobile
        hamburger.style.display = 'flex';
        
        // Verify mobile menu functionality
        this.verifyMobileMenuFunctionality();
      }
    };

    // Check on load and resize
    checkNavigation();
    window.addEventListener('resize', checkNavigation);
  }

  handleNavigationOverflow() {
    const navLinks = document.querySelector('.nav-links');
    const items = navLinks.querySelectorAll('.nav-link');
    
    // Create overflow menu for excess items
    const overflowItems = Array.from(items).slice(-2); // Last 2 items
    
    if (overflowItems.length > 0) {
      const moreButton = document.createElement('div');
      moreButton.className = 'nav-dropdown nav-more';
      moreButton.innerHTML = `
        <a href="#" class="nav-link nav-dropdown-toggle" role="button" aria-haspopup="true" aria-expanded="false">
          More
          <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor" class="nav-dropdown-icon">
            <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          </svg>
        </a>
        <ul class="nav-dropdown-menu" role="menu">
          ${overflowItems.map(item => `
            <li role="none">
              <a href="${item.href}" class="nav-dropdown-item" role="menuitem">
                ${item.textContent}
              </a>
            </li>
          `).join('')}
        </ul>
      `;
      
      // Remove overflow items and add more button
      overflowItems.forEach(item => item.remove());
      navLinks.appendChild(moreButton);
    }
  }

  verifyMobileMenuFunctionality() {
    const hamburger = document.querySelector('.nav-hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;

    // Ensure mobile menu can be opened
    const testOpen = () => {
      if (window.mobileNavigation) {
        return window.mobileNavigation.isOpen !== undefined;
      }
      return false;
    };

    if (!testOpen()) {
      // Fallback: CSS-only mobile menu
      this.enableCSSOnlyMobileMenu();
    }
  }

  enableCSSOnlyMobileMenu() {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 767px) {
        .nav-hamburger:focus + .nav-links,
        .nav-hamburger:active + .nav-links {
          display: flex !important;
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          flex-direction: column;
          padding: 24px;
          z-index: 99;
        }
      }
    `;
    document.head.appendChild(style);
  }

  preventTextOverflow() {
    const textElements = document.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, .btn, .nav-link, .card-title'
    );

    textElements.forEach(element => {
      this.setupTextOverflowPrevention(element);
    });
  }

  setupTextOverflowPrevention(element) {
    const observer = new ResizeObserver(() => {
      this.checkTextOverflow(element);
    });
    
    observer.observe(element);
    
    // Initial check
    this.checkTextOverflow(element);
  }

  checkTextOverflow(element) {
    const computedStyle = window.getComputedStyle(element);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const maxHeight = parseFloat(computedStyle.maxHeight);
    
    // Check if text is overflowing
    if (element.scrollHeight > element.clientHeight) {
      this.handleTextOverflow(element);
    }
    
    // Check for horizontal overflow
    if (element.scrollWidth > element.clientWidth) {
      this.handleHorizontalTextOverflow(element);
    }
  }

  handleTextOverflow(element) {
    // Add ellipsis for overflow
    element.style.overflow = 'hidden';
    element.style.textOverflow = 'ellipsis';
    
    // For multi-line text, use line clamping
    if (element.tagName.match(/^H[1-6]$/)) {
      element.style.display = '-webkit-box';
      element.style.webkitLineClamp = '2';
      element.style.webkitBoxOrient = 'vertical';
    }
    
    // Add title attribute for full text
    if (!element.title) {
      element.title = element.textContent.trim();
    }
  }

  handleHorizontalTextOverflow(element) {
    // Enable word wrapping
    element.style.wordWrap = 'break-word';
    element.style.overflowWrap = 'break-word';
    element.style.hyphens = 'auto';
    
    // For buttons and nav links, allow text to wrap
    if (element.classList.contains('btn') || element.classList.contains('nav-link')) {
      element.style.whiteSpace = 'normal';
      element.style.textAlign = 'center';
    }
  }

  maintainImageAspectRatios() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      this.preserveImageAspectRatio(img);
    });
  }

  preserveImageAspectRatio(img) {
    // Store original dimensions
    const originalLoad = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      img.dataset.aspectRatio = aspectRatio;
      
      // Apply responsive sizing
      this.applyResponsiveImageSizing(img, aspectRatio);
    };

    if (img.complete) {
      originalLoad();
    } else {
      img.addEventListener('load', originalLoad);
    }

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      const aspectRatio = parseFloat(img.dataset.aspectRatio);
      if (aspectRatio) {
        this.applyResponsiveImageSizing(img, aspectRatio);
      }
    });
    
    resizeObserver.observe(img.parentElement);
  }

  applyResponsiveImageSizing(img, aspectRatio) {
    const container = img.parentElement;
    const containerWidth = container.clientWidth;
    
    // Calculate appropriate height
    const calculatedHeight = containerWidth / aspectRatio;
    
    // Apply sizing while maintaining aspect ratio
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.maxWidth = '100%';
    img.style.objectFit = 'cover';
    
    // Prevent images from becoming too tall on mobile
    if (window.innerWidth < this.breakpoints.mobile) {
      const maxHeight = window.innerHeight * 0.4; // 40% of viewport height
      if (calculatedHeight > maxHeight) {
        img.style.height = maxHeight + 'px';
        img.style.objectFit = 'cover';
      }
    }
  }

  setupResponsiveTextScaling() {
    const textElements = document.querySelectorAll('h1, h2, h3, .hero-headline, .text-display');
    
    textElements.forEach(element => {
      this.setupResponsiveText(element);
    });
  }

  setupResponsiveText(element) {
    const originalFontSize = window.getComputedStyle(element).fontSize;
    element.dataset.originalFontSize = originalFontSize;
    
    const scaleText = () => {
      const viewportWidth = window.innerWidth;
      const baseFontSize = parseFloat(element.dataset.originalFontSize);
      
      let scaleFactor = 1;
      
      if (viewportWidth < this.breakpoints.mobile) {
        scaleFactor = 0.8; // Smaller on mobile
      } else if (viewportWidth < this.breakpoints.tablet) {
        scaleFactor = 0.9; // Slightly smaller on tablet
      }
      
      const newFontSize = baseFontSize * scaleFactor;
      element.style.fontSize = newFontSize + 'px';
      
      // Ensure text doesn't overflow container
      this.checkTextOverflow(element);
    };
    
    scaleText();
    window.addEventListener('resize', scaleText);
  }

  preventLayoutShifts() {
    // Reserve space for images
    this.reserveImageSpace();
    
    // Prevent font loading shifts
    this.preventFontLoadingShifts();
    
    // Stabilize dynamic content
    this.stabilizeDynamicContent();
  }

  reserveImageSpace() {
    const images = document.querySelectorAll('img[width][height]');
    
    images.forEach(img => {
      const width = parseInt(img.getAttribute('width'));
      const height = parseInt(img.getAttribute('height'));
      const aspectRatio = width / height;
      
      // Set aspect ratio to prevent layout shift
      img.style.aspectRatio = aspectRatio;
      
      // Fallback for browsers without aspect-ratio support
      if (!CSS.supports('aspect-ratio', aspectRatio)) {
        const container = img.parentElement;
        container.style.position = 'relative';
        container.style.paddingBottom = (height / width * 100) + '%';
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
      }
    });
  }

  preventFontLoadingShifts() {
    // Use font-display: swap for better loading performance
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    
    // Set fallback fonts immediately
    document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    
    // Apply custom fonts when loaded
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.body.style.fontFamily = '';
      });
    }
  }

  stabilizeDynamicContent() {
    // Reserve space for loading content
    const loadingElements = document.querySelectorAll('.loading, .skeleton');
    
    loadingElements.forEach(element => {
      const minHeight = element.dataset.minHeight || '100px';
      element.style.minHeight = minHeight;
    });
  }

  setupViewportChangeHandling() {
    let resizeTimeout;
    
    const handleViewportChange = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleViewportChange();
      }, 150); // Debounce resize events
    };
    
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleViewportChange, 100); // Delay for orientation change
    });
  }

  handleViewportChange() {
    // Re-check all preserved elements
    this.ensureNavigationAccessibility();
    
    // Re-apply text scaling
    const textElements = document.querySelectorAll('[data-original-font-size]');
    textElements.forEach(element => {
      this.setupResponsiveText(element);
    });
    
    // Re-check image sizing
    const images = document.querySelectorAll('img[data-aspect-ratio]');
    images.forEach(img => {
      const aspectRatio = parseFloat(img.dataset.aspectRatio);
      if (aspectRatio) {
        this.applyResponsiveImageSizing(img, aspectRatio);
      }
    });
    
    // Announce viewport change to screen readers
    if (window.accessibilityManager) {
      const width = window.innerWidth;
      let deviceType = 'desktop';
      
      if (width < this.breakpoints.mobile) {
        deviceType = 'mobile';
      } else if (width < this.breakpoints.tablet) {
        deviceType = 'tablet';
      }
      
      window.accessibilityManager.announce(`Layout changed to ${deviceType} view`);
    }
  }

  handleLayoutShift(entry) {
    console.warn('Layout shift detected:', entry);
    
    // Try to identify the cause
    const sources = entry.sources || [];
    sources.forEach(source => {
      const element = source.node;
      if (element) {
        console.warn('Layout shift source:', element);
        
        // Apply stabilization
        this.stabilizeElement(element);
      }
    });
  }

  stabilizeElement(element) {
    // Add min-height to prevent future shifts
    if (!element.style.minHeight) {
      const rect = element.getBoundingClientRect();
      element.style.minHeight = rect.height + 'px';
    }
    
    // Ensure element has stable positioning
    if (element.tagName === 'IMG') {
      this.preserveImageAspectRatio(element);
    }
  }

  checkContentOverflow(element) {
    const isOverflowing = element.scrollWidth > element.clientWidth || 
                         element.scrollHeight > element.clientHeight;
    
    if (isOverflowing) {
      this.handleContentOverflow(element);
    }
  }

  handleContentOverflow(element) {
    // Add overflow handling
    element.style.overflow = 'auto';
    
    // For text content, enable word wrapping
    if (element.textContent.trim()) {
      element.style.wordWrap = 'break-word';
      element.style.overflowWrap = 'break-word';
    }
    
    // For containers, enable scrolling
    if (element.children.length > 0) {
      element.style.overflowX = 'auto';
      element.style.webkitOverflowScrolling = 'touch';
    }
  }

  // Public API
  preserveElement(selector, options = {}) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    this.preservedElements.set(selector, {
      element,
      originalHTML: element.innerHTML,
      originalStyles: element.style.cssText,
      options
    });
  }

  restoreElement(selector) {
    const preserved = this.preservedElements.get(selector);
    if (!preserved) return;
    
    preserved.element.innerHTML = preserved.originalHTML;
    preserved.element.style.cssText = preserved.originalStyles;
  }

  getLayoutMetrics() {
    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      breakpoint: this.getCurrentBreakpoint(),
      preservedElements: this.preservedElements.size,
      layoutShifts: this.layoutShiftObserver ? 'monitored' : 'not available'
    };
  }

  getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width < this.breakpoints.mobile) {
      return 'mobile';
    } else if (width < this.breakpoints.tablet) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }
}

// Initialize layout preservation manager
const layoutPreservationManager = new LayoutPreservationManager();

// Make it globally available
window.layoutPreservationManager = layoutPreservationManager;

// ============================================================
// CONTENT REFLOW OPTIMIZATION SYSTEM
// ============================================================

// Content reflow optimizer to prevent layout shifts and maintain functionality
class ContentReflowOptimizer {
  constructor() {
    this.reflowObserver = null;
    this.reflowQueue = [];
    this.isProcessingReflow = false;
    this.reflowThreshold = 16; // 16ms for 60fps
    this.lastReflowTime = 0;
    
    this.init();
  }

  init() {
    this.setupReflowObserver();
    this.optimizeContentReflow();
    this.preventLayoutThrashing();
    this.maintainInteractiveElements();
    this.setupPerformanceMonitoring();
  }

  setupReflowObserver() {
    // Use ResizeObserver to detect layout changes
    this.reflowObserver = new ResizeObserver((entries) => {
      this.handleReflowEntries(entries);
    });

    // Observe critical elements that can cause reflow
    const criticalElements = document.querySelectorAll(
      '.container, .nav, .hero, .section, .card, .team-card, .grid-2, .grid-3, .grid-4'
    );
    
    criticalElements.forEach(element => {
      this.reflowObserver.observe(element);
    });
  }

  handleReflowEntries(entries) {
    const currentTime = performance.now();
    
    // Throttle reflow handling to prevent performance issues
    if (currentTime - this.lastReflowTime < this.reflowThreshold) {
      this.queueReflowHandling(entries);
      return;
    }
    
    this.lastReflowTime = currentTime;
    this.processReflowEntries(entries);
  }

  queueReflowHandling(entries) {
    this.reflowQueue.push(...entries);
    
    if (!this.isProcessingReflow) {
      this.isProcessingReflow = true;
      
      requestAnimationFrame(() => {
        this.processReflowQueue();
        this.isProcessingReflow = false;
      });
    }
  }

  processReflowQueue() {
    const entries = [...this.reflowQueue];
    this.reflowQueue = [];
    
    this.processReflowEntries(entries);
  }

  processReflowEntries(entries) {
    entries.forEach(entry => {
      this.optimizeElementReflow(entry.target, entry.contentRect);
    });
  }

  optimizeElementReflow(element, rect) {
    // Optimize based on element type
    if (element.classList.contains('nav')) {
      this.optimizeNavigationReflow(element, rect);
    } else if (element.classList.contains('hero')) {
      this.optimizeHeroReflow(element, rect);
    } else if (element.classList.contains('card') || element.classList.contains('team-card')) {
      this.optimizeCardReflow(element, rect);
    } else if (element.classList.contains('container')) {
      this.optimizeContainerReflow(element, rect);
    } else if (element.matches('.grid-2, .grid-3, .grid-4')) {
      this.optimizeGridReflow(element, rect);
    }
  }

  optimizeNavigationReflow(nav, rect) {
    const navLinks = nav.querySelector('.nav-links');
    const hamburger = nav.querySelector('.nav-hamburger');
    
    if (!navLinks || !hamburger) return;

    // Calculate available space for navigation items
    const navInner = nav.querySelector('.nav-inner');
    const logo = nav.querySelector('.nav-logo');
    const cta = nav.querySelector('.nav-cta');
    
    const logoWidth = logo ? logo.getBoundingClientRect().width : 0;
    const ctaWidth = cta ? cta.getBoundingClientRect().width : 0;
    const availableWidth = rect.width - logoWidth - ctaWidth - 100; // 100px buffer
    
    // Check if navigation items fit
    const linksWidth = this.calculateNavLinksWidth(navLinks);
    
    if (linksWidth > availableWidth && rect.width >= 768) {
      // Show condensed navigation
      this.enableCondensedNavigation(navLinks);
    } else if (rect.width >= 768) {
      // Show full navigation
      this.enableFullNavigation(navLinks, hamburger);
    } else {
      // Show mobile navigation
      this.enableMobileNavigation(navLinks, hamburger);
    }
  }

  calculateNavLinksWidth(navLinks) {
    const links = navLinks.querySelectorAll('.nav-link');
    let totalWidth = 0;
    
    links.forEach(link => {
      totalWidth += link.getBoundingClientRect().width + 28; // Include gap
    });
    
    return totalWidth;
  }

  enableCondensedNavigation(navLinks) {
    navLinks.classList.add('nav-condensed');
    
    // Reduce spacing between items
    navLinks.style.gap = '16px';
    
    // Use shorter text for some items if available
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
      if (link.dataset.shortText) {
        link.textContent = link.dataset.shortText;
      }
    });
  }

  enableFullNavigation(navLinks, hamburger) {
    navLinks.classList.remove('nav-condensed');
    navLinks.style.display = 'flex';
    hamburger.style.display = 'none';
    
    // Restore full text
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
      if (link.dataset.fullText) {
        link.textContent = link.dataset.fullText;
      }
    });
  }

  enableMobileNavigation(navLinks, hamburger) {
    hamburger.style.display = 'flex';
    
    // Hide navigation links unless menu is open
    if (!document.body.classList.contains('nav-open')) {
      navLinks.style.display = 'none';
    }
  }

  optimizeHeroReflow(hero, rect) {
    const heroContent = hero.querySelector('.hero-content');
    const heroVisual = hero.querySelector('.hero-visual');
    
    if (!heroContent || !heroVisual) return;

    // Adjust layout based on available space
    if (rect.width < 768) {
      // Stack vertically on mobile
      hero.classList.add('hero-stacked');
      heroContent.style.marginBottom = '32px';
    } else if (rect.width < 1200) {
      // Adjust spacing on tablet
      hero.classList.remove('hero-stacked');
      hero.classList.add('hero-tablet');
    } else {
      // Full desktop layout
      hero.classList.remove('hero-stacked', 'hero-tablet');
    }
    
    // Optimize text sizing
    this.optimizeHeroTextSizing(heroContent, rect.width);
  }

  optimizeHeroTextSizing(heroContent, width) {
    const headline = heroContent.querySelector('.hero-headline');
    const subtitle = heroContent.querySelector('.hero-sub');
    
    if (headline) {
      let fontSize;
      if (width < 480) {
        fontSize = 'clamp(28px, 8vw, 36px)';
      } else if (width < 768) {
        fontSize = 'clamp(36px, 8vw, 48px)';
      } else if (width < 1200) {
        fontSize = 'clamp(48px, 6vw, 64px)';
      } else {
        fontSize = 'clamp(64px, 5vw, 88px)';
      }
      
      headline.style.fontSize = fontSize;
    }
    
    if (subtitle) {
      let fontSize;
      if (width < 768) {
        fontSize = '16px';
      } else {
        fontSize = '18px';
      }
      
      subtitle.style.fontSize = fontSize;
    }
  }

  optimizeCardReflow(card, rect) {
    // Adjust card content based on available space
    const cardContent = card.querySelector('.card-content, .team-card-content');
    if (!cardContent) return;

    // Optimize text content
    const title = cardContent.querySelector('h3, .team-name, .card-title');
    const description = cardContent.querySelector('p, .team-bio, .card-description');
    
    if (title && rect.width < 300) {
      // Use smaller title on narrow cards
      title.style.fontSize = '18px';
      title.style.lineHeight = '1.3';
    } else if (title) {
      // Reset to default
      title.style.fontSize = '';
      title.style.lineHeight = '';
    }
    
    if (description && rect.width < 250) {
      // Limit description length on very narrow cards
      this.limitTextLength(description, 100);
    } else if (description && rect.width < 350) {
      // Moderate limitation
      this.limitTextLength(description, 150);
    } else if (description) {
      // Full text
      this.restoreFullText(description);
    }
  }

  limitTextLength(element, maxLength) {
    if (!element.dataset.fullText) {
      element.dataset.fullText = element.textContent;
    }
    
    const fullText = element.dataset.fullText;
    if (fullText.length > maxLength) {
      element.textContent = fullText.substring(0, maxLength) + '...';
      element.title = fullText; // Show full text on hover
    }
  }

  restoreFullText(element) {
    if (element.dataset.fullText) {
      element.textContent = element.dataset.fullText;
      element.removeAttribute('title');
    }
  }

  optimizeContainerReflow(container, rect) {
    // Adjust container padding based on available space
    let padding;
    
    if (rect.width < 480) {
      padding = '16px';
    } else if (rect.width < 768) {
      padding = '20px';
    } else {
      padding = '24px';
    }
    
    container.style.paddingLeft = padding;
    container.style.paddingRight = padding;
  }

  optimizeGridReflow(grid, rect) {
    // Adjust grid columns based on available space and content
    const items = grid.children.length;
    let columns;
    
    if (grid.classList.contains('grid-2')) {
      columns = rect.width < 768 ? 1 : 2;
    } else if (grid.classList.contains('grid-3')) {
      if (rect.width < 600) {
        columns = 1;
      } else if (rect.width < 900) {
        columns = 2;
      } else {
        columns = 3;
      }
    } else if (grid.classList.contains('grid-4')) {
      if (rect.width < 500) {
        columns = 1;
      } else if (rect.width < 750) {
        columns = 2;
      } else if (rect.width < 1000) {
        columns = 3;
      } else {
        columns = 4;
      }
    }
    
    // Apply grid template
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    
    // Adjust gap based on available space
    const gap = rect.width < 768 ? '16px' : '24px';
    grid.style.gap = gap;
  }

  optimizeContentReflow() {
    // Batch DOM reads and writes to prevent layout thrashing
    this.batchDOMOperations();
    
    // Use CSS containment for better performance
    this.applyCSSContainment();
    
    // Optimize animations during reflow
    this.optimizeAnimationsDuringReflow();
  }

  batchDOMOperations() {
    let readQueue = [];
    let writeQueue = [];
    let isScheduled = false;
    
    const flushQueues = () => {
      // Process all reads first
      readQueue.forEach(fn => fn());
      readQueue = [];
      
      // Then process all writes
      writeQueue.forEach(fn => fn());
      writeQueue = [];
      
      isScheduled = false;
    };
    
    const scheduleFlush = () => {
      if (!isScheduled) {
        isScheduled = true;
        requestAnimationFrame(flushQueues);
      }
    };
    
    // Expose batching API
    window.batchRead = (fn) => {
      readQueue.push(fn);
      scheduleFlush();
    };
    
    window.batchWrite = (fn) => {
      writeQueue.push(fn);
      scheduleFlush();
    };
  }

  applyCSSContainment() {
    // Apply CSS containment to improve reflow performance
    const containmentElements = document.querySelectorAll(
      '.card, .team-card, .hero-visual, .section'
    );
    
    containmentElements.forEach(element => {
      element.style.contain = 'layout style paint';
    });
  }

  optimizeAnimationsDuringReflow() {
    let isReflowing = false;
    
    const startReflow = () => {
      if (isReflowing) return;
      
      isReflowing = true;
      document.body.classList.add('reflow-active');
      
      // Pause non-critical animations
      const animations = document.querySelectorAll('.hero-orb, .ticker-track');
      animations.forEach(element => {
        element.style.animationPlayState = 'paused';
      });
    };
    
    const endReflow = () => {
      if (!isReflowing) return;
      
      setTimeout(() => {
        isReflowing = false;
        document.body.classList.remove('reflow-active');
        
        // Resume animations
        const animations = document.querySelectorAll('.hero-orb, .ticker-track');
        animations.forEach(element => {
          element.style.animationPlayState = 'running';
        });
      }, 100);
    };
    
    // Listen for resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      startReflow();
      
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(endReflow, 150);
    });
  }

  preventLayoutThrashing() {
    // Prevent rapid layout recalculations
    let layoutTimeout;
    
    const debouncedLayout = () => {
      clearTimeout(layoutTimeout);
      layoutTimeout = setTimeout(() => {
        this.recalculateLayout();
      }, 100);
    };
    
    // Listen for events that can cause layout thrashing
    window.addEventListener('resize', debouncedLayout);
    window.addEventListener('orientationchange', () => {
      setTimeout(debouncedLayout, 100);
    });
    
    // Prevent layout during scroll
    let isScrolling = false;
    window.addEventListener('scroll', () => {
      if (!isScrolling) {
        isScrolling = true;
        document.body.classList.add('scrolling');
        
        setTimeout(() => {
          isScrolling = false;
          document.body.classList.remove('scrolling');
        }, 150);
      }
    }, { passive: true });
  }

  recalculateLayout() {
    // Force layout recalculation in an optimized way
    const elements = document.querySelectorAll('.layout-dependent');
    
    // Batch all reads first
    const measurements = [];
    elements.forEach(element => {
      measurements.push({
        element,
        rect: element.getBoundingClientRect()
      });
    });
    
    // Then batch all writes
    measurements.forEach(({ element, rect }) => {
      this.optimizeElementReflow(element, rect);
    });
  }

  maintainInteractiveElements() {
    // Ensure interactive elements remain functional during reflow
    this.maintainButtonFunctionality();
    this.maintainNavigationFunctionality();
    this.maintainFormFunctionality();
  }

  maintainButtonFunctionality() {
    const buttons = document.querySelectorAll('.btn, button');
    
    buttons.forEach(button => {
      // Ensure minimum touch target size
      const rect = button.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        button.style.minWidth = '44px';
        button.style.minHeight = '44px';
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
      }
      
      // Prevent text overflow in buttons
      if (button.scrollWidth > button.clientWidth) {
        button.style.fontSize = '14px';
        button.style.padding = '12px 16px';
      }
    });
  }

  maintainNavigationFunctionality() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      // Ensure navigation links remain clickable
      link.style.minHeight = '44px';
      link.style.display = 'flex';
      link.style.alignItems = 'center';
      
      // Handle text overflow
      if (link.scrollWidth > link.clientWidth) {
        link.style.fontSize = '14px';
        link.title = link.textContent;
      }
    });
  }

  maintainFormFunctionality() {
    const formElements = document.querySelectorAll('input, textarea, select');
    
    formElements.forEach(element => {
      // Ensure form elements remain usable
      element.style.minHeight = '44px';
      element.style.fontSize = '16px'; // Prevent zoom on iOS
      
      // Handle container overflow
      const container = element.closest('.form-group');
      if (container && container.scrollWidth > container.clientWidth) {
        container.style.overflow = 'visible';
      }
    });
  }

  setupPerformanceMonitoring() {
    // Monitor reflow performance
    let reflowCount = 0;
    let reflowTime = 0;
    
    const originalObserve = this.reflowObserver.observe.bind(this.reflowObserver);
    this.reflowObserver.observe = (element) => {
      const startTime = performance.now();
      
      originalObserve(element);
      
      reflowCount++;
      reflowTime += performance.now() - startTime;
      
      // Log performance metrics periodically
      if (reflowCount % 10 === 0) {
        console.log(`Reflow performance: ${reflowCount} reflows, avg ${(reflowTime / reflowCount).toFixed(2)}ms`);
      }
    };
  }

  // Public API
  optimizeElement(element) {
    const rect = element.getBoundingClientRect();
    this.optimizeElementReflow(element, rect);
  }

  pauseReflowOptimization() {
    if (this.reflowObserver) {
      this.reflowObserver.disconnect();
    }
  }

  resumeReflowOptimization() {
    if (this.reflowObserver) {
      this.setupReflowObserver();
    }
  }

  getReflowMetrics() {
    return {
      queueLength: this.reflowQueue.length,
      isProcessing: this.isProcessingReflow,
      lastReflowTime: this.lastReflowTime,
      threshold: this.reflowThreshold
    };
  }
}

// Initialize content reflow optimizer
const contentReflowOptimizer = new ContentReflowOptimizer();

// Make it globally available
window.contentReflowOptimizer = contentReflowOptimizer;

// ============================================================
// GRACEFUL DEGRADATION AND ERROR RECOVERY SYSTEM
// ============================================================

// Network connectivity and error recovery manager
class ErrorRecoveryManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.retryQueue = [];
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.connectionCheckInterval = null;
    
    this.init();
  }

  init() {
    this.setupNetworkListeners();
    this.setupGlobalErrorHandlers();
    this.setupResourceErrorHandlers();
    this.startConnectionMonitoring();
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleConnectionRestored();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleConnectionLost();
    });
  }

  setupGlobalErrorHandlers() {
    // JavaScript error handler
    window.addEventListener('error', (event) => {
      this.handleJavaScriptError(event);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handlePromiseRejection(event);
    });

    // Resource loading error handler
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleResourceError(event);
      }
    }, true);
  }

  setupResourceErrorHandlers() {
    // CSS loading error fallback
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    cssLinks.forEach(link => {
      link.addEventListener('error', () => {
        this.handleCSSLoadError(link);
      });
    });

    // Font loading error fallback
    if ('fonts' in document) {
      document.fonts.addEventListener('loadingerror', (event) => {
        this.handleFontLoadError(event);
      });
    }
  }

  handleConnectionLost() {
    // Show offline indicator
    this.showOfflineIndicator();
    
    // Pause non-critical operations
    this.pauseNonCriticalOperations();
    
    // Enable offline mode
    document.body.classList.add('offline-mode');
  }

  handleConnectionRestored() {
    // Hide offline indicator
    this.hideOfflineIndicator();
    
    // Resume operations
    this.resumeOperations();
    
    // Process retry queue
    this.processRetryQueue();
    
    // Disable offline mode
    document.body.classList.remove('offline-mode');
  }

  handleJavaScriptError(event) {
    console.error('JavaScript Error:', event.error);
    
    // Try to recover from common errors
    if (event.error && event.error.message) {
      const message = event.error.message.toLowerCase();
      
      if (message.includes('network') || message.includes('fetch')) {
        this.handleNetworkError(event);
      } else if (message.includes('undefined') || message.includes('null')) {
        this.handleReferenceError(event);
      }
    }
    
    // Show user-friendly error message
    this.showErrorMessage('Something went wrong. The page will continue to work with basic functionality.');
  }

  handlePromiseRejection(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    
    // Prevent the default browser error handling
    event.preventDefault();
    
    // Try to recover
    if (event.reason && event.reason.message) {
      const message = event.reason.message.toLowerCase();
      
      if (message.includes('network') || message.includes('fetch')) {
        this.addToRetryQueue(() => {
          // Retry the failed operation
          return Promise.resolve();
        });
      }
    }
  }

  handleResourceError(event) {
    const element = event.target;
    
    if (element.tagName === 'IMG') {
      this.handleImageError(element);
    } else if (element.tagName === 'LINK' && element.rel === 'stylesheet') {
      this.handleCSSLoadError(element);
    } else if (element.tagName === 'SCRIPT') {
      this.handleScriptError(element);
    }
  }

  handleImageError(img) {
    // Add error class
    img.classList.add('image-error');
    
    // Try alternative sources
    if (img.dataset.fallback) {
      img.src = img.dataset.fallback;
      return;
    }
    
    // Show placeholder
    this.showImagePlaceholder(img);
  }

  handleCSSLoadError(link) {
    console.warn('CSS failed to load:', link.href);
    
    // Add fallback styles
    this.addFallbackStyles();
    
    // Retry loading
    this.retryResourceLoad(link);
  }

  handleScriptError(script) {
    console.warn('Script failed to load:', script.src);
    
    // Enable no-js fallbacks
    document.documentElement.classList.add('no-js');
    
    // Try to load from alternative source
    if (script.dataset.fallback) {
      this.loadFallbackScript(script.dataset.fallback);
    }
  }

  handleFontLoadError(event) {
    console.warn('Font failed to load:', event.fontface);
    
    // Use system fonts as fallback
    document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  }

  handleNetworkError(event) {
    if (!this.isOnline) {
      this.showOfflineMessage();
      return;
    }
    
    // Add to retry queue
    this.addToRetryQueue(() => {
      // Retry the failed network operation
      return fetch(event.target.src || event.target.href)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response;
        });
    });
  }

  handleReferenceError(event) {
    // Try to recover by reinitializing components
    try {
      // Reinitialize critical components
      if (typeof viewportManager !== 'undefined') {
        viewportManager.handleViewportChange();
      }
      
      if (typeof mobileNavigation !== 'undefined') {
        mobileNavigation.init();
      }
    } catch (error) {
      console.warn('Could not recover from reference error:', error);
    }
  }

  addToRetryQueue(retryFunction) {
    this.retryQueue.push({
      fn: retryFunction,
      attempts: 0,
      maxAttempts: this.maxRetries
    });
  }

  processRetryQueue() {
    const queue = [...this.retryQueue];
    this.retryQueue = [];
    
    queue.forEach(item => {
      this.retryOperation(item);
    });
  }

  retryOperation(item) {
    if (item.attempts >= item.maxAttempts) {
      console.warn('Max retry attempts reached for operation');
      return;
    }
    
    item.attempts++;
    
    setTimeout(() => {
      item.fn()
        .then(() => {
          console.log('Retry successful');
        })
        .catch(() => {
          if (item.attempts < item.maxAttempts) {
            this.retryOperation(item);
          }
        });
    }, this.retryDelay * item.attempts);
  }

  retryResourceLoad(element) {
    const originalSrc = element.src || element.href;
    
    setTimeout(() => {
      if (element.tagName === 'LINK') {
        element.href = originalSrc + '?retry=' + Date.now();
      } else {
        element.src = originalSrc + '?retry=' + Date.now();
      }
    }, this.retryDelay);
  }

  showOfflineIndicator() {
    let indicator = document.getElementById('offline-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'offline-indicator';
      indicator.className = 'offline-indicator';
      indicator.innerHTML = `
        <div class="offline-content">
          <span class="offline-icon">📡</span>
          <span class="offline-text">You're offline</span>
        </div>
      `;
      document.body.appendChild(indicator);
    }
    
    indicator.classList.add('visible');
  }

  hideOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.classList.remove('visible');
    }
  }

  showOfflineMessage() {
    this.showErrorMessage('You appear to be offline. Some features may not work until your connection is restored.');
  }

  showErrorMessage(message) {
    // Create or update error message
    let errorDiv = document.getElementById('error-message');
    
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.id = 'error-message';
      errorDiv.className = 'error-message';
      document.body.appendChild(errorDiv);
    }
    
    errorDiv.innerHTML = `
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-text">${message}</span>
        <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    errorDiv.classList.add('visible');
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (errorDiv && errorDiv.parentNode) {
        errorDiv.classList.remove('visible');
      }
    }, 10000);
  }

  showImagePlaceholder(img) {
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = `
      <div class="placeholder-content">
        <span class="placeholder-icon">🖼️</span>
        <span class="placeholder-text">${img.alt || 'Image unavailable'}</span>
      </div>
    `;
    
    // Replace image with placeholder
    if (img.parentNode) {
      img.parentNode.insertBefore(placeholder, img);
      img.style.display = 'none';
    }
  }

  addFallbackStyles() {
    const fallbackCSS = `
      body { font-family: system-ui, -apple-system, sans-serif !important; }
      .nav { background: #ffffff !important; border-bottom: 1px solid #e5e7eb !important; }
      .btn { background: #6366f1 !important; color: white !important; padding: 12px 24px !important; border-radius: 6px !important; }
      .card { border: 1px solid #e5e7eb !important; padding: 24px !important; border-radius: 8px !important; }
    `;
    
    const style = document.createElement('style');
    style.textContent = fallbackCSS;
    document.head.appendChild(style);
  }

  loadFallbackScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  }

  pauseNonCriticalOperations() {
    // Pause animations
    document.body.classList.add('pause-animations');
    
    // Stop auto-playing content
    const videos = document.querySelectorAll('video[autoplay]');
    videos.forEach(video => video.pause());
    
    // Pause lazy loading
    if (window.lazyImageLoader) {
      window.lazyImageLoader.pause = true;
    }
  }

  resumeOperations() {
    // Resume animations
    document.body.classList.remove('pause-animations');
    
    // Resume lazy loading
    if (window.lazyImageLoader) {
      window.lazyImageLoader.pause = false;
      window.lazyImageLoader.refresh();
    }
  }

  startConnectionMonitoring() {
    this.connectionCheckInterval = setInterval(() => {
      this.checkConnection();
    }, 30000); // Check every 30 seconds
  }

  checkConnection() {
    if (!navigator.onLine) return;
    
    // Try to fetch a small resource to verify connectivity
    fetch('/favicon.ico', { 
      method: 'HEAD',
      cache: 'no-cache'
    })
    .then(() => {
      if (!this.isOnline) {
        this.isOnline = true;
        this.handleConnectionRestored();
      }
    })
    .catch(() => {
      if (this.isOnline) {
        this.isOnline = false;
        this.handleConnectionLost();
      }
    });
  }

  // Public API
  getStatus() {
    return {
      isOnline: this.isOnline,
      retryQueueLength: this.retryQueue.length
    };
  }

  forceRetry() {
    this.processRetryQueue();
  }
}

// Initialize error recovery manager
const errorRecoveryManager = new ErrorRecoveryManager();

// Make it globally available
window.errorRecoveryManager = errorRecoveryManager;

// ============================================================
// PERFORMANCE OPTIMIZATION AND RESOURCE MANAGEMENT
// ============================================================

// Performance optimization manager
class PerformanceOptimizer {
  constructor() {
    this.metrics = {
      loadStart: performance.now(),
      domContentLoaded: null,
      windowLoaded: null,
      firstPaint: null,
      firstContentfulPaint: null,
      largestContentfulPaint: null
    };
    
    this.init();
  }

  init() {
    this.measurePerformance();
    this.optimizeResources();
    this.setupResourceHints();
    this.enableCompression();
  }

  measurePerformance() {
    // Measure DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.metrics.domContentLoaded = performance.now();
    });

    // Measure Window Load
    window.addEventListener('load', () => {
      this.metrics.windowLoaded = performance.now();
      this.reportMetrics();
    });

    // Measure paint metrics
    if ('PerformanceObserver' in window) {
      // First Paint and First Contentful Paint
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint') {
            this.metrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  optimizeResources() {
    // Optimize images that don't have lazy loading
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });

    // Add decoding="async" to images
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });

    // Optimize font loading
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
      });
    }
  }

  setupResourceHints() {
    // Preload critical resources
    const criticalImages = [
      'assets/images/Logo_BabyCue.png'
    ];
    
    criticalImages.forEach(src => {
      if (!document.querySelector(`link[href="${src}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      }
    });

    // DNS prefetch for external domains
    const externalDomains = [
      '//play.google.com',
      '//growgut-product-506773688937.asia-south1.run.app'
    ];

    externalDomains.forEach(domain => {
      if (!document.querySelector(`link[href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      }
    });
  }

  enableCompression() {
    // Add compression hints for better caching
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Service worker registration failed, continue without it
        });
      });
    }

    // Enable resource compression hints
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Encoding';
    meta.content = 'gzip, deflate, br';
    document.head.appendChild(meta);
  }

  reportMetrics() {
    const loadTime = this.metrics.windowLoaded - this.metrics.loadStart;
    
    // Log performance metrics (can be sent to analytics)
    console.log('Performance Metrics:', {
      ...this.metrics,
      totalLoadTime: loadTime,
      isUnder5Seconds: loadTime < 5000
    });

    // Dispatch performance event
    window.dispatchEvent(new CustomEvent('performanceMetrics', {
      detail: {
        ...this.metrics,
        totalLoadTime: loadTime,
        isUnder5Seconds: loadTime < 5000
      }
    }));
  }

  // Public API
  getMetrics() {
    return { ...this.metrics };
  }

  isPerformant() {
    const loadTime = this.metrics.windowLoaded - this.metrics.loadStart;
    return loadTime < 5000; // Under 5 seconds as per requirements
  }
}

// Initialize performance optimizer
const performanceOptimizer = new PerformanceOptimizer();

// Make it globally available
window.performanceOptimizer = performanceOptimizer;

// ============================================================
// VIEWPORT DETECTION AND LAYOUT MANAGEMENT
// ============================================================

// Viewport breakpoints (matching CSS)
const BREAKPOINTS = {
  mobile: 767,
  tablet: 1199,
  desktop: 1200
};

// Viewport detection system
class ViewportManager {
  constructor() {
    this.currentViewport = this.detectViewport();
    this.previousViewport = null;
    this.orientationChangeTimeout = null;
    
    // Initialize viewport classes
    this.updateViewportClasses();
    
    // Bind event listeners
    this.bindEvents();
    
    // Initial layout setup
    this.handleLayoutChange();
  }

  detectViewport() {
    const width = window.innerWidth;
    
    if (width <= BREAKPOINTS.mobile) {
      return 'mobile';
    } else if (width <= BREAKPOINTS.tablet) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  updateViewportClasses() {
    const body = document.body;
    const html = document.documentElement;
    
    // Remove all viewport classes
    body.classList.remove('viewport-mobile', 'viewport-tablet', 'viewport-desktop');
    html.classList.remove('viewport-mobile', 'viewport-tablet', 'viewport-desktop');
    
    // Add current viewport class
    const viewportClass = `viewport-${this.currentViewport}`;
    body.classList.add(viewportClass);
    html.classList.add(viewportClass);
    
    // Add responsive helper classes
    if (this.currentViewport === 'mobile') {
      body.classList.add('is-mobile');
      body.classList.remove('is-tablet', 'is-desktop');
    } else if (this.currentViewport === 'tablet') {
      body.classList.add('is-tablet');
      body.classList.remove('is-mobile', 'is-desktop');
    } else {
      body.classList.add('is-desktop');
      body.classList.remove('is-mobile', 'is-tablet');
    }
  }

  handleViewportChange() {
    this.previousViewport = this.currentViewport;
    this.currentViewport = this.detectViewport();
    
    if (this.previousViewport !== this.currentViewport) {
      this.updateViewportClasses();
      this.handleLayoutChange();
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('viewportChange', {
        detail: {
          current: this.currentViewport,
          previous: this.previousViewport
        }
      }));
    }
  }

  handleOrientationChange() {
    // Clear existing timeout
    if (this.orientationChangeTimeout) {
      clearTimeout(this.orientationChangeTimeout);
    }
    
    // Delay handling to allow for proper viewport calculation
    this.orientationChangeTimeout = setTimeout(() => {
      this.handleViewportChange();
      
      // Force layout recalculation for smooth transitions
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
      
      // Dispatch orientation change event
      window.dispatchEvent(new CustomEvent('orientationChangeComplete', {
        detail: {
          viewport: this.currentViewport,
          orientation: window.orientation || 0
        }
      }));
    }, 100);
  }

  handleLayoutChange() {
    // Mobile-specific layout adjustments
    if (this.currentViewport === 'mobile') {
      this.setupMobileLayout();
    }
    // Tablet-specific layout adjustments
    else if (this.currentViewport === 'tablet') {
      this.setupTabletLayout();
    }
    // Desktop-specific layout adjustments
    else {
      this.setupDesktopLayout();
    }
  }

  setupMobileLayout() {
    // Close any open dropdowns
    const activeDropdowns = document.querySelectorAll('.nav-dropdown.active');
    activeDropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    
    // Close mobile menu if open
    const navLinks = document.getElementById('navLinks');
    const navHamburger = document.getElementById('navHamburger');
    if (navLinks && navHamburger) {
      navLinks.classList.remove('active');
      navHamburger.classList.remove('active');
    }
    
    // Optimize images for mobile
    this.optimizeImagesForViewport('mobile');
    
    // Disable hover effects on touch devices
    if ('ontouchstart' in window) {
      document.body.classList.add('touch-device');
    }
  }

  setupTabletLayout() {
    // Close mobile menu if open
    const navLinks = document.getElementById('navLinks');
    const navHamburger = document.getElementById('navHamburger');
    if (navLinks && navHamburger) {
      navLinks.classList.remove('active');
      navHamburger.classList.remove('active');
    }
    
    // Optimize images for tablet
    this.optimizeImagesForViewport('tablet');
  }

  setupDesktopLayout() {
    // Close mobile menu
    const navLinks = document.getElementById('navLinks');
    const navHamburger = document.getElementById('navHamburger');
    if (navLinks && navHamburger) {
      navLinks.classList.remove('active');
      navHamburger.classList.remove('active');
    }
    
    // Optimize images for desktop
    this.optimizeImagesForViewport('desktop');
    
    // Remove touch device class
    document.body.classList.remove('touch-device');
  }

  optimizeImagesForViewport(viewport) {
    const images = document.querySelectorAll('img[data-src-mobile], img[data-src-tablet], img[data-src-desktop]');
    
    images.forEach(img => {
      let targetSrc = null;
      
      if (viewport === 'mobile' && img.dataset.srcMobile) {
        targetSrc = img.dataset.srcMobile;
      } else if (viewport === 'tablet' && img.dataset.srcTablet) {
        targetSrc = img.dataset.srcTablet;
      } else if (viewport === 'desktop' && img.dataset.srcDesktop) {
        targetSrc = img.dataset.srcDesktop;
      }
      
      if (targetSrc && img.src !== targetSrc) {
        img.src = targetSrc;
      }
    });
  }

  bindEvents() {
    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleViewportChange();
      }, 150);
    }, { passive: true });

    // Orientation change handler
    window.addEventListener('orientationchange', () => {
      this.handleOrientationChange();
    }, { passive: true });

    // Load handler for initial setup
    window.addEventListener('load', () => {
      this.handleViewportChange();
    }, { passive: true });
  }

  // Public API
  getCurrentViewport() {
    return this.currentViewport;
  }

  isMobile() {
    return this.currentViewport === 'mobile';
  }

  isTablet() {
    return this.currentViewport === 'tablet';
  }

  isDesktop() {
    return this.currentViewport === 'desktop';
  }

  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
}

// Initialize viewport manager
const viewportManager = new ViewportManager();

// Make it globally available
window.viewportManager = viewportManager;

// ============================================================
// PERFORMANCE OPTIMIZATION
// ============================================================

// ============================================================
// ENHANCED LAZY LOADING SYSTEM WITH PERFORMANCE OPTIMIZATION
// ============================================================

// Enhanced lazy loading for images with error handling and performance optimization
class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.loadedImages = new Set();
    this.failedImages = new Set();
    this.retryAttempts = new Map();
    this.maxRetries = 2;
    this.supportedFormats = this.detectSupportedFormats();
    
    this.init();
  }

  init() {
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      this.loadAllImages();
      return;
    }

    this.setupObserver();
    this.observeImages();
  }

  detectSupportedFormats() {
    const formats = {
      webp: false,
      avif: false,
      jpeg2000: false
    };

    // Test WebP support
    const webpCanvas = document.createElement('canvas');
    webpCanvas.width = 1;
    webpCanvas.height = 1;
    formats.webp = webpCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

    // Test AVIF support (basic check)
    const avifImg = new Image();
    avifImg.onload = () => { formats.avif = true; };
    avifImg.onerror = () => { formats.avif = false; };
    avifImg.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';

    return formats;
  }

  setupObserver() {
    const options = {
      rootMargin: '50px 0px',
      threshold: 0.01
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, options);
  }

  observeImages() {
    // Observe images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]:not([src])');
    lazyImages.forEach(img => {
      this.imageObserver.observe(img);
    });

    // Also observe images with loading="lazy" that don't have src yet
    const lazyLoadingImages = document.querySelectorAll('img[loading="lazy"]:not([src])');
    lazyLoadingImages.forEach(img => {
      if (img.dataset.src) {
        this.imageObserver.observe(img);
      }
    });

    // Observe picture elements
    const lazyPictures = document.querySelectorAll('picture[data-src]');
    lazyPictures.forEach(picture => {
      this.imageObserver.observe(picture);
    });
  }

  getOptimalImageSrc(img) {
    const baseSrc = img.dataset.src;
    if (!baseSrc) return null;

    // Check for WebP version if supported
    if (this.supportedFormats.webp && img.dataset.srcWebp) {
      return img.dataset.srcWebp;
    }

    // Check for AVIF version if supported
    if (this.supportedFormats.avif && img.dataset.srcAvif) {
      return img.dataset.srcAvif;
    }

    // Check for responsive sources
    if (img.dataset.srcset) {
      return this.selectResponsiveSource(img.dataset.srcset);
    }

    return baseSrc;
  }

  selectResponsiveSource(srcset) {
    const sources = srcset.split(',').map(src => {
      const parts = src.trim().split(' ');
      return {
        url: parts[0],
        descriptor: parts[1] || '1x'
      };
    });

    // Simple selection based on device pixel ratio
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    if (devicePixelRatio >= 2) {
      const highDpiSource = sources.find(src => src.descriptor.includes('2x'));
      if (highDpiSource) return highDpiSource.url;
    }

    return sources[0].url;
  }

  loadImage(element) {
    if (element.tagName === 'PICTURE') {
      this.loadPictureElement(element);
      return;
    }

    const src = this.getOptimalImageSrc(element);
    if (!src || this.loadedImages.has(src)) return;

    // Add loading class
    element.classList.add('lazy-loading');
    
    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      this.handleImageLoad(element, src);
    };
    
    imageLoader.onerror = () => {
      this.handleImageError(element, src);
    };
    
    // Start loading
    imageLoader.src = src;
  }

  loadPictureElement(picture) {
    const img = picture.querySelector('img');
    if (!img) return;

    const sources = picture.querySelectorAll('source[data-srcset]');
    
    // Load sources
    sources.forEach(source => {
      if (source.dataset.srcset) {
        source.srcset = source.dataset.srcset;
        delete source.dataset.srcset;
      }
    });

    // Load main image
    if (img.dataset.src) {
      this.loadImage(img);
    }
  }

  handleImageLoad(img, src) {
    // Set the source
    img.src = src;
    
    // Update classes
    img.classList.remove('lazy', 'lazy-loading');
    img.classList.add('loaded');
    
    // Mark as loaded
    this.loadedImages.add(src);
    
    // Remove data-src to prevent reprocessing
    delete img.dataset.src;
    
    // Dispatch load event
    img.dispatchEvent(new CustomEvent('lazyload', {
      detail: { src }
    }));
  }

  handleImageError(img, src) {
    const retryCount = this.retryAttempts.get(src) || 0;
    
    if (retryCount < this.maxRetries) {
      // Try fallback formats
      if (retryCount === 0 && img.dataset.src && src !== img.dataset.src) {
        // Retry with original format
        this.retryAttempts.set(src, retryCount + 1);
        setTimeout(() => {
          this.loadImageWithFallback(img, img.dataset.src);
        }, 1000);
        return;
      }
      
      // Retry loading
      this.retryAttempts.set(src, retryCount + 1);
      setTimeout(() => {
        this.loadImage(img);
      }, 1000 * (retryCount + 1)); // Exponential backoff
    } else {
      // Max retries reached, show error state
      img.classList.remove('lazy', 'lazy-loading');
      img.classList.add('lazy-error');
      this.failedImages.add(src);
      
      // Set alt text as fallback or show error placeholder
      if (img.alt) {
        img.title = `Failed to load: ${img.alt}`;
      }
      
      // Dispatch error event
      img.dispatchEvent(new CustomEvent('lazyerror', {
        detail: { src, retryCount }
      }));
    }
  }

  loadImageWithFallback(img, fallbackSrc) {
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      this.handleImageLoad(img, fallbackSrc);
    };
    
    imageLoader.onerror = () => {
      this.handleImageError(img, fallbackSrc);
    };
    
    imageLoader.src = fallbackSrc;
  }

  loadAllImages() {
    // Fallback for browsers without Intersection Observer
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      this.loadImage(img);
    });
  }

  // Public API
  refresh() {
    this.observeImages();
  }

  getStats() {
    return {
      loaded: this.loadedImages.size,
      failed: this.failedImages.size,
      retries: this.retryAttempts.size,
      supportedFormats: this.supportedFormats
    };
  }
}

// Initialize enhanced lazy loading
const lazyImageLoader = new LazyImageLoader();

// Make it globally available
window.lazyImageLoader = lazyImageLoader;

// Add format support classes to document
function addFormatSupportClasses() {
  const html = document.documentElement;
  const formats = lazyImageLoader.supportedFormats;
  
  // Add WebP support class
  if (formats.webp) {
    html.classList.add('webp');
  } else {
    html.classList.add('no-webp');
  }
  
  // Add AVIF support class
  if (formats.avif) {
    html.classList.add('avif');
  } else {
    html.classList.add('no-avif');
  }
  
  // Add JPEG 2000 support class
  if (formats.jpeg2000) {
    html.classList.add('jpeg2000');
  } else {
    html.classList.add('no-jpeg2000');
  }
}

// Initialize format detection
addFormatSupportClasses();

// Progressive image enhancement
function setupProgressiveImages() {
  const progressiveImages = document.querySelectorAll('.progressive-image');
  
  progressiveImages.forEach(container => {
    const img = container.querySelector('img');
    if (!img) return;
    
    container.classList.add('loading');
    
    img.addEventListener('load', () => {
      container.classList.remove('loading');
      container.classList.add('loaded');
    });
    
    img.addEventListener('error', () => {
      container.classList.remove('loading');
      container.classList.add('error');
    });
  });
}

// Initialize progressive images
document.addEventListener('DOMContentLoaded', setupProgressiveImages);

// Legacy support for existing lazy loading code
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      img.classList.add('loaded');
      observer.unobserve(img);
    }
  });
}, {
  rootMargin: '50px 0px',
  threshold: 0.01
});

lazyImages.forEach(img => imageObserver.observe(img));

// Performance optimization - Debounced scroll handler
let ticking = false;
function optimizedScrollHandler() {
  if (!ticking) {
    requestAnimationFrame(() => {
      // Existing scroll functionality
      const nav = document.getElementById('mainNav');
      if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 20);
      }
      highlightActiveLink();
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
}

// Replace multiple scroll listeners with single optimized handler
window.removeEventListener('scroll', highlightActiveLink);
window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// ============================================================
// EXISTING FUNCTIONALITY (OPTIMIZED)
// ============================================================

// Nav scroll effect
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ============================================================
// ENHANCED MOBILE NAVIGATION SYSTEM
// ============================================================

// Mobile navigation manager
class MobileNavigation {
  constructor() {
    this.navHamburger = document.getElementById('navHamburger');
    this.navLinks = document.getElementById('navLinks');
    this.navDropdowns = document.querySelectorAll('.nav-dropdown');
    this.navLinksAll = document.querySelectorAll('.nav-link');
    this.isOpen = false;
    this.focusableElements = [];
    
    this.init();
  }

  init() {
    if (!this.navHamburger || !this.navLinks) return;
    
    this.bindEvents();
    this.setupAccessibility();
    this.updateFocusableElements();
  }

  bindEvents() {
    // Hamburger menu toggle
    this.navHamburger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    // Close menu when clicking navigation links
    this.navLinksAll.forEach(link => {
      link.addEventListener('click', (e) => {
        // Only close if it's a hash link (internal navigation)
        if (link.getAttribute('href')?.startsWith('#')) {
          this.close();
        }
      });
    });

    // Dropdown toggle for mobile
    this.navDropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.nav-dropdown-toggle');
      if (toggle) {
        toggle.addEventListener('click', (e) => {
          // Only prevent default on mobile/tablet
          if (window.viewportManager && !window.viewportManager.isDesktop()) {
            e.preventDefault();
            this.toggleDropdown(dropdown);
          }
        });
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
        this.navHamburger.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.navLinks.contains(e.target) && !this.navHamburger.contains(e.target)) {
        this.close();
      }
    });

    // Handle viewport changes
    window.addEventListener('viewportChange', (e) => {
      if (e.detail.current === 'desktop' && this.isOpen) {
        this.close();
      }
    });

    // Prevent body scrolling when menu is open
    this.navLinks.addEventListener('transitionend', () => {
      if (this.isOpen) {
        this.preventBodyScroll();
      } else {
        this.allowBodyScroll();
      }
    });
  }

  setupAccessibility() {
    // Set up ARIA attributes
    this.navHamburger.setAttribute('aria-expanded', 'false');
    this.navHamburger.setAttribute('aria-controls', 'navLinks');
    this.navLinks.setAttribute('aria-hidden', 'true');
    
    // Add role to navigation
    this.navLinks.setAttribute('role', 'navigation');
    this.navLinks.setAttribute('aria-label', 'Main navigation');
  }

  updateFocusableElements() {
    this.focusableElements = this.navLinks.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    
    // Update classes
    this.navHamburger.classList.add('active');
    this.navLinks.classList.add('active');
    document.body.classList.add('nav-open');
    
    // Update ARIA attributes
    this.navHamburger.setAttribute('aria-expanded', 'true');
    this.navLinks.setAttribute('aria-hidden', 'false');
    
    // Focus management
    this.updateFocusableElements();
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
    
    // Trap focus within navigation
    this.trapFocus();
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('mobileNavOpen'));
  }

  close() {
    this.isOpen = false;
    
    // Update classes
    this.navHamburger.classList.remove('active');
    this.navLinks.classList.remove('active');
    document.body.classList.remove('nav-open');
    
    // Close all dropdowns
    this.navDropdowns.forEach(dropdown => {
      dropdown.classList.remove('active');
    });
    
    // Update ARIA attributes
    this.navHamburger.setAttribute('aria-expanded', 'false');
    this.navLinks.setAttribute('aria-hidden', 'true');
    
    // Remove focus trap
    this.removeFocusTrap();
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('mobileNavClose'));
  }

  toggleDropdown(dropdown) {
    const isActive = dropdown.classList.contains('active');
    
    // Close all other dropdowns
    this.navDropdowns.forEach(d => {
      if (d !== dropdown) {
        d.classList.remove('active');
      }
    });
    
    // Toggle current dropdown
    dropdown.classList.toggle('active', !isActive);
    
    // Update ARIA
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
    }
  }

  preventBodyScroll() {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.dataset.scrollY = scrollY.toString();
  }

  allowBodyScroll() {
    const scrollY = document.body.dataset.scrollY;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY));
      delete document.body.dataset.scrollY;
    }
  }

  trapFocus() {
    if (this.focusableElements.length === 0) return;
    
    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];
    
    this.focusTrapHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    document.addEventListener('keydown', this.focusTrapHandler);
  }

  removeFocusTrap() {
    if (this.focusTrapHandler) {
      document.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
  }
}

// Initialize mobile navigation
const mobileNavigation = new MobileNavigation();

// Make it globally available
window.mobileNavigation = mobileNavigation;

// ============================================================
// ENHANCED NAVIGATION FUNCTIONALITY
// ============================================================

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

// Ensure elements exist before observing
const animatedElements = document.querySelectorAll('.animate-on-scroll');
if (animatedElements.length > 0) {
  animatedElements.forEach(el => enhancedObserver.observe(el));
  
  // Fallback: Show animations after 2 seconds if observer fails
  setTimeout(() => {
    animatedElements.forEach(el => {
      if (!el.classList.contains('visible') && !el.classList.contains('in-view')) {
        el.classList.add('visible');
      }
    });
  }, 2000);
}

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