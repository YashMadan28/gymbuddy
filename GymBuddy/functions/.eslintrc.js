module.exports = {
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: ["eslint:recommended"],
  globals: {
    module: "readonly", // Declare 'module' as a global variable
    require: "readonly", // Declare 'require' as a global variable
  },
};
