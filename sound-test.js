class SoundTester {
    constructor() {
        this.audioContext = null;
        this.selections = {
            caseOpen: null,
            spin: null,
            stop: null,
            gold: null
        };
        
        this.initializeAudio();
        this.createSoundVariations();
    }
    
    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            alert("Audio not supported in this browser");
        }
    }
    
    createSoundVariations() {
        // Case Open Sounds (10 variations)
        const caseOpenVariations = [
            { name: "Sharp Click", desc: "High, quick", freq: 1000, dur: 0.1 },
            { name: "Metallic Snap", desc: "Medium, crisp", freq: 900, dur: 0.15 },
            { name: "Deep Thud", desc: "Low, heavy", freq: 600, dur: 0.2 },
            { name: "Quick Pop", desc: "Very fast", freq: 800, dur: 0.08 },
            { name: "Resonant Click", desc: "Echoing", freq: 700, dur: 0.12 },
            { name: "Bright Snap", desc: "High pitch", freq: 1200, dur: 0.1 },
            { name: "Solid Click", desc: "Medium pitch", freq: 750, dur: 0.15 },
            { name: "Sharp Ping", desc: "Very high", freq: 1500, dur: 0.09 },
            { name: "Muffled Click", desc: "Low, soft", freq: 500, dur: 0.18 },
            { name: "Crisp Snap", desc: "Balanced", freq: 850, dur: 0.11 }
        ];
        
        // Spinning Sounds (10 variations)
        const spinVariations = [
            { name: "Fast Whirr", desc: "High speed", baseFreq: 300, modFreq: 8 },
            { name: "Smooth Spin", desc: "Medium speed", baseFreq: 250, modFreq: 5 },
            { name: "Deep Rumble", desc: "Low speed", baseFreq: 150, modFreq: 3 },
            { name: "Mechanical", desc: "Gear-like", baseFreq: 200, modFreq: 10 },
            { name: "Airy Whirr", desc: "Light", baseFreq: 280, modFreq: 6 },
            { name: "Heavy Spin", desc: "Dense", baseFreq: 180, modFreq: 4 },
            { name: "Rapid Tick", desc: "Quick pulses", baseFreq: 320, modFreq: 12 },
            { name: "Steady Hum", desc: "Constant", baseFreq: 220, modFreq: 2 },
            { name: "Vibrating", desc: "Oscillating", baseFreq: 240, modFreq: 7 },
            { name: "Balanced", desc: "Standard", baseFreq: 250, modFreq: 5 }
        ];
        
        // Stop Sounds (10 variations)
        const stopVariations = [
            { name: "Quick Click", desc: "Fast stop", freq: 700, dur: 0.06 },
            { name: "Firm Stop", desc: "Definitive", freq: 600, dur: 0.08 },
            { name: "Soft Landing", desc: "Gentle", freq: 500, dur: 0.1 },
            { name: "Sharp Stop", desc: "Abrupt", freq: 800, dur: 0.05 },
            { name: "Resonant Stop", desc: "Echoing", freq: 550, dur: 0.09 },
            { name: "Clean Click", desc: "Clear", freq: 650, dur: 0.07 },
            { name: "Muted Stop", desc: "Quiet", freq: 450, dur: 0.11 },
            { name: "Bright Stop", desc: "High pitch", freq: 750, dur: 0.06 },
            { name: "Deep Stop", desc: "Low pitch", freq: 400, dur: 0.12 },
            { name: "Balanced Stop", desc: "Standard", freq: 600, dur: 0.08 }
        ];
        
        // Gold Reveal Sounds (10 variations)
        const goldVariations = [
            { name: "Ascending Chime", desc: "Rising pitch", startFreq: 400, endFreq: 800 },
            { name: "Victory Fanfare", desc: "Triumphant", startFreq: 300, endFreq: 900 },
            { name: "Golden Bells", desc: "Bell-like", startFreq: 500, endFreq: 1000 },
            { name: "Majestic Rise", desc: "Grand", startFreq: 350, endFreq: 850 },
            { name: "Sparkle Chime", desc: "Light", startFreq: 450, endFreq: 950 },
            { name: "Epic Reveal", desc: "Dramatic", startFreq: 250, endFreq: 750 },
            { name: "Bright Chime", desc: "High", startFreq: 500, endFreq: 1200 },
            { name: "Rich Tone", desc: "Full", startFreq: 300, endFreq: 700 },
            { name: "Crystal Clear", desc: "Pure", startFreq: 400, endFreq: 900 },
            { name: "Classic Gold", desc: "Standard", startFreq: 400, endFreq: 800 }
        ];
        
        this.createButtons('caseOpenGrid', caseOpenVariations, 'caseOpen', (variation) => {
            this.playCaseOpen(variation.freq, variation.dur);
        });
        
        this.createButtons('spinGrid', spinVariations, 'spin', (variation) => {
            this.playSpin(variation.baseFreq, variation.modFreq);
        });
        
        this.createButtons('stopGrid', stopVariations, 'stop', (variation) => {
            this.playStop(variation.freq, variation.dur);
        });
        
        this.createButtons('goldGrid', goldVariations, 'gold', (variation) => {
            this.playGold(variation.startFreq, variation.endFreq);
        });
    }
    
    createButtons(containerId, variations, category, playFunction) {
        const container = document.getElementById(containerId);
        variations.forEach((variation, index) => {
            const button = document.createElement('div');
            button.className = 'sound-button';
            button.innerHTML = `
                <div class="sound-label">${variation.name}</div>
                <div class="sound-desc">${variation.desc}</div>
            `;
            button.onclick = () => {
                // Remove previous selection
                container.querySelectorAll('.sound-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                // Select this one
                button.classList.add('selected');
                this.selections[category] = index;
                playFunction(variation);
                this.updateSelections();
            };
            container.appendChild(button);
        });
    }
    
    updateSelections() {
        const selectionsDiv = document.getElementById('selections');
        const config = {
            caseOpen: this.selections.caseOpen,
            spin: this.selections.spin,
            stop: this.selections.stop,
            gold: this.selections.gold
        };
        selectionsDiv.innerHTML = `<pre>${JSON.stringify(config, null, 2)}</pre>`;
    }
    
    // Sound generation functions
    playCaseOpen(frequency, duration) {
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
    
    playSpin(baseFreq, modFreq) {
        const duration = 0.2;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                const t = i / sampleRate;
                channelData[i] = 0.3 * Math.sin(2 * Math.PI * baseFreq * t) * 
                                (1 + 0.1 * Math.sin(2 * Math.PI * modFreq * t));
            }
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start();
    }
    
    playStop(frequency, duration) {
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
    
    playGold(startFreq, endFreq) {
        const duration = 0.5;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                const t = i / sampleRate;
                const freq = startFreq + (t / duration) * (endFreq - startFreq);
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
}

function copySelections() {
    const tester = window.soundTester;
    const config = {
        caseOpen: tester.selections.caseOpen,
        spin: tester.selections.spin,
        stop: tester.selections.stop,
        gold: tester.selections.gold
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    alert("Configuration copied to clipboard!");
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    window.soundTester = new SoundTester();
});

// Handle audio context on user interaction
document.addEventListener('click', () => {
    if (window.soundTester && window.soundTester.audioContext && 
        window.soundTester.audioContext.state === 'suspended') {
        window.soundTester.audioContext.resume();
    }
}, { once: true });

