import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BlindAuction from '../BlindAuction.sol';

const App: React.FC = () => {
  const [account, setAccount] = useState<string>('');
  const [contract, setContract] = useState<any>(null);
  const [auctionStatus, setAuctionStatus] = useState<string>('Not Started');
  const [highestBid, setHighestBid] = useState<string>('0');
  const [bidAmount, setBidAmount] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [isFake, setIsFake] = useState<boolean>(false);
  const [phase, setPhase] = useState<'bidding' | 'reveal' | 'ended'>('bidding');

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        // Initialize contract
        const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with deployed contract address
        const contract = new ethers.Contract(contractAddress, BlindAuction.abi, signer);
        setContract(contract);

        // Load initial data
        loadAuctionData(contract);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const loadAuctionData = async (contract: any) => {
    try {
      const ended = await contract.ended();
      const highestBid = await contract.highestBid();
      const biddingEnd = await contract.biddingEnd();
      const revealEnd = await contract.revealEnd();

      setHighestBid(ethers.utils.formatEther(highestBid));
      setAuctionStatus(ended ? 'Ended' : 'Active');

      const now = Math.floor(Date.now() / 1000);
      if (now < biddingEnd) {
        setPhase('bidding');
      } else if (now < revealEnd) {
        setPhase('reveal');
      } else {
        setPhase('ended');
      }
    } catch (error) {
      console.error('Error loading auction data:', error);
    }
  };

  const placeBid = async () => {
    if (!contract || !bidAmount || !secret) return;

    try {
      const value = ethers.utils.parseEther(bidAmount);
      const blindedBid = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['uint256', 'bool', 'bytes32'],
          [value, isFake, ethers.utils.keccak256(ethers.utils.toUtf8Bytes(secret))]
        )
      );

      const tx = await contract.bid(blindedBid, { value });
      await tx.wait();
      alert('Bid placed successfully!');
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Error placing bid');
    }
  };

  const revealBid = async () => {
    if (!contract || !bidAmount || !secret) return;

    try {
      const value = ethers.utils.parseEther(bidAmount);
      const tx = await contract.reveal(
        [value],
        [isFake],
        [ethers.utils.keccak256(ethers.utils.toUtf8Bytes(secret))]
      );
      await tx.wait();
      alert('Bid revealed successfully!');
    } catch (error) {
      console.error('Error revealing bid:', error);
      alert('Error revealing bid');
    }
  };

  const withdraw = async () => {
    if (!contract) return;

    try {
      const tx = await contract.withdraw();
      await tx.wait();
      alert('Funds withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      alert('Error withdrawing funds');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">Blind Auction</h1>
          <p className="text-center text-gray-300">A secure and private auction system</p>
        </header>

        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Auction Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300">Current Phase</p>
                <p className="text-xl font-bold">{phase}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300">Highest Bid</p>
                <p className="text-xl font-bold">{highestBid} ETH</p>
              </div>
            </div>
          </div>

          {account ? (
            <div className="space-y-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300">Connected Account</p>
                <p className="font-mono">{account}</p>
              </div>

              {phase === 'bidding' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Place a Bid</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Bid Amount (ETH)</label>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full bg-gray-600 rounded-lg px-4 py-2"
                        placeholder="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Secret Phrase</label>
                      <input
                        type="text"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        className="w-full bg-gray-600 rounded-lg px-4 py-2"
                        placeholder="Your secret phrase"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isFake}
                        onChange={(e) => setIsFake(e.target.checked)}
                        className="mr-2"
                      />
                      <label className="text-gray-300">This is a fake bid</label>
                    </div>
                    <button
                      onClick={placeBid}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Place Bid
                    </button>
                  </div>
                </div>
              )}

              {phase === 'reveal' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Reveal Your Bid</h3>
                  <button
                    onClick={revealBid}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                  >
                    Reveal Bid
                  </button>
                </div>
              )}

              <button
                onClick={withdraw}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Withdraw Funds
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App; 