// eslint.config.mjs
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { FlatCompat } from '@eslint/compat'; // <-- Use this (Named Import)
// Initialize FlatCompat
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  // You might also need to specify "recommended" for Next.js rules
});

export default tseslint.config(
  // 1. Load the old 'eslint-config-next' RECOMMENDED config via the utility
  // This is the cleanest way to avoid the circular reference when extending it.
  ...compat.extends('next/core-web-vitals'), 
  // Use 'next/core-web-vitals' as it's the standard recommended base for modern Next.js apps.

  // 2. TypeScript recommended rules
  ...tseslint.configs.recommendedTypeChecked,

  // 3. Custom/Overrides
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/.next/**', '**/node_modules/**'],
    
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    rules: {
      // Re-add your manual fixes here:
      '@typescript-eslint/no-explicit-any': 'error', 
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      
      // Ensure React Hooks rules are still active (they should be included by 'next/core-web-vitals',
      // but keeping them ensures the error from your initial log is caught):
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Fix for unescaped entities:
      'react/no-unescaped-entities': 'error',
    },
  }
);