import React, { useState } from "react";

function BookmarksPage({ onBack, onAddBookmark, onEditBookmark, onDeleteBookmark, onReorderBookmarks, bookmarks = [] }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState(null);
  const [draggedBookmark, setDraggedBookmark] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const handleOpenAllBookmarks = () => {
    // Open all bookmarks in new tabs
    bookmarks.forEach(bookmark => {
      if (bookmark.url) {
        window.open(bookmark.url, '_blank');
      }
    });
  };

  const handleAddToBookmarks = () => {
    console.log("Adding current site to bookmarks...");
  };

  const handleAddWebsite = () => {
    if (onAddBookmark) {
      onAddBookmark();
    }
  };

  const handleOpenBookmark = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleEditBookmark = (bookmark) => {
    if (onEditBookmark) {
      onEditBookmark(bookmark);
    }
  };

  const handleDeleteClick = (bookmark) => {
    setBookmarkToDelete(bookmark);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (bookmarkToDelete && onDeleteBookmark) {
      onDeleteBookmark(bookmarkToDelete.id);
    }
    setShowDeleteConfirm(false);
    setBookmarkToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setBookmarkToDelete(null);
  };

  // Drag and Drop handlers
  const handleDragStart = (e, bookmark, index) => {
    setDraggedBookmark({ bookmark, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (!draggedBookmark || draggedBookmark.index === dropIndex) {
      setDraggedBookmark(null);
      setDragOverIndex(null);
      return;
    }

    const newBookmarks = [...bookmarks];
    const draggedItem = newBookmarks[draggedBookmark.index];
    
    // Remove the dragged item
    newBookmarks.splice(draggedBookmark.index, 1);
    
    // Insert at new position
    const insertIndex = dropIndex > draggedBookmark.index ? dropIndex - 1 : dropIndex;
    newBookmarks.splice(insertIndex, 0, draggedItem);
    
    if (onReorderBookmarks) {
      onReorderBookmarks(newBookmarks);
    }
    
    setDraggedBookmark(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedBookmark(null);
    setDragOverIndex(null);
  };

  const getBookmarkIconPath = (iconType) => {
    switch (iconType) {
      case 'link':
        return './assets/icons/Internet-white.png';
      case 'discord':
        return './assets/icons/Discord New-white.png';
      case 'telegram':
        return './assets/icons/Telegram App-white.png';
      case 'twitter':
        return './assets/icons/X-white.png';
      default:
        return './assets/icons/Internet-white.png';
    }
  };

  const handleLinkClick = () => {
    window.open('https://flowkey-two.vercel.app/', '_blank');
  };

  const handleFileClick = () => {
    // Replace with actual FlowKey documentation URL
    window.open('https://github.com/pasindupiumal03/FlowKey-Chrome-Extension/blob/main/README.md', '_blank');
  };

  const handleTwitterClick = () => {
    // Replace with actual FlowKey Twitter URL
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

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button 
            onClick={handleOpenAllBookmarks}
            className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors"
          >
            <span>Open All Bookmarks</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>

          <button 
            onClick={handleAddToBookmarks}
            className="w-full text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            style={{ backgroundColor: '#6E4EFF' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5A3FE6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6E4EFF'}
          >
            <span>Add to bookmarks</span>
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

          {/* Bookmarks List or Empty State */}
          {bookmarks.length > 0 ? (
            <div className="flex-1 space-y-3 mb-6">
              {bookmarks.map((bookmark, index) => (
                <div 
                  key={bookmark.id} 
                  className={`bg-gray-800/50 rounded-lg p-3 flex items-center justify-between transition-all duration-200 ${
                    dragOverIndex === index ? 'bg-purple-600/20 border-2 border-purple-500' : ''
                  } ${draggedBookmark?.index === index ? 'opacity-50' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, bookmark, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  {/* Left side - Drag handle, Icon, Name */}
                  <div className="flex items-center space-x-3">
                    {/* Drag Handle */}
                    <div className="cursor-move hover:text-white">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                    
                    {/* Record Indicator */}
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    
                    {/* Bookmark Icon */}
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center"
                      style={{ backgroundColor: '#6F4FFF' }}
                    >
                      <img 
                        src={getBookmarkIconPath(bookmark.icon)}
                        alt={bookmark.icon}
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    
                    {/* Bookmark Name */}
                    <span className="text-white font-medium">{bookmark.name}</span>
                  </div>
                  
                  {/* Right side - Action buttons */}
                  <div className="flex items-center space-x-2">
                    {/* Open in new tab */}
                    <button 
                      onClick={() => handleOpenBookmark(bookmark.url)}
                      className="p-1 hover:bg-gray-600/50 rounded transition-colors"
                      title="Open bookmark"
                    >
                      <svg className="w-4 h-4 text-gray-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                    
                    {/* Edit bookmark */}
                    <button 
                      onClick={() => handleEditBookmark(bookmark)}
                      className="p-1 hover:bg-gray-600/50 rounded transition-colors"
                      title="Edit bookmark"
                    >
                      <svg className="w-4 h-4 text-gray-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    
                    {/* Delete bookmark */}
                    <button 
                      onClick={() => handleDeleteClick(bookmark)}
                      className="p-1 hover:bg-gray-600/50 rounded transition-colors"
                      title="Delete bookmark"
                    >
                      <svg className="w-4 h-4 text-gray-300 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Add Website Button */}
              <button 
                onClick={handleAddWebsite}
                className="w-full py-4 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center space-x-2 hover:border-gray-500 hover:bg-gray-800/30 transition-colors"
              >
                <span className="text-2xl text-gray-400">+</span>
                <span className="text-gray-400">Add a website to bookmarks</span>
              </button>
            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 px-4">
              <div className="flex justify-center">
                <img 
                  src="./assets/icons/book-mark.png" 
                  alt="Empty Bookmarks" 
                  className="opacity-50 max-w-full h-auto"
                  style={{ maxHeight: '120px' }}
                />
              </div>
              <p className="text-center text-sm opacity-80 max-w-sm">
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
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 rounded-lg">
            <div className="bg-white rounded-lg p-4 mx-4 max-w-xs w-full shadow-xl">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-red-100 mb-3">
                  <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Delete Bookmark</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Are you sure you want to delete<br/>
                  <span className="font-medium">"{bookmarkToDelete?.name}"</span>?<br/>
                  This action cannot be undone.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelDelete}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-3 rounded-md text-sm hover:bg-gray-300 transition-colors"
                  >
                    No
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md text-sm hover:bg-red-700 transition-colors"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layouts Section
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <h2 className="text-xl font-semibold">Layouts (0)</h2>
          </div>
        </div> */}

        {/* Bottom Navigation */}
        <div className="flex justify-center space-x-8 mt-6 pt-4 border-t border-purple-600/30">
          <button 
            className="p-2 rounded-lg transition-all duration-300 hover:bg-purple-600/20 hover:scale-110 active:scale-95" 
            onClick={handleLinkClick}
          >
            <img 
              src="./assets/icons/link.png" 
              alt="Link" 
              className="w-6 h-6 transition-all duration-300 hover:brightness-125"
            />
          </button>
          <button 
            className="p-2 rounded-lg transition-all duration-300 hover:bg-purple-600/20 hover:scale-110 active:scale-95" 
            onClick={handleFileClick}
          >
            <img 
              src="./assets/icons/file.png" 
              alt="File" 
              className="w-6 h-6 transition-all duration-300 hover:brightness-125"
            />
          </button>
          <button 
            className="p-2 rounded-lg transition-all duration-300 hover:bg-purple-600/20 hover:scale-110 active:scale-95" 
            onClick={handleTwitterClick}
          >
            <img 
              src="./assets/icons/twitter.png" 
              alt="Twitter" 
              className="w-6 h-6 transition-all duration-300 hover:brightness-125"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookmarksPage;
