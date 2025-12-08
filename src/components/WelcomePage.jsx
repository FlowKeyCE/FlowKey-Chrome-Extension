import React from "react";
import { motion } from "framer-motion";

function WelcomePage({ onConnect, accessDenied, tokenGateInfo, loading }) {
  return (
    <motion.div
      className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white flex flex-col items-center justify-center p-8 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Solid color overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: '#111728' }}></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 text-center">
        {/* FlowKey Logo */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ scale: 0.95, y: 6, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <img
            src="./assets/icons/flowkey_logo-removebg.png"
            alt="FlowKey Logo"
            className="w-28 h-28 object-contain"
          />
        </motion.div>

        {/* Welcome Text */}
        <motion.div className="space-y-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.25 }}>
          <h1
            className="text-white"
            style={{
              fontFamily: 'Poppins Regular',
              fontWeight: '800',
              fontSize: '40px',
              lineHeight: '42px',
              letterSpacing: '0.04em'
            }}
          >
            WELCOME TO
          </h1>
          <h2
            className="text-white"
            style={{
              fontFamily: 'Poppins SemiBold',
              fontWeight: '800',
              fontSize: '44px',
              lineHeight: '46px',
              letterSpacing: '0.04em'
            }}
          >
            FLOWKEY
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p className="text-sm opacity-80 max-w-xs leading-relaxed" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.25 }}>
          Please connect your wallet to access FlowKey features
        </motion.p>

        {/* Access denied message with detailed info */}
        {accessDenied && (
          <motion.div 
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h3 className="text-red-400 font-semibold text-sm">🔒 Access Denied</h3>
            </div>
            
            {tokenGateInfo?.reason === "api_error" || tokenGateInfo?.reason === "network_error" ? (
              <div className="space-y-2 text-center">
                <p className="text-red-300 text-xs leading-relaxed">
                  ⚠️ Unable to verify your token balance right now.
                </p>
                <p className="text-red-300/80 text-xs">
                  Please check your internet connection and try again.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-center">
                <p className="text-red-300 text-xs leading-relaxed">
                  💎 You need <span className="font-semibold text-red-200">{(tokenGateInfo?.requiredAmount || 20000).toLocaleString()} FlowKey tokens</span> to access this extension.
                </p>
                {tokenGateInfo?.holding !== undefined && (
                  <div className="bg-red-500/5 rounded p-2 border-l-2 border-red-400/30 text-center">
                    <p className="text-red-300/90 text-xs">
                      📊 Your current balance: <span className="font-medium">{Math.floor(tokenGateInfo.holding).toLocaleString()} tokens</span>
                    </p>
                    {tokenGateInfo.holding < (tokenGateInfo?.requiredAmount || 20000) && (
                      <p className="text-red-300/80 text-xs mt-1">
                        📈 You need {Math.floor((tokenGateInfo?.requiredAmount || 20000) - tokenGateInfo.holding).toLocaleString()} more tokens
                      </p>
                    )}
                  </div>
                )}
                <p className="text-red-300/70 text-xs mt-2">
                  🛒 Get FlowKey tokens to unlock premium features!
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Connect Button (flat) */}
        <motion.button
          onClick={onConnect}
          disabled={loading}
          className={`text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform shadow-lg flex items-center space-x-3 ${
            loading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:scale-105 hover:shadow-xl'
          }`}
          style={{ 
            backgroundColor: loading ? '#6E4EFF80' : '#6E4EFF', 
            border: 'none' 
          }}
          onMouseEnter={(e) => { 
            if (!loading) e.target.style.backgroundColor = '#5A3FE6'; 
          }}
          onMouseLeave={(e) => { 
            if (!loading) e.target.style.backgroundColor = '#6E4EFF'; 
          }}
          whileHover={loading ? {} : { y: -2 }}
          whileTap={loading ? {} : { scale: 0.98 }}
        >
          {loading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Checking eligibility...</span>
            </>
          ) : (
            <>
              <span>Log In with Phantom</span>
              <img
                src="./assets/icons/panthom-wallet.png"
                alt="Phantom Wallet"
                className="w-6 h-6 object-contain"
              />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default WelcomePage;