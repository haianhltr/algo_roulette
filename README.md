# LeetCode Case Opener 🎰

A fun CS:GO-style case opening simulator for LeetCode problems! Make practicing algorithms more exciting by simulating case openings to decide which problem to solve.

## Features

- 🎮 CS:GO-style case opening animation
- 🔊 Sound effects (case open, spinning, stop, gold reveal)
- 🎨 Tier system matching CS:GO rarity (Blue, Purple, Pink, Red, Gold)
- 📝 Automatically reads problems from `learned.txt`
- 🎲 Weighted probability system based on CS:GO drop rates

## Setup

1. Activate your virtual environment:
   ```bash
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   
   # Windows CMD
   venv\Scripts\activate.bat
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   
   This installs:
   - `pygame` - For CS:GO-style sound effects
   - `numpy` - For sound generation

## Usage

1. Add your learned LeetCode problems to `learned.txt` (one per line):
   ```
   212. Word Search II
   121. Best Time to Buy and Sell Stock
   15. 3Sum
   ```

2. Run the case opener:
   ```bash
   python case_opener.py
   ```

3. Click "OPEN CASE" to reveal a random problem!

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

Enjoy practicing LeetCode with a fun twist! 🚀

