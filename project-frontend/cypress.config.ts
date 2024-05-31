import { defineConfig } from 'cypress';

export default defineConfig({
    env: {
        VITE_ENV: 'test', // Ensure this matches your pipeline configuration
    },
    e2e: {
        setupNodeEvents(_on, _config) {
            // implement node event listeners here
        },
    },
});
