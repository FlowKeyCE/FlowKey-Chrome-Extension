(function () {
  const getProvider = () => {
    try {
      if (typeof window !== "undefined" && window.solana && window.solana.isPhantom) {
        return window.solana;
      }
    } catch (_) {}
    return null;
  };

  const postResult = (payload) => {
    window.postMessage({ target: "FLOWKEY_EXTENSION", ...payload }, "*");
  };

  const removeOverlay = () => {
    const el = document.getElementById("flowkey-connect-overlay");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  };

  const ensureOverlay = (requestId) => {
    removeOverlay();

    const overlay = document.createElement("div");
    overlay.id = "flowkey-connect-overlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "2147483647";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    const panel = document.createElement("div");
    panel.style.background = "#111728";
    panel.style.color = "#fff";
    panel.style.borderRadius = "12px";
    panel.style.padding = "20px";
    panel.style.width = "min(90vw, 360px)";
    panel.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
    panel.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

    const title = document.createElement("div");
    title.textContent = "FlowKey";
    title.style.fontSize = "18px";
    title.style.fontWeight = "700";
    title.style.marginBottom = "8px";

    const desc = document.createElement("div");
    desc.textContent = "Click to connect your Phantom wallet";
    desc.style.fontSize = "14px";
    desc.style.opacity = "0.8";
    desc.style.marginBottom = "14px";

    const btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.gap = "8px";

    const connectBtn = document.createElement("button");
    connectBtn.textContent = "Connect with Phantom";
    connectBtn.style.flex = "1";
    connectBtn.style.background = "#6E4EFF";
    connectBtn.style.border = "none";
    connectBtn.style.color = "#fff";
    connectBtn.style.borderRadius = "8px";
    connectBtn.style.padding = "10px 12px";
    connectBtn.style.cursor = "pointer";

    const forceBtn = document.createElement("button");
    forceBtn.textContent = "Force re-connect";
    forceBtn.style.flex = "1";
    forceBtn.style.background = "#30324a";
    forceBtn.style.border = "1px solid #4b4e74";
    forceBtn.style.color = "#fff";
    forceBtn.style.borderRadius = "8px";
    forceBtn.style.padding = "10px 12px";
    forceBtn.style.cursor = "pointer";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Cancel";
    closeBtn.style.marginTop = "10px";
    closeBtn.style.width = "100%";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "#b3b7d3";
    closeBtn.style.cursor = "pointer";

    const provider = getProvider();
    const handleResult = (address, error) => {
      postResult({ type: "FLOWKEY_PHANTOM_CONNECTED", requestId, address, error });
      removeOverlay();
    };

    connectBtn.onclick = async () => {
      if (!provider) return handleResult(undefined, "PHANTOM_NOT_FOUND");
      try {
        const resp = await provider.connect({ onlyIfTrusted: false });
        handleResult(resp?.publicKey?.toString?.());
      } catch (e) {
        handleResult(undefined, e?.message || "CONNECT_FAILED");
      }
    };

    forceBtn.onclick = async () => {
      if (!provider) return handleResult(undefined, "PHANTOM_NOT_FOUND");
      try {
        try { await provider.disconnect(); } catch (_) {}
        const resp = await provider.connect({ onlyIfTrusted: false });
        handleResult(resp?.publicKey?.toString?.());
      } catch (e) {
        handleResult(undefined, e?.message || "CONNECT_FAILED");
      }
    };

    closeBtn.onclick = () => handleResult(undefined, "USER_CANCELLED");

    btnRow.appendChild(connectBtn);
    btnRow.appendChild(forceBtn);
    panel.appendChild(title);
    panel.appendChild(desc);
    panel.appendChild(btnRow);
    panel.appendChild(closeBtn);
    overlay.appendChild(panel);
    document.documentElement.appendChild(overlay);
  };

  window.addEventListener("message", async (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.target !== "FLOWKEY_INPAGE") return;

    if (data.type === "FLOWKEY_OPEN_CONNECT_UI") {
      const { requestId } = data;
      ensureOverlay(requestId);
      return;
    }

    if (data.type === "FLOWKEY_PHANTOM_CONNECT") {
      const { requestId } = data;
      const provider = getProvider();
      if (!provider) {
        postResult({ type: "FLOWKEY_PHANTOM_CONNECTED", requestId, error: "PHANTOM_NOT_FOUND" });
        return;
      }
      try {
        const resp = await provider.connect({ onlyIfTrusted: false });
        const address = resp?.publicKey?.toString?.();
        postResult({ type: "FLOWKEY_PHANTOM_CONNECTED", requestId, address });
      } catch (e) {
        postResult({ type: "FLOWKEY_PHANTOM_CONNECTED", requestId, error: e?.message || "CONNECT_FAILED" });
      }
    }
  });
})();


