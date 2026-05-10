const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/apiRoutes');

// ADD THIS
const chatbotRoutes = require('./routes/chatbot');

const app = express();

app.use(cors());
app.use(express.json());

// Existing routes
app.use('/', apiRoutes);

// CHATBOT ROUTES
app.use('/api/chatbot', chatbotRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: 'Something went wrong on the server!'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Backend server running on port ${PORT}`)
);