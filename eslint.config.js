import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-undef': 'off', // 글로벌 변수 허용
      'no-console': 'off', // console 허용
      'no-alert': 'off', // alert 허용
      'no-confirm': 'off', // confirm 허용
      'no-window': 'off', // window 허용
      'no-document': 'off', // document 허용
      'no-localStorage': 'off', // localStorage 허용
      'no-setTimeout': 'off', // setTimeout 허용
      'no-clearTimeout': 'off', // clearTimeout 허용
      'no-setInterval': 'off', // setInterval 허용
      'no-clearInterval': 'off', // clearInterval 허용
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]; 