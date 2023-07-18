module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        'semi': ['error', 'always'],
        'indent': ['error', 4],
        'object-curly-spacing': ['error', 'never'],
        'quotes': ['error', 'single'],
        'no-var': 'error',
        'eqeqeq': ['error', 'always'],
    },
};
