from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from model import SafetyAnalyzer

app = FastAPI(title="SheShield AI Engine", description="AI engine for risk analysis", version="1.0")

# Allow all origins for simplicity in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize our dummy ML model
analyzer = SafetyAnalyzer()

# Request model
class SensorData(BaseModel):
    motion: str         # e.g., 'idle', 'walking', 'sudden_running'
    audio_text: str     # e.g., 'hello', 'help me', 'scream'
    location_type: str  # e.g., 'public', 'isolated'

@app.get("/")
def root():
    return {"message": "SheShield AI Engine is running"}

@app.post("/api/analyze")
def analyze_situation(data: SensorData):
    try:
        # Run the risk analysis model
        result = analyzer.analyze(
            motion=data.motion,
            audio_text=data.audio_text,
            location_type=data.location_type
        )
        return {
            "status": "success",
            "analysis": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
