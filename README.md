# LeetCode Case Opener 🎰

A fun CS:GO-style case opening simulator for LeetCode problems! Make practicing algorithms more exciting by simulating case openings to decide which problem to solve.

## Features

- 🎮 CS:GO-style case opening animation
- 🔊 Sound effects (case open, spinning, stop, gold reveal)
- 🎨 Tier system matching CS:GO rarity (Blue, Purple, Pink, Red, Gold)
- 📝 Automatically reads problems from `learned.txt`
- 🎲 Weighted probability system based on CS:GO drop rates
- 📱 Mobile-responsive design
- 🌐 Works in any browser (desktop & mobile)

## Live Demo

After deploying to GitHub Pages, your site will be live at:
```
https://YOUR_USERNAME.github.io/leetcode_roulett
```

See [DEPLOY.md](DEPLOY.md) for deployment instructions.

## Setup

### Option 1: Use GitHub Pages (Recommended)

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select source: `main` branch, `/ (root)` folder
4. Your site will be live at `https://yourusername.github.io/leetcode_roulett`

### Option 2: Local Development

1. Clone this repository
2. Open `index.html` in your browser
3. Or use a local server:
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`

## Usage

1. **Load Problems**:
   - Option A: Upload your `learned.txt` file using the file input
   - Option B: The app will try to load `learned.txt` from the repository
   - Option C: Use the default problems included

2. **Open a Case**: Click "OPEN CASE" to reveal a random problem!

3. **Add Problems**: Edit `learned.txt` and reload, or use the file input

## File Format

Your `learned.txt` should have one problem per line:
```
212. Word Search II
121. Best Time to Buy and Sell Stock
70. Climbing Stairs
1. Two Sum
```

## Tier System

Problems are assigned to tiers with the following probabilities (matching CS:GO):

- **Mil-Spec (Blue)** - 79.92% - Most common
- **Restricted (Purple)** - 15.98%
- **Classified (Pink)** - 3.20%
- **Covert (Red)** - 0.64%
- **Exceedingly Rare (Gold)** - 0.26% - Rarest!

## How It Works

1. Problems from `learned.txt` are randomly distributed across tiers
2. When you open a case, the tier is selected based on CS:GO probabilities
3. A random problem from that tier is revealed
4. The color-coded result shows your challenge!

## Technical Details

- Pure JavaScript (no build step required)
- Web Audio API for sound effects
- CSS animations for smooth visuals
- Responsive design for mobile devices
- Works offline after initial load

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Enjoy practicing LeetCode with a fun twist! 🚀
