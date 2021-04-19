module.exports = {
  extends: [
    'plugin:vue/recommended',
    'plugin:vue/strongly-recommended',
    'plugin:vue/essential',
    'eslint-config-airbnb-base',
  ],
  rules: {
    'import/extensions': ['error', 'never'],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
    'max-classes-per-file': 'off',
    'max-len': [
      'error',
      140,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'require-await': 'error',
  },
};
