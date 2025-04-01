const ExamSystemABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "student",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "examId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "score",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "examHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "submittedAt",
        "type": "uint256"
      }
    ],
    "name": "SubmissionCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "examId",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "questionId",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "chosenOption",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "isCorrect",
            "type": "bool"
          }
        ],
        "internalType": "struct ExamSystem.StudentAnswer[]",
        "name": "studentAnswers",
        "type": "tuple[]"
      },
      {
        "internalType": "string",
        "name": "examHash",
        "type": "string"
      },
      {
        "internalType": "uint8[]",
        "name": "correctAnswers",
        "type": "uint8[]"
      }
    ],
    "name": "submitExam",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "examId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      }
    ],
    "name": "getSubmission",
    "outputs": [
      {
        "internalType": "address",
        "name": "studentAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "examId_",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "score",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "examHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "submittedAt",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "questionId",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "chosenOption",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "isCorrect",
            "type": "bool"
          }
        ],
        "internalType": "struct ExamSystem.StudentAnswer[]",
        "name": "answers",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      }
    ],
    "name": "getSubmittedExamIds",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export default ExamSystemABI;