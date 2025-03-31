import CryptoJS from 'crypto-js';
import Web3 from 'web3';
import ExamSystem from '../contracts/ExamSystem.json';
import BN from 'bn.js';

let web3;
let isRequestingAccounts = false; 
const initWeb3 = async () => {
  if (isRequestingAccounts) {
    console.log('MetaMask is already processing a request.'); 
    return web3;
  }

  if (window.ethereum) {
    try {
      isRequestingAccounts = true; 
      const accounts = await window.ethereum.request({
        method: 'eth_accounts', 
      });

      if (accounts.length === 0) {
        
        await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
      }

      web3 = new Web3(window.ethereum);
      return web3;
    } catch (error) {
      console.error('MetaMask connection error:', error);
      throw new Error('Không thể kết nối MetaMask: ' + error.message);
    } finally {
      isRequestingAccounts = false; 
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

    if (!web3 || !web3.eth) {
      console.warn('Web3 is not initialized properly.');
      return { web3: null, contract: null, accounts: [] }; 
    }

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = ExamSystem.networks[networkId];

    if (!deployedNetwork) {
      throw new Error(`Hợp đồng chưa được triển khai trên mạng ${networkId}`);
    }

    const contract = new web3.eth.Contract(
      ExamSystem.abi,
      deployedNetwork.address
    );

    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      throw new Error('Không tìm thấy tài khoản MetaMask');
    }

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

export const connectMetaMask = async () => {
  try {
    const { accounts } = await getBlockchain();
    if (accounts.length > 0) {
      localStorage.setItem('isMetaMaskConnected', 'true'); 
      return { isConnected: true, accounts };
    }
    return { isConnected: false, error: 'No accounts found' };
  } catch (error) {
    console.error('MetaMask connection error:', error);
    return { isConnected: false, error: error.message };
  }
};

export default getBlockchain; 