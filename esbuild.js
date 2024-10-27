const esbuild = require('esbuild');
const copyStaticFiles = require('esbuild-copy-static-files');

esbuild.build({
    entryPoints: ['./apps/RestApi/Main.ts'],
    bundle: true,
    platform: 'node',
    outfile: './dist/apps/RestApi/Main.js',
    plugins: [
        copyStaticFiles({
            src: './apps/static', // Carpeta origen
            dest: './dist/static', // Carpeta destino
        }),
    ],
}).catch(() => process.exit(1));
