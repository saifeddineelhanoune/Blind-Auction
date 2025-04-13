import { Contract } from 'ethers';

export const BlindAuctionABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_biddingTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_revealTime",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "_beneficiary",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "blindedBid",
        "type": "bytes32"
      }
    ],
    "name": "bid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "auctionEnd",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "values",
        "type": "uint256[]"
      },
      {
        "internalType": "bool[]",
        "name": "fakes",
        "type": "bool[]"
      },
      {
        "internalType": "bytes32[]",
        "name": "secrets",
        "type": "bytes32[]"
      }
    ],
    "name": "reveal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "beneficiary",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "biddingEnd",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ended",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "highestBid",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "highestBidder",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "pendingReturns",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "revealEnd",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const BlindAuctionAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Replace with your deployed contract address

export interface BlindAuctionContract extends Contract {
  beneficiary(): Promise<string>;
  biddingEnd(): Promise<number>;
  revealEnd(): Promise<number>;
  ended(): Promise<boolean>;
  highestBid(): Promise<number>;
  highestBidder(): Promise<string>;
  pendingReturns(address: string): Promise<number>;
  bid(blindedBid: string, options?: { value: number }): Promise<any>;
  reveal(values: number[], fakes: boolean[], secrets: string[]): Promise<any>;
  withdraw(): Promise<any>;
  auctionEnd(): Promise<any>;
} 