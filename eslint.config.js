/* ESLint: catches unused variables/imports and wrong use of React hooks. Run with `npm run lint`. */
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Count <Component /> in JSX as a use, so unused imports are still reported.
      'react/jsx-uses-vars': 'error',
      'no-unused-vars': ['error', { args: 'after-used', ignoreRestSiblings: true }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // These files export a context hook or shared constants next to their component on purpose.
    files: ['src/context/**', 'src/components/Avatar.jsx', 'src/components/labs/common.jsx', 'src/components/labs/*/shared.jsx', 'src/components/labs/*/data.jsx', 'src/components/labs/descent/valley.jsx', 'src/components/labs/knn/data.jsx', 'src/components/labs/metrics/data.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
];
