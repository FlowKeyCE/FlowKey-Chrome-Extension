import React, { useState } from "react";

function BookmarksPage({ onBack }) {
  const [bookmarks, setBookmarks] = useState([]);

  const handleOpenAllBookmarks = () => {
    console.log("Opening all bookmarks...");
  };

  const handleAddToBookmarks = () => {
    console.log("Adding current site to bookmarks...");
  };

  const handleAddWebsite = () => {
    console.log("Add website to bookmarks...");
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white p-4 relative">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-blue-800/20 to-purple-900/20"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img 
              src="./assets/icons/flowkey_logo-removebg.png" 
              alt="FlowKey Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button 
            onClick={handleOpenAllBookmarks}
            className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <span>Open All Bookmarks</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>

          <button 
            onClick={handleAddToBookmarks}
            className="w-full text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-between transition-colors"
            style={{ backgroundColor: '#6E4EFF' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5A3FE6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6E4EFF'}
          >
            <span>Add to bookmarks (Site Not F..)</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Bookmarks Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center mb-4">
            <button onClick={onBack} className="mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold">Bookmarks ({bookmarks.length})</h2>
          </div>

          {/* Empty State */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="mb-6">
              <svg className="w-24 h-24 text-purple-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <p className="text-center text-lg opacity-80 mb-8">
              Looks empty...add your first bookmark
            </p>
            
            <button 
              onClick={handleAddWebsite}
              className="bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">+</span>
              <span>Add a website to bookmarks</span>
            </button>
          </div>
        </div>

        {/* Layouts Section */}
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <h2 className="text-xl font-semibold">Layouts (0)</h2>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-center space-x-8 mt-6 pt-4 border-t border-purple-600/30">
          <button className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
          </button>
          <button className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookmarksPage;
