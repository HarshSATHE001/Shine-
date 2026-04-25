from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StudentData(BaseModel):
    attendance: float
    marks: float
    fee_status: bool

class PredictionResponse(BaseModel):
    risk_score: float
    risk_category: str
    reason: str

@app.post("/predict", response_model=PredictionResponse)
def predict_risk(data: StudentData):
    # Simple Mock ML Logic
    score = 0
    reasons = []

    if data.attendance < 75:
        score += 40
        reasons.append("Low attendance")
    elif data.attendance < 85:
        score += 15

    if data.marks < 40:
        score += 40
        reasons.append("Poor academic performance")
    elif data.marks < 60:
        score += 15

    if not data.fee_status:
        score += 20
        reasons.append("Fees unpaid")

    # Cap score at 100
    score = min(score, 100)

    category = "Low"
    if score >= 70:
        category = "High"
    elif score >= 40:
        category = "Medium"

    reason_str = ", ".join(reasons) if reasons else "Good standing"

    return PredictionResponse(
        risk_score=score,
        risk_category=category,
        reason=reason_str
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
