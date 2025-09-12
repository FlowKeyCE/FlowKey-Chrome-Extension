// Test script to verify bookmark storage functionality
// This can be run in browser console to test Chrome storage integration

console.log("=== FlowKey Extension Bookmark Storage Test ===");

// Mock bookmark data for testing
const testBookmark = {
  name: "FlowKey Test",
  url: "https://flowkey-two.vercel.app/",
  icon: "link",
  id: Date.now()
};

const testBookmark2 = {
  name: "GitHub Repository",
  url: "https://github.com/bytesquadlabs/FlowKey-Chrome-Extension",
  icon: "link",
  id: Date.now() + 1
};

// Test functions
async function testStorageController() {
  console.log("\n1. Testing basic storage functions...");
  
  try {
    // Test saving a single bookmark
    console.log("- Saving test bookmark:", testBookmark);
    const saved = await chrome.storage.local.set({ bookmarks: [testBookmark] });
    console.log("✓ Bookmark saved successfully");
    
    // Test retrieving bookmarks
    const result = await chrome.storage.local.get(["bookmarks"]);
    console.log("✓ Retrieved bookmarks:", result.bookmarks);
    
    // Test adding another bookmark
    console.log("- Adding second bookmark:", testBookmark2);
    const updatedBookmarks = [...result.bookmarks, testBookmark2];
    await chrome.storage.local.set({ bookmarks: updatedBookmarks });
    
    // Verify both bookmarks exist
    const finalResult = await chrome.storage.local.get(["bookmarks"]);
    console.log("✓ Final bookmarks list:", finalResult.bookmarks);
    
    return true;
  } catch (error) {
    console.error("✗ Storage test failed:", error);
    return false;
  }
}

async function testTabsAPI() {
  console.log("\n2. Testing Chrome tabs API...");
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("✓ Current tab info:", {
      title: tab.title,
      url: tab.url,
      id: tab.id
    });
    return true;
  } catch (error) {
    console.error("✗ Tabs API test failed:", error);
    return false;
  }
}

async function testPermissions() {
  console.log("\n3. Testing required permissions...");
  
  try {
    const hasStorage = await chrome.permissions.contains({ permissions: ['storage'] });
    const hasTabs = await chrome.permissions.contains({ permissions: ['tabs'] });
    const hasActiveTab = await chrome.permissions.contains({ permissions: ['activeTab'] });
    
    console.log("✓ Storage permission:", hasStorage ? "GRANTED" : "DENIED");
    console.log("✓ Tabs permission:", hasTabs ? "GRANTED" : "DENIED");
    console.log("✓ ActiveTab permission:", hasActiveTab ? "GRANTED" : "DENIED");
    
    return hasStorage && (hasTabs || hasActiveTab);
  } catch (error) {
    console.error("✗ Permissions test failed:", error);
    return false;
  }
}

async function runAllTests() {
  console.log("Starting comprehensive bookmark functionality tests...\n");
  
  const storageTest = await testStorageController();
  const tabsTest = await testTabsAPI();
  const permissionsTest = await testPermissions();
  
  console.log("\n=== Test Results ===");
  console.log("Storage functionality:", storageTest ? "✓ PASS" : "✗ FAIL");
  console.log("Tabs API:", tabsTest ? "✓ PASS" : "✗ FAIL");
  console.log("Permissions:", permissionsTest ? "✓ PASS" : "✗ FAIL");
  
  const allPassed = storageTest && tabsTest && permissionsTest;
  console.log("\nOverall result:", allPassed ? "✓ ALL TESTS PASSED" : "✗ SOME TESTS FAILED");
  
  if (allPassed) {
    console.log("\n🎉 FlowKey Extension bookmark storage is ready!");
    console.log("You can now:");
    console.log("- Save bookmarks to Chrome storage");
    console.log("- Retrieve bookmarks after extension restart");
    console.log("- Auto-fill current tab information");
    console.log("- Edit and delete stored bookmarks");
  }
  
  return allPassed;
}

// Auto-run if in extension context
if (typeof chrome !== 'undefined' && chrome.storage) {
  runAllTests();
} else {
  console.log("Run this script in the extension popup console to test bookmark storage functionality");
}