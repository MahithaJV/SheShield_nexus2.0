import random

class SafetyAnalyzer:
    def __init__(self):
        # In a real scenario, this would load ML models (e.g., joblib/pickle/keras)
        # For simplicity, we use keyword matching and heuristics
        
        self.dangerous_keywords = ["help", "stop", "no", "leave me", "scream", "save me", "police"]
        self.suspicious_keywords = ["who are you", "what do you want", "go away", "following"]
        
    def analyze(self, motion: str, audio_text: str, location_type: str):
        # Normalize text
        text_lower = audio_text.lower()
        
        # 1. Check Audio
        audio_risk = 0 # 0=Safe, 1=Suspicious, 2=Dangerous
        for word in self.dangerous_keywords:
            if word in text_lower:
                audio_risk = 2
                break
        if audio_risk == 0:
            for word in self.suspicious_keywords:
                if word in text_lower:
                    audio_risk = 1
                    break
                    
        # 2. Check Motion
        motion_risk = 0
        if motion.lower() in ["sudden_running", "falling", "shaking"]:
            motion_risk = 2
        elif motion.lower() in ["running"]:
            motion_risk = 1
            
        # 3. Check Location
        location_risk = 0
        if location_type.lower() == "isolated":
            location_risk = 1
            
        # Overall Risk Calculation (Rule-based)
        # If audio is dangerous OR motion is sudden running in isolated area -> DANGEROUS
        total_risk_score = audio_risk * 2 + motion_risk + location_risk
        
        classification = "SAFE"
        if total_risk_score >= 4:
            classification = "DANGEROUS"
        elif total_risk_score >= 2:
            classification = "SUSPICIOUS"
            
        # Hard override rules matching the SheShield workflow chart
        if audio_risk == 2 or (motion_risk == 2 and location_risk == 1):
             classification = "DANGEROUS"
             
        return {
            "classification": classification,
            "risk_score": total_risk_score,
            "factors": {
                "audio_risk_level": audio_risk,
                "motion_risk_level": motion_risk,
                "location_risk_level": location_risk
            }
        }
