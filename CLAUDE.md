# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a vanilla JavaScript web application that provides a unified interface for interacting with multiple Large Language Models (LLMs) through API keys. The application runs entirely in the browser with no backend dependencies.

## Development Setup

### Running the Application
- Open `index.html` directly in a web browser
- No build process, server, or package manager required
- All dependencies are vanilla JavaScript/HTML/CSS

### Testing
- No automated test framework is configured
- Manual testing through browser interaction
- Check browser console for JavaScript errors

## Architecture

The application follows a class-based architecture with clear separation of concerns:

### Core Classes (app.js)
- **APIConfig**: Manages API configuration and endpoints
- **UnifiedLLMProvider**: Handles HTTP communication with different AI services via streaming and non-streaming requests
- **MultiLLMChat**: Core chat functionality, conversation management, and bulk API key operations  
- **MultiLLMChatGUI**: User interface management, instant model switching, and DOM event handling
- **MarkdownRenderer**: Processes and displays formatted AI responses
- **LanguageManager**: Handles multi-language support using translations.js

### Key Technical Details
- **API Communication**: Uses fetch() with streaming support for real-time responses
- **State Management**: Local storage for API keys, conversation history, and user preferences
- **Model Support**: Handles both text and image models (including Flux models)
- **Image Processing**: Supports base64 image uploads and display
- **Streaming**: Implements Server-Sent Events (SSE) parsing for real-time response streaming

### File Structure
```
├── index.html         # Main application interface with DOM structure
├── app.js             # All application logic and classes
├── translations.js    # Multi-language support data
├── styles.css         # UI styling and responsive design
└── README.md          # Documentation
```

## Key Development Patterns

### API Configuration
- Default base URL: `https://api.laozhang.ai/v1`
- API keys stored in localStorage with provider-specific management
- Models are predefined in the application (no dynamic model loading)

### Event Handling
- Uses modern DOM event listeners with proper cleanup
- Keyboard shortcuts: Ctrl+Enter for sending messages
- Real-time UI updates during streaming responses

### Data Flow
1. User selects model → APIConfig created
2. Message sent → UnifiedLLMProvider handles API call
3. Response received → MarkdownRenderer processes and displays
4. History maintained → MultiLLMChat manages conversation state

## Common Operations

### Adding New Models
Models are hardcoded in the application. To add new models, modify the model selection dropdown in `index.html` and update the corresponding logic in `app.js`.

### Debugging
- Browser console shows detailed error messages
- Network tab shows API request/response details
- localStorage inspection reveals saved state

### Language Support
Add new languages by extending the TRANSLATIONS object in `translations.js` and updating the language dropdown in `index.html`.