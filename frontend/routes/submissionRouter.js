const express = require('express');
const submissionController = require('../controllers/submissionController');
const router = express.Router();

router.post('/', submissionController.submitExam);

module.exports = router;