const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbconfig');
const authController = require('./controllers/authController');
const examRoutes = require('./routes/examRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const app = express();
const questionRoutes = require('./routes/questionRouter');

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

app.use(authMiddleware);
app.use('/api', examRoutes);
app.use('/api/questions', questionRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});