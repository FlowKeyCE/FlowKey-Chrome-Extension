import React from "react";
import { connectWallet } from "../controllers/walletController";

function WelcomePage({ onConnect }) {
  const handleConnect = async () => {
    const address = await connectWallet();
    if (address && onConnect) {
      onConnect(address); // send address to parent
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white flex flex-col items-center justify-center p-8 relative">
      {/* Solid color overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: '#111728' }}></div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 text-center">
        
        {/* FlowKey Logo */}
        <div className="flex items-center justify-center">
          <img 
            src="./assets/icons/flowkey_logo-removebg.png" 
            alt="FlowKey Logo" 
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h1 
            className="text-white"
            style={{
              fontFamily: 'Poppins',
              fontWeight: '800',
              fontSize: '48px',
              lineHeight: '50px',
              letterSpacing: '0.05em'
            }}
          >
            WELCOME TO
          </h1>
          <h2 
            className="text-white"
            style={{
              fontFamily: 'Poppins',
              fontWeight: '800',
              fontSize: '48px',
              lineHeight: '50px',
              letterSpacing: '0.05em'
            }}
          >
            FLOWKEY
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-lg opacity-80 max-w-xs leading-relaxed">
          Please connect your wallet to access FlowKey Features
        </p>

        {/* Connect Button */}
        <button 
          onClick={onConnect}
          className="text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 
                     transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3"
          style={{
            backgroundColor: '#6E4EFF',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#5A3FE6';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6E4EFF';
          }}
        >
          <span className="max-w-xs leading-relaxed">Log In with Phantom</span>
          <img 
            src="./assets/icons/panthom-wallet.png" 
            alt="Phantom Wallet" 
            className="w-6 h-6 object-contain"
          />
        </button>

      </div>
    </div>
  );
}

export default WelcomePage;
