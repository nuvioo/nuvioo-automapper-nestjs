import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// Mirrors upstream's shared Vitest config: swc transpiles legacy decorators with emitDecoratorMetadata (the
// AutoMap/reflect-metadata path needs design:type), and keepClassNames because the mapper identifies models by
// constructor.name.
export default defineConfig({
    oxc: false,
    plugins: [
        swc.vite({
            jsc: {
                parser: { syntax: 'typescript', decorators: true },
                transform: { legacyDecorator: true, decoratorMetadata: true },
                target: 'es2022',
                keepClassNames: true,
            },
        }),
    ],
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['reflect-metadata'],
        include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
    },
});
