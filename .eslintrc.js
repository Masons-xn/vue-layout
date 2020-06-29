module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:prettier/recommended",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier":0,
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-this-alias": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/ban-ts-ignore":0,
    "prefer-rest-params": 1,
    "no-useless-escape": 0,
    camelcase: 2, //强制驼峰法命名
    eqeqeq: 2, //必须使用全等
    indent: [2, 2], //缩进风格
    semi: ["error", "never"], //语句强制分号结尾
    strict: 2, //使用严格模式
    "no-undef": 0
  }
}
