# 🛡️ SheShield Nexus 2.0

SheShield Nexus 2.0 is an AI-powered personal safety companion designed to provide real-time protection and peace of mind. By integrating audio analysis, motion tracking, and location risk assessment, the system dynamically evaluates the user's environment to detect and respond to potential threats.

---

## 🌟 Key Features

### 🧠 SafetyAnalyzer Engine (AI Backend)
The core intelligence of the system that evaluates risk based on three critical data points:
- **Audio Context:** Monitors for dangerous keywords (e.g., "help", "scream", "police") and suspicious phrases.
- **Motion Tracking:** Analyzes movement patterns like sudden running, falling, or shaking to identify distress.
- **Location Profiling:** Factors in environment risk levels (e.g., isolated zones vs. public areas).

### 📱 Premium Dashboard (Frontend)
- **Emergency SOS:** Instant one-tap alert system for emergency services and trusted contacts.
- **Safe Navigation:** AI-powered routing to guide users through the safest paths.
- **Safe Circle:** Manage trusted contacts who receive real-time alerts.
- **Modern UI:** Sleek, dark-mode interface with smooth animations and intuitive navigation.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js & npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MahithaJV/SheShield_nexus2.0.git
   cd SheShield_nexus2.0
   ```

2. **Setup Backend:**
   ```bash
   cd ai_backend
   python -m venv venv
   .\venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On Linux/macOS
   pip install -r requirements.txt
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

---

## 🛠️ Running the Application

### Start Backend
In the `ai_backend` directory:
```bash
uvicorn main:app --reload
```

### Start Frontend
In the `frontend` directory:
```bash
npm run dev
```

---

## 🏗️ Tech Stack
- **Backend:** FastAPI (Python), Pydantic
- **Frontend:** React (TypeScript), Vite, Tailwind CSS, Framer Motion, Lucide Icons
- **AI/Logic:** Rule-based heuristics and keyword matching (extensible to ML models)

---

## 🛡️ License
Distributed under the MIT License.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
