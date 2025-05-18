/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-organize-imports'],
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  bracketSpacing: true,
  bracketSameLine: true,
  useTabs: false,
};