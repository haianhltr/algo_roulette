# Deployment Guide - GitHub Pages

## Quick Setup (5 minutes)

### Step 1: Push to GitHub

1. Make sure all files are committed:
   ```bash
   git add .
   git commit -m "Add web version for GitHub Pages"
   git push origin main
   ```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### Step 3: Access Your Site

Your site will be live at:
```
https://YOUR_USERNAME.github.io/leetcode_roulett
```

Replace `YOUR_USERNAME` with your GitHub username.

## Files Structure

Make sure these files are in your repository root:
```
├── index.html      (Main HTML file)
├── style.css       (Styles)
├── app.js          (JavaScript logic)
├── learned.txt     (Your problems - optional)
└── README.md       (Documentation)
```

## Custom Domain (Optional)

If you want a custom domain:
1. Add a `CNAME` file with your domain name
2. Update DNS settings as per GitHub Pages instructions

## Troubleshooting

**Site not loading?**
- Wait 1-2 minutes after enabling Pages
- Check Settings → Pages for any errors
- Make sure `index.html` is in the root folder

**Problems not loading?**
- The app will use default problems if `learned.txt` isn't found
- Users can upload their own `learned.txt` file via the file input

**Sounds not working?**
- Some browsers require user interaction before playing audio
- Click anywhere on the page first, then try opening a case

## Mobile Testing

Test on your phone:
1. Open the GitHub Pages URL
2. Add to home screen (optional)
3. Works offline after first load!

