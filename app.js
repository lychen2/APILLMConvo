// app.js - Main application logic

// API Configuration Class
class APIConfig {
    constructor(apiKey, model, provider, baseUrl = null) {
        this.apiKey = apiKey;
        this.model = model;
        this.provider = provider;
        this.baseUrl = baseUrl || localStorage.getItem('defaultBaseUrl') || "https://api.laozhang.ai/v1";
    }
}

// Unified LLM Provider Class
class UnifiedLLMProvider {
    constructor(config) {
        this.config = config;
    }

    async chat(message, conversationHistory = [], imageUrl = null, onStreamData = null) {
        const headers = {
            "Authorization": `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json"
        };

        const isImageModel = this.config.model.includes('image') || this.config.model.includes('flux');
        const isFluxModel = this.config.model.includes('flux');
        const requestBody = {
            model: this.config.model,
            max_tokens: 4096,
            temperature: 0.7,
            stream: onStreamData ? true : false
        };

        if (isImageModel) {
            if (isFluxModel) {
                // Flux model expects messages array with content as string
                requestBody.messages = [{ role: "user", content: message }];
            } else {
                // GPT image model with base64 image support
                const userMessage = { role: "user", content: [] };
                if (message) {
                    userMessage.content.push({ type: "text", text: message });
                }
                if (imageUrl) {
                    // Handle base64 images for GPT models
                    if (imageUrl.startsWith('data:image')) {
                        userMessage.content.push({ type: "image_url", image_url: imageUrl });
                    } else {
                        userMessage.content.push({ type: "image_url", image_url: { url: imageUrl } });
                    }
                }
                requestBody.messages = [userMessage];
            }
        } else {
            const messages = [...conversationHistory];
            const userMessage = { role: "user", content: [] };

            if (message) {
                userMessage.content.push({ type: "text", text: message });
            }
            if (imageUrl) {
                userMessage.content.push({ type: "image_url", image_url: { url: imageUrl } });
            }
            messages.push(userMessage);
            requestBody.messages = messages;
        }

        try {
            const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle streaming response
            if (onStreamData && response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let fullContent = '';

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop() || '';

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6).trim();
                                if (data === '[DONE]') {
                                    return fullContent;
                                }
                                try {
                                    const parsed = JSON.parse(data);
                                    if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
                                        const content = parsed.choices[0].delta.content || '';
                                        if (content) {
                                            fullContent += content;
                                            onStreamData(content);
                                        }
                                    }
                                } catch (e) {
                                    // Skip invalid JSON
                                }
                            }
                        }
                    }
                } finally {
                    reader.releaseLock();
                }
                
                return fullContent;
            }

            const result = await response.json();

            if (isImageModel) {
                if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
                    const content = result.choices[0].message.content;
                    const imageUrlRegex = /!\[.*?\]\((.*?)\)/;
                    const match = content.match(imageUrlRegex);
                    if (match && match[1]) {
                        return [{ type: "image_url", image_url: { url: match[1] } }];
                    }
                }
                
                if (result.data && Array.isArray(result.data) && result.data[0].url) {
                    return [{ type: "image_url", image_url: { url: result.data[0].url } }];
                }
                
                return "Image generation failed or returned unexpected format.";

            } else {
                if (result.choices && result.choices[0].message) {
                    return result.choices[0].message.content;
                } else {
                    return "Unsupported response format from API";
                }
            }

        } catch (error) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                return `${this.config.provider} Network error: Unable to connect to API`;
            }
            return `${this.config.provider} API error: ${error.message}`;
        }
    }
}

// Multi-LLM Chat Manager Class
class MultiLLMChat {
    constructor() {
        this.providers = new Map();
        this.currentProvider = null;
        this.conversationHistory = [];
        this.loadConfig();
        this.loadConversation();
    }

    loadConfig() {
        try {
            const configData = localStorage.getItem('llmConfig');
            if (!configData) {
                this.createSampleConfig();
                return;
            }

            const config = JSON.parse(configData);
            for (const [providerName, providerConfig] of Object.entries(config)) {
                const apiKey = providerConfig.api_key;
                if (apiKey && apiKey !== "your_api_key_here") {
                    const apiConfig = new APIConfig(
                        apiKey,
                        providerConfig.model,
                        providerName
                    );
                    this.providers.set(providerName, new UnifiedLLMProvider(apiConfig));
                }
            }
        } catch (error) {
            console.error('Failed to load config:', error);
            this.createSampleConfig();
        }
    }

    createSampleConfig() {
        const sampleConfig = {
            "gemini-2.5": {
                "api_key": "your_api_key_here",
                "model": "gemini-2.5-pro-preview-06-05",
                "description": "gemini-2.5-pro"
            },
            "gemini-2.5-flash": {
                "api_key": "your_api_key_here",
                "model": "gemini-2.5-flash-preview-05-20",
                "description": "gemini-2.5-flash"
            },
            "gpt-4.1": {
                "api_key": "your_api_key_here",
                "model": "gpt-4.1",
                "description": "OpenAI gpt-4.1"
            },  
            "gpt-4.1-mini": {
                "api_key": "your_api_key_here",
                "model": "gpt-4.1-mini",
                "description": "OpenAI gpt-4.1-mini"
            },   
            "claude-sonnet": {
                "api_key": "your_api_key_here",
                "model": "claude-sonnet-4-20250514",
                "description": "claude-sonnet-4-20250514"
            },
            "gpt-4o-image": {
                "api_key": "your_api_key_here",
                "model": "gpt-4o-image",
                "description": "GPT-4o with image generation capabilities"
            },
            "flux-kontext-pro": {
                "api_key": "your_api_key_here",
                "model": "flux-kontext-pro",
                "description": "Flux Kontext Pro image generation model"
            }
        };

        localStorage.setItem('llmConfig', JSON.stringify(sampleConfig));
        console.log('Created sample config. Please add your API keys in localStorage under "llmConfig".');
    }

    loadConversation() {
        try {
            const conversationData = localStorage.getItem('conversationHistory');
            if (conversationData) {
                this.conversationHistory = JSON.parse(conversationData);
            }
        } catch (error) {
            console.error('Failed to load conversation:', error);
            this.conversationHistory = [];
        }
    }

    saveConversation() {
        try {
            localStorage.setItem('conversationHistory', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.error('Failed to save conversation:', error);
        }
    }

    selectProvider(providerName) {
        if (this.providers.has(providerName)) {
            this.currentProvider = providerName;
            return true;
        }
        return false;
    }

    async chat(message, imageUrl = null, onStreamData = null) {
        if (!this.currentProvider) {
            return "Please select an LLM provider first";
        }

        const sanitizedMessage = message.replace(/\s+/g, ' ').trim();
        const provider = this.providers.get(this.currentProvider);
        const response = await provider.chat(sanitizedMessage, [...this.conversationHistory], imageUrl, onStreamData);

        const userMessageContent = [];
        if (sanitizedMessage) {
            userMessageContent.push({ type: 'text', text: sanitizedMessage });
        }
        if (imageUrl) {
            userMessageContent.push({ type: 'image_url', image_url: { url: imageUrl } });
        }

        this.conversationHistory.push({ role: "user", content: userMessageContent });
        this.conversationHistory.push({
            role: "assistant",
            content: response,
            provider: this.currentProvider
        });

        this.saveConversation();
        return response;
    }

    clearHistory() {
        this.conversationHistory = [];
        this.saveConversation();
    }

    getProviderNames() {
        return Array.from(this.providers.keys());
    }

    getAllProviders() {
        const configData = localStorage.getItem('llmConfig');
        if (!configData) return {};
        return JSON.parse(configData);
    }

    addProvider(name, apiKey, model, description = '') {
        const config = this.getAllProviders();
        config[name] = {
            api_key: apiKey,
            model: model,
            description: description
        };
        localStorage.setItem('llmConfig', JSON.stringify(config));
        
        if (apiKey && apiKey !== "your_api_key_here") {
            const apiConfig = new APIConfig(apiKey, model, name);
            this.providers.set(name, new UnifiedLLMProvider(apiConfig));
        }
        return true;
    }

    updateProvider(name, apiKey, model, description = '') {
        const config = this.getAllProviders();
        if (!config[name]) return false;
        
        config[name] = {
            api_key: apiKey,
            model: model,
            description: description
        };
        localStorage.setItem('llmConfig', JSON.stringify(config));
        
        this.providers.delete(name);
        if (apiKey && apiKey !== "your_api_key_here") {
            const apiConfig = new APIConfig(apiKey, model, name);
            this.providers.set(name, new UnifiedLLMProvider(apiConfig));
        }
        return true;
    }

    deleteProvider(name) {
        const config = this.getAllProviders();
        if (!config[name]) return false;
        
        delete config[name];
        localStorage.setItem('llmConfig', JSON.stringify(config));
        this.providers.delete(name);
        
        if (this.currentProvider === name) {
            this.currentProvider = null;
        }
        return true;
    }

    getCurrentProviderInfo() {
        if (this.currentProvider && this.providers.has(this.currentProvider)) {
            const provider = this.providers.get(this.currentProvider);
            return {
                name: this.currentProvider,
                model: provider.config.model,
                baseUrl: provider.config.baseUrl
            };
        }
        return null;
    }

    setApiKeyForAll(apiKey) {
        const config = this.getAllProviders();
        for (const [name, providerConfig] of Object.entries(config)) {
            config[name].api_key = apiKey;
        }
        localStorage.setItem('llmConfig', JSON.stringify(config));
        
        // Reload all providers with new API key
        this.loadConfig();
        return true;
    }

    setBaseUrl(newBaseUrl) {
        // Update all existing providers with new base URL
        for (const [name, provider] of this.providers.entries()) {
            provider.config.baseUrl = newBaseUrl;
        }
        
        // Save the new base URL to localStorage for future provider creation
        localStorage.setItem('defaultBaseUrl', newBaseUrl);
        return true;
    }

    getBaseUrl() {
        // Get base URL from localStorage or return default
        return localStorage.getItem('defaultBaseUrl') || "https://api.laozhang.ai/v1";
    }
}

// Markdown Renderer Class
class MarkdownRenderer {
    static renderMarkdown(text) {
        const lines = text.split('\n');
        let result = '';
        let inCodeBlock = false;
        let codeContent = [];

        for (const line of lines) {
            // Handle code blocks
            if (line.trim().startsWith('```')) {
                if (inCodeBlock) {
                    if (codeContent.length > 0) {
                        result += `<div class="markdown-code-block">${this.escapeHtml(codeContent.join('\n'))}</div>`;
                    }
                    codeContent = [];
                    inCodeBlock = false;
                } else {
                    inCodeBlock = true;
                }
                continue;
            }

            if (inCodeBlock) {
                codeContent.push(line);
                continue;
            }

            // Handle headings
            if (line.startsWith('# ')) {
                result += `<div class="markdown-heading1">${this.escapeHtml(line.slice(2))}</div>`;
            } else if (line.startsWith('## ')) {
                result += `<div class="markdown-heading2">${this.escapeHtml(line.slice(3))}</div>`;
            } else if (line.startsWith('### ')) {
                result += `<div class="markdown-heading3">${this.escapeHtml(line.slice(4))}</div>`;
            } else if (line.startsWith('> ')) {
                result += `<div class="markdown-quote">${this.escapeHtml(line.slice(2))}</div>`;
            } else {
                result += this.renderLineWithFormatting(line);
            }
        }

