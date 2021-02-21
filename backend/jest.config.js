module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        './src/controllers/*.js',
        './src/middlewares/*.js',
        './src/models/*.js'
    ],
    
    coveragePathIgnorePatterns: [
        '/node_modules/'
    ],

    testPathIgnorePatterns: [
        '/node_modules/'
    ],

    testEnvironment: 'node',
    testMatch: [
        '**/tests/**/?(*.)+(spec|test).[tj]s?(x)'
    ]
}