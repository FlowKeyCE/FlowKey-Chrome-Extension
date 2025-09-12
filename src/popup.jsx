import React, { useState, useEffect } from "react";
import {
  saveToStorage,
  getFromStorage,
} from "./controllers/storageController.js";
import { createRoot } from "react-dom/client";
import "./index.css";
import WelcomePage from "./components/WelcomePage.jsx";
import BookmarksPage from "./components/BookmarksPage.jsx";
import AddBookmarkPage from "./components/AddBookmarkPage.jsx";
import BookmarkSavedPage from "./components/BookmarkSavedPage.jsx";

function Popup() {
  const [currentPage, setCurrentPage] = useState('welcome'); // 'welcome', 'bookmarks', 'addBookmark', or 'bookmarkSaved'
  const [bookmarks, setBookmarks] = useState([]);
  const [lastSavedBookmark, setLastSavedBookmark] = useState(null);

  const handlePhantomConnect = () => {
    console.log("Connecting to Phantom wallet...");
    // Simulate successful connection and navigate to bookmarks
    setCurrentPage('bookmarks');
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
  };

  const handleAddBookmark = () => {
    setCurrentPage('addBookmark');
  };

  const handleBackToBookmarks = () => {
    setCurrentPage('bookmarks');
  };

  const handleSaveBookmark = (bookmarkData) => {
    setBookmarks(prev => [...prev, bookmarkData]);
    setLastSavedBookmark(bookmarkData);
    setCurrentPage('bookmarkSaved');
    console.log("Bookmark saved:", bookmarkData);
  };

  const handleBackToBookmarksFromSaved = () => {
    setCurrentPage('bookmarks');
  };

  return (
    <>
      {currentPage === 'welcome' && (
        <WelcomePage onConnect={handlePhantomConnect} />
      )}
      {currentPage === 'bookmarks' && (
        <BookmarksPage 
          onBack={handleBackToWelcome}
          onAddBookmark={handleAddBookmark}
          bookmarks={bookmarks}
        />
      )}
      {currentPage === 'addBookmark' && (
        <AddBookmarkPage 
          onBack={handleBackToBookmarks}
          onSave={handleSaveBookmark}
        />
      )}
      {currentPage === 'bookmarkSaved' && (
        <BookmarkSavedPage 
          onBackToBookmarks={handleBackToBookmarksFromSaved}
          bookmarkData={lastSavedBookmark}
        />
      )}
    </>
  );
}

const root = createRoot(document.getElementById("react-target"));
root.render(<Popup />);
