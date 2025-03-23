// // filepath: d:\BLOCKCHAIN\TL\chamdiem\src\utils\blockchain.js
// import Web3 from 'web3';
// import ExamSystem from '../contracts/ExamSystem.json';

// const getBlockchain = () =>
//   new Promise((resolve, reject) => {
//     window.addEventListener('load', async () => {
//       if (window.ethereum) {
//         const web3 = new Web3(window.ethereum);
//         try {
//           await window.ethereum.enable();
//           const networkId = await web3.eth.net.getId();
//           const deployedNetwork = ExamSystem.networks[networkId];
//           const contract = new web3.eth.Contract(
//             ExamSystem.abi,
//             deployedNetwork && deployedNetwork.address,
//           );
//           resolve({ web3, contract });
//         } catch (error) {
//           reject(error);
//         }
//       } else {
//         reject('Install Metamask');
//       }
//     });
//   });

// export default getBlockchain;