# Pivotal Tracker Story Creator Chrome Extension

This Chrome extension allows you to quickly create stories in Pivotal Tracker directly from your browser. It supports adding a title, description, URL of the current page, and a screenshot to the story. If the URL is a subdomain of `mytime.com`, it automatically labels the story with the subdomain name.

## Features

- **Quick Story Creation**: Add a title and description for your Pivotal Tracker story.
- **URL and Screenshot**: Automatically include the current page's URL and a screenshot in the story.
- **Automatic Labeling**: Automatically label stories with the subdomain of `mytime.com` URLs.

## Installation Instructions

### Method 1: Manual Installation from Source

1. **Clone or Download the Repository**:
   - Clone the repository using Git:
     ```bash
     git clone https://github.com/MelianLabs/pivotal-tracker-story-creator-chrome-extension.git
     ```
   - Or download the ZIP file from the [GitHub repository](https://github.com/MelianLabs/pivotal-tracker-story-creator-chrome-extension) and extract it.

2. **Load the Extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" in the top right corner.
   - Click "Load unpacked" and select the folder where you cloned or extracted the extension files.

3. **Start Using the Extension**:
   - The extension should now be installed and ready to use. Click on the extension icon in your Chrome toolbar to open the Pivotal Tracker Story Creator.

### Method 2: Installation Using `.crx` File

1. **Download the `.crx` File**:
   - Download the `.crx` file from the following link: [Pivotal Tracker Story Creator `.crx` Download](https://github.com/MelianLabs/pivotal-tracker-story-creator-chrome-extension/releases/latest/download/pivotal-tracker-story-creator.crx).

2. **Install the Extension**:
   - Drag and drop the `.crx` file into the Chrome `chrome://extensions/` page.
   - If Chrome blocks the installation, you may need to enable developer mode by toggling the "Developer mode" switch in the top right corner.

3. **Start Using the Extension**:
   - Once installed, the extension should appear in your Chrome toolbar, ready for use.

## How to Log In

To use this extension, you need to log in with your Pivotal Tracker API token.

1. **Create Your API Token**:
   - Go to your Pivotal Tracker profile page: [Pivotal Tracker Profile](https://www.pivotaltracker.com/profile).
   - Scroll down to the "API Token" section.
   - If you don't already have an API token, click "Create New Token".
   - Copy the API token.

2. **Log In to the Extension**:
   - Click on the extension icon in your Chrome toolbar to open it.
   - Paste your API token into the "API Token" field.
   - Click the "Login" button.

3. **Select a Project and Create Stories**:
   - Once logged in, you can select a project from the dropdown menu.
   - Enter a title and description for the story.
   - Click "Create Ticket" to create the story in Pivotal Tracker. The URL of the current page will be added to the description, and a screenshot will be attached as a comment.

## Building the Extension

If you want to make modifications and rebuild the extension:

1. **Make Your Changes**:
   - Edit the necessary files in the repository.

2. **Package the Extension**:
   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" in the top right corner.
   - Click "Pack extension".
   - Select the directory where your extension files are located.
   - Chrome will generate a `.crx` file (the packaged extension) and a `.pem` file (your private key).

3. **Distribute the `.crx` File**:
   - You can share the newly created `.crx` file directly with others or upload it to your GitHub repository for others to download.

## Contributing

If you have any suggestions or improvements, feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
