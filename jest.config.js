import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest-setup.ts", "<rootDir>/src/app/__tests__/setupTests.js"],
    moduleNameMapper: {
        "^@components/(.*)$": "<rootDir>/src/components/$1",
        "^@app/(.*)$": "<rootDir>/src/app/$1",
        "^@/(.*)$": "<rootDir>/src/$1",
        "^react-leaflet$": "<rootDir>/src/app/__tests__/__mocks__/reactLeafletMock.js",
    },
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/", "<rootDir>/src/app/__tests__/__mocks__/", "<rootDir>/src/app/__tests__/setupTests.js"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
    },
    transformIgnorePatterns: ["/node_modules/(?!(@?react-leaflet|leaflet)/)"],
    testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
};

export default createJestConfig(customJestConfig);
