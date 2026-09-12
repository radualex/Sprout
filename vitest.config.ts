import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        environment: 'jsdom',
        globals: false,
        setupFiles: ['./test/vitest/setup.ts'],
        include: ['src/**/test.unit.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/js/**/*.{ts,tsx}', 'src/design-system/**/*.{ts,tsx}'],
            exclude: [
                '**/*.d.ts',
                '**/test.unit.{ts,tsx}',
                '**/*.mock.{ts,tsx}',
                'test/**',
                'src/js/lib/db/auth-schema.ts'
            ],
            thresholds: {
                statements: 11,
                branches: 16,
                functions: 10,
                lines: 11
            }
        }
    }
});
