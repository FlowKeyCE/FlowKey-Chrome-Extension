chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "OPEN_TABS") {
    try {
      const tabs = Array.isArray(message.tabs) ? message.tabs.filter(t => t && t.url) : [];
      if (tabs.length === 0) {
        sendResponse && sendResponse({ ok: false, error: "NO_TABS" });
        return; 
      }

      const [first, ...rest] = tabs;
      chrome.windows.create({ url: first.url, focused: true }, (createdWindow) => {
        if (chrome.runtime.lastError || !createdWindow) {
          sendResponse && sendResponse({ ok: false, error: chrome.runtime.lastError?.message || "WINDOW_CREATE_FAILED" });
          return;
        }

        const windowId = createdWindow.id;
        rest.forEach((tab) => {
          try {
            chrome.tabs.create({ windowId, url: tab.url, pinned: !!tab.pinned });
          } catch (_) {}
        });

        sendResponse && sendResponse({ ok: true, windowId });
      });

      // Keep the message channel open for the async sendResponse
      return true;
    } catch (e) {
      sendResponse && sendResponse({ ok: false, error: e?.message || "UNKNOWN_ERROR" });
    }
  }
});