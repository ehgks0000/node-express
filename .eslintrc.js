module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
    'any-other-config',
    'other-config',
    'prettier',
    'eslint:recommended',
  ],
  plugins: ['prettier'],
  // eslint-plugin-prettier를 적용시켜줍니다
  rules: { 'prettier/prettier': 'error' },
};
