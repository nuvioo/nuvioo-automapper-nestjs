import { defineConfig } from 'tsdown';

// Same output as the upstream @automapper/nestjs 9.x package: ESM-only, one bundled index.mjs + index.d.mts,
// with legacy decorators and their design:paramtypes metadata. Peers and rxjs stay external.
export default defineConfig({
    entry: ['src/index.ts'],
    format: 'esm',
    dts: true,
    outDir: 'dist',
    clean: true,
    deps: { neverBundle: ['@automapper/core', '@nestjs/common', '@nestjs/core', 'rxjs', 'reflect-metadata', 'tslib'] },
});
