/**
 * Utility class for analyzing word context to determine appropriate vs inappropriate usage
 */
class WordContextAnalyzer {
    constructor() {
        // Common prefixes/suffixes that often indicate appropriate usage
        this.appropriatePrefixes = [
            'un', 're', 'pre', 'post', 'anti', 'pro', 'sub', 'super', 'inter', 'intra',
            'trans', 'ultra', 'semi', 'mini', 'maxi', 'micro', 'macro', 'neo', 'paleo'
        ];

        // Common suffixes that often indicate appropriate usage
        this.appropriateSuffixes = [
            'ing', 'ed', 'er', 'est', 'ly', 'ness', 'ment', 'tion', 'sion', 'able', 'ible',
            'ful', 'less', 'ish', 'ous', 'al', 'ic', 'ive', 'ize', 'ise', 'ify', 'fy'
        ];

        // Words that often indicate educational/appropriate context
        this.educationalIndicators = [
            'discuss', 'debate', 'analyze', 'study', 'research', 'learn', 'teach', 'explain',
            'understand', 'context', 'history', 'culture', 'society', 'politics', 'science',
            'academic', 'scholarly', 'professional', 'medical', 'legal', 'technical'
        ];

        // Words that often indicate inappropriate context
        this.inappropriateIndicators = [
            'hate', 'kill', 'attack', 'insult', 'offend', 'disrespect', 'mock', 'ridicule',
            'threaten', 'bully', 'harass', 'abuse', 'discriminate', 'target', 'victim'
        ];

        // Common phrases that indicate appropriate usage
        this.appropriatePhrases = [
            'in the context of', 'from a historical perspective', 'academically speaking',
            'professionally', 'in terms of', 'regarding', 'concerning', 'about',
            'discussion of', 'analysis of', 'study of', 'research on'
        ];

        // Common phrases that indicate inappropriate usage
        this.inappropriatePhrases = [
            'i hate', 'you are', 'go kill', 'i wish you', 'you should die',
            'i hope you', 'you deserve', 'you are a', 'stupid', 'idiot', 'moron'
        ];
    }

    /**
     * Analyze the context of a message to determine if a word is used appropriately
     * @param {string} message - The full message content
     * @param {string} word - The blacklisted word that was found
     * @param {Object} wordData - The blacklisted word data
     * @returns {Object} Analysis result with confidence score and reasoning
     */
    analyzeContext(message, word, wordData) {
        const analysis = {
            isAppropriate: false,
            confidence: 0,
            reasoning: [],
            context: this.extractContext(message, word)
        };

        // Get surrounding context
        const context = analysis.context;
        const lowerMessage = message.toLowerCase();
        const lowerWord = word.toLowerCase();

        // Check for educational/appropriate indicators
        const educationalScore = this.checkEducationalContext(lowerMessage, context);
        analysis.confidence += educationalScore.score;
        if (educationalScore.reasons.length > 0) {
            analysis.reasoning.push(...educationalScore.reasons);
        }

        // Check for inappropriate indicators
        const inappropriateScore = this.checkInappropriateContext(lowerMessage, context);
        analysis.confidence -= inappropriateScore.score;
        if (inappropriateScore.reasons.length > 0) {
            analysis.reasoning.push(...inappropriateScore.reasons);
        }

        // Check for appropriate phrases
        const appropriatePhraseScore = this.checkAppropriatePhrases(lowerMessage, context);
        analysis.confidence += appropriatePhraseScore.score;
        if (appropriatePhraseScore.reasons.length > 0) {
            analysis.reasoning.push(...appropriatePhraseScore.reasons);
        }

        // Check for inappropriate phrases
        const inappropriatePhraseScore = this.checkInappropriatePhrases(lowerMessage, context);
        analysis.confidence -= inappropriatePhraseScore.score;
        if (inappropriatePhraseScore.reasons.length > 0) {
            analysis.reasoning.push(...inappropriatePhraseScore.reasons);
        }

        // Check for word modifications (prefixes/suffixes)
        const modificationScore = this.checkWordModifications(lowerMessage, lowerWord);
        analysis.confidence += modificationScore.score;
        if (modificationScore.reasons.length > 0) {
            analysis.reasoning.push(...modificationScore.reasons);
        }

        // Check for quotation marks (often indicates discussion)
        if (this.hasQuotations(context)) {
            analysis.confidence += 0.3;
            analysis.reasoning.push('Word appears in quotation marks (likely discussing the term)');
        }

        // Check for code blocks or technical formatting
        if (this.hasTechnicalFormatting(context)) {
            analysis.confidence += 0.2;
            analysis.reasoning.push('Word appears in technical context (code, formatting, etc.)');
        }

        // Determine if usage is appropriate based on confidence score
        analysis.isAppropriate = analysis.confidence > 0.2;
        
        // Normalize confidence to 0-1 range
        analysis.confidence = Math.max(0, Math.min(1, (analysis.confidence + 1) / 2));

        return analysis;
    }

