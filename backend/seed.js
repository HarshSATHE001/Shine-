const bcrypt = require('bcrypt');
const db = require('./db');

async function seed() {
  console.log('Starting Seeding...');
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Clear existing data (optional but good for a fresh start in this session)
  await db.query('DELETE FROM counseling');
  await db.query('DELETE FROM risk');
  await db.query('DELETE FROM records');
  await db.query('DELETE FROM students');
  await db.query('DELETE FROM users WHERE role != "mentor" OR email != "mentor@example.com"');

  // Ensure mentor exists
  let mentorRes = await db.query('SELECT id FROM users WHERE email = ?', ['mentor@example.com']);
  let mentorId;
  if (mentorRes.rows.length === 0) {
    const res = await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) RETURNING id', 
      ['Admin Mentor', 'mentor@example.com', passwordHash, 'mentor']);
    mentorId = res.rows[0].id;
  } else {
    mentorId = mentorRes.rows[0].id;
  }

  const courses = ['B.Tech Computer Science', 'B.Tech IT', 'B.Tech Electronics'];
  const years = [1, 2, 3, 4];
  const semesters = ['Sem 1', 'Sem 2', 'Sem 3'];

  console.log('Generating 85 students...');
  for (let i = 1; i <= 85; i++) {
    const name = `Student ${i}`;
    const email = `student${i}@example.com`;
    const enroll = `ENR${String(i).padStart(3, '0')}`;
    const course = courses[i % courses.length];
    const year = years[i % years.length];

    // Create User
    const userRes = await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) RETURNING id',
      [name, email, passwordHash, 'student']);
    const userId = userRes.rows[0].id;

    // Create Student Profile
    const studentRes = await db.query('INSERT INTO students (user_id, enrollment_number, course, year) VALUES (?, ?, ?, ?) RETURNING id',
      [userId, enroll, course, year]);
    const studentId = studentRes.rows[0].id;

    // Create Academic Records for 3 Semesters
    for (const sem of semesters) {
      // Random but somewhat realistic data
      const attendance = 60 + Math.random() * 35; // 60-95
      const marks = 35 + Math.random() * 60;      // 35-95
      const feePaid = Math.random() > 0.1;        // 90% chance fee paid

      const studentFeedback = i % 10 === 0 ? "I'm struggling with the current modules, need help with IT fundamentals." : null;
      const reportUrl = `https://example.com/reports/${enroll}_${sem.replace(' ', '')}.pdf`;

      await db.query(
        'INSERT INTO records (student_id, attendance_percentage, marks_percentage, fee_paid, semester, uploaded_by, student_feedback, report_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [studentId, attendance.toFixed(2), marks.toFixed(2), feePaid, sem, mentorId, studentFeedback, reportUrl]
      );

      // Risk calculation (Mock logic same as AI service)
      if (sem === 'Sem 3') { // Only latest sem gets a risk record for now
        let score = 0;
        let reasons = [];
        if (attendance < 75) { score += 40; reasons.push("Low attendance"); }
        else if (attendance < 85) { score += 15; }
        
        if (marks < 40) { score += 40; reasons.push("Poor academic performance"); }
        else if (marks < 60) { score += 15; }
        
        if (!feePaid) { score += 20; reasons.push("Fees unpaid"); }
        
        score = Math.min(score, 100);
        let category = "Low";
        if (score >= 70) category = "High";
        else if (score >= 40) category = "Medium";

        await db.query(
          'INSERT INTO risk (student_id, risk_score, risk_category, reason) VALUES (?, ?, ?, ?)',
          [studentId, score, category, reasons.join(', ') || 'Good standing']
        );
      }
    }

    // Occasionally add a counseling session
    if (i % 5 === 0) {
      await db.query(
        'INSERT INTO counseling (student_id, mentor_id, scheduled_date, status, notes) VALUES (?, ?, ?, ?, ?)',
        [studentId, mentorId, new Date(Date.now() - 86400000 * (i % 10)).toISOString(), 'completed', 'Routine check-up and performance review.']
      );
    }
    if (i % 12 === 0) {
      await db.query(
        'INSERT INTO counseling (student_id, mentor_id, scheduled_date, status, notes) VALUES (?, ?, ?, ?, ?)',
        [studentId, mentorId, new Date(Date.now() + 86400000 * 2).toISOString(), 'pending', 'High risk follow-up.']
      );
    }
  }

  console.log('Seeding Completed Successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding Failed:', err);
  process.exit(1);
});
