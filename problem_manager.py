import random
from typing import List, Tuple, Dict

# CS:GO tier probabilities - Official Valve-confirmed drop rates
# Based on years of community-verified statistical testing
# These percentages apply to weapon skins from cases
TIER_PROBABILITIES = {
    "Mil-Spec (Blue)": 79.92,        # ~4 out of 5 case opens (1 in 1.25)
    "Restricted (Purple)": 15.98,     # ~1 in 6 case opens (1 in 6.25)
    "Classified (Pink)": 3.20,        # ~1 in 31 opens (1 in 31.25)
    "Covert (Red)": 0.64,             # ~1 in 156 opens (1 in 156.25)
    "Exceedingly Rare (Gold)": 0.26   # ~1 in 385 opens (1 in 384.62) - knives/gloves
}

TIER_COLORS = {
    "Mil-Spec (Blue)": "#4B69FF",
    "Restricted (Purple)": "#8847FF",
    "Classified (Pink)": "#D32CE6",
    "Covert (Red)": "#EB4B4B",
    "Exceedingly Rare (Gold)": "#FFD700"
}

class ProblemManager:
    def __init__(self, learned_file: str = "learned.txt"):
        self.learned_file = learned_file
        self.problems = []
        self.tiered_problems = {}  # Store tier assignments (one tier per problem)
        self.load_problems()
        self.assign_tiers()  # Assign tiers once on initialization
    
    def load_problems(self):
        """Load problems from learned.txt file"""
        try:
            with open(self.learned_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                for line in lines:
                    line = line.strip()
                    if line:
                        self.problems.append(line)
        except FileNotFoundError:
            print(f"Warning: {self.learned_file} not found. Creating empty file.")
            with open(self.learned_file, 'w', encoding='utf-8') as f:
                pass
    
    def reload_problems(self):
        """Reload problems and reassign tiers (call when learned.txt changes)"""
        self.problems = []
        self.load_problems()
        self.assign_tiers()
    
    def assign_tiers(self):
        """Assign problems to tiers based on rarity - each problem gets ONE tier only"""
        if not self.problems:
            self.tiered_problems = {tier: [] for tier in TIER_PROBABILITIES.keys()}
            return
        
        # Shuffle problems for random tier assignment
        shuffled = self.problems.copy()
        random.shuffle(shuffled)
        
        # Calculate how many problems per tier based on probabilities
        total = len(shuffled)
        self.tiered_problems = {
            "Mil-Spec (Blue)": [],
            "Restricted (Purple)": [],
            "Classified (Pink)": [],
            "Covert (Red)": [],
            "Exceedingly Rare (Gold)": []
        }
        
        # Distribute problems across tiers
        # Blue gets most, then purple, pink, red, gold gets least
        tiers = list(TIER_PROBABILITIES.keys())
        index = 0
        
        for i, tier in enumerate(tiers):
            if i == len(tiers) - 1:  # Last tier gets remaining problems
                self.tiered_problems[tier] = shuffled[index:]
            else:
                # Calculate how many problems for this tier
                # Use a distribution that favors lower tiers
                if tier == "Mil-Spec (Blue)":
                    count = max(1, int(total * 0.5))  # 50% to blue
                elif tier == "Restricted (Purple)":
                    count = max(1, int(total * 0.3))  # 30% to purple
                elif tier == "Classified (Pink)":
                    count = max(1, int(total * 0.15))  # 15% to pink
                elif tier == "Covert (Red)":
                    count = max(1, int(total * 0.05))  # 5% to red
                else:
                    count = 1  # Gold gets at least 1
                
                self.tiered_problems[tier] = shuffled[index:index+count]
                index += count
    
    def open_case(self) -> Tuple[str, str]:
        """Open a case and return a random problem based on CS:GO tier probabilities"""
        if not self.problems:
            return "No problems available", "Mil-Spec (Blue)"
        
        # Select tier based on probabilities
        rand = random.random() * 100
        cumulative = 0
        selected_tier = "Mil-Spec (Blue)"  # Default
        
        for tier, probability in TIER_PROBABILITIES.items():
            cumulative += probability
            if rand <= cumulative:
                selected_tier = tier
                break
        
        # Get problems for this tier (from pre-assigned tiers)
        tier_problems = self.tiered_problems.get(selected_tier, [])
        
        # If tier has no problems, fall back to any problem
        if not tier_problems:
            problem = random.choice(self.problems)
        else:
            problem = random.choice(tier_problems)
        
        return problem, selected_tier
    
    def get_problem_tier(self, problem: str) -> str:
        """Get the tier for a specific problem"""
        for tier, problems in self.tiered_problems.items():
            if problem in problems:
                return tier
        return "Mil-Spec (Blue)"  # Default
    
    def get_tier_color(self, tier: str) -> str:
        """Get the color code for a tier"""
        return TIER_COLORS.get(tier, "#FFFFFF")
    
    def get_problem_count(self) -> int:
        """Get total number of problems"""
        return len(self.problems)

