// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ExamSystem {
    struct StudentAnswer {
        uint256 questionId;
        uint8 chosenOption;
        bool isCorrect;
    }

    struct ExamSubmission {
        address student;
        uint256 examId;
        uint8 score; // Điểm từ 0-10
        string examHash;
        uint256 submittedAt;
    }

    mapping(uint256 => mapping(address => ExamSubmission)) private _submissions;
    mapping(uint256 => mapping(address => StudentAnswer[])) private _answers;
    uint256 private examCount;
    
    event SubmissionCreated(
        address indexed student, 
        uint256 indexed examId, 
        uint8 score, 
        string examHash,
        uint256 submittedAt
    );

    function submitExam(
        uint256 examId,
        StudentAnswer[] calldata studentAnswers,
        string calldata examHash,
        uint8[] calldata correctAnswers
    ) external {
        require(studentAnswers.length == correctAnswers.length, "Number of answers doesn't match");
        require(studentAnswers.length > 0, "Must have at least one answer");
        require(bytes(examHash).length > 0, "Exam hash cannot be empty");
        require(examId > 0, "Invalid exam ID");

        // Clear previous submission if exists
        delete _answers[examId][msg.sender];

        uint8 correctCount = 0;

        for (uint256 i = 0; i < studentAnswers.length; i++) {
            require(studentAnswers[i].chosenOption < 4, "Invalid chosen option");
            require(correctAnswers[i] < 4, "Invalid correct answer");
            
            bool isCorrect = (studentAnswers[i].chosenOption == correctAnswers[i]);
            if (isCorrect) {
                correctCount++;
            }

            _answers[examId][msg.sender].push(StudentAnswer({
                questionId: studentAnswers[i].questionId,
                chosenOption: studentAnswers[i].chosenOption,
                isCorrect: isCorrect
            }));
        }

        // Tính điểm trên thang 10 (làm tròn 1 chữ số thập phân)
        uint8 score = uint8((correctCount * 1000) / studentAnswers.length) / 100;

        _submissions[examId][msg.sender] = ExamSubmission({
            student: msg.sender,
            examId: examId,
            score: score,
            examHash: examHash,
            submittedAt: block.timestamp
        });

        emit SubmissionCreated(msg.sender, examId, score, examHash, block.timestamp);
    }

    function getSubmission(uint256 examId, address student) external view returns (
        address studentAddress,
        uint256 examId_,
        uint8 score,
        string memory examHash,
        uint256 submittedAt,
        StudentAnswer[] memory answers
    ) {
        ExamSubmission memory submission = _submissions[examId][student];
        return (
            submission.student,
            submission.examId,
            submission.score,
            submission.examHash,
            submission.submittedAt,
            _answers[examId][student]
        );
    }

    function getSubmittedExamIds(address student) external view returns (uint256[] memory) {
        uint256[] memory examIds = new uint256[](examCount); // `examCount` là tổng số bài kiểm tra
        uint256 count = 0;

        for (uint256 i = 1; i <= examCount; i++) {
            if (_submissions[i][student].submittedAt > 0) {
                examIds[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = examIds[j];
        }

        return result;
    }
}