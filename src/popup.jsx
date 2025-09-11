import React, { useState, useEffect } from "react";
import {
  saveToStorage,
  getFromStorage,
} from "./controllers/storageController.js";
import { createRoot } from "react-dom/client";
import "./index.css";
import WelcomePage from "./components/WelcomePage.jsx";
import BookmarksPage from "./components/BookmarksPage.jsx";

function Popup() {
  const [currentPage, setCurrentPage] = useState('welcome'); // 'welcome' or 'bookmarks'

  const handlePhantomConnect = () => {
    console.log("Connecting to Phantom wallet...");
    // Simulate successful connection and navigate to bookmarks
    setCurrentPage('bookmarks');
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
  };

  return (
    <>
      {currentPage === 'welcome' && (
        <WelcomePage onConnect={handlePhantomConnect} />
      )}
      {currentPage === 'bookmarks' && (
        <BookmarksPage onBack={handleBackToWelcome} />
      )}
    </>
  );
}

const root = createRoot(document.getElementById("react-target"));
root.render(<Popup />);
