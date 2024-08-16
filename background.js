chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureScreenshot") {
    chrome.tabs.captureVisibleTab(null, {}, (image) => {
      sendResponse({ screenshot: image });
    });
    return true;  // Indicates that the response is asynchronous
  }
});
