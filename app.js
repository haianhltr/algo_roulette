// CS:GO Tier Probabilities
const TIER_PROBABILITIES = {
    "Mil-Spec (Blue)": 79.92,
    "Restricted (Purple)": 15.98,
    "Classified (Pink)": 3.20,
    "Covert (Red)": 0.64,
    "Exceedingly Rare (Gold)": 0.26
};

const TIER_COLORS = {
    "Mil-Spec (Blue)": "#4B69FF",
    "Restricted (Purple)": "#8847FF",
    "Classified (Pink)": "#D32CE6",
    "Covert (Red)": "#EB4B4B",
    "Exceedingly Rare (Gold)": "#FFD700"
};

const TIER_CLASSES = {
    "Mil-Spec (Blue)": "tier-blue",
    "Restricted (Purple)": "tier-purple",
    "Classified (Pink)": "tier-pink",
    "Covert (Red)": "tier-red",
    "Exceedingly Rare (Gold)": "tier-gold"
};

class CaseOpener {
    constructor() {
        this.problems = [];
        this.tieredProblems = {};
        this.isOpening = false;
        this.selectedProblem = null;
        this.selectedTier = null;
        this.fakeItems = [];
        this.animationStartTime = null;
        this.animationDuration = 3500; // 3.5 seconds
        this.lastSpinSoundTime = 0;
        
        this.initializeAudio();
        this.setupEventListeners();
        this.loadDefaultProblems();
    }
    
    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.soundsEnabled = true;
        } catch (e) {
            this.soundsEnabled = false;
            console.warn("Audio not supported");
        }
    }
    
    setupEventListeners() {
        document.getElementById('openButton').addEventListener('click', () => this.openCase());
        document.getElementById('fileInput').addEventListener('change', (e) => this.loadFile(e));
    }
    
    loadDefaultProblems() {
        // Try to load from learned.txt if available (for GitHub Pages, use a default set)
        const defaultProblems = [
            "212. Word Search II",
            "121. Best Time to Buy and Sell Stock",
            "70. Climbing Stairs",
            "1. Two Sum",
            "322. Coin Change",
            "55. Jump Game",
            "200. Number of Islands",
            "3. Longest Substring Without Repeating Characters",
            "347. Top K Frequent Elements"
        ];
        
        // Try to fetch learned.txt
        fetch('learned.txt')
            .then(response => response.text())
            .then(text => {
                const lines = text.split('\n').filter(line => line.trim());
                if (lines.length > 0) {
                    this.problems = lines;
                } else {
                    this.problems = defaultProblems;
                }
                this.assignTiers();
                this.updateProblemCount();
            })
            .catch(() => {
                // If file doesn't exist, use defaults
                this.problems = defaultProblems;
                this.assignTiers();
                this.updateProblemCount();
            });
    }
    
    loadFile(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                this.problems = text.split('\n').filter(line => line.trim());
                this.assignTiers();
                this.updateProblemCount();
            };
            reader.readAsText(file);
        }
    }
    
    assignTiers() {
        if (this.problems.length === 0) {
            this.tieredProblems = {
                "Mil-Spec (Blue)": [],
                "Restricted (Purple)": [],
                "Classified (Pink)": [],
                "Covert (Red)": [],
                "Exceedingly Rare (Gold)": []
            };
            return;
        }
        
        const shuffled = [...this.problems].sort(() => Math.random() - 0.5);
        const total = shuffled.length;
        
        this.tieredProblems = {
            "Mil-Spec (Blue)": [],
            "Restricted (Purple)": [],
            "Classified (Pink)": [],
            "Covert (Red)": [],
            "Exceedingly Rare (Gold)": []
        };
        
        let index = 0;
        const tiers = Object.keys(TIER_PROBABILITIES);
        
        tiers.forEach((tier, i) => {
            if (i === tiers.length - 1) {
                this.tieredProblems[tier] = shuffled.slice(index);
            } else {
                let count;
                if (tier === "Mil-Spec (Blue)") {
                    count = Math.max(1, Math.floor(total * 0.5));
                } else if (tier === "Restricted (Purple)") {
                    count = Math.max(1, Math.floor(total * 0.3));
                } else if (tier === "Classified (Pink)") {
                    count = Math.max(1, Math.floor(total * 0.15));
                } else if (tier === "Covert (Red)") {
                    count = Math.max(1, Math.floor(total * 0.05));
                } else {
                    count = 1;
                }
                this.tieredProblems[tier] = shuffled.slice(index, index + count);
                index += count;
            }
        });
    }
    
    openCase() {
        if (this.isOpening) return;
        
        if (this.problems.length === 0) {
            alert("Please add problems first!");
            return;
        }
        
        this.isOpening = true;
        const openButton = document.getElementById('openButton');
        openButton.disabled = true;
        openButton.textContent = "OPENING...";
        
        // Hide previous result
        document.getElementById('revealArea').style.display = 'none';
        
        // Determine result FIRST (like CS:GO)
        const rand = Math.random() * 100;
        let cumulative = 0;
        let selectedTier = "Mil-Spec (Blue)";
        
        for (const [tier, probability] of Object.entries(TIER_PROBABILITIES)) {
            cumulative += probability;
            if (rand <= cumulative) {
                selectedTier = tier;
                break;
            }
        }
        
        const tierProblems = this.tieredProblems[selectedTier] || [];
        this.selectedProblem = tierProblems.length > 0 
            ? tierProblems[Math.floor(Math.random() * tierProblems.length)]
            : this.problems[Math.floor(Math.random() * this.problems.length)];
        this.selectedTier = selectedTier;
        
        // Play case open sound
        this.playCaseOpen();
        
        // Hide case, show scroll
        document.getElementById('caseArea').style.display = 'none';
        document.getElementById('scrollArea').style.display = 'block';
        
        // Generate fake items
        this.generateFakeItems(100);
        
        // Insert selected item at position 50
        this.fakeItems.splice(50, 0, { problem: this.selectedProblem, tier: this.selectedTier });
        
        // Start animation
        this.animationStartTime = Date.now();
        this.lastSpinSoundTime = Date.now();
        this.animateScroll();
    }
    
    generateFakeItems(count) {
        this.fakeItems = [];
        
        for (let i = 0; i < count; i++) {
            const rand = Math.random() * 100;
            let cumulative = 0;
            let selectedTier = "Mil-Spec (Blue)";
            
            for (const [tier, probability] of Object.entries(TIER_PROBABILITIES)) {
                cumulative += probability;
                if (rand <= cumulative) {
                    selectedTier = tier;
                    break;
                }
            }
            
            const tierProblems = this.tieredProblems[selectedTier] || [];
            const problem = tierProblems.length > 0
                ? tierProblems[Math.floor(Math.random() * tierProblems.length)]
                : this.problems[Math.floor(Math.random() * this.problems.length)];
            
            this.fakeItems.push({ problem, tier: selectedTier });
        }
    }
    
    animateScroll() {
        const elapsed = Date.now() - this.animationStartTime;
        const progress = Math.min(elapsed / this.animationDuration, 1.0);
        
        // Ease-out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        // Calculate scroll position - center the selected card
        const cardWidth = 200;
        const cardSpacing = 10;
        const scrollArea = document.getElementById('scrollArea');
        const scrollAreaRect = scrollArea.getBoundingClientRect();
        const scrollAreaWidth = scrollAreaRect.width;
        const scrollAreaCenter = scrollAreaWidth / 2;
        
        const insertPos = 50;
        const cardLeftPos = insertPos * (cardWidth + cardSpacing);
        // Target: card center should be at scroll area center
        // card center = cardLeftPos - scrollPosition + cardWidth/2
        // We want: card center = scrollAreaCenter
        // So: scrollPosition = cardLeftPos + cardWidth/2 - scrollAreaCenter
        const targetPosition = cardLeftPos + cardWidth / 2 - scrollAreaCenter;
        const startPos = -cardWidth * 2;
        const totalDistance = targetPosition - startPos;
        const scrollPosition = startPos + (totalDistance * easedProgress);
        
        // Play spinning sound
        const speedFactor = Math.max(0.1, 1.0 - progress * 0.9);
        const now = Date.now();
        if (now - this.lastSpinSoundTime > 50) {
            this.playSpin(speedFactor);
            this.lastSpinSoundTime = now;
        }
        
        // Render cards
        this.renderCards(scrollPosition, progress < 1.0);
        
        if (progress < 1.0) {
            requestAnimationFrame(() => this.animateScroll());
        } else {
            // Animation complete
            this.playStop();
            this.renderCards(targetPosition, false);
            
            // Hold for 0.5 seconds
            setTimeout(() => {
                this.revealItem();
            }, 500);
        }
    }
    
    renderCards(scrollPosition, isAnimating) {
        const container = document.getElementById('scrollContainer');
        const scrollArea = document.getElementById('scrollArea');
        container.innerHTML = '';
        
        const cardWidth = 200;
        const cardSpacing = 10;
        const scrollAreaRect = scrollArea.getBoundingClientRect();
        const scrollAreaWidth = scrollAreaRect.width;
        const scrollAreaCenter = scrollAreaWidth / 2;
        
        this.fakeItems.forEach((item, i) => {
            // Calculate card position relative to scroll container (0,0 at top-left of container)
            const cardLeftInList = i * (cardWidth + cardSpacing);
            const x = cardLeftInList - scrollPosition;
            const cardCenter = x + cardWidth / 2;
            
            // Check if card is visible (center should be within reasonable bounds)
            const isVisible = cardCenter > -cardWidth && cardCenter < scrollAreaWidth + cardWidth;
            
            if (isVisible) {
                const isSelected = item.problem === this.selectedProblem && item.tier === this.selectedTier;
                const card = document.createElement('div');
                card.className = `item-card ${TIER_CLASSES[item.tier]} ${isSelected ? 'selected' : isAnimating ? 'dimmed' : ''}`;
                card.style.left = `${x}px`;
                card.style.position = 'absolute';
                
                const problemText = document.createElement('div');
                problemText.className = 'problem-text';
                problemText.textContent = item.problem.length > 30 ? item.problem.substring(0, 30) + '...' : item.problem;
                
                const tierText = document.createElement('div');
                tierText.className = 'tier-text';
                tierText.textContent = item.tier.split()[0];
                
                card.appendChild(problemText);
                card.appendChild(tierText);
                container.appendChild(card);
            }
        });
    }
    
    revealItem() {
        if (this.selectedTier === "Exceedingly Rare (Gold)") {
            this.playGoldReveal();
            // Gold flash
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const flash = document.createElement('div');
                    flash.className = 'gold-flash';
                    document.body.appendChild(flash);
                    setTimeout(() => flash.remove(), 160);
                }, i * 160);
            }
        }
        
        // Show reveal area
        const revealArea = document.getElementById('revealArea');
        revealArea.style.display = 'block';
        
        document.getElementById('problemLabel').textContent = this.selectedProblem;
        document.getElementById('problemLabel').style.color = TIER_COLORS[this.selectedTier];
        
        document.getElementById('tierLabel').textContent = `Tier: ${this.selectedTier}`;
        document.getElementById('tierLabel').style.color = TIER_COLORS[this.selectedTier];
        
        this.isOpening = false;
        document.getElementById('openButton').disabled = false;
        document.getElementById('openButton').textContent = "OPEN CASE";
        
        setTimeout(() => {
            alert(`Case Opened! 🎉\n\nYou got: ${this.selectedProblem}\n\nTier: ${this.selectedTier}\n\nTime to solve it!`);
        }, 500);
    }
    
    updateProblemCount() {
        document.getElementById('problemCount').textContent = this.problems.length;
    }
    
    // Sound Functions
    playCaseOpen() {
        if (!this.soundsEnabled) return;
        this.playClick(900, 0.15);
    }
    
    playSpin(speedFactor) {
        if (!this.soundsEnabled) return;
        const freq = 250 * speedFactor;
        this.playTone(freq, 0.05, 0.3);
    }
    
    playStop() {
        if (!this.soundsEnabled) return;
        this.playClick(600, 0.08);
    }
    
    playGoldReveal() {
        if (!this.soundsEnabled) return;
        const duration = 0.5;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                const t = i / sampleRate;
                const freq = 400 + (t / duration) * 400;
                const envelope = Math.exp(-t * 2);
                channelData[i] = 0.7 * envelope * (
                    Math.sin(2 * Math.PI * freq * t) +
                    0.5 * Math.sin(2 * Math.PI * freq * 2 * t)
                );
            }
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start();
    }
    
    playClick(frequency, duration) {
        if (!this.soundsEnabled) return;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                const t = i / sampleRate;
                const envelope = Math.exp(-t * 15) * (1 - t / duration);
                channelData[i] = 0.6 * envelope * Math.sin(2 * Math.PI * frequency * t);
            }
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start();
    }
    
    playTone(frequency, duration, volume) {
        if (!this.soundsEnabled) return;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                const t = i / sampleRate;
                channelData[i] = volume * Math.sin(2 * Math.PI * frequency * t) * (1 + 0.1 * Math.sin(2 * Math.PI * 5 * t));
            }
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start();
    }
}

// Initialize app when page loads
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new CaseOpener();
});

// Handle audio context on user interaction (required by browsers)
document.addEventListener('click', () => {
    if (app && app.audioContext && app.audioContext.state === 'suspended') {
        app.audioContext.resume();
    }
}, { once: true });

