const axios = require('axios');
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.predictRisk = async (attendance, marks, fee_status) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict`, {
      attendance,
      marks,
      fee_status
    });
    return response.data; // { risk_score, risk_category, reason }
  } catch (error) {
    console.error('AI Service Error:', error.message);
    // Return a fallback if AI is down so demo doesn't crash
    return {
      risk_score: 50,
      risk_category: "Medium",
      reason: "AI Service Unavailable - Default Risk"
    };
  }
};
