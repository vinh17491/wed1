# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

## ??? Frontend Hardening Report (05/05/2026)

### ?? Cart Store 8-Step Refactor
H? th?ng Gi? hàng dã du?c nâng c?p lên chu?n Senior v?i các tính nang:
1. **Robust ID:** K?t h?p UUID và Monotonic Counter.
2. **Double Validation:** Ki?m tra c? Product và CartItem tru?c khi ghi vào state.
3. **Smart Merging:** T? d?ng g?p s?n ph?m trùng c?u hình.
4. **Auto-Clean:** X? lý d? li?u "b?n" t? `localStorage` ngay khi kh?i ch?y.
5. **Clamping:** Gi?i h?n s? lu?ng [1-99] ? m?i ngõ vào.
6. **Safe Total:** Tính toán không bao gi? gây `NaN` hay `Infinity`.
7. **Action Logging:** H? th?ng log chi ti?t cho vi?c Debug.
8. **Vite Env Fix:** Ð?ng b? hóa các bi?n môi tru?ng theo chu?n Vite.

### ?? Quality Assurance
- **TypeScript:** 100% Type-safe.
- **Persistence:** T? ph?c h?i d? li?u khi b? can thi?p th? công.
- **Performance:** T?i uu hóa render qua selector và immutability.