        if (inCodeBlock && codeContent.length > 0) {
            result += `<div class="markdown-code-block">${this.escapeHtml(codeContent.join('\n'))}</div>`;
        }

        return result;
    }

    static renderLineWithFormatting(line) {
        if (!line.trim()) {
            return '<br>';
        }

        let formatted = this.escapeHtml(line);

        // Process **bold** text
        formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<span class="markdown-bold">$1</span>');

        // Process *italic* text
        formatted = formatted.replace(/\*([^*]+)\*/g, '<span class="markdown-italic">$1</span>');

        // Process `inline code` text
        formatted = formatted.replace(/`([^`]+)`/g, '<span class="markdown-code-inline">$1</span>');

        return `<div>${formatted}</div>`;
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Main GUI Application Class
class MultiLLMChatGUI {
    constructor() {
        this.chatApp = new MultiLLMChat();
        this.languageManager = new LanguageManager();
        this.isGenerating = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.initializeApp();
        this.refreshUILanguage();
    }

    initializeElements() {
        // Get DOM elements
        this.elements = {
            title: document.getElementById('title'),
            providerInfo: document.getElementById('provider-info'),
            modelSelect: document.getElementById('model-select'),
            languageSelect: document.getElementById('language-select'),
            setApiKeyAllBtn: document.getElementById('set-api-key-all-btn'),
            manageProvidersBtn: document.getElementById('manage-providers-btn'),
            changeBaseUrlBtn: document.getElementById('change-baseurl-btn'),
            clearHistoryBtn: document.getElementById('clear-history-btn'),
            statusBtn: document.getElementById('status-btn'),
            helpBtn: document.getElementById('help-btn'),
            chatHistory: document.getElementById('chat-history'),
            messageInput: document.getElementById('message-input'),
            sendBtn: document.getElementById('send-btn'),
            statusText: document.getElementById('status-text'),
            modal: document.getElementById('modal'),
            modalTitle: document.getElementById('modal-title'),
            modalBody: document.getElementById('modal-body'),
            closeModal: document.querySelector('.close'),
            
            // Image elements
            imageInput: document.getElementById('image-input'),
            imageUploadBtn: document.getElementById('image-upload-btn'),
            imagePreviewContainer: document.getElementById('image-preview-container'),
            imagePreview: document.getElementById('image-preview'),
            removeImageBtn: document.getElementById('remove-image-btn'),

            // Provider management elements
            providerModal: document.getElementById('provider-modal'),
            providerClose: document.getElementById('provider-close'),
            formTitle: document.getElementById('form-title'),
            providerForm: document.getElementById('provider-form'),
            providerName: document.getElementById('provider-name'),
            providerApiKey: document.getElementById('provider-api-key'),
            providerModel: document.getElementById('provider-model'),
            providerDescription: document.getElementById('provider-description'),
            saveProviderBtn: document.getElementById('save-provider-btn'),
            cancelProviderBtn: document.getElementById('cancel-provider-btn'),
            providersTable: document.getElementById('providers-table')
        };
    }

    setupEventListeners() {
        // Language selection
        this.elements.languageSelect.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        // Model selection - automatically switch when changed
        this.elements.modelSelect.addEventListener('change', () => {
            this.switchProvider();
        });

        // Button events
        this.elements.setApiKeyAllBtn.addEventListener('click', () => this.setApiKeyForAll());
        this.elements.manageProvidersBtn.addEventListener('click', () => this.showProviderManagement());
        this.elements.changeBaseUrlBtn.addEventListener('click', () => this.changeBaseUrl());
        this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.elements.statusBtn.addEventListener('click', () => this.showStatus());
        this.elements.helpBtn.addEventListener('click', () => this.showHelp());
        this.elements.sendBtn.addEventListener('click', () => this.sendMessage());

        // Image events
        this.elements.imageUploadBtn.addEventListener('click', () => this.elements.imageInput.click());
        this.elements.imageInput.addEventListener('change', (e) => this.handleImageSelected(e));
        this.elements.removeImageBtn.addEventListener('click', () => this.removeImage());

        // Input events
        this.elements.messageInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Modal events
        this.elements.closeModal.addEventListener('click', () => this.closeModal());
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeModal();
            }
        });

        // Provider modal events
        this.elements.providerClose.addEventListener('click', () => this.closeProviderModal());
        this.elements.providerModal.addEventListener('click', (e) => {
            if (e.target === this.elements.providerModal) {
                this.closeProviderModal();
            }
        });
        this.elements.providerForm.addEventListener('submit', (e) => this.handleProviderSubmit(e));
        this.elements.cancelProviderBtn.addEventListener('click', () => this.closeProviderModal());

        // Window events
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeProviderModal();
            }
        });
    }

    initializeApp() {
        // Set language
        this.elements.languageSelect.value = this.languageManager.currentLanguage;

        // Populate model selection
        const providers = this.chatApp.getProviderNames();
        this.elements.modelSelect.innerHTML = '<option value="">Select a model...</option>';
        
        providers.forEach(provider => {
            const option = document.createElement('option');
            option.value = provider;
            option.textContent = provider;
            this.elements.modelSelect.appendChild(option);
        });

        // Select first provider if available
        if (providers.length > 0) {
            this.chatApp.selectProvider(providers[0]);
            this.elements.modelSelect.value = providers[0];
            this.updateProviderDisplay();
        }

        // Load conversation history
        this.loadConversationHistory();
        this.updateStatus('ready');
    }

    changeLanguage(languageCode) {
        const languages = this.languageManager.getAvailableLanguages();
        for (const [code, name] of Object.entries(languages)) {
            if (code === languageCode) {
                this.languageManager.setLanguage(code);
                this.refreshUILanguage();
                break;
            }
        }
    }

    refreshUILanguage() {
        // Update text content
        this.elements.title.textContent = this.languageManager.getText('title');
        document.title = this.languageManager.getText('title');
        
        const labels = {
            'select-model-label': 'select_model',
            'language-label': 'language',
            'conversation-history-label': 'conversation_history',
            'input-label': 'send'
        };

        Object.entries(labels).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.languageManager.getText(key) + (key === 'send' ? ' Message:' : '');
            }
        });

        // Update buttons
        this.elements.setApiKeyAllBtn.textContent = this.languageManager.getText('set_api_key_all');
        this.elements.manageProvidersBtn.textContent = this.languageManager.getText('manage_providers');
        this.elements.changeBaseUrlBtn.textContent = this.languageManager.getText('change_base_url');
        this.elements.clearHistoryBtn.textContent = this.languageManager.getText('clear_history');
        this.elements.statusBtn.textContent = this.languageManager.getText('status');
        this.elements.helpBtn.textContent = this.languageManager.getText('help');
        this.elements.sendBtn.textContent = `🚀 ${this.languageManager.getText('send')}`;

        // Update provider display
        this.updateProviderDisplay();
        this.updateStatus('ready');

        // Update provider modal labels
        this.updateProviderModalLabels();
    }

    updateProviderModalLabels() {
        const modalTitle = document.getElementById('manage-providers-title');
        const existingProvidersTitle = document.getElementById('existing-providers-title');
        const providerNameLabel = document.getElementById('provider-name-label');
        const providerApiKeyLabel = document.getElementById('provider-api-key-label');
        const providerModelLabel = document.getElementById('provider-model-label');
        const providerDescriptionLabel = document.getElementById('provider-description-label');
        const cancelBtn = document.getElementById('cancel-provider-btn');

        if (modalTitle) modalTitle.textContent = this.languageManager.getText('manage_providers');
        if (existingProvidersTitle) existingProvidersTitle.textContent = this.languageManager.getText('existing_providers');
        if (providerNameLabel) providerNameLabel.textContent = this.languageManager.getText('provider_name') + ':';
        if (providerApiKeyLabel) providerApiKeyLabel.textContent = this.languageManager.getText('api_key') + ':';
        if (providerModelLabel) providerModelLabel.textContent = this.languageManager.getText('model') + ':';
        if (providerDescriptionLabel) providerDescriptionLabel.textContent = this.languageManager.getText('description') + ':';
        if (cancelBtn) cancelBtn.textContent = this.languageManager.getText('cancel');
    }

    updateProviderDisplay() {
        const providerInfo = this.chatApp.getCurrentProviderInfo();
        if (providerInfo) {
            this.elements.providerInfo.textContent = `${providerInfo.name.toUpperCase()} (${providerInfo.model})`;
        } else {
            this.elements.providerInfo.textContent = this.languageManager.getText('no_model_selected');
        }
    }

    switchProvider() {
        const selectedProvider = this.elements.modelSelect.value;
        if (selectedProvider && this.chatApp.selectProvider(selectedProvider)) {
            this.updateProviderDisplay();
            const message = this.languageManager.getText('switched_to_model').replace('{}', selectedProvider.toUpperCase());
            this.addToHistory(message, 'system');
        }
    }

    setApiKeyForAll() {
        const apiKey = prompt(this.languageManager.getText('enter_api_key_all'));
        if (apiKey && apiKey.trim()) {
            this.chatApp.setApiKeyForAll(apiKey.trim());
            this.addToHistory(this.languageManager.getText('api_key_set_all'), 'system');
            this.refreshModelSelect();
            this.updateProviderDisplay();
        } else if (apiKey !== null) {
            alert(this.languageManager.getText('api_key_required'));
        }
    }

    clearHistory() {
        this.chatApp.clearHistory();
        this.elements.chatHistory.innerHTML = '';
        this.addToHistory(this.languageManager.getText('history_cleared'), 'system');
    }

    showStatus() {
        const providerInfo = this.chatApp.getCurrentProviderInfo();
        let statusInfo = this.languageManager.getText('current_status') + '\n\n';

        if (providerInfo) {
            statusInfo += `${this.languageManager.getText('provider')}: ${providerInfo.name.toUpperCase()} (${providerInfo.model})\n`;
            statusInfo += `Base URL: ${providerInfo.baseUrl}\n`;
        } else {
            statusInfo += `${this.languageManager.getText('provider')}: None\n`;
        }

        statusInfo += `${this.languageManager.getText('conversation_turns')}: ${Math.floor(this.chatApp.conversationHistory.length / 2)}\n`;
        statusInfo += `Default Base URL: ${this.chatApp.getBaseUrl()}`;

        this.showModal(this.languageManager.getText('status'), statusInfo);
    }

    showHelp() {
        this.showModal(
            this.languageManager.getText('help_title'),
            this.languageManager.getText('help_content')
        );
    }

    showModal(title, content) {
        this.elements.modalTitle.textContent = title;
        this.elements.modalBody.textContent = content;
        this.elements.modal.style.display = 'block';
    }

    closeModal() {
        this.elements.modal.style.display = 'none';
    }

    loadConversationHistory() {
        this.elements.chatHistory.innerHTML = '';
        
        this.chatApp.conversationHistory.forEach(msg => {
            const role = msg.role || 'unknown';
            const content = msg.content || '';

            if (role === 'user') {
               let text = '';
               let imageUrl = null;
               if(Array.isArray(content)) {
                   content.forEach(part => {
                       if (part.type === 'text') text = part.text;
                       if (part.type === 'image_url' && part.image_url) imageUrl = part.image_url.url;
                   });
               } else {
                   text = content; 
               }
               this.addToHistory(text, 'user', null, imageUrl);

            } else if (role === 'assistant') {
                this.addToHistory(content, 'assistant', msg.provider);
            }
        });

        this.scrollToBottom();
    }

    async sendMessage() {
        const message = this.elements.messageInput.value.trim();
        let imageUrl = null;
        
        // Handle image preview for upload
        if (this.elements.imagePreview.src.startsWith('data:image')) {
            imageUrl = this.elements.imagePreview.src;
        }

        if (!message && !imageUrl || this.isGenerating) {
            return;
        }

        this.addToHistory(message, 'user', null, imageUrl);
        this.elements.messageInput.value = '';
        this.removeImage();
        this.updateStatus('generating');
        this.setGeneratingState(true);

        try {
            // Check if current provider supports streaming
            const isStreamingSupported = true; // Most modern APIs support streaming
            
            if (isStreamingSupported) {
                // Create a placeholder for streaming response
                const assistantMessageId = 'assistant-' + Date.now();
                this.addToHistory('', 'assistant', null, null, assistantMessageId);
                
                let streamedContent = '';
                const onStreamData = (chunk) => {
                    streamedContent += chunk;
                    this.updateStreamingMessage(assistantMessageId, streamedContent);
                };
                
                const response = await this.chatApp.chat(message, imageUrl, onStreamData);
                
                // Final update with complete response
                this.updateStreamingMessage(assistantMessageId, response);
            } else {
                // Fallback to non-streaming
                const response = await this.chatApp.chat(message, imageUrl);
                this.addToHistory(response, 'assistant');
            }
        } catch (error) {
            const errorMsg = `${this.languageManager.getText('error')}: ${error.message}`;
            this.addToHistory(errorMsg, 'error');
        } finally {
            this.setGeneratingState(false);
            this.updateStatus('ready');
        }
    }

    setGeneratingState(generating) {
        this.isGenerating = generating;
        this.elements.sendBtn.disabled = generating;
        if (generating) {
            this.elements.sendBtn.style.background = 'var(--text-secondary)';
        } else {
            this.elements.sendBtn.style.background = 'var(--success)';
        }
    }

    addToHistory(content, role, provider = null, imageUrl = null, messageId = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        if (messageId) {
            messageDiv.id = messageId;
        }

        let prefix = '';
        let className = '';
        let contentHtml = '';

        switch (role) {
            case 'user':
                prefix = `${this.languageManager.getText('you')}: `;
                className = 'message-user';
                contentHtml = this.escapeHtml(content);
                if (imageUrl) {
                    contentHtml += `<br><img src="${imageUrl}" style="max-width: 200px; border-radius: 5px; margin-top: 5px;">`;
                }
                break;
            case 'assistant':
                const providerName = provider ? provider.toUpperCase() : 'AI';
                prefix = `${providerName}: `;
                className = 'message-assistant';
                
                if (Array.isArray(content)) {
                    content.forEach(part => {
                        if (part.type === 'text') {
                            contentHtml += MarkdownRenderer.renderMarkdown(part.text);
                        } else if (part.type === 'image_url' && part.image_url && part.image_url.url) {
                            contentHtml += `<br><img src="${part.image_url.url}" style="max-width: 100%; border-radius: 5px; margin-top: 10px;">`;
                        }
                    });
                } else if (typeof content === 'string') {
                    const imageUrlRegex = /(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp))/ig;
                    const textAndImageParts = content.split(imageUrlRegex);
                    
                    contentHtml = textAndImageParts.map((part, index) => {
                        if (index % 2 === 1) {
                            return `<br><img src="${part}" style="max-width: 100%; border-radius: 5px; margin-top: 10px;">`;
                        } else {
                            return MarkdownRenderer.renderMarkdown(part);
                        }
                    }).join('');
                } else if (content) {
                    contentHtml = this.escapeHtml(JSON.stringify(content));
                }
                break;
            case 'system':
                prefix = `${this.languageManager.getText('system')}: `;
                className = 'message-system';
                contentHtml = this.escapeHtml(content);
                break;
            case 'error':
                prefix = `${this.languageManager.getText('error')}: `;
                className = 'message-error';
                contentHtml = this.escapeHtml(content);
                break;
        }

        messageDiv.innerHTML = `<span class="${className}">${prefix}</span><div class="message-content">${contentHtml}</div>`;
        this.elements.chatHistory.appendChild(messageDiv);
        this.scrollToBottom();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
        this.elements.chatHistory.scrollTop = this.elements.chatHistory.scrollHeight;
    }

    updateStatus(key) {
        this.elements.statusText.textContent = this.languageManager.getText(key);
    }

    handleImageSelected(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.elements.imagePreview.src = e.target.result;
                this.elements.imagePreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    removeImage() {
        this.elements.imageInput.value = ''; // Reset file input
        this.elements.imagePreview.src = '#';
        this.elements.imagePreviewContainer.style.display = 'none';
    }

    // Provider Management Methods
    showProviderManagement() {
        this.currentEditingProvider = null;
        this.resetProviderForm();
        this.updateProviderModalLabels();
        this.refreshProvidersTable();
        this.elements.providerModal.style.display = 'block';
    }

    closeProviderModal() {
        this.elements.providerModal.style.display = 'none';
        this.resetProviderForm();
    }

    resetProviderForm() {
        this.elements.formTitle.textContent = this.languageManager.getText('add_new_provider');
        this.elements.providerForm.reset();
        this.elements.saveProviderBtn.textContent = this.languageManager.getText('save_provider');
        this.elements.providerName.disabled = false;
        this.currentEditingProvider = null;
    }

    refreshProvidersTable() {
        const providers = this.chatApp.getAllProviders();
        let tableHTML = `
            <table class="providers-table">
                <thead>
                    <tr>
                        <th>${this.languageManager.getText('name')}</th>
                        <th>${this.languageManager.getText('model')}</th>
                        <th>${this.languageManager.getText('description')}</th>
                        <th>${this.languageManager.getText('status_column')}</th>
                        <th>${this.languageManager.getText('actions')}</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (const [name, config] of Object.entries(providers)) {
            const hasValidKey = config.api_key && config.api_key !== "your_api_key_here";
            const status = hasValidKey ? this.languageManager.getText('active') : this.languageManager.getText('no_api_key');
            const statusClass = hasValidKey ? 'text-success' : 'text-warning';
            
            tableHTML += `
                <tr>
                    <td data-label="${this.languageManager.getText('name')}"><strong>${this.escapeHtml(name)}</strong></td>
                    <td data-label="${this.languageManager.getText('model')}">${this.escapeHtml(config.model)}</td>
                    <td data-label="${this.languageManager.getText('description')}">${this.escapeHtml(config.description || this.languageManager.getText('no_description'))}</td>
                    <td data-label="${this.languageManager.getText('status_column')}"><span class="${statusClass}">${status}</span></td>
                    <td data-label="${this.languageManager.getText('actions')}" class="provider-actions">
                        <button class="btn-small btn-edit" onclick="chatApp.editProvider('${name}')">${this.languageManager.getText('edit')}</button>
                        <button class="btn-small btn-delete" onclick="chatApp.deleteProviderConfirm('${name}')">${this.languageManager.getText('delete')}</button>
                    </td>
                </tr>
            `;
        }

        tableHTML += `
                </tbody>
            </table>
        `;

        this.elements.providersTable.innerHTML = tableHTML;
    }

    editProvider(name) {
        const providers = this.chatApp.getAllProviders();
        const provider = providers[name];
        if (!provider) return;

        this.currentEditingProvider = name;
        this.elements.formTitle.textContent = `${this.languageManager.getText('edit_provider')}: ${name}`;
        this.elements.providerName.value = name;
        this.elements.providerApiKey.value = provider.api_key === "your_api_key_here" ? "" : provider.api_key;
        this.elements.providerModel.value = provider.model;
        this.elements.providerDescription.value = provider.description || '';
        this.elements.saveProviderBtn.textContent = this.languageManager.getText('update_provider');
        this.elements.providerName.disabled = false;
    }

    deleteProviderConfirm(name) {
        const confirmMessage = this.languageManager.getText('delete_confirm').replace('{}', name);
        if (confirm(confirmMessage)) {
            this.chatApp.deleteProvider(name);
            this.refreshProvidersTable();
            this.refreshModelSelect();
            const successMessage = this.languageManager.getText('provider_deleted').replace('{}', name);
            this.addToHistory(successMessage, 'system');
        }
    }

    handleProviderSubmit(e) {
        e.preventDefault();
        
        const name = this.elements.providerName.value.trim();
        const apiKey = this.elements.providerApiKey.value.trim();
        const model = this.elements.providerModel.value.trim();
        const description = this.elements.providerDescription.value.trim();

        if (!name || !apiKey || !model) {
            alert(this.languageManager.getText('fill_required_fields'));
            return;
        }

        if (this.currentEditingProvider) {
            // Check if name changed and if new name already exists
            if (name !== this.currentEditingProvider) {
                const providers = this.chatApp.getAllProviders();
                if (providers[name]) {
                    alert(this.languageManager.getText('provider_exists'));
                    return;
                }
                // Delete old provider first if name changed
                this.chatApp.deleteProvider(this.currentEditingProvider);
            }
            
            if (this.chatApp.addProvider(name, apiKey, model, description)) {
                const successMessage = this.languageManager.getText('provider_updated').replace('{}', name);
                this.addToHistory(successMessage, 'system');
            }
        } else {
            const providers = this.chatApp.getAllProviders();
            if (providers[name]) {
                alert(this.languageManager.getText('provider_exists'));
                return;
            }
            
            if (this.chatApp.addProvider(name, apiKey, model, description)) {
                const successMessage = this.languageManager.getText('provider_added').replace('{}', name);
                this.addToHistory(successMessage, 'system');
            }
        }

        this.refreshProvidersTable();
        this.refreshModelSelect();
        this.resetProviderForm();
    }

    refreshModelSelect() {
        const currentValue = this.elements.modelSelect.value;
        const providers = this.chatApp.getProviderNames();
        
        this.elements.modelSelect.innerHTML = '<option value="">Select a model...</option>';
        providers.forEach(provider => {
            const option = document.createElement('option');
            option.value = provider;
            option.textContent = provider;
            this.elements.modelSelect.appendChild(option);
        });

        if (providers.includes(currentValue)) {
            this.elements.modelSelect.value = currentValue;
        } else if (providers.length > 0 && !currentValue) {
            this.chatApp.selectProvider(providers[0]);
            this.elements.modelSelect.value = providers[0];
            this.updateProviderDisplay();
        }
    }

    updateStreamingMessage(messageId, content) {
        const messageDiv = document.getElementById(messageId);
        if (messageDiv) {
            const contentDiv = messageDiv.querySelector('.message-content');
            if (contentDiv) {
                // Handle different content types
                if (Array.isArray(content)) {
                    let contentHtml = '';
                    content.forEach(part => {
                        if (part.type === 'text') {
                            contentHtml += MarkdownRenderer.renderMarkdown(part.text);
                        } else if (part.type === 'image_url' && part.image_url && part.image_url.url) {
                            contentHtml += `<br><img src="${part.image_url.url}" style="max-width: 100%; border-radius: 5px; margin-top: 10px;">`;
                        }
                    });
                    contentDiv.innerHTML = contentHtml;
                } else if (typeof content === 'string') {
                    const imageUrlRegex = /(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp))/ig;
                    const textAndImageParts = content.split(imageUrlRegex);
                    
                    const contentHtml = textAndImageParts.map((part, index) => {
                        if (index % 2 === 1) {
                            return `<br><img src="${part}" style="max-width: 100%; border-radius: 5px; margin-top: 10px;">`;
                        } else {
                            return MarkdownRenderer.renderMarkdown(part);
                        }
                    }).join('');
                    contentDiv.innerHTML = contentHtml;
                } else if (content) {
                    contentDiv.innerHTML = this.escapeHtml(JSON.stringify(content));
                }
            }
        }
        this.scrollToBottom();
    }

    changeBaseUrl() {
        const currentBaseUrl = this.chatApp.getBaseUrl();
        const promptText = this.languageManager.getText('enter_new_base_url').replace('{}', currentBaseUrl);
        const newBaseUrl = prompt(promptText, currentBaseUrl);
        
        if (newBaseUrl && newBaseUrl.trim() && newBaseUrl !== currentBaseUrl) {
            const trimmedUrl = newBaseUrl.trim();
            
            // Validate URL format
            try {
                new URL(trimmedUrl);
                this.chatApp.setBaseUrl(trimmedUrl);
                const successMessage = this.languageManager.getText('base_url_changed').replace('{}', trimmedUrl);
                this.addToHistory(successMessage, 'system');
                this.updateProviderDisplay();
            } catch (error) {
                alert(this.languageManager.getText('invalid_url_format'));
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatApp = new MultiLLMChatGUI();
});