# Shine AI: JARVIS HUD Edition 🛡️

**Shine AI** is an advanced AI-powered Student Dropout Prediction and Counseling System designed with a high-tech Ironman (JARVIS) HUD aesthetic. It enables mentors to monitor student batches, identify high-risk individuals via deep-learning diagnostics, and manage intervention protocols.

![HUD Preview](https://via.placeholder.com/1200x600?text=Shine+AI+JARVIS+Console)

## 🚀 Quick Start (Docker)

1. **Build and Start Services**:
   ```bash
   docker-compose up --build -d
   ```

2. **Seed the Database (Optional - for Demo Data)**:
   ```bash
   docker exec -it shine-backend npm run seed
   ```
   *(Note: replace `shine-backend` with the actual container name if different)*

- **Frontend**: [http://localhost](http://localhost)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **AI Service**: [http://localhost:8000](http://localhost:8000)

## 🔑 Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Mentor (Admin)** | `mentor@example.com` | `password123` |
| **Student** | `student1@example.com` | `password123` |

## ✨ Core Features

- **Ironman HUD Dashboard**: Real-time monitoring of batch stability and risk.
- **AI Dropout Prediction**: Advanced risk scoring using XGBoost models.
- **Batch Analysis**: Upload large datasets for instant bulk diagnostic scans.
- **Protocol Management**: Schedule and track counseling interventions.
- **AI Chatbot**: Intelligent assistant for mentors and students to query academic standing.
- **Automated Reporting**: Generate comprehensive XLSX reports for student risk distribution.

## 🛠️ Tech Stack

- **Frontend**: Vite + React 19 + Tailwind CSS + Lucide Icons + Recharts
- **Backend**: Node.js + Express + SQLite
- **AI**: Python + FastAPI + XGBoost + SHAP
- **Deployment**: Docker + Nginx

---
Created by [HarshSATHE001](https://github.com/HarshSATHE001)
