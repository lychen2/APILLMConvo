# APILLMConvo

A modern, feature-rich web application for interacting with multiple Large Language Models through a unified, intuitive interface. Built with vanilla JavaScript, HTML, and CSS.

## 🌟 Purpose and Motivation

This project began as a personal utility to solve a practical problem: accessing modern AI models like Claude and Gemini can be difficult from certain regions, such as China. This tool provides a straightforward way to connect to these services using your own API keys through a unified proxy.

It's a personal project, built to scratch my own itch, and I'm sharing it in the hope that it might be useful to others facing similar challenges.

## 🤖 How It Was Built

It's important to mention that a significant portion of this application's code was generated with the help of **Claude**. My role was primarily to guide the development, refine the logic, and piece everything together into a functional tool. The credit for the heavy lifting goes to the AI itself.

## ✨ Key Features

### Core Functionality
*   **🔄 Unified Interface:** Chat with different LLMs without switching between multiple websites or applications
*   **⚙️ Provider Management:** Easily add, edit, and manage your API keys for various services through a user-friendly interface
*   **🔒 Local First:** Your conversation history and API keys are stored locally in your browser, not on any server
*   **🌍 Multi-language Support:** Interface available in 6 languages (English, 中文, Français, Deutsch, 日本語, Español)

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- API keys for the AI services you want to use

### Installation
1.  **Download the files** to your computer:
    ```bash
    git clone https://github.com/lychen2/APILLMConvo
    # or download and extract the ZIP file
    ```

2.  **Open the application**:
    - Simply open the `index.html` file in your web browser

### Initial Setup
1.  **Configure API Providers**:
    - Click the "Manage Providers" button in the interface
    - Add your API keys for the models you want to use
    - Configure model names and descriptions as needed

2.  **Select a Model**:
    - Use the dropdown menu to select your preferred AI model
    - The interface will show the currently active provider

3.  **Start Chatting**:
    - Type your message in the input area
    - Press "Send" or use Ctrl+Enter to submit
    - View responses with full markdown formatting

## 🔧 Configuration

### Adding Custom Models
1. Click "Manage Providers" in the interface
2. Fill in the provider details:
   - **Provider Name**: A unique identifier for your model
   - **API Key**: Your authentication key
   - **Model**: The exact model name (e.g., "gpt-4", "claude-3-sonnet")
   - **Description**: Optional description for easy identification

### Changing Base URL
- Click "Change Base URL" to set up a custom API endpoint
- Default proxy: `https://api.laozhang.ai/v1`

### Language Settings
- Use the language dropdown to switch interface languages
- Settings are automatically saved and restored between sessions

## 📁 File Structure

```
llm_js/
├── index.html         # Main application interface
├── app.js             # Core application logic and classes
├── translations.js    # Multi-language support
├── styles.css         # UI styling
└── README.md          # This documentation
```

### Key Components

**app.js** contains several important classes:
- `APIConfig`: Manages API configuration and endpoints
- `UnifiedLLMProvider`: Handles communication with different AI services
- `MultiLLMChat`: Core chat functionality and conversation management
- `MultiLLMChatGUI`: User interface management and event handling
- `MarkdownRenderer`: Processes and displays formatted AI responses
- `LanguageManager`: Handles multi-language support

## 🤝 Contributing

This is a personal project, but contributions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit language translations
- Improve documentation

## ⚠️ Important Notes

### Usage Guidelines
- This is a personal utility and not a commercial product
- Please be mindful of the terms of service for any API keys you use
- Respect rate limits and usage policies of AI service providers

## 📞 Support

If you encounter issues or have questions:
1. Check that your API keys are correctly configured
2. Verify your internet connection
3. Try refreshing the page to reset the application state
4. Check browser console for error messages

## 📄 License

**This project is licensed under the MIT License.**  
[View Full License Text](https://opensource.org/licenses/MIT)

**Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:**

1. **The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.**
2. **The Software is provided "AS IS", WITHOUT WARRANTY OF ANY KIND**, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. 
3. **In no event shall the authors or copyright holders be liable for any claim**, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the Software or the use or other dealings in the Software.

---

**I hope you find it helpful and productive for your AI interactions!** 🚀
