# 🚀 Production Deployment Guide

**Project**: BabyCue Website  
**Type**: Static HTML/CSS/JS  
**Status**: ✅ Production-Ready  
**Last Updated**: February 22, 2026

---

## 📦 Production Package Contents

Your website is now optimized for direct server upload. Here's what to deploy:

### ✅ Required Files & Folders

```
babycue-website/
├── index.html              # Main website (REQUIRED)
├── css/
│   └── styles.css          # All styles (REQUIRED)
├── js/
│   └── script.js           # All functionality (REQUIRED)
└── assets/                 # Media files (REQUIRED structure)
    ├── images/             # Add your images here
    ├── icons/              # Add your icons here
    ├── fonts/              # Add custom fonts here
    └── favicons/           # Add favicon files here
```

### 📄 Optional Files (Documentation)
```
├── README.md               # Project documentation
├── LICENSE                 # MIT License
├── DEPLOYMENT.md           # Deployment guides
├── CLEANUP-SUMMARY.md      # Cleanup report
└── docs/
    └── project-overview.md # Technical docs
```

---

## 🌐 Deployment Methods

### Method 1: FTP/cPanel Upload (Recommended for Custom Hosting)

#### Step 1: Connect to Your Server
1. Open your FTP client (FileZilla, WinSCP, or cPanel File Manager)
2. Connect using your hosting credentials:
   - Host: `ftp.yourdomain.com`
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21 (FTP) or 22 (SFTP)

#### Step 2: Upload Files
1. Navigate to your website root directory:
   - Usually: `/public_html/` or `/www/` or `/htdocs/`
2. Upload these folders and files:
   ```
   ✅ index.html
   ✅ css/ (entire folder)
   ✅ js/ (entire folder)
   ✅ assets/ (entire folder)
   ```

#### Step 3: Set Permissions (if needed)
```bash
# Files: 644
# Folders: 755
chmod 644 index.html
chmod 644 css/styles.css
chmod 644 js/script.js
chmod 755 css/
chmod 755 js/
chmod 755 assets/
```

#### Step 4: Test
- Visit: `https://yourdomain.com`
- Check all sections load correctly
- Test navigation and animations

---

### Method 2: cPanel File Manager (No FTP Client Needed)

1. **Login to cPanel**
   - Go to: `https://yourdomain.com/cpanel`
   - Enter your credentials

2. **Open File Manager**
   - Click "File Manager" icon
   - Navigate to `public_html/`

3. **Upload Files**
   - Click "Upload" button
   - Select and upload:
     - `index.html`
     - `css/` folder (as ZIP, then extract)
     - `js/` folder (as ZIP, then extract)
     - `assets/` folder (as ZIP, then extract)

4. **Extract ZIP Files** (if uploaded as ZIP)
   - Right-click each ZIP file
   - Select "Extract"
   - Delete ZIP files after extraction

5. **Verify Structure**
   ```
   public_html/
   ├── index.html
   ├── css/
   ├── js/
   └── assets/
   ```

---

### Method 3: GitHub Pages (Free Hosting)

#### Quick Deploy
```bash
# 1. Commit all changes
git add -A
git commit -m "Production ready deployment"

# 2. Push to GitHub
git push origin master

# 3. Enable GitHub Pages
# Go to: Repository Settings → Pages
# Source: master branch → Save
```

**Your site will be live at:**  
`https://yourusername.github.io/babycue-website/`

---

### Method 4: Vercel (Free, Fast CDN)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (one command)
vercel --prod

# Follow prompts, done!
```

**Features:**
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ Automatic deployments
- ✅ Custom domain support

---

### Method 5: Netlify (Drag & Drop)

1. Go to: https://app.netlify.com/drop
2. Drag your entire project folder
3. Done! Your site is live

**Or use CLI:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

---

## 🔧 Server Configuration

### Apache (.htaccess) - Optional Optimizations

Create `.htaccess` in your root directory:

```apache
# Enable GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Force HTTPS (if SSL enabled)
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove .html extension
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^([^\.]+)$ $1.html [NC,L]
```

---

## 📊 Pre-Deployment Checklist

### ✅ Before Upload
- [ ] Test website locally (`start index.html`)
- [ ] Verify all links work
- [ ] Check responsive design (mobile/tablet/desktop)
- [ ] Test all animations and interactions
- [ ] Verify contact email addresses
- [ ] Check external links (Google Play Store, etc.)

### ✅ After Upload
- [ ] Visit your live URL
- [ ] Test all navigation links
- [ ] Check chatbot functionality
- [ ] Verify smooth scroll works
- [ ] Test on mobile devices
- [ ] Check page load speed
- [ ] Verify SSL certificate (if applicable)

---

## 🎯 File Size & Performance

### Current Stats
- **HTML**: ~50 KB
- **CSS**: ~75 KB
- **JS**: ~2 KB
- **Total**: ~127 KB (without images)
- **Load Time**: <2 seconds

### Optimization Tips
1. **Images**: Use WebP format, compress before upload
2. **Fonts**: Already using Google Fonts CDN (optimized)
3. **CSS/JS**: Already minified and optimized
4. **Caching**: Use .htaccess rules above

---

## 🌍 Custom Domain Setup

### If Using Custom Domain

1. **Update DNS Records** (at your domain registrar):
   ```
   Type: A Record
   Name: @
   Value: [Your server IP]
   TTL: 3600

   Type: CNAME
   Name: www
   Value: yourdomain.com
   TTL: 3600
   ```

2. **Wait for DNS Propagation** (up to 48 hours)

3. **Enable SSL Certificate** (in cPanel or hosting panel)
   - Use Let's Encrypt (free)
   - Or upload custom SSL certificate

---

## 📱 Adding Your Assets

### Images
Place your images in: `assets/images/`
```html
<!-- Reference in HTML -->
<img src="assets/images/your-image.jpg" alt="Description">
```

### Icons
Place your icons in: `assets/icons/`
```html
<!-- Reference in HTML -->
<img src="assets/icons/your-icon.svg" alt="Icon">
```

### Favicons
Place favicon files in: `assets/favicons/`
```html
<!-- Add to <head> in index.html -->
<link rel="icon" type="image/png" href="assets/favicons/favicon-32x32.png">
```

---

## 🔍 Testing Your Deployment

### Online Tools
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- **SSL Test**: https://www.ssllabs.com/ssltest/

### Expected Results
- ✅ PageSpeed Score: 90+
- ✅ Mobile-Friendly: Yes
- ✅ SSL Grade: A
- ✅ Load Time: <2s

---

## 🆘 Troubleshooting

### Issue: CSS/JS Not Loading
**Solution**: Check file paths are relative:
```html
✅ Correct: href="css/styles.css"
❌ Wrong: href="/css/styles.css"
```

### Issue: 404 Error on Homepage
**Solution**: Ensure `index.html` is in root directory

### Issue: Animations Not Working
**Solution**: Check JavaScript is loading:
```html
<script src="js/script.js" defer></script>
```

### Issue: Slow Loading
**Solution**: 
1. Enable GZIP compression (.htaccess)
2. Optimize images (compress, use WebP)
3. Enable browser caching

---

## 📞 Support

**For Hosting Issues:**
- Contact your hosting provider's support
- Check cPanel documentation
- Review server error logs

**For Website Issues:**
- Email: info@babycue.in
- Check browser console for errors (F12)

---

## ✅ Deployment Complete!

Once uploaded, your BabyCue website will be live and accessible at your domain.

**Next Steps:**
1. ✅ Upload files to server
2. ✅ Test all functionality
3. ✅ Add your images to `assets/` folders
4. ✅ Configure SSL certificate
5. ✅ Submit to Google Search Console
6. ✅ Set up Google Analytics (optional)

---

**Deployment Guide Version**: 1.0  
**Last Updated**: February 22, 2026  
**Status**: ✅ Production-Ready
