document.getElementById("login").addEventListener("click", login);
document.getElementById("apiToken").addEventListener("keypress", (e) => {
  if (e.key === "Enter") login();
});

document.getElementById("createTicket").addEventListener("click", createTicket);
document.getElementById("title").addEventListener("keypress", (e) => {
  if (e.key === "Enter") createTicket();
});
document.getElementById("description").addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    createTicket();
  }
});

function login() {
  const apiToken = document.getElementById("apiToken").value;

  if (!apiToken) {
    document.getElementById("status").innerText = "Please enter your API token.";
    return;
  }

  chrome.storage.local.set({ apiToken }, () => {
    fetchProjects(apiToken);
  });
}

function fetchProjects(apiToken) {
  fetch('https://www.pivotaltracker.com/services/v5/projects', {
    method: 'GET',
    headers: {
      'X-TrackerToken': apiToken,
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (Array.isArray(data)) {
      populateProjectDropdown(data);
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("ticketSection").style.display = "block";
    } else {
      document.getElementById("status").innerText = "Invalid API token.";
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById("status").innerText = "Error fetching projects.";
  });
}

function populateProjectDropdown(projects) {
  const dropdown = document.getElementById("projectDropdown");
  dropdown.innerHTML = '';

  projects.forEach(project => {
    const option = document.createElement("option");
    option.value = project.id;
    option.text = project.name;
    dropdown.add(option);
  });
}

function createTicket() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const storyType = document.getElementById("storyType").value;
  const projectId = document.getElementById("projectDropdown").value;

  if (!title) {
    document.getElementById("status").innerText = "Please enter a title.";
    return;
  }
  if (!description) {
    document.getElementById("status").innerText = "Please enter a description.";
    return;
  }

  chrome.storage.local.get(['apiToken'], (result) => {
    const apiToken = result.apiToken;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = new URL(tabs[0].url);
      let label = null;

      // Check if the URL is a subdomain of mytime.com
      if (url.hostname.endsWith("mytime.com")) {
        const subdomain = url.hostname.split('.')[0];
        label = subdomain;
      }

      chrome.runtime.sendMessage({ action: "captureScreenshot" }, (response) => {
        const screenshot = response.screenshot;
        createPivotalTrackerStory(apiToken, projectId, title, description, storyType, url.href, screenshot, label);
      });
    });
  });
}

function createPivotalTrackerStory(apiToken, projectId, title, description, storyType, url, screenshot, label) {
  const payload = {
    name: title,
    description: `${description}\n\nURL: ${url}`,
    labels: label ? ["chrome-extension", label] : ["chrome-extension"],
    story_type: storyType,
  };

  fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/stories`, {
    method: 'POST',
    headers: {
      'X-TrackerToken': apiToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    if (data.id) {
      document.getElementById("status").innerText = "Ticket created successfully!";
      uploadScreenshotAndAddComment(apiToken, projectId, data.id, url, screenshot);
    } else {
      document.getElementById("status").innerText = "Failed to create ticket.";
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById("status").innerText = "Error creating ticket.";
  });
}

function uploadScreenshotAndAddComment(apiToken, projectId, storyId, url, screenshot) {
  const blob = dataURItoBlob(screenshot);
  const formData = new FormData();
  formData.append('file', blob, 'screenshot.png');

  fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/uploads`, {
    method: 'POST',
    headers: {
      'X-TrackerToken': apiToken,
    },
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.id) {
      addScreenshotComment(apiToken, projectId, storyId, data.id, url);
    } else {
      document.getElementById("status").innerText = "Failed to upload screenshot.";
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById("status").innerText = "Error uploading screenshot.";
  });
}

function addScreenshotComment(apiToken, projectId, storyId, attachmentId, url) {
  const payload = {
    text: `Screenshot attached. URL: ${url}`,
    file_attachments: [{ id: attachmentId }]
  };

  fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/stories/${storyId}/comments`, {
    method: 'POST',
    headers: {
      'X-TrackerToken': apiToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    if (data.id) {
      document.getElementById("status").innerText = "Screenshot added successfully!";
    } else {
      document.getElementById("status").innerText = "Failed to add screenshot comment.";
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById("status").innerText = "Error adding screenshot comment.";
  });
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

// Automatically try to log in if the token is already stored
chrome.storage.local.get(['apiToken'], (result) => {
  if (result.apiToken) {
    fetchProjects(result.apiToken);
  }
});
