# Deployment Guide - BabyCue Website

## 📋 Pre-Deployment Checklist

- [ ] Test website locally in multiple browsers
- [ ] Verify all CSS styles are loading correctly
- [ ] Verify all JavaScript functionality works
- [ ] Check responsive design on mobile devices
- [ ] Validate HTML (https://validator.w3.org/)
- [ ] Test all internal links and anchors
- [ ] Verify Google Fonts are loading
- [ ] Check console for any errors

## 🚀 Deployment Options

### Option 1: Netlify (Easiest - Recommended)

1. **Via Drag & Drop**
   ```
   1. Go to https://app.netlify.com/drop
   2. Drag the entire project folder
   3. Done! Your site is live
   ```

2. **Via Git (Continuous Deployment)**
   ```bash
   # Initialize git (if not already)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Push to GitHub
   git remote add origin your-repo-url
   git push -u origin main
   
   # Connect to Netlify
   1. Go to Netlify Dashboard
   2. Click "New site from Git"
   3. Select your repository
   4. Deploy!
   ```

3. **Build Settings** (None needed!)
   - Build command: (leave empty)
   - Publish directory: `.` (root)

### Option 2: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /path/to/BabyCue
vercel

# Follow prompts
# Done!
```

**Or via Dashboard:**
1. Go to https://vercel.com/new
2. Import your Git repository
3. Deploy (no build configuration needed)

### Option 3: GitHub Pages

```bash
# Create gh-pages branch
git checkout -b gh-pages

# Push to GitHub
git push origin gh-pages

# Enable in Settings
1. Go to repository Settings
2. Pages section
3. Source: gh-pages branch
4. Save
```

Your site will be at: `https://username.github.io/repository-name/`

### Option 4: AWS S3 + CloudFront

```bash
# Install AWS CLI
# Configure credentials
aws configure

# Create S3 bucket
aws s3 mb s3://babycue-website

# Enable static website hosting
aws s3 website s3://babycue-website \
  --index-document index.html \
  --error-document index.html

# Upload files
aws s3 sync . s3://babycue-website \
  --exclude ".git/*" \
  --exclude "*.md"

# Make public
aws s3api put-bucket-policy \
  --bucket babycue-website \
  --policy file://bucket-policy.json
```

**bucket-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::babycue-website/*"
  }]
}
```

### Option 5: Traditional cPanel Hosting

1. **Via File Manager:**
   ```
   1. Login to cPanel
   2. Go to File Manager
   3. Navigate to public_html/
   4. Upload all files maintaining structure
   5. Done!
   ```

2. **Via FTP:**
   ```
   Host: ftp.yourdomain.com
   Username: your-username
   Password: your-password
   
   Upload to: /public_html/
   ```

### Option 6: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Select options:
# - Public directory: . (current directory)
# - Single-page app: No
# - GitHub deploys: Optional

# Deploy
firebase deploy
```

## 🔧 Post-Deployment Configuration

### Custom Domain Setup

**Netlify:**
```
1. Go to Domain settings
2. Add custom domain
3. Update DNS records:
   - Type: A
   - Name: @
   - Value: 75.2.60.5
   
   - Type: CNAME
   - Name: www
   - Value: your-site.netlify.app
```

**Vercel:**
```
1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com
```

### SSL Certificate

All recommended platforms (Netlify, Vercel, GitHub Pages) provide **free automatic SSL**.

For traditional hosting:
- Use Let's Encrypt (free)
- Or purchase SSL from hosting provider

### Performance Optimization

1. **Enable Gzip Compression**
   ```nginx
   # Nginx
   gzip on;
   gzip_types text/css application/javascript;
   ```

2. **Set Cache Headers**
   ```
   # .htaccess (Apache)
   <IfModule mod_expires.c>
     ExpiresActive On
     ExpiresByType text/css "access plus 1 year"
     ExpiresByType application/javascript "access plus 1 year"
   </IfModule>
   ```

3. **CDN Setup** (Optional)
   - Cloudflare (free tier available)
   - AWS CloudFront
   - Fastly

## 📊 Monitoring & Analytics

### Add Google Analytics

Add before `</head>` in `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Add Meta Pixel (Facebook)

Add before `</head>`:
```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

## 🔒 Security Headers

Add to hosting configuration:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Netlify** (`netlify.toml`):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

**Vercel** (`vercel.json`):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        }
      ]
    }
  ]
}
```

## 🧪 Testing After Deployment

1. **Functionality Test**
   - [ ] Navigation works
   - [ ] All sections scroll correctly
   - [ ] Chatbot opens/closes
   - [ ] All links work
   - [ ] Forms submit (if any)

2. **Performance Test**
   - Google PageSpeed Insights
   - GTmetrix
   - WebPageTest

3. **Mobile Test**
   - Chrome DevTools Device Mode
   - Real devices (iOS, Android)
   - BrowserStack (cross-browser)

4. **SEO Test**
   - Google Search Console
   - Bing Webmaster Tools
   - Submit sitemap

## 📱 Progressive Web App (Optional)

To make it a PWA, add:

1. **manifest.json**
2. **Service Worker**
3. **Icons** (192x192, 512x512)

## 🆘 Troubleshooting

### CSS Not Loading
```
✓ Check file path: href="css/styles.css"
✓ Verify file uploaded correctly
✓ Check browser console for 404 errors
✓ Clear browser cache
```

### JavaScript Not Working
```
✓ Check file path: src="js/script.js"
✓ Verify defer attribute is present
✓ Check browser console for errors
✓ Test in incognito mode
```

### Fonts Not Loading
```
✓ Check internet connection (Google Fonts CDN)
✓ Verify font link in <head>
✓ Check browser console for CORS errors
```

## 📞 Support

Need help with deployment?
- Email: info@babycue.in
- Phone: +91 8637221566

---

**Recommended Platform**: Netlify (easiest, free SSL, CDN included)
