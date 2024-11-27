const esbuild = require('esbuild');
const copyStaticFiles = require('esbuild-copy-static-files');
const path = require('path');
const fs = require('fs');

const envFiles = [
    {
        src: path.resolve('core/uniMatch/user/user.env'),
        dest: path.resolve('dist/apps/RestApi/user.env')
    },
    {
        src: path.resolve('core/uniMatch/status/status.env'),
        dest: path.resolve('dist/apps/RestApi/status.env')
    },
    {
        src: path.resolve('core/uniMatch/notifications/notifications.env'),
        dest: path.resolve('dist/apps/RestApi/notifications.env')
    },
    {
        src: path.resolve('core/uniMatch/message/message.env'),
        dest: path.resolve('dist/apps/RestApi/message.env')
    },
    {
        src: path.resolve('core/uniMatch/matching/matching.env'),
        dest: path.resolve('dist/apps/RestApi/matching.env')
    },
    {
        src: path.resolve('core/uniMatch/event/event.env'),
        dest: path.resolve('dist/apps/RestApi/event.env')
    },
    {
        src: path.resolve('core/shared/shared.env'),
        dest: path.resolve('dist/apps/RestApi/shared.env')
    }

];

const copyEnvFiles = (files) => {
    files.forEach(({ src, dest }) => {
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
        } else {
            console.warn(`No se encontró el archivo ${src}`);
        }
    });
};

// Opciones comunes para build
const buildOptions = {
    entryPoints: ['./apps/RestApi/Main.ts'],
    bundle: true,
    platform: 'node',
    outfile: './dist/apps/RestApi/Main.js',
    sourcemap: true, // Generar source maps
    minify: process.env.NODE_ENV === 'production', // Minificar en producción
    plugins: [
        copyStaticFiles({
            src: './apps/static',
            dest: './dist/static',
        }),
    ],
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
};

esbuild.build(buildOptions).then(() => {
    copyEnvFiles(envFiles);
    console.log('Build completado con éxito.');
}).catch(() => process.exit(1));