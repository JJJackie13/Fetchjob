module.exports = {
    root: true,
    extends: '@react-native-community',
    plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
    rules: {
        semi: ['error', 'never'],
        endOfLine: 'auto',
    },
};
