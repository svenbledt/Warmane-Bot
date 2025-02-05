const globals = require('globals');
const js = require('@eslint/js');

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node
            },
            ecmaVersion: 'latest',
            sourceType: 'commonjs'
        },
        rules: {
            'indent': ['error', 4],
            'linebreak-style': ['error', 'unix'],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'no-unused-vars': ['warn'],
            'no-undef': ['error'],
            'prefer-const': ['warn'],
            'no-var': ['error']
        }
    }
];