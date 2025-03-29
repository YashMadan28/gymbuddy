module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "script", // Explicitly set to script (default)
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "require-jsdoc": "off", // Disable JSDoc requirement
    "max-len": ["error", { code: 120, ignoreUrls: true }], // Allow longer URLs
    camelcase: "off", // Disable camelcase enforcement
    indent: ["error", 2], // Match your current indentation
    "comma-dangle": "off", // Disable comma dangle rule
    "object-curly-spacing": "off", // Disable spacing enforcement
    "arrow-parens": ["error", "as-needed"], // Minimal arrow parens
    "no-unused-vars": ["error", { args: "none" }], // Allow unused args
    "no-undef": "off", // Disable undef checks (for fetch)
  },
  globals: {
    fetch: "readonly", // Declare fetch as a global
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
};
