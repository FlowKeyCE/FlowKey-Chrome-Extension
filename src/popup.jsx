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
  const [editingBookmark, setEditingBookmark] = useState(null); // For editing existing bookmarks

  const handlePhantomConnect = () => {
    console.log("Connecting to Phantom wallet...");
    // Simulate successful connection and navigate to bookmarks
    setCurrentPage('bookmarks');
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
  };

  const handleAddBookmark = () => {
    setEditingBookmark(null); // Clear editing state for new bookmark
    setCurrentPage('addBookmark');
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setCurrentPage('addBookmark');
  };

  const handleBackToBookmarks = () => {
    setEditingBookmark(null); // Clear editing state
    setCurrentPage('bookmarks');
  };

  const handleSaveBookmark = (bookmarkData) => {
    if (editingBookmark) {
      // Update existing bookmark
      setBookmarks(prev => prev.map(bookmark => 
        bookmark.id === editingBookmark.id ? { ...bookmarkData, id: editingBookmark.id } : bookmark
      ));
      setEditingBookmark(null);
    } else {
      // Add new bookmark
      setBookmarks(prev => [...prev, bookmarkData]);
    }
    setLastSavedBookmark(bookmarkData);
    setCurrentPage('bookmarks'); // Navigate directly to bookmarks page
    console.log("Bookmark saved:", bookmarkData);
  };

  const handleDeleteBookmark = (bookmarkId) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
  };

  const handleReorderBookmarks = (newBookmarks) => {
    setBookmarks(newBookmarks);
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
          onEditBookmark={handleEditBookmark}
          onDeleteBookmark={handleDeleteBookmark}
          onReorderBookmarks={handleReorderBookmarks}
          bookmarks={bookmarks}
        />
      )}
      {currentPage === 'addBookmark' && (
        <AddBookmarkPage 
          onBack={handleBackToBookmarks}
          onSave={handleSaveBookmark}
          editingBookmark={editingBookmark}
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
