module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle': 'off',
    'linebreak-style': 'off',
    'import/no-extraneous-dependencies': 'off',
    'quotes': 'off',
    'import/extensions': 'off',
    'no-console': 'off',
    'func-names': 'off',
    'no-process-exit': 'off',
    'class-methods-use-this': 'off',
    'no-return-await': 'off',
    'object-shorthand': 'warn',
    'import/newline-after-import': 'warn',
    'padded-blocks': 'warn',
    'comma-dangle': 'warn',
  },
};
