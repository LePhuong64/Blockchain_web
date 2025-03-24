const express = require('express');
const cors = require('cors');
const connectDB = require('./src/utils/db');
const authController = require('./controllers/authController');
const examController = require('./controllers/examController');
const examRoutes = require('./routes/examRoutes');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.post('/api/register', authController.register);
app.post('/api/login', authController.login);


app.use(async (req, res, next) => {
  const token = req.header('Authorization');
  if (token) {
    try {
      const decoded = jwt.verify(token.split(' ')[1], 'your_jwt_secret');
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        console.log('User authenticated:', user);
        next();
      } else {
        console.log('User not found');
        return res.status(401).json({ error: 'Unauthorized: User not found' });
      }
    } catch (error) {
      console.log('Invalid token:', error.message);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  } else {
    console.log('No token provided');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
});

app.get('/api/exams', examController.getExams);
app.get('/api/exams/:id', examController.getExamById);
app.post('/api/exams', examController.createExam);
app.put('/api/exams/:examId', examController.updateExam);
app.delete('/api/exams/:examId', examController.deleteExam);
app.post('/api/exams/:examId/approve', examController.approveExam);
app.post('/api/exams/:examId/reject', examController.rejectExam);
app.use('/api', examRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});