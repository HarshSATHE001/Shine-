const axios = require('axios');

/**
 * AI Service: Handles communication with the FastAPI ML inference server.
 * Provides risk predictions and explanations for students.
 */
class AIService {
    constructor() {
        this.baseUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        this.timeout = 5000; // 5 seconds
    }

    /**
     * Predicts dropout risk for a student.
     * @param {Object} studentData Raw student attributes from database
     * @returns {Object} Prediction result or fallback
     */
    async predictRisk(studentData) {
        try {
            // If studentData is passed as multiple arguments (legacy call), handle it
            let payload = studentData;
            if (arguments.length > 1) {
                payload = {
                    attendance_percentage: arguments[0],
                    marks_percentage: arguments[1],
                    fee_paid: arguments[2]
                };
            }

            // Construct full StudentData with defaults for the complex model
            // Mapping simple fields to the complex schema where possible
            const fullData = {
                school: "GP",
                sex: "F",
                age: 18,
                address: "U",
                famsize: "GT3",
                Pstatus: "T",
                Medu: 2,
                Fedu: 2,
                Mjob: "other",
                Fjob: "other",
                reason: "course",
                guardian: "mother",
                traveltime: 2,
                studytime: 2,
                failures: 0,
                schoolsup: "no",
                famsup: "no",
                paid: payload.fee_paid ? "yes" : "no",
                activities: "no",
                nursery: "yes",
                higher: "yes",
                internet: "yes",
                romantic: "no",
                famrel: 4,
                freetime: 3,
                goout: 3,
                Dalc: 1,
                Walc: 1,
                health: 3,
                absences: Math.max(0, Math.round((100 - (payload.attendance_percentage || 90)) / 2)),
                course: "math",
                ...payload
            };

            console.log(`Calling AI Service for student prediction`);
            
            const response = await axios.post(`${this.baseUrl}/predict`, fullData, {
                timeout: this.timeout
            });

            return response.data;
        } catch (error) {
            console.error('AI Service Error:', error.message);
            
            // Fallback logic
            return {
                risk_level: 0,
                risk_label: 'Safe (Fallback)',
                confidence: 0.0,
                probabilities: { "Safe": 1.0, "Medium Risk": 0.0, "High Risk": 0.0 },
                explanation: ['AI Service Offline or Invalid Input - using conservative fallback'],
                is_fallback: true
            };
        }
    }

    async predictBatch(studentsArray) {
        try {
            console.log(`Calling AI Service for batch of ${studentsArray.length} students`);
            const response = await axios.post(`${this.baseUrl}/batch-predict`, studentsArray, {
                timeout: 30000 // 30 seconds for batch
            });
            return response.data;
        } catch (error) {
            console.error('AI Batch Error:', error.message);
            return studentsArray.map(() => ({
                risk_level: 0,
                risk_label: 'Safe (Fallback)',
                confidence: 0.0,
                is_fallback: true
            }));
        }
    }

    async getHealth() {
        try {
            const response = await axios.get(`${this.baseUrl}/health`);
            return response.data;
        } catch (error) {
            return { status: 'offline' };
        }
    }
}

module.exports = new AIService();
