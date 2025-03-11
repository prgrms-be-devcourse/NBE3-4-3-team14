import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import nextCoreWebVitals from 'next/core-web-vitals';
import prettier from 'eslint-plugin-prettier';
import prettierPlugin from 'eslint-config-prettier';
import airbnb from 'eslint-config-airbnb'; // Airbnb 스타일 가이드 추가

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser, // 브라우저 글로벌 변수 사용
      parser: '@typescript-eslint/parser', // TypeScript 파서 설정
      parserOptions: {
        ecmaVersion: 2021, // ECMAScript 2021 버전 사용
        sourceType: 'module', // ES Modules 사용
        ecmaFeatures: {
          jsx: true, // JSX 문법 사용
        },
      },
    },
  },

  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs', // CommonJS 모듈 시스템 사용
    },
  },

  airbnb, // Airbnb 스타일 가이드 적용
  pluginReact.configs.flat.recommended, // React 규칙
  pluginReactHooks.configs.recommended, // React Hooks 규칙
  pluginJsxA11y.configs.recommended, // JSX 접근성 규칙
  nextCoreWebVitals.config, // Next.js Core Web Vitals 규칙
  prettier, // Prettier 플러그인 활성화
  prettierPlugin.configs.recommended, // Prettier와의 충돌을 방지하는 설정

  {
    rules: {
      'react/react-in-jsx-scope': 'off', // Next.js에서는 React import가 필요 없음
      'react/prop-types': 'off', // TypeScript에서는 PropTypes를 사용하지 않음
      '@typescript-eslint/no-unused-vars': ['warn'], // 사용하지 않는 변수에 대해 경고 표시
      'import/prefer-default-export': 'off', // Default export 강제 해제
      'jsx-a11y/anchor-is-valid': 'off', // Next.js의 Link 사용에 맞추기 위해 비활성화
      'prettier/prettier': ['error', { endOfLine: 'auto' }], // Prettier 규칙을 에러로 처리
    },
  },
];
