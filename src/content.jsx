import { initPopup } from "./shadowRoot";

// Optionally mount injected UI
// setInterval(() => {
//   const popup = document.querySelector("#react-chrome-extension-popup");
//   if (popup) return;
//   initPopup();
// }, 100);

// Inject in-page script to access window.solana (content scripts are isolated)
const injectInpageScript = () => {
  try {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("inpage.js");
    script.async = false;
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => {
      script.parentNode && script.parentNode.removeChild(script);
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("FlowKey: failed to inject inpage script", e);
  }
};

injectInpageScript();

// Maintain pending connect requests keyed by requestId
const pendingConnectResponses = new Map();

// Receive messages from the in-page context
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  const data = event.data;
  if (!data || data.target !== "FLOWKEY_EXTENSION") return;

  if (data.type === "FLOWKEY_PHANTOM_CONNECTED") {
    const { requestId, address, error } = data;
    const resolver = pendingConnectResponses.get(requestId);
    if (resolver) {
      resolver({ address, error });
      pendingConnectResponses.delete(requestId);
    }
  }
});

// Listen for messages from the extension (popup/background)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return;

  if (message.type === "FLOWKEY_CONNECT") {
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    // Store resolver to reply asynchronously
    pendingConnectResponses.set(requestId, (payload) => {
      try {
        sendResponse(payload);
      } catch (_) {
        // channel might be closed; ignore
      }
    });

    // First open an in-page UI which lets the user click to connect.
    window.postMessage(
      { type: "FLOWKEY_OPEN_CONNECT_UI", target: "FLOWKEY_INPAGE", requestId },
      "*"
    );

    // keep the message channel open for async response
    return true;
  }
});
