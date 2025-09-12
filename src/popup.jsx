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

function Popup() {
  const [currentPage, setCurrentPage] = useState('welcome'); // 'welcome', 'bookmarks', or 'addBookmark'
  const [bookmarks, setBookmarks] = useState([]);

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
    setCurrentPage('bookmarks');
    console.log("Bookmark saved:", bookmarkData);
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
    </>
  );
}

const root = createRoot(document.getElementById("react-target"));
root.render(<Popup />);
