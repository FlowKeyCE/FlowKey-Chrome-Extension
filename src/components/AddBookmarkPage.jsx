import React, { useState } from "react";

function AddBookmarkPage({ onBack, onSave }) {
  const [bookmarkName, setBookmarkName] = useState("");
  const [bookmarkUrl, setBookmarkUrl] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("link"); // link, discord, telegram, twitter

  const iconOptions = [
    { id: "link", iconPath: "./assets/icons/Internet-white.png", alt: "Link" },
    { id: "discord", iconPath: "./assets/icons/Discord New-white.png", alt: "Discord" },
    { id: "telegram", iconPath: "./assets/icons/Telegram App-white.png", alt: "Telegram" },
    { id: "twitter", iconPath: "./assets/icons/X-white.png", alt: "Twitter" }
  ];

  const handleSaveBookmark = () => {
    const bookmarkData = {
      name: bookmarkName,
      url: bookmarkUrl,
      icon: selectedIcon,
      id: Date.now() // Simple ID generation
    };
    
    if (onSave) {
      onSave(bookmarkData);
    }
    console.log("Saving bookmark:", bookmarkData);
  };

  const handleLinkClick = () => {
    window.open('https://flowkey-two.vercel.app/', '_blank');
  };

  const handleFileClick = () => {
    window.open('https://github.com/pasindupiumal03/FlowKey-Chrome-Extension/blob/main/README.md', '_blank');
  };

  const handleTwitterClick = () => {
    window.open('https://twitter.com/flowkey', '_blank');
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white p-4 relative">
      {/* Solid color overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: '#101828' }}></div>
      
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

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg p-6 text-black relative overflow-hidden">
          {/* Large bookmark icon at top */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex justify-center">
                <img 
                    src="./assets/icons/book-mark.png" 
                    alt="Empty Bookmarks" 
                    className=" max-w-full h-auto"
                    style={{ maxHeight: '120px' }}
                />
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              value={bookmarkName}
              onChange={(e) => setBookmarkName(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-lg border-none outline-none"
              placeholder="Enter bookmark name"
            />
          </div>

          {/* URL Field */}
          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-medium mb-2">
              Url
            </label>
            <input
              type="url"
              value={bookmarkUrl}
              onChange={(e) => setBookmarkUrl(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-lg border-none outline-none"
              placeholder="Enter website URL"
            />
          </div>

          {/* Icon Selection */}
          <div className="mb-8">
            <label className="block text-gray-600 text-sm font-medium mb-3">
              Choose an icon
            </label>
            <div className="flex space-x-3">
              {iconOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedIcon(option.id)}
                  className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                    selectedIcon === option.id ? 'shadow-lg' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ 
                    backgroundColor: selectedIcon === option.id ? '#6F4FFF' : '#969eac'
                  }}
                >
                  <img 
                    src={option.iconPath} 
                    alt={option.alt} 
                    className="w-8 h-8 object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-auto pt-4">
            <button
              onClick={handleSaveBookmark}
              className="w-full text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base hover:shadow-lg active:scale-95"
              style={{ backgroundColor: '#6E4EFF' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5A3FE6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#6E4EFF'}
            >
              Save to bookmarks
            </button>
            
            <button
              onClick={onBack}
              className="w-full bg-transparent text-gray-600 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-center space-x-8 mt-6 pt-4 border-t border-purple-600/30">
          <button className="p-2" onClick={handleLinkClick}>
            <img 
              src="./assets/icons/link.png" 
              alt="Link" 
              className="w-6 h-6"
            />
          </button>
          <button className="p-2" onClick={handleFileClick}>
            <img 
              src="./assets/icons/file.png" 
              alt="File" 
              className="w-6 h-6"
            />
          </button>
          <button className="p-2" onClick={handleTwitterClick}>
            <img 
              src="./assets/icons/twitter.png" 
              alt="Twitter" 
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBookmarkPage;
