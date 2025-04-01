import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchQuestions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/questions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

