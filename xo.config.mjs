import globals from 'globals';

const xoConfig = [{
  space: true,
  languageOptions: {
    globals: {...globals.node, ...globals.mocha},
  },
  rules: {
    'node/no-deprecated-api': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-node-protocol': 'off',
  },
}];

export default xoConfig;
