const js = require("@eslint/js");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const globals = require("globals");

module.exports = [
    // Базовые правила JavaScript с глобальными переменными Node.js
    {
        ...js.configs.recommended,
        languageOptions: {
            globals: {
                ...globals.node, // Добавляем глобальные переменные Node.js
                process: "readonly",
                setImmediate: "readonly",
            },
        },
    },

    // TypeScript конфигурация
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
                project: "./tsconfig.json",
            },
            globals: {
                ...globals.node, // Глобальные переменные для TS файлов
                process: "readonly",
                setImmediate: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },
        rules: {
            // TypeScript правила
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": "error",

            // Общие правила
            "no-console": "warn",
            "prefer-const": "error",
            "no-var": "error",
        },
    },

    // JavaScript файлы (логгер)
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node,
                process: "readonly",
            },
        },
        rules: {
            "@typescript-eslint/no-var-requires": "off",
        },
    },

    // Игнорируемые файлы
    {
        ignores: [
            "node_modules/",
            "dist/",
            "logs/",
            "*.min.js",
            "coverage/",
            ".nyc_output/",
            ".env",
            ".env.local",
            ".env.production",
        ],
    },
];
