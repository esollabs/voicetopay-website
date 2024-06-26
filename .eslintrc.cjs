// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  extends: ['plugin:prettier/recommended', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.cjs'],
      plugins: ['@typescript-eslint', 'unused-imports', 'simple-import-sort'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            plugins: ['prettier-plugin-tailwindcss'],
            singleQuote: true,
            trailingComma: 'es5',
            endOfLine: 'auto',
            printWidth: 120,
          },
        ],
        'import/prefer-default-export': 'off',
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Packages `react` related packages come first.
              ['^react', '^@?\\w'],
              // Internal packages.
              ['^(@|components)(/.*|$)'],
              // Side effect imports.
              ['^\\u0000'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // Style imports.
              ['^.+\\.?(css)$'],
            ],
          },
        ],
        'react/react-in-jsx-scope': 'off',
        'no-param-reassign': 'off',
        'simple-import-sort/exports': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-plusplus': 'off',
        'no-case-declarations': 'off',
      },
    },
  ],
};
