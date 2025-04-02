import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getBlockchain, generateExamHash, objectIdToUint } from '../../utils/blockchain';
import '../../styles/taketest.css';

function TakeTest() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState({
    page: true,
    submit: false,
    metamask: false
  });
  const [examInfo, setExamInfo] = useState({});
  const [validationError, setValidationError] = useState('');
  const [isSubmittable, setIsSubmittable] = useState(false);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [metaMaskError, setMetaMaskError] = useState(null);
  const navigate = useNavigate();

  // Connect to MetaMask
  const connectMetaMask = async () => {
    setLoading((prev) => ({ ...prev, metamask: true }));
    setMetaMaskError(null);

    const result = await getBlockchain(); // Sửa lại để gọi đúng hàm
    if (result.accounts && result.accounts.length > 0) {
      setIsMetaMaskConnected(true);
    } else {
      setMetaMaskError(result.error || 'Failed to connect MetaMask');
      setIsMetaMaskConnected(false);
    }

    setLoading((prev) => ({ ...prev, metamask: false }));
  };

  // Fetch exam data
  useEffect(() => {
    const fetchExamData = async () => {
      const token = localStorage.getItem('token');

      try {
        const [examRes, questionsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/exams/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/exams/${id}/questions`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setExamInfo(examRes.data);
        setQuestions(questionsRes.data.questions || []);
        console.log("Fetched questions:", questionsRes.data.questions);
        questionsRes.data.questions.forEach(q => {
          console.log(`Question: ${q.questionText}, Correct Answer (from API): ${q.correctAnswer}`);
        });

        // Kiểm tra kết nối MetaMask
        if (!isMetaMaskConnected) {
          try {
            const blockchain = await getBlockchain();
            if (blockchain && blockchain.accounts.length > 0) {
              setIsMetaMaskConnected(true);
            } else {
              setIsMetaMaskConnected(false);
            }
          } catch (blockchainError) {
            console.warn('MetaMask connection failed:', blockchainError.message);
            setIsMetaMaskConnected(false);
          }
        }
      } catch (error) {
        console.error('Error fetching exam data:', error);
        alert('Error loading exam data. Please try again.');
      } finally {
        setLoading(prev => ({ ...prev, page: false }));
      }
    };

    fetchExamData();
  }, [id, isMetaMaskConnected]);

  // Show MetaMask modal immediately on page load if not connected
  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      const isConnected = localStorage.getItem('isMetaMaskConnected') === 'true';
      setIsMetaMaskConnected(isConnected);

      if (!isConnected && window.ethereum) {
        try {
          await connectMetaMask();
        } catch (error) {
          console.log('MetaMask connection error:', error); // Thay vì console.error
        }
      }
    };

    checkMetaMaskConnection();
  }, []);

  // Check if all questions are answered
  useEffect(() => {
    const answeredCount = Object.keys(answers).length;
    setIsSubmittable(answeredCount === questions.length && questions.length > 0);

    if (answeredCount === questions.length && questions.length > 0) {

      setValidationError('');
    }
  }, [answers, questions]);

  // Normalize correct answer format

  const normalizeCorrectAnswer = (correctAnswer) => {
    if (typeof correctAnswer === 'number') return correctAnswer;
    if (typeof correctAnswer === 'string') return parseInt(correctAnswer, 10);
    if (correctAnswer?.$numberInt) return parseInt(correctAnswer.$numberInt, 10);
    return 0;
  };



  // Handle option selection
  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Validate answers before submission
  const validateAnswers = (questions, answers) => {
    if (Object.keys(answers).length < questions.length) {
      setValidationError('You must answer all questions!');
      throw new Error('You must answer all questions!');
    }

    const preparedAnswers = questions.map(question => {
      const chosenOptionIndex = answers[question._id] !== undefined ?
        parseInt(answers[question._id], 10) : -1;

      if (chosenOptionIndex < 0 || chosenOptionIndex >= question.options.length) {
        throw new Error("Invalid chosen option");
      }

      const correctAnswerIndex = normalizeCorrectAnswer(question.correctAnswer);

      if (isNaN(correctAnswerIndex) || correctAnswerIndex < 0 || correctAnswerIndex >= question.options.length) {
        throw new Error(`Invalid correct answer for question ${question._id}`);
      }

      return {
        questionId: objectIdToUint(question._id),
        chosenOption: chosenOptionIndex,
        isCorrect: chosenOptionIndex === correctAnswerIndex
      };
    });

    const correctAnswers = questions.map(q => normalizeCorrectAnswer(q.correctAnswer));

    return { preparedAnswers, correctAnswers };
  };

  // Handle exam submission
  const handleSubmit = async () => {
    if (questions.length === 0) {
      alert('No questions to submit!');
      return;
    }

    if (!isSubmittable) {
      setValidationError('You must answer all questions!');
      return;
    }

    if (!isMetaMaskConnected) {
      setMetaMaskError('Please connect MetaMask to submit your exam');
      return;
    }

    const confirmSubmit = window.confirm('Bạn chắc chắn muốn nộp bài ?');
    if (!confirmSubmit) return;

    setLoading(prev => ({ ...prev, submit: true }));
    try {
      const { contract, accounts } = await getBlockchain();

      const { preparedAnswers, correctAnswers } = validateAnswers(questions, answers);

      const examHash = generateExamHash(questions, answers);

      const tx = await contract.methods.submitExam(
        objectIdToUint(id),
        preparedAnswers,
        examHash,
        correctAnswers.map(ans => Number(ans))
      ).send({ from: accounts[0] });

      console.log("correctAnswers:", correctAnswers.map(ans => Number(ans)));
      console.log("accounts[0]:", accounts[0]);

      const correctCount = preparedAnswers.filter(a => a.isCorrect).length;
      const score = (correctCount * 10) / questions.length; // Adjusted to scale score to 10

      navigate('/student/test-result', {
        state: {
          submissionData: {
            examName: examInfo.name,
            examSubject: examInfo.subject,
            score,
            examHash,
            submittedAt: Math.floor(Date.now() / 1000),
            totalQuestions: questions.length,
            correctCount,
            wrongCount: questions.length - correctCount,
            answers: preparedAnswers.map((ans, idx) => ({
              ...ans,
              correctAnswer: correctAnswers[idx]
            }))
          },
          questions: questions.map(q => ({
            ...q,
            correctAnswer: normalizeCorrectAnswer(q.correctAnswer)
          })),
          txHash: tx.transactionHash
        }
      });

    } catch (error) {
      console.error('Error submitting exam:', error);

      let errorMessage = 'Submission failed';
      if (error.message.includes("Invalid correct answers data") ||
        error.message.includes("invalid correct answer")) {
        errorMessage = "System error: Invalid answer data. Please contact admin.";
      } else if (error.message.includes("revert")) {
        errorMessage = "Transaction rejected by contract";
      } else if (error.message.includes("MetaMask")) {
        errorMessage = "MetaMask connection error";
      } else if (error.message.includes("answer all questions")) {
        errorMessage = error.message;
      }

      alert(`${errorMessage}`);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  return (
    <div className="card">
      <h2 className="card-title"> {examInfo.name}</h2>
      <h3 className="card-subtitle">Môn {examInfo.subject}</h3>

      {loading.page ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading exam...</p>
        </div>
      ) : (
        <>
          {questions.map((q, index) => (
            <div key={q._id} className="exam-card">
              <div className="exam-info">
                <div className="exam-title">{`${index + 1}. ${q.questionText}`}</div>
                <div className="exam-meta">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="option">
                      <input
                        type="radio"
                        name={`question-${q._id}`}
                        checked={answers[q._id] === optIndex}
                        onChange={() => handleOptionChange(q._id, optIndex)}
                      /> {opt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="submit-section">
            {validationError && (
              <p className="warning-message">{validationError}</p>
            )}
            {metaMaskError && (
              <p className="error-message">{metaMaskError}</p>
            )}
            <button
              className={`btn-primary submit-button ${!isSubmittable || !isMetaMaskConnected ? 'disabled-btn' : ''}`}
              onClick={handleSubmit}
              disabled={loading.submit || !isSubmittable || !isMetaMaskConnected}
            >
              {loading.submit ? 'Đang nộp...' : 'Nộp bài'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TakeTest;
