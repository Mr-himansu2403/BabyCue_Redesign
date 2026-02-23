# 🧹 Git Repository Cleanup Guide

## Current Status
Your repository has:
- ✅ Git already initialized
- 📝 4 deleted files (documentation cleanup)
- ✏️ 3 modified files (index.html, README.md, css/styles.css)
- 📁 Untracked files (PROJECT-INVENTORY.md, assets/ folder with fonts)

---

## 🚀 Step-by-Step Git Cleanup Commands

### Step 1: Check Current Status
```bash
git status
```
**What it shows:** All untracked, modified, and deleted files

---

### Step 2: Stage All Changes (Add, Modify, Delete)
```bash
git add -A
```
**What it does:**
- Stages all modified files
- Stages all new/untracked files
- Stages all deleted files
- `-A` = stages everything in the entire working tree

**Alternative commands (same result):**
```bash
git add .              # Stages everything in current directory
git add --all          # Same as -A (verbose)
```

---

### Step 3: Verify Staging
```bash
git status
```
**Expected output:**
```
On branch master
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   PROJECT-INVENTORY.md
        new file:   assets/fonts/fonts.css
        new file:   assets/fonts/[9 font files]
        new file:   assets/images/Logo_BabyCue.png
        modified:   README.md
        modified:   css/styles.css
        modified:   index.html
        deleted:    CLEANUP-SUMMARY.md
        deleted:    DEPLOYMENT.md
        deleted:    PRODUCTION-DEPLOYMENT.md
        deleted:    PRODUCTION-READY.md
        deleted:    docs/project-overview.md
```

---

### Step 4: Commit All Changes
```bash
git commit -m "Optimize website: self-hosted fonts, cleanup docs, performance improvements"
```

**What it does:**
- Commits all staged changes
- `-m` = commit message
- Creates a snapshot of current state

**Alternative with detailed message:**
```bash
git commit -m "Optimize website performance and cleanup

- Convert to self-hosted fonts (156 KB, 70% faster loading)
- Remove Google Fonts CDN dependency (0 external requests)
- Download all 9 font files (Sora, DM Serif Display, JetBrains Mono)
- Clean up unnecessary documentation files
- Update README with new font setup instructions
- Add PROJECT-INVENTORY.md with complete file breakdown
- Total size: 290 KB, load time <2 seconds"
```

---

### Step 5: Verify Clean State
```bash
git status
```
**Expected output:**
```
On branch master
nothing to commit, working tree clean
```
✅ **Success!** Repository is now clean.

---

### Step 6: View Commit History
```bash
git log --oneline -5
```
**What it shows:** Last 5 commits in one line each

**Or detailed view:**
```bash
git log -1
```
**What it shows:** Full details of last commit

---

## 📋 Complete Command Sequence (Copy & Paste)

```bash
# 1. Check status
git status

# 2. Stage all changes
git add -A

# 3. Verify staging
git status

# 4. Commit with message
git commit -m "Optimize website: self-hosted fonts, cleanup docs, performance improvements"

# 5. Verify clean state
git status

# 6. View commit
git log --oneline -1
```

---

## 🔄 If You Have a Remote Repository (GitHub, GitLab, etc.)

### Push to Remote
```bash
# Check remote
git remote -v

# Push to main/master branch
git push origin master
# or
git push origin main
```

### If No Remote Yet (First Time Setup)
```bash
# Add remote repository
git remote add origin https://github.com/yourusername/babycue-website.git

# Push and set upstream
git push -u origin master
```

---

## 🛡️ Best Practices for Future Development

### 1. Check Status Frequently
```bash
git status
```
Run this before and after making changes.

### 2. Stage Changes Incrementally
```bash
# Stage specific file
git add index.html

# Stage specific folder
git add assets/

# Stage all CSS files
git add *.css

# Stage everything
git add -A
```

### 3. Commit Often with Clear Messages
```bash
# Good commit messages
git commit -m "Add hero section animation"
git commit -m "Fix mobile navigation bug"
git commit -m "Update contact information"

# Bad commit messages (avoid)
git commit -m "updates"
git commit -m "fix"
git commit -m "changes"
```

### 4. Use .gitignore for Files You Don't Want to Track
Your `.gitignore` already includes:
```
node_modules/
.DS_Store
*.log
.env
```

**Add more if needed:**
```bash
# Edit .gitignore
echo "*.tmp" >> .gitignore
echo ".vscode/" >> .gitignore
```

### 5. View Changes Before Committing
```bash
# See what changed in files
git diff

# See what's staged
git diff --staged

# See changes in specific file
git diff index.html
```

### 6. Undo Changes (If Needed)

**Unstage file (keep changes):**
```bash
git restore --staged index.html
```

**Discard changes in file (dangerous!):**
```bash
git restore index.html
```

**Undo last commit (keep changes):**
```bash
git reset --soft HEAD~1
```

**Undo last commit (discard changes - dangerous!):**
```bash
git reset --hard HEAD~1
```

---

## 📊 Useful Git Commands Reference

### Status & Info
```bash
git status                    # Current status
git log                       # Commit history
git log --oneline            # Compact history
git log --graph --oneline    # Visual branch history
git diff                     # Unstaged changes
git diff --staged            # Staged changes
git show                     # Last commit details
```

### Staging
```bash
git add <file>               # Stage specific file
git add .                    # Stage current directory
git add -A                   # Stage everything
git add *.css                # Stage all CSS files
git restore --staged <file>  # Unstage file
```

### Committing
```bash
git commit -m "message"      # Commit with message
git commit -am "message"     # Stage & commit modified files
git commit --amend           # Edit last commit
```

### Branches
```bash
git branch                   # List branches
git branch <name>            # Create branch
git checkout <name>          # Switch branch
git checkout -b <name>       # Create & switch
git merge <branch>           # Merge branch
git branch -d <name>         # Delete branch
```

### Remote
```bash
git remote -v                # List remotes
git push origin master       # Push to remote
git pull origin master       # Pull from remote
git fetch                    # Fetch updates
git clone <url>              # Clone repository
```

---

## 🎯 Your Specific Cleanup Summary

**Files to be committed:**
- ✅ 1 new file: `PROJECT-INVENTORY.md`
- ✅ 10 new files: `assets/fonts/` (fonts.css + 9 woff2 files)
- ✅ 1 new file: `assets/images/Logo_BabyCue.png`
- ✅ 3 modified: `index.html`, `README.md`, `css/styles.css`
- ✅ 5 deleted: Documentation cleanup files

**Total changes:** ~20 file operations

**Commit message suggestion:**
```
"Optimize website: self-hosted fonts, cleanup docs, performance improvements"
```

---

## ✅ After Running Commands

Your repository will be:
- 🟢 **Clean** - No untracked files
- 🟢 **Committed** - All changes saved
- 🟢 **Tracked** - All files in Git
- 🟢 **Ready** - For deployment or push to remote

---

## 🆘 Troubleshooting

### Problem: "fatal: not a git repository"
**Solution:**
```bash
git init
git add -A
git commit -m "Initial commit"
```

### Problem: Large files warning
**Solution:**
```bash
# Check file sizes
git ls-files -s | awk '{print $4, $2}' | sort -n -r | head -10

# If needed, use Git LFS for large files
git lfs install
git lfs track "*.woff2"
```

### Problem: Merge conflicts
**Solution:**
```bash
# View conflicts
git status

# Edit conflicted files manually
# Then:
git add <resolved-file>
git commit -m "Resolve merge conflicts"
```

---

**Ready to clean your repository? Run the commands above!** 🚀
