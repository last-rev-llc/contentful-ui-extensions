module.exports = {
  "parser": "babel-eslint",
  "env": {
      "browser": true,
      "es6": true,
      "jest": true
  },
  "settings": {
        "ecmascript": 6,
        "jsx": true
  },
  "parserOptions": {
      "ecmaVersion": 2017,
      "ecmaFeatures": {
          "experimentalObjectRestSpread": true,
          "experimentalDecorators": true,
          "jsx": true
      },
      "sourceType": "module"
  },
  "plugins": [
      "react",
  ],
  "extends": "airbnb",
  "rules": {
    "react/jsx-filename-extension": 0,
    "function-paren-newline": 0,
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
    "no-underscore-dangle": 0,
    "react/jsx-one-expression-per-line": 0,
    "import/no-cycle": 0,
    "react/jsx-max-props-per-line": [1, { "maximum": 1, "when": "always" }],
    "array-callback-return": 0,
    "no-plusplus": ['error', { "allowForLoopAfterthoughts": true }]
  }
};