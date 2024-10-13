// babel.config.cjs
module.exports = {
  presets: [
    "@babel/preset-env", // Transpile modern JavaScript
    "@babel/preset-react", // Transpile JSX
  ],
  plugins: [
    "@babel/plugin-transform-runtime", // Optimize runtime code
    "@babel/plugin-proposal-class-properties", // Support class properties
    "@babel/plugin-syntax-import-meta", // Support import.meta
  ],
};
