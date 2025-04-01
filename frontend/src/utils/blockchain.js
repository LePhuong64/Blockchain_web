import CryptoJS from 'crypto-js';
import Web3 from 'web3';
import ExamSystemABI from '../contracts/ExamSystemABI';
import contractAddress from '../utils/contractAddress';
import BN from 'bn.js';

let web3;
let isConnectingMetaMask = false; // Trạng thái kết nối MetaMask
let connectPromise = null; // Lưu trữ promise để tránh gọi lại nhiều lần

const initWeb3 = async () => {
  if (isConnectingMetaMask) {
    console.warn('MetaMask đang xử lý yêu cầu. Vui lòng đợi.');
    return connectPromise; // Trả về promise đang xử lý
  }

  if (window.ethereum) {
    try {
      isConnectingMetaMask = true; // Đánh dấu đang kết nối
      connectPromise = window.ethereum.request({ method: 'eth_requestAccounts' }).then(() => {
        web3 = new Web3(window.ethereum);
        return web3;
      });
      return await connectPromise; // Đợi kết nối hoàn tất
    } catch (error) {
      console.error('MetaMask connection error:', error);
      throw new Error('Không thể kết nối MetaMask: ' + error.message);
    } finally {
      isConnectingMetaMask = false; // Đặt lại trạng thái sau khi hoàn tất
      connectPromise = null; // Xóa promise sau khi hoàn thành
    }
  } else {
    throw new Error('Vui lòng cài đặt MetaMask để sử dụng ứng dụng.');
  }
};

export const getBlockchain = async () => {
  try {
    if (!web3) {
      web3 = await initWeb3();
    }

    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      throw new Error('Không tìm thấy tài khoản MetaMask');
    }

    const contract = new web3.eth.Contract(ExamSystemABI, contractAddress);

    return { web3, contract, accounts };
  } catch (error) {
    console.error('Lỗi kết nối blockchain:', error);
    throw error;
  }
};

export const generateExamHash = (questions, answers) => {
  if (!questions || !answers) {
    throw new Error("Dữ liệu câu hỏi hoặc đáp án không hợp lệ");
  }

  const dataToHash = questions.map(q => {
    const questionId = q._id;
    const userAnswerIndex = answers[questionId] !== undefined ? 
      parseInt(answers[questionId], 10) : -1;
    const correctAnswerIndex = normalizeAnswerIndex(q.correctAnswer);

    return {
      questionId,
      questionText: q.questionText,
      chosenOption: userAnswerIndex,
      correctAnswer: correctAnswerIndex,
      options: q.options
    };
  });
  
  return CryptoJS.SHA256(JSON.stringify(dataToHash)).toString();
};

export const objectIdToUint = (objectId) => {
  if (!objectId || typeof objectId !== 'string') {
    throw new Error("ObjectId không hợp lệ");
  }
  
  const hexString = objectId.replace(/[^0-9a-fA-F]/g, '').substring(0, 24);
  if (hexString.length !== 24) {
    throw new Error("ObjectId phải là chuỗi hex 24 ký tự");
  }
  
  return new BN(hexString, 16).toString();
};

const normalizeAnswerIndex = (answer) => {
  if (answer === undefined || answer === null) return -1;
  if (typeof answer === 'number') return answer;
  if (typeof answer === 'string' && !isNaN(answer)) return parseInt(answer, 10);
  if (answer?.$numberInt) return parseInt(answer.$numberInt, 10);
  if (answer?.$numberLong) return parseInt(answer.$numberLong, 10);
  return -1;
};

export const getExamResultsWithDetails = async (examId) => {
  try {
    const { contract } = await getBlockchain();
    const results = await contract.methods.getExamResultsWithDetails(examId).call();
    return results;
  } catch (error) {
    console.error('Error fetching exam results with details:', error);
    throw error;
  }
};

