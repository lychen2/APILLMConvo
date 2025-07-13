// translations.js - Multi-language support
const TRANSLATIONS = {
    'en': {
        'title': 'Multi-LLM Chat',
        'select_model': 'Select Model:',
        'switch_model': 'Switch Model',
        'clear_history': 'Clear History',
        'status': 'Status',
        'help': 'Help',
        'language': 'Language',
        'conversation_history': 'Conversation History',
        'send': 'Send',
        'ready': 'Ready',
        'generating': 'Generating response...',
        'you': 'You',
        'system': 'System',
        'error': 'Error',
        'no_model_selected': 'No model selected',
        'switched_to_model': 'Switched to model: {}',
        'history_cleared': 'Conversation history cleared',
        'current_status': 'Current Status:',
        'provider': 'Provider',
        'conversation_turns': 'Conversation turns',
        'api_endpoint': 'API Endpoint',
        'help_title': 'Multi-LLM Chat - Help Guide',
        'help_content': `Features:
1. Type your message in the input box and click "Send" or press Ctrl+Enter
2. Use the dropdown menu to select different AI models
3. Use toolbar buttons to switch models, clear history, etc.

Markdown Support:
- **Bold** text
- *Italic* text
- \`Code\` blocks
- # Headings
- Lists, tables, and other formatting

All API calls are proxied through https://api.laozhang.ai`,
        'manage_providers': 'Manage Providers',
        'add_new_provider': 'Add New Provider',
        'edit_provider': 'Edit Provider',
        'provider_name': 'Provider Name',
        'api_key': 'API Key',
        'model': 'Model',
        'description': 'Description',
        'save_provider': 'Save Provider',
        'update_provider': 'Update Provider',
        'cancel': 'Cancel',
        'existing_providers': 'Existing Providers',
        'name': 'Name',
        'status_column': 'Status',
        'actions': 'Actions',
        'active': 'Active',
        'no_api_key': 'No API Key',
        'edit': 'Edit',
        'delete': 'Delete',
        'delete_confirm': 'Are you sure you want to delete the provider "{}"?',
        'provider_added': 'Provider "{}" added successfully',
        'provider_updated': 'Provider "{}" updated successfully',
        'provider_deleted': 'Provider "{}" deleted successfully',
        'provider_exists': 'A provider with this name already exists. Please choose a different name.',
        'fill_required_fields': 'Please fill in all required fields (Name, API Key, Model)',
        'no_description': 'No description',
        'change_base_url': 'Change Base URL',
        'enter_new_base_url': 'Enter new base URL (current: {}):',
        'invalid_url_format': 'Invalid URL format. Please enter a valid URL.',
        'base_url_changed': 'Base URL changed to: {}',
        'set_api_key_all': 'Set API Key for All',
        'enter_api_key_all': 'Enter API key to set for all providers:',
        'api_key_set_all': 'API key has been set for all providers',
        'api_key_required': 'API key is required'
    },
    'zh': {
        'title': '多模型聊天助手',
        'select_model': '选择模型：',
        'switch_model': '切换模型',
        'clear_history': '清除历史',
        'status': '状态',
        'help': '帮助',
        'language': '语言',
        'conversation_history': '对话历史',
        'send': '发送',
        'ready': '就绪',
        'generating': '正在生成回复...',
        'you': '您',
        'system': '系统',
        'error': '错误',
        'no_model_selected': '未选择模型',
        'switched_to_model': '已切换到模型：{}',
        'history_cleared': '对话历史已清除',
        'current_status': '当前状态：',
        'provider': '提供商',
        'conversation_turns': '对话轮次',
        'api_endpoint': 'API端点',
        'help_title': '多模型聊天助手 - 帮助指南',
        'help_content': `功能特性：
1. 在输入框中输入消息，点击"发送"或按Ctrl+Enter
2. 使用下拉菜单选择不同的AI模型
3. 使用工具栏按钮切换模型、清除历史等

Markdown支持：
- **粗体** 文本
- *斜体* 文本
- \`代码\` 块
- # 标题
- 列表、表格和其他格式

所有API调用通过 https://api.laozhang.ai 代理`,
        'manage_providers': '管理提供商',
        'add_new_provider': '添加新提供商',
        'edit_provider': '编辑提供商',
        'provider_name': '提供商名称',
        'api_key': 'API密钥',
        'model': '模型',
        'description': '描述',
        'save_provider': '保存提供商',
        'update_provider': '更新提供商',
        'cancel': '取消',
        'existing_providers': '现有提供商',
        'name': '名称',
        'status_column': '状态',
        'actions': '操作',
        'active': '活跃',
        'no_api_key': '无API密钥',
        'edit': '编辑',
        'delete': '删除',
        'delete_confirm': '确定要删除提供商"{}"吗？',
        'provider_added': '提供商"{}"添加成功',
        'provider_updated': '提供商"{}"更新成功',
        'provider_deleted': '提供商"{}"删除成功',
        'provider_exists': '此名称的提供商已存在，请选择其他名称。',
        'fill_required_fields': '请填写所有必填字段（名称、API密钥、模型）',
        'no_description': '无描述',
        'change_base_url': '更改基础URL',
        'enter_new_base_url': '输入新的基础URL（当前：{}）：',
        'invalid_url_format': 'URL格式无效。请输入有效的URL。',
        'base_url_changed': '基础URL已更改为：{}',
        'set_api_key_all': '为所有设置API密钥',
        'enter_api_key_all': '输入要为所有提供商设置的API密钥：',
        'api_key_set_all': '已为所有提供商设置API密钥',
        'api_key_required': '需要API密钥'
    },
    'fr': {
        'title': 'Chat Multi-LLM',
        'select_model': 'Sélectionner le modèle:',
        'switch_model': 'Changer de modèle',
        'clear_history': 'Effacer l\'historique',
        'status': 'Statut',
        'help': 'Aide',
        'language': 'Langue',
        'conversation_history': 'Historique des conversations',
        'send': 'Envoyer',
        'ready': 'Prêt',
        'generating': 'Génération de la réponse...',
        'you': 'Vous',
        'system': 'Système',
        'error': 'Erreur',
        'no_model_selected': 'Aucun modèle sélectionné',
        'switched_to_model': 'Basculé vers le modèle: {}',
        'history_cleared': 'Historique des conversations effacé',
        'current_status': 'Statut actuel:',
        'provider': 'Fournisseur',
        'conversation_turns': 'Tours de conversation',
        'api_endpoint': 'Point de terminaison API',
        'help_title': 'Chat Multi-LLM - Guide d\'aide',
        'help_content': `Fonctionnalités:
1. Tapez votre message dans la zone de saisie et cliquez sur "Envoyer" ou appuyez sur Ctrl+Entrée
2. Utilisez le menu déroulant pour sélectionner différents modèles d'IA
3. Utilisez les boutons de la barre d'outils pour changer de modèle, effacer l'historique, etc.

Support Markdown:
- Texte **gras**
- Texte *italique*
- Blocs de \`code\`
- # Titres
- Listes, tableaux et autres formatages

Tous les appels API sont acheminés via https://api.laozhang.ai`,
        'manage_providers': 'Gérer les fournisseurs',
        'add_new_provider': 'Ajouter un nouveau fournisseur',
        'edit_provider': 'Modifier le fournisseur',
        'provider_name': 'Nom du fournisseur',
        'api_key': 'Clé API',
        'model': 'Modèle',
        'description': 'Description',
        'save_provider': 'Enregistrer le fournisseur',
        'update_provider': 'Mettre à jour le fournisseur',
        'cancel': 'Annuler',
        'existing_providers': 'Fournisseurs existants',
        'name': 'Nom',
        'status_column': 'Statut',
        'actions': 'Actions',
        'active': 'Actif',
        'no_api_key': 'Pas de clé API',
        'edit': 'Modifier',
        'delete': 'Supprimer',
        'delete_confirm': 'Êtes-vous sûr de vouloir supprimer le fournisseur "{}"?',
        'provider_added': 'Fournisseur "{}" ajouté avec succès',
        'provider_updated': 'Fournisseur "{}" mis à jour avec succès',
        'provider_deleted': 'Fournisseur "{}" supprimé avec succès',
        'provider_exists': 'Un fournisseur avec ce nom existe déjà. Veuillez choisir un nom différent.',
        'fill_required_fields': 'Veuillez remplir tous les champs obligatoires (Nom, Clé API, Modèle)',
        'no_description': 'Aucune description',
        'change_base_url': 'Changer l\'URL de base',
        'enter_new_base_url': 'Entrez la nouvelle URL de base (actuelle: {}):',
        'invalid_url_format': 'Format d\'URL invalide. Veuillez entrer une URL valide.',
        'base_url_changed': 'URL de base changée vers: {}',
        'set_api_key_all': 'Définir la clé API pour tous',
        'enter_api_key_all': 'Entrez la clé API à définir pour tous les fournisseurs:',
        'api_key_set_all': 'La clé API a été définie pour tous les fournisseurs',
        'api_key_required': 'La clé API est requise'
    },
    'de': {
        'title': 'Multi-LLM Chat',
        'select_model': 'Modell auswählen:',
        'switch_model': 'Modell wechseln',
        'clear_history': 'Verlauf löschen',
        'status': 'Status',
        'help': 'Hilfe',
        'language': 'Sprache',
        'conversation_history': 'Gesprächsverlauf',
        'send': 'Senden',
        'ready': 'Bereit',
        'generating': 'Antwort wird generiert...',
        'you': 'Sie',
        'system': 'System',
        'error': 'Fehler',
        'no_model_selected': 'Kein Modell ausgewählt',
        'switched_to_model': 'Zu Modell gewechselt: {}',
        'history_cleared': 'Gesprächsverlauf gelöscht',
        'current_status': 'Aktueller Status:',
        'provider': 'Anbieter',
        'conversation_turns': 'Gesprächsrunden',
        'api_endpoint': 'API-Endpunkt',
        'help_title': 'Multi-LLM Chat - Hilfe-Leitfaden',
        'help_content': `Funktionen:
1. Geben Sie Ihre Nachricht in das Eingabefeld ein und klicken Sie auf "Senden" oder drücken Sie Strg+Enter
2. Verwenden Sie das Dropdown-Menü, um verschiedene KI-Modelle auszuwählen
3. Verwenden Sie die Schaltflächen in der Symbolleiste, um Modelle zu wechseln, den Verlauf zu löschen usw.

Markdown-Unterstützung:
- **Fetter** Text
- *Kursiver* Text
- \`Code\`-Blöcke
- # Überschriften
- Listen, Tabellen und andere Formatierungen

Alle API-Aufrufe werden über https://api.laozhang.ai weitergeleitet`,
        'manage_providers': 'Anbieter verwalten',
        'add_new_provider': 'Neuen Anbieter hinzufügen',
        'edit_provider': 'Anbieter bearbeiten',
        'provider_name': 'Anbietername',
        'api_key': 'API-Schlüssel',
        'model': 'Modell',
        'description': 'Beschreibung',
        'save_provider': 'Anbieter speichern',
        'update_provider': 'Anbieter aktualisieren',
        'cancel': 'Abbrechen',
        'existing_providers': 'Vorhandene Anbieter',
        'name': 'Name',
        'status_column': 'Status',
        'actions': 'Aktionen',
        'active': 'Aktiv',
        'no_api_key': 'Kein API-Schlüssel',
        'edit': 'Bearbeiten',
        'delete': 'Löschen',
        'delete_confirm': 'Sind Sie sicher, dass Sie den Anbieter "{}" löschen möchten?',
        'provider_added': 'Anbieter "{}" erfolgreich hinzugefügt',
        'provider_updated': 'Anbieter "{}" erfolgreich aktualisiert',
        'provider_deleted': 'Anbieter "{}" erfolgreich gelöscht',
        'provider_exists': 'Ein Anbieter mit diesem Namen existiert bereits. Bitte wählen Sie einen anderen Namen.',
        'fill_required_fields': 'Bitte füllen Sie alle Pflichtfelder aus (Name, API-Schlüssel, Modell)',
        'no_description': 'Keine Beschreibung',
        'change_base_url': 'Basis-URL ändern',
        'enter_new_base_url': 'Neue Basis-URL eingeben (aktuell: {}):',
        'invalid_url_format': 'Ungültiges URL-Format. Bitte geben Sie eine gültige URL ein.',
        'base_url_changed': 'Basis-URL geändert zu: {}',
        'set_api_key_all': 'API-Schlüssel für alle setzen',
        'enter_api_key_all': 'Geben Sie den API-Schlüssel ein, der für alle Anbieter gesetzt werden soll:',
        'api_key_set_all': 'API-Schlüssel wurde für alle Anbieter gesetzt',
        'api_key_required': 'API-Schlüssel ist erforderlich'
    },
    'ja': {
        'title': 'マルチLLMチャット',
        'select_model': 'モデル選択：',
        'switch_model': 'モデル切替',
        'clear_history': '履歴クリア',
        'status': 'ステータス',
        'help': 'ヘルプ',
        'language': '言語',
        'conversation_history': '会話履歴',
        'send': '送信',
        'ready': '準備完了',
        'generating': '応答を生成中...',
        'you': 'あなた',
        'system': 'システム',
        'error': 'エラー',
        'no_model_selected': 'モデルが選択されていません',
        'switched_to_model': 'モデルを切り替えました：{}',
        'history_cleared': '会話履歴がクリアされました',
        'current_status': '現在のステータス：',
        'provider': 'プロバイダー',
        'conversation_turns': '会話ターン',
        'api_endpoint': 'APIエンドポイント',
        'help_title': 'マルチLLMチャット - ヘルプガイド',
        'help_content': `機能：
1. 入力ボックスにメッセージを入力し、「送信」をクリックするかCtrl+Enterを押してください
2. ドロップダウンメニューを使用して異なるAIモデルを選択してください
3. ツールバーボタンを使用してモデルの切り替え、履歴のクリアなどを行ってください

Markdownサポート：
- **太字** テキスト
- *斜体* テキスト
- \`コード\` ブロック
- # 見出し
- リスト、テーブル、その他のフォーマット

すべてのAPI呼び出しは https://api.laozhang.ai を通じてプロキシされます`,
        'manage_providers': 'プロバイダー管理',
        'add_new_provider': '新しいプロバイダーを追加',
        'edit_provider': 'プロバイダーを編集',
        'provider_name': 'プロバイダー名',
        'api_key': 'APIキー',
        'model': 'モデル',
        'description': '説明',
        'save_provider': 'プロバイダーを保存',
        'update_provider': 'プロバイダーを更新',
        'cancel': 'キャンセル',
        'existing_providers': '既存のプロバイダー',
        'name': '名前',
        'status_column': 'ステータス',
        'actions': 'アクション',
        'active': 'アクティブ',
        'no_api_key': 'APIキーなし',
        'edit': '編集',
        'delete': '削除',
        'delete_confirm': 'プロバイダー"{}"を削除してもよろしいですか？',
        'provider_added': 'プロバイダー"{}"が正常に追加されました',
        'provider_updated': 'プロバイダー"{}"が正常に更新されました',
        'provider_deleted': 'プロバイダー"{}"が正常に削除されました',
        'provider_exists': 'この名前のプロバイダーは既に存在します。別の名前を選択してください。',
        'fill_required_fields': 'すべての必須フィールド（名前、APIキー、モデル）を入力してください',
        'no_description': '説明なし',
        'change_base_url': 'ベースURL変更',
        'enter_new_base_url': '新しいベースURLを入力してください（現在：{}）：',
        'invalid_url_format': '無効なURL形式です。有効なURLを入力してください。',
        'base_url_changed': 'ベースURLが次に変更されました：{}',
        'set_api_key_all': 'すべてのAPIキーを設定',
        'enter_api_key_all': 'すべてのプロバイダーに設定するAPIキーを入力してください：',
        'api_key_set_all': 'すべてのプロバイダーにAPIキーが設定されました',
        'api_key_required': 'APIキーが必要です'
    },
    'es': {
        'title': 'Chat Multi-LLM',
        'select_model': 'Seleccionar modelo:',
        'switch_model': 'Cambiar modelo',
        'clear_history': 'Limpiar historial',
        'status': 'Estado',
        'help': 'Ayuda',
        'language': 'Idioma',
        'conversation_history': 'Historial de conversación',
        'send': 'Enviar',
        'ready': 'Listo',
        'generating': 'Generando respuesta...',
        'you': 'Tú',
        'system': 'Sistema',
        'error': 'Error',
        'no_model_selected': 'Ningún modelo seleccionado',
        'switched_to_model': 'Cambiado al modelo: {}',
        'history_cleared': 'Historial de conversación borrado',
        'current_status': 'Estado actual:',
        'provider': 'Proveedor',
        'conversation_turns': 'Turnos de conversación',
        'api_endpoint': 'Punto final de API',
        'help_title': 'Chat Multi-LLM - Guía de ayuda',
        'help_content': `Características:
1. Escriba su mensaje en el cuadro de entrada y haga clic en "Enviar" o presione Ctrl+Enter
2. Use el menú desplegable para seleccionar diferentes modelos de IA
3. Use los botones de la barra de herramientas para cambiar modelos, limpiar historial, etc.

Soporte de Markdown:
- Texto **negrita**
- Texto *cursiva*
- Bloques de \`código\`
- # Encabezados
- Listas, tablas y otros formatos

Todas las llamadas a la API se realizan a través de https://api.laozhang.ai`,
        'manage_providers': 'Gestionar proveedores',
        'add_new_provider': 'Agregar nuevo proveedor',
        'edit_provider': 'Editar proveedor',
        'provider_name': 'Nombre del proveedor',
        'api_key': 'Clave API',
        'model': 'Modelo',
        'description': 'Descripción',
        'save_provider': 'Guardar proveedor',
        'update_provider': 'Actualizar proveedor',
        'cancel': 'Cancelar',
        'existing_providers': 'Proveedores existentes',
        'name': 'Nombre',
        'status_column': 'Estado',
        'actions': 'Acciones',
        'active': 'Activo',
        'no_api_key': 'Sin clave API',
        'edit': 'Editar',
        'delete': 'Eliminar',
        'delete_confirm': '¿Está seguro de que desea eliminar el proveedor "{}"?',
        'provider_added': 'Proveedor "{}" agregado exitosamente',
        'provider_updated': 'Proveedor "{}" actualizado exitosamente',
        'provider_deleted': 'Proveedor "{}" eliminado exitosamente',
        'provider_exists': 'Ya existe un proveedor con este nombre. Por favor, elija un nombre diferente.',
        'fill_required_fields': 'Por favor, complete todos los campos obligatorios (Nombre, Clave API, Modelo)',
        'no_description': 'Sin descripción',
        'change_base_url': 'Cambiar URL base',
        'enter_new_base_url': 'Ingrese nueva URL base (actual: {}):',
        'invalid_url_format': 'Formato de URL inválido. Por favor ingrese una URL válida.',
        'base_url_changed': 'URL base cambiada a: {}',
        'set_api_key_all': 'Establecer clave API para todos',
        'enter_api_key_all': 'Ingrese la clave API para establecer en todos los proveedores:',
        'api_key_set_all': 'Se ha establecido la clave API para todos los proveedores',
        'api_key_required': 'Se requiere clave API'
    }
};

const LANGUAGE_NAMES = {
    'en': 'English',
    'zh': '中文',
    'fr': 'Français',
    'de': 'Deutsch',
    'ja': '日本語',
    'es': 'Español'
};

// Language Manager Class
class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.loadLanguageSettings();
    }

    loadLanguageSettings() {
        try {
            const settings = localStorage.getItem('languageSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.currentLanguage = parsed.language || 'en';
            }
        } catch (error) {
            console.error('Failed to load language settings:', error);
            this.currentLanguage = 'en';
        }
    }

    saveLanguageSettings() {
        try {
            localStorage.setItem('languageSettings', JSON.stringify({
                language: this.currentLanguage
            }));
        } catch (error) {
            console.error('Failed to save language settings:', error);
        }
    }

    setLanguage(language) {
        if (TRANSLATIONS[language]) {
            this.currentLanguage = language;
            this.saveLanguageSettings();
        }
    }

    getText(key) {
        return TRANSLATIONS[this.currentLanguage]?.[key] || key;
    }

    getAvailableLanguages() {
        return LANGUAGE_NAMES;
    }
}