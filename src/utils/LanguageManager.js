class LanguageManager {
    constructor() {
        this.languages = new Map();
        this.defaultLanguage = 'en';
    }

    loadLanguage(code) {
        try {
            const language = require(`../languages/${code}`);
            this.languages.set(code, language);
        } catch (error) {
            console.error(`Failed to load language ${code}:`, error);
        }
    }

    getText(path, lang = this.defaultLanguage, replacements = {}) {
        const language = this.languages.get(lang) || this.languages.get(this.defaultLanguage);
        
        // Split the path (e.g., "commands.charname.no_permission")
        const keys = path.split('.');
        let text = language;
        
        // Navigate through the object
        for (const key of keys) {
            text = text?.[key];
            if (!text) break;
        }

        // If text not found, try default language
        if (!text && lang !== this.defaultLanguage) {
            return this.getText(path, this.defaultLanguage, replacements);
        }

        // Replace placeholders with values
        if (text && typeof text === 'string') {
            return Object.entries(replacements).reduce((str, [key, value]) => {
                return str.replace(new RegExp(`{${key}}`, 'g'), value);
            }, text);
        }

        return `Missing text: ${path}`;
    }
}

module.exports = new LanguageManager(); 