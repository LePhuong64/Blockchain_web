const ExamSystem = artifacts.require("ExamSystem");

module.exports = function (deployer) {
  deployer.deploy(ExamSystem);
};