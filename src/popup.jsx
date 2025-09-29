import React, { useState, useEffect } from "react";
import {
  saveToStorage,
  getFromStorage,
  getCurrentTab,
  getBookmarks,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  reorderBookmarks,
} from "./controllers/storageController.js";
import { createRoot } from "react-dom/client";
import "./index.css";
import WelcomePage from "./components/WelcomePage.jsx";
import BookmarksPage from "./components/BookmarksPage.jsx";
import AddBookmarkPage from "./components/AddBookmarkPage.jsx";
import BookmarkSavedPage from "./components/BookmarkSavedPage.jsx";

// --- ADDED: GAS web app URL + check helper ---
const FLOWKEY_GATE_URL =
  "https://script.google.com/macros/s/AKfycbxr8rm-p23okBuBxXJ2LH7_dCfl6E9ypwA5eD4dnHgJDbOju6Ju6ozb9mWIBC8h5MI/exec";

async function checkFlowKeyEligibility(walletAddress) {
  try {
    const url = `${FLOWKEY_GATE_URL}?wallet=${encodeURIComponent(walletAddress)}`;
    const res = await fetch(url, { method: "GET" });
    
    if (!res.ok) {
      console.error(`Token gate API error: ${res.status} ${res.statusText}`);
      return { allowed: false, reason: "api_error", status: res.status };
    }
    
    const data = await res.json();
    
    if (data.error) {
      console.error(`Token gate error:`, data.error);
      return { allowed: false, reason: "gate_error", error: data.error };
    }
    
    return { 
      allowed: !!data.allowed, 
      holding: data.holding || 0, 
      token: data.token,
      requiredAmount: 20000000
    };
  } catch (error) {
    console.error("Token gate check failed:", error);
    return { allowed: false, reason: "network_error", error: error.message };
  }
}
// --- END ADDED ---

