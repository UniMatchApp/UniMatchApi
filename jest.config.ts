module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',  // Mapea el alias "@/..." a la raíz del proyecto
    },

};
