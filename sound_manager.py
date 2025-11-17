import numpy as np
import pygame
import io
import threading

class SoundManager:
    def __init__(self):
        """Initialize sound manager with pygame"""
        try:
            pygame.mixer.init(frequency=22050, size=-16, channels=2, buffer=512)
            self.sounds_enabled = True
        except:
            self.sounds_enabled = False
            print("Warning: Sound initialization failed. Running without sound.")
    
    def generate_tone(self, frequency, duration, sample_rate=22050, volume=0.5):
        """Generate a sine wave tone"""
        if not self.sounds_enabled:
            return None
        
        frames = int(duration * sample_rate)
        arr = np.zeros((frames, 2), dtype=np.int16)
        max_sample = 2**(16 - 1) - 1
        
        for i in range(frames):
            wave = max_sample * volume * np.sin(2 * np.pi * frequency * i / sample_rate)
            arr[i][0] = int(wave)  # Left channel
            arr[i][1] = int(wave)  # Right channel
        
        return pygame.sndarray.make_sound(arr)
    
    def generate_click(self, frequency=800, duration=0.1):
        """Generate a metallic click sound (case opening)"""
        if not self.sounds_enabled:
            return None
        
        sample_rate = 22050
        frames = int(duration * sample_rate)
        arr = np.zeros((frames, 2), dtype=np.int16)
        max_sample = 2**(16 - 1) - 1
        
        # Click with quick attack and decay
        for i in range(frames):
            t = i / sample_rate
            # Quick attack, exponential decay
            envelope = np.exp(-t * 15) * (1 - t / duration)
            wave = max_sample * 0.6 * envelope * np.sin(2 * np.pi * frequency * t)
            arr[i][0] = int(wave)
            arr[i][1] = int(wave)
        
        return pygame.sndarray.make_sound(arr)
    
    def generate_spin_sound(self, base_freq=200, duration=0.1, speed_factor=1.0):
        """Generate spinning/whirring sound that can vary in speed"""
        if not self.sounds_enabled:
            return None
        
        sample_rate = 22050
        frames = int(duration * sample_rate)
        arr = np.zeros((frames, 2), dtype=np.int16)
        max_sample = 2**(16 - 1) - 1
        
        freq = base_freq * speed_factor
        
        for i in range(frames):
            t = i / sample_rate
            # Whirring sound with slight variation
            wave = max_sample * 0.3 * np.sin(2 * np.pi * freq * t) * (1 + 0.1 * np.sin(2 * np.pi * 5 * t))
            arr[i][0] = int(wave)
            arr[i][1] = int(wave)
        
        return pygame.sndarray.make_sound(arr)
    
    def generate_gold_chime(self):
        """Generate special gold tier chime sound"""
        if not self.sounds_enabled:
            return None
        
        sample_rate = 22050
        duration = 0.5
        frames = int(duration * sample_rate)
        arr = np.zeros((frames, 2), dtype=np.int16)
        max_sample = 2**(16 - 1) - 1
        
        # Ascending chime (like CS:GO gold reveal)
        for i in range(frames):
            t = i / sample_rate
            # Ascending frequency with harmonics
            freq = 400 + (t / duration) * 400  # 400Hz to 800Hz
            envelope = np.exp(-t * 2)  # Decay
            wave = max_sample * 0.7 * envelope * (
                np.sin(2 * np.pi * freq * t) +
                0.5 * np.sin(2 * np.pi * freq * 2 * t)  # Harmonic
            )
            arr[i][0] = int(wave)
            arr[i][1] = int(wave)
        
        return pygame.sndarray.make_sound(arr)
    
    def play_case_open(self):
        """Play case opening sound"""
        if self.sounds_enabled:
            sound = self.generate_click(900, 0.15)
            if sound:
                sound.play()
    
    def play_spin(self, speed_factor=1.0):
        """Play spinning sound at given speed"""
        if self.sounds_enabled:
            sound = self.generate_spin_sound(250, 0.05, speed_factor)
            if sound:
                sound.play()
    
    def play_stop(self):
        """Play stop/click sound"""
        if self.sounds_enabled:
            sound = self.generate_click(600, 0.08)
            if sound:
                sound.play()
    
    def play_gold_reveal(self):
        """Play gold tier reveal sound"""
        if self.sounds_enabled:
            sound = self.generate_gold_chime()
            if sound:
                sound.play()