    /**
     * Extract context around the found word
     */
    extractContext(message, word) {
        const wordIndex = message.toLowerCase().indexOf(word.toLowerCase());
        if (wordIndex === -1) return message;

        const start = Math.max(0, wordIndex - 50);
        const end = Math.min(message.length, wordIndex + word.length + 50);
        return message.substring(start, end);
    }

    /**
     * Check for educational/appropriate context indicators
     */
    checkEducationalContext(message, context) {
        let score = 0;
        const reasons = [];

        for (const indicator of this.educationalIndicators) {
            if (message.includes(indicator)) {
                score += 0.15;
                reasons.push(`Contains educational indicator: "${indicator}"`);
            }
        }

        return { score, reasons };
    }

    /**
     * Check for inappropriate context indicators
     */
    checkInappropriateContext(message, context) {
        let score = 0;
        const reasons = [];

        for (const indicator of this.inappropriateIndicators) {
            if (message.includes(indicator)) {
                score += 0.2;
                reasons.push(`Contains inappropriate indicator: "${indicator}"`);
            }
        }

        return { score, reasons };
    }

    /**
     * Check for appropriate phrases
     */
    checkAppropriatePhrases(message, context) {
        let score = 0;
        const reasons = [];

        for (const phrase of this.appropriatePhrases) {
            if (message.includes(phrase)) {
                score += 0.25;
                reasons.push(`Contains appropriate phrase: "${phrase}"`);
            }
        }

        return { score, reasons };
    }

    /**
     * Check for inappropriate phrases
     */
    checkInappropriatePhrases(message, context) {
        let score = 0;
        const reasons = [];

        for (const phrase of this.inappropriatePhrases) {
            if (message.includes(phrase)) {
                score += 0.3;
                reasons.push(`Contains inappropriate phrase: "${phrase}"`);
            }
        }

        return { score, reasons };
    }

    /**
     * Check for word modifications (prefixes/suffixes)
     */
    checkWordModifications(message, word) {
        let score = 0;
        const reasons = [];

        // Check for prefixes
        for (const prefix of this.appropriatePrefixes) {
            if (message.includes(prefix + word)) {
                score += 0.1;
                reasons.push(`Word has appropriate prefix: "${prefix}"`);
            }
        }

        // Check for suffixes
        for (const suffix of this.appropriateSuffixes) {
            if (message.includes(word + suffix)) {
                score += 0.1;
                reasons.push(`Word has appropriate suffix: "${suffix}"`);
            }
        }

        return { score, reasons };
    }

    /**
     * Check if context contains quotations
     */
    hasQuotations(context) {
        return context.includes('"') || context.includes('\'') || context.includes('`');
    }

    /**
     * Check if context has technical formatting
     */
    hasTechnicalFormatting(context) {
        return context.includes('`') || context.includes('```') || context.includes('**') || context.includes('__');
    }

    /**
     * Get a human-readable explanation of the analysis
     */
    getExplanation(analysis) {
        if (analysis.reasoning.length === 0) {
            return 'No specific context indicators found.';
        }

        return analysis.reasoning.join('\n');
    }
}

module.exports = WordContextAnalyzer; 