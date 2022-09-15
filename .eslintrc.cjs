module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
   
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "unused-imports"
    ],
    "rules": {
        "@typescript-eslint/no-unused-vars": "off", 
        "unused-imports/no-unused-imports": "error", 
        "unused-imports/no-unused-vars": [ "warn", { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }, ], 
    }
}
