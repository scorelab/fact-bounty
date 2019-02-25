module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: ["react-app", "eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "no-unused-vars": [
      "off",
      { vars: "all", args: "after-used", ignoreRestSiblings: false }
    ],
    "no-console": "off",
    indent: ["error", "tab"],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "never"]
  },
  settings: {
    react: {
      createClass: "createReactClass",
      pragma: "React",
      version: "detect",
      flowVersion: "0.53"
    }
  }
};