function Popup() {
  const [currentPage, setCurrentPage] = useState("bookmarks"); // 'welcome', 'bookmarks', 'addBookmark', or 'bookmarkSaved'
  const [bookmarks, setBookmarks] = useState([]);
  const [lastSavedBookmark, setLastSavedBookmark] = useState(null);
  const [editingBookmark, setEditingBookmark] = useState(null); // For editing existing bookmarks
  const [currentTabInfo, setCurrentTabInfo] = useState(null); // For auto-filling current tab data
  const [loading, setLoading] = useState(false); // For loading states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // --- ADDED: track denial to show message on Welcome page ---
  const [accessDenied, setAccessDenied] = useState(false);
  const [tokenGateInfo, setTokenGateInfo] = useState(null); // Store token gate details

  // Load bookmarks from storage on component mount
  useEffect(() => {
    loadBookmarksFromStorage();

    const checkLoginState = async () => {
      const storedLoginState = await getFromStorage("walletAddress");
      // --- ADDED: read denial flag and token info ---
      const deny = await getFromStorage("flowkeyAccessDenied");
      const gateInfo = await getFromStorage("tokenGateInfo");
      setAccessDenied(!!deny.flowkeyAccessDenied);
      setTokenGateInfo(gateInfo.tokenGateInfo || null);
      // --- END ADDED ---
      if (storedLoginState.walletAddress && !deny.flowkeyAccessDenied) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginState();
  }, []);

  const loadBookmarksFromStorage = async () => {
    try {
      setLoading(true);
      const storedBookmarks = await getBookmarks();
      setBookmarks(storedBookmarks);
      console.log("Loaded bookmarks from storage:", storedBookmarks);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to get current tab information using enhanced storageController
  const getCurrentTabInfo = async () => {
    try {
      const tab = await getCurrentTab();
      if (tab) {
        return {
          title: tab.title,
          url: tab.url,
          favIconUrl: tab.favIconUrl,
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting tab info:", error);
      return null;
    }
  };

  const handlePhantomConnect = async () => {
    try {
      setLoading(true);
      console.log("Connecting to Phantom wallet via content script...");

      // Ask background to open the dedicated connect tab and orchestrate load
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          { type: "FLOWKEY_OPEN_CONNECT_TAB", url: "https://flowkey-two.vercel.app/extension" },
          (res) => resolve(res || {})
        );
      });

      if (response?.error) {
        if (response.error === "PHANTOM_NOT_FOUND") {
          if (confirm("Phantom wallet not found. Open install page?")) {
            chrome.tabs.create({ url: "https://phantom.app/download" });
          }
        } else {
          alert(`Failed to connect: ${response.error}`);
        }
        return;
      }

      const address = response?.address;
      if (!address) {
        alert("No address returned from Phantom.");
        return;
      }

      // Save address directly via chrome.storage.local if present
      if (response?.address) {
        try {
          await new Promise((resolve) =>
            chrome.storage?.local?.set?.({ walletAddress: response.address }, resolve)
          );
        } catch (_) {}
      }
      // Save address to storage
      await saveToStorage({
        walletAddress: address,
        walletProvider: "phantom",
      });
      console.log("Wallet connected:", address);

      // --- ADDED: token-gate check via GAS (no API key in extension) ---
      console.log("Checking FlowKey token eligibility for:", address);
      const gate = await checkFlowKeyEligibility(address);
      
      setTokenGateInfo(gate); // Store gate info for display
      
      if (!gate.allowed) {
        console.log("Access denied. Gate response:", gate);
        setIsLoggedIn(false);
        setAccessDenied(true);
        await saveToStorage({ 
          flowkeyAccessDenied: true,
          tokenGateInfo: gate
        });
        
        // Show specific error message based on the reason
        let errorMessage = "Access denied. ";
        if (gate.reason === "api_error") {
          errorMessage += "Unable to verify token eligibility. Please try again later.";
        } else if (gate.reason === "network_error") {
          errorMessage += "Network error occurred. Please check your connection.";
        } else {
          errorMessage += `You need at least ${(gate.requiredAmount || 20000000).toLocaleString()} FlowKey tokens to access this extension.`;
          if (gate.holding !== undefined) {
            errorMessage += ` Current balance: ${gate.holding.toLocaleString()} tokens.`;
          }
        }
        
        alert(errorMessage);
        return; // stop here; stay on Welcome page
      } else {
        console.log("Access granted. Token balance:", gate.holding);
        setAccessDenied(false);
        await saveToStorage({ 
          flowkeyAccessDenied: false,
          tokenGateInfo: gate
        });
      }
      // --- END ADDED ---

      setIsLoggedIn(true);
      // Navigate to bookmarks after successful connection
      setCurrentPage("bookmarks");
    } catch (error) {
      console.error("Error during Phantom connect:", error);
      alert("Error connecting to wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWelcome = () => {
    setCurrentPage("welcome");
  };

  const handleAddBookmark = () => {
    setEditingBookmark(null); // Clear editing state for new bookmark
    setCurrentTabInfo(null); // Clear tab info for manual entry
    setCurrentPage("addBookmark");
  };

  const handleAddCurrentTabBookmark = async () => {
    setEditingBookmark(null); // Clear editing state
    const tabInfo = await getCurrentTabInfo();
    setCurrentTabInfo(tabInfo);
    setCurrentPage("addBookmark");
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setCurrentPage("addBookmark");
  };

  const handleBackToBookmarks = () => {
    setEditingBookmark(null); // Clear editing state
    setCurrentTabInfo(null); // Clear tab info
    setCurrentPage("bookmarks");
  };

  const handleSaveBookmark = async (bookmarkData) => {
    try {
      setLoading(true);
      let savedBookmark;

      if (editingBookmark) {
        // Update existing bookmark using storageController
        savedBookmark = await updateBookmark(editingBookmark.id, bookmarkData);
        if (savedBookmark) {
          setBookmarks((prev) =>
            prev.map((bookmark) =>
              bookmark.id === editingBookmark.id ? savedBookmark : bookmark
            )
          );
        }
        setEditingBookmark(null);
      } else {
        // Add new bookmark using storageController
        savedBookmark = await addBookmark(bookmarkData);
        if (savedBookmark) {
          setBookmarks((prev) => [...prev, savedBookmark]);
        }
      }

      if (savedBookmark) {
        setLastSavedBookmark(savedBookmark);
        setCurrentPage("bookmarks"); // Navigate directly to bookmarks page
        console.log("Bookmark saved:", savedBookmark);
      } else {
        alert("Failed to save bookmark. Please try again.");
      }
    } catch (error) {
      console.error("Error saving bookmark:", error);
      alert("Error saving bookmark. Please try again.");
    } finally {
      setLoading(false);
      setCurrentTabInfo(null); // Clear tab info after saving
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      setLoading(true);
      const success = await deleteBookmark(bookmarkId);
      if (success) {
        setBookmarks((prev) =>
          prev.filter((bookmark) => bookmark.id !== bookmarkId)
        );
        console.log("Bookmark deleted successfully");
      } else {
        alert("Failed to delete bookmark. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      alert("Error deleting bookmark. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReorderBookmarks = async (newBookmarks) => {
    try {
      const reorderedBookmarks = await reorderBookmarks(newBookmarks);
      if (reorderedBookmarks) {
        setBookmarks(reorderedBookmarks);
        console.log("Bookmarks reordered successfully");
      }
    } catch (error) {
      console.error("Error reordering bookmarks:", error);
    }
  };

  const handleBackToBookmarksFromSaved = () => {
    setCurrentPage("bookmarks");
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-600">Processing...</p>
          </div>
        </div>
      )}
      {!isLoggedIn && (
        <WelcomePage 
          onConnect={handlePhantomConnect} 
          accessDenied={accessDenied} 
          tokenGateInfo={tokenGateInfo}
          loading={loading}
        />
      )}
      {isLoggedIn && (
        <>
          {currentPage === "bookmarks" && (
            <BookmarksPage
              onBack={handleBackToWelcome}
              onAddBookmark={handleAddBookmark}
              onAddCurrentTabBookmark={handleAddCurrentTabBookmark}
              onEditBookmark={handleEditBookmark}
              onDeleteBookmark={handleDeleteBookmark}
              onReorderBookmarks={handleReorderBookmarks}
              bookmarks={bookmarks}
            />
          )}
          {currentPage === "addBookmark" && (
            <AddBookmarkPage
              onBack={handleBackToBookmarks}
              onSave={handleSaveBookmark}
              editingBookmark={editingBookmark}
              currentTabInfo={currentTabInfo}
            />
          )}
          {currentPage === "bookmarkSaved" && (
            <BookmarkSavedPage
              onBackToBookmarks={handleBackToBookmarksFromSaved}
              bookmarkData={lastSavedBookmark}
            />
          )}
        </>
      )}
    </>
  );
}

const root = createRoot(document.getElementById("react-target"));
root.render(<Popup />);
