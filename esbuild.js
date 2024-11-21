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

esbuild.build({
    entryPoints: ['./apps/RestApi/Main.ts'],
    bundle: true,
    platform: 'node',
    outfile: './dist/apps/RestApi/Main.js',
    plugins: [
        copyStaticFiles({
            src: './apps/static',
            dest: './dist/static',
        }),
    ],
}).then(() => {
    copyEnvFiles(envFiles);
}).catch(() => process.exit(1));
