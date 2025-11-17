import tkinter as tk
from tkinter import font, messagebox
import random
import math
import time
from problem_manager import ProblemManager, TIER_COLORS, TIER_PROBABILITIES
from sound_manager import SoundManager

class CaseOpenerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("LeetCode Case Opener")
        self.root.geometry("1000x800")
        self.root.configure(bg="#0d1117")
        
        self.problem_manager = ProblemManager()
        self.sound_manager = SoundManager()
        self.is_opening = False
        self.scroll_position = 0
        self.scroll_speed = 0
        self.selected_problem = None
        self.selected_tier = None
        self.last_spin_sound_time = 0
        
        self.setup_ui()
        
    def setup_ui(self):
        """Setup the user interface"""
        # Title
        title_font = font.Font(family="Arial", size=28, weight="bold")
        title_label = tk.Label(
            self.root,
            text="LeetCode Case Opener",
            font=title_font,
            bg="#0d1117",
            fg="#FFFFFF"
        )
        title_label.pack(pady=15)
        
        # Case display area - will show the case initially
        self.case_frame = tk.Frame(self.root, bg="#0d1117", width=900, height=200)
        self.case_frame.pack(pady=10)
        self.case_frame.pack_propagate(False)
        
        # Case canvas (shown before opening)
        self.case_canvas = tk.Canvas(
            self.case_frame,
            bg="#161b22",
            width=200,
            height=200,
            highlightthickness=0
        )
        self.case_canvas.pack(pady=10)
        self.draw_case()
        
        # Scrolling loot bar canvas (hidden initially)
        self.scroll_canvas = tk.Canvas(
            self.case_frame,
            bg="#0d1117",
            width=900,
            height=250,
            highlightthickness=0
        )
        self.scroll_canvas.pack_forget()  # Hidden until case opens
        
        # Center indicator line
        self.center_line_x = 450
        
        # Problem reveal area (initially hidden)
        self.reveal_frame = tk.Frame(self.root, bg="#0d1117")
        self.reveal_frame.pack(pady=20)
        
        self.problem_label = tk.Label(
            self.reveal_frame,
            text="",
            font=font.Font(family="Arial", size=22, weight="bold"),
            bg="#0d1117",
            fg="#FFFFFF",
            wraplength=900
        )
        self.problem_label.pack()
        
        self.tier_label = tk.Label(
            self.reveal_frame,
            text="",
            font=font.Font(family="Arial", size=16),
            bg="#0d1117",
            fg="#FFFFFF"
        )
        self.tier_label.pack(pady=10)
        
        # Open button
        button_font = font.Font(family="Arial", size=18, weight="bold")
        self.open_button = tk.Button(
            self.root,
            text="OPEN CASE",
            font=button_font,
            bg="#4B69FF",
            fg="#FFFFFF",
            activebackground="#3A59EF",
            activeforeground="#FFFFFF",
            relief=tk.RAISED,
            bd=5,
            padx=40,
            pady=18,
            command=self.open_case,
            cursor="hand2"
        )
        self.open_button.pack(pady=20)
        
        # Problem count label
        count_label = tk.Label(
            self.root,
            text=f"Problems in collection: {self.problem_manager.get_problem_count()}",
            font=font.Font(family="Arial", size=11),
            bg="#0d1117",
            fg="#8b949e"
        )
        count_label.pack(pady=5)
        
    def draw_case(self):
        """Draw the case box"""
        self.case_canvas.delete("all")
        # Draw case box with metallic look
        self.case_canvas.create_rectangle(
            20, 20, 180, 180,
            fill="#2a2a2a",
            outline="#4B69FF",
            width=4
        )
        # Draw case lock icon
        self.case_canvas.create_text(
            100, 90,
            text="📦",
            font=font.Font(family="Arial", size=50)
        )
        self.case_canvas.create_text(
            100, 150,
            text="CASE",
            font=font.Font(family="Arial", size=18, weight="bold"),
            fill="#FFFFFF"
        )
    
    def generate_fake_items(self, count=100):
        """Generate fake items for the scrolling animation using CS:GO probabilities"""
        fake_items = []
        
        # Use actual CS:GO probabilities for fake items
        tiers = list(TIER_PROBABILITIES.keys())
        probabilities = list(TIER_PROBABILITIES.values())
        
        # Generate items using actual drop rates
        for i in range(count):
            # Select tier based on CS:GO probabilities
            rand = random.random() * 100
            cumulative = 0
            selected_tier = "Mil-Spec (Blue)"  # Default
            
            for tier, probability in TIER_PROBABILITIES.items():
                cumulative += probability
                if rand <= cumulative:
                    selected_tier = tier
                    break
            
            # Get a random problem from the assigned tier (or any problem if tier is empty)
            tier_problems = self.problem_manager.tiered_problems.get(selected_tier, [])
            if tier_problems:
                problem = random.choice(tier_problems)
            elif self.problem_manager.problems:
                problem = random.choice(self.problem_manager.problems)
            else:
                problem = f"Problem {i+1}"
            
            fake_items.append((problem, selected_tier))
        
        return fake_items
    
    def draw_item_card(self, canvas, x, y, width, height, problem, tier, is_selected=False):
        """Draw a single item card - all cards show tier color like CS:GO"""
        tier_color = TIER_COLORS.get(tier, "#FFFFFF")
        
        # All cards show their tier color background
        # Selected card gets white border and is brighter
        if is_selected:
            # Highlight selected card with white border and full brightness
            canvas.create_rectangle(
                x, y, x + width, y + height,
                fill=tier_color,
                outline="#FFFFFF",
                width=4
            )
        else:
            # Non-selected cards: tier color with slightly darker overlay
            canvas.create_rectangle(
                x, y, x + width, y + height,
                fill=tier_color,
                outline=tier_color,
                width=2
            )
            # Dark overlay to make it slightly dimmer (like CS:GO)
            canvas.create_rectangle(
                x, y, x + width, y + height,
                fill="#000000",
                outline="",
                stipple="gray50"  # 50% opacity dark overlay
            )
        
        # Problem text (truncate if too long)
        problem_text = problem[:30] + "..." if len(problem) > 30 else problem
        canvas.create_text(
            x + width/2, y + height/2 - 20,
            text=problem_text,
            font=font.Font(family="Arial", size=11, weight="bold"),
            fill="#FFFFFF",
            width=width - 20
        )
        
        # Tier name
        tier_short = tier.split()[0]
        canvas.create_text(
            x + width/2, y + height/2 + 20,
            text=tier_short,
            font=font.Font(family="Arial", size=10),
            fill="#FFFFFF"
        )
    
    def open_case(self):
        """Handle case opening - CS:GO style"""
        if self.is_opening:
            return
        
        if self.problem_manager.get_problem_count() == 0:
            messagebox.showwarning(
                "No Problems",
                "Please add problems to learned.txt first!"
            )
            return
        
        self.is_opening = True
        self.open_button.config(state=tk.DISABLED, text="OPENING...")
        
        # Hide previous result
        self.problem_label.config(text="")
        self.tier_label.config(text="")
        self.reveal_frame.pack_forget()
        
        # Determine the result FIRST (like CS:GO - result is predetermined)
        self.selected_problem, self.selected_tier = self.problem_manager.open_case()
        
        # Step 1: Case opens - play opening sound
        self.sound_manager.play_case_open()
        self.case_canvas.pack_forget()
        self.scroll_canvas.pack(pady=10)
        
        # Generate fake items for scrolling
        self.fake_items = self.generate_fake_items(100)
        
        # Insert the actual selected item at a FIXED position for consistent timing
        # Use fixed position: 50 (middle of 100 items)
        insert_pos = 50
        self.fake_items.insert(insert_pos, (self.selected_problem, self.selected_tier))
        
        # Calculate target position so the selected card is centered
        card_width = 200
        card_spacing = 10
        # Card's left edge position in the item list
        card_left_pos = insert_pos * (card_width + card_spacing)
        # We want the card's center to align with center_line_x (450)
        # Card center = card_left_pos - scroll_position + card_width/2
        # Set card center = center_line_x
        # So: scroll_position = card_left_pos + card_width/2 - center_line_x
        self.target_position = card_left_pos + card_width / 2 - self.center_line_x
        
        # FIXED animation duration: 3.5 seconds total
        # Start position: -400 (off-screen)
        # Target position: ~10,500 pixels
        # Total distance: ~10,900 pixels
        # We'll use a fixed timing curve to ensure 3.5 seconds
        self.animation_start_time = None
        self.animation_duration = 3500  # 3.5 seconds in milliseconds
        
        # Start scrolling animation
        self.scroll_position = -card_width * 2  # Start off-screen
        self.scroll_speed = 60  # Start faster
        self.animation_frame = 0
        self.animation_start_time = time.time() * 1000  # milliseconds
        
        self.animate_scroll()
    
    def animate_scroll(self):
        """Animate the scrolling loot bar with slowdown"""
        self.scroll_canvas.delete("all")
        
        card_width = 200
        card_height = 180
        card_spacing = 10
        center_y = 125
        
        # Draw center indicator line
        self.scroll_canvas.create_line(
            self.center_line_x, 20,
            self.center_line_x, 230,
            fill="#FFFFFF",
            width=3,
            dash=(5, 5)
        )
        
        # Draw visible cards
        visible_start = max(0, int(self.scroll_position / (card_width + card_spacing)) - 2)
        visible_end = min(len(self.fake_items), visible_start + 10)
        
        for i in range(visible_start, visible_end):
            x = i * (card_width + card_spacing) - self.scroll_position
            y = center_y - card_height / 2
            
            # Only draw if card is visible
            if -card_width < x < 900 + card_width:
                problem, tier = self.fake_items[i]
                is_selected = (problem == self.selected_problem and tier == self.selected_tier)
                self.draw_item_card(
                    self.scroll_canvas,
                    x, y,
                    card_width, card_height,
                    problem, tier,
                    is_selected
                )
        
        # FIXED DURATION ANIMATION - Use time-based easing
        current_time = time.time() * 1000  # milliseconds
        elapsed = current_time - self.animation_start_time
        progress = min(elapsed / self.animation_duration, 1.0)  # 0.0 to 1.0
        
        # Easing function: ease-out cubic for smooth slowdown
        # Using cubic ease-out: 1 - (1 - t)^3
        eased_progress = 1 - pow(1 - progress, 3)
        
        # Calculate position based on eased progress
        start_pos = -card_width * 2
        target_x = self.target_position
        total_distance = target_x - start_pos
        self.scroll_position = start_pos + (total_distance * eased_progress)
        
        # Play spinning sound that slows down
        # Speed factor: 1.0 (fast) to 0.1 (slow)
        speed_factor = max(0.1, 1.0 - progress * 0.9)
        current_time_sec = time.time()
        # Play spin sound every 50ms during animation
        if current_time_sec - self.last_spin_sound_time > 0.05:
            self.sound_manager.play_spin(speed_factor)
            self.last_spin_sound_time = current_time_sec
        
        # Calculate speed for next frame (for visual smoothness)
        if progress < 1.0:
            # Still animating
            delay = max(8, int(1000 / 60))  # ~60 FPS
            self.root.after(delay, self.animate_scroll)
        else:
            # Animation complete - play stop sound
            self.sound_manager.play_stop()
            self.scroll_position = target_x
            self.scroll_speed = 0
            # Redraw at final position
            self.draw_final_position()
            # Hold for 0.5 seconds before revealing
            self.root.after(500, self.reveal_item)
    
    def draw_final_position(self):
        """Draw the final position with selected card centered"""
        self.scroll_canvas.delete("all")
        card_width = 200
        card_height = 180
        card_spacing = 10
        center_y = 125
        
        # Draw center indicator line (solid now)
        self.scroll_canvas.create_line(
            self.center_line_x, 20,
            self.center_line_x, 230,
            fill="#FFFFFF",
            width=4
        )
        
        # Find and draw the selected card centered
        for i, (problem, tier) in enumerate(self.fake_items):
            x = i * (card_width + card_spacing) - self.scroll_position
            y = center_y - card_height / 2
            
            is_selected = (problem == self.selected_problem and tier == self.selected_tier)
            
            # Only draw if card is visible or is the selected card
            if is_selected or (-card_width < x < 900 + card_width):
                self.draw_item_card(
                    self.scroll_canvas,
                    x, y,
                    card_width, card_height,
                    problem, tier,
                    is_selected
                )
    
    def reveal_item(self):
        """Final reveal with gold flash if gold tier"""
        tier_color = self.problem_manager.get_tier_color(self.selected_tier)
        
        # Gold flash effect for gold tier
        if self.selected_tier == "Exceedingly Rare (Gold)":
            # Play gold reveal sound
            self.sound_manager.play_gold_reveal()
            for flash in range(3):
                # Create flash overlay
                flash_rect = self.scroll_canvas.create_rectangle(
                    0, 0, 900, 250,
                    fill="#FFD700",
                    outline=""
                )
                self.root.update()
                self.root.after(80)
                self.scroll_canvas.delete(flash_rect)
                self.root.update()
                self.root.after(80)
        
        # Redraw final position (card should already be centered from draw_final_position)
        # But redraw to show the final reveal state
        self.draw_final_position()
        
        # Show problem details
        self.reveal_frame.pack(pady=20)
        self.problem_label.config(
            text=self.selected_problem,
            fg=tier_color
        )
        self.tier_label.config(
            text=f"Tier: {self.selected_tier}",
            fg=tier_color
        )
        
        self.is_opening = False
        self.open_button.config(state=tk.NORMAL, text="OPEN CASE")
        
        # Show celebration message
        self.root.after(500, lambda: messagebox.showinfo(
            "Case Opened! 🎉",
            f"You got: {self.selected_problem}\n\nTier: {self.selected_tier}\n\nTime to solve it!"
        ))

def main():
    root = tk.Tk()
    app = CaseOpenerApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
