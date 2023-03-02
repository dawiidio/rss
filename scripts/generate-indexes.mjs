import { basename, dirname, join, sep } from 'node:path';
import { Readable } from 'node:stream';
import { createWriteStream } from 'node:fs';
import { access, constants, readdir, rm, stat, writeFile } from 'node:fs/promises';

const NODE_REGEX = /^[a-zA-z0-9_-]+\.(node\.js|node\.d\.ts)$/;
const BROWSER_REGEX = /^[a-zA-z0-9_-]+\.(browser\.js|browser\.d\.ts)$/;
const COMMON_REGEX = /^[a-zA-z0-9_-]+\.(js|d\.ts)$/;

const CONFIG = {
    rootDirectory: 'lib',
    commonFileMatcher: (filename) => COMMON_REGEX.test(filename),
    excludeFileMatcher: (filename) => false,
    system: {
        node: {
            directory: 'node',
            system: 'cjs',
            extension: '.node.js',
            outputFile: 'lib/node/index.js',
            fileMatcher: (filename) => NODE_REGEX.test(filename)
        },
        browser: {
            directory: 'browser',
            system: 'esm',
            extension: '.browser.js',
            outputFile: 'lib/browser/index.js',
            fileMatcher: (filename) => BROWSER_REGEX.test(filename)
        },
    },
};

async function main(config = CONFIG) {
    await Promise.all(Object.entries(config.system).map(async ([moduleSystemName, systemConfig]) => {
        const rootDir = join(config.rootDirectory, config.system.node.directory);

        const {
            commonPaths,
            modulePaths,
            declarationPaths,
        } = groupPathsByType(
            await readdirRecursively(rootDir),
            systemConfig.fileMatcher,
            config.commonFileMatcher,
            config.excludeFileMatcher
        );

        const destination = await buildPackageEntrypoint(
            normalizePathsArray([...modulePaths, ...commonPaths], rootDir),
            systemConfig.outputFile,
            exportGeneratorsFactory(moduleSystemName),
        );

        const declarationOutputFilename = `${basename(systemConfig.outputFile, '.js')}.d.ts`;

        const declarationDestination = await buildPackageEntrypointTsDeclaration(
            normalizePathsArray(declarationPaths, rootDir, '.d.ts'),
            join(dirname(systemConfig.outputFile), declarationOutputFilename),
            exportGeneratorsFactory('declaration'),
        );

        console.log(
            `Entrypoint file for \x1b[35m%s\x1b[0m generated under \x1b[32m%s\x1b[0m with declaration under \x1b[34m%s\x1b[0m`,
            moduleSystemName,
            destination,
            declarationDestination,
        );
    }));
}

async function readdirRecursively(path, nestedPath = path) {
    const dirList = await readdir(path);

    const data = (await Promise.all(dirList.map(async (pathToFileOrDir) => {
        const stats = await stat(join(nestedPath, pathToFileOrDir));
        const relativePath = join(nestedPath, pathToFileOrDir);

        if (stats.isFile()) {
            return relativePath;
        } else if (stats.isDirectory()) {
            return readdirRecursively(relativePath);
        }

        throw new Error(`Unknown type of path ${pathToFileOrDir}`);
    })));

    return (path === nestedPath) ? data.flatMap((x) => x) : data;
}

const isDeclarationFile = path => path.endsWith('.d.ts');

const groupPathsByType = (dirList, moduleMatcher, commonMatcher, excludeMatcher) => {
    const modulePaths = [];
    const commonPaths = [];
    const declarationPaths = [];

    for (const path of dirList) {
        const filename = basename(path);

        if (excludeMatcher(filename)) {
            continue;
        }

        if (moduleMatcher(filename)) {
            if (isDeclarationFile(filename))
                declarationPaths.push(path);
            else
                modulePaths.push(path);
        }
        else if (commonMatcher(filename)) {
            if (isDeclarationFile(filename))
                declarationPaths.push(path);
            else
                commonPaths.push(path);
        }
    }

    return {
        modulePaths,
        commonPaths,
        declarationPaths,
    };
};

async function buildPackageEntrypoint(paths, destination, exportFactory) {
    await recreateFile(destination);

    const writeStream = createWriteStream(destination);
    const readStream = new Readable();

    readStream.pipe(writeStream);
    readStream.push('// WARNING! This file is autogenerated in build process, do not edit it manually\n');
    readStream.push('Object.defineProperty(exports, "__esModule", { value: true });\n');

    paths.map((path) => readStream.push(exportFactory(path)));

    readStream.emit('close');
    readStream.destroy();

    return destination;
}

async function buildPackageEntrypointTsDeclaration(paths, destination, exportFactory) {
    await recreateFile(destination);

    const writeStream = createWriteStream(destination);
    const readStream = new Readable();

    readStream.pipe(writeStream);
    readStream.push('// WARNING! This file is autogenerated in build process, do not edit it manually \n');

    paths.map((path) => readStream.push(exportFactory(path)));

    readStream.emit('close');
    readStream.destroy();

    return destination;
}

function getNodeExportString(path, exportName = basename(path)) {
    const importName = normalizeExportImportName(basename(path));
    exportName = normalizeExportImportName(exportName);

    return `exports.${exportName} = require('${path}').${importName};\n`;
}

function getBrowserExportString(path, exportName = basename(path)) {
    const importName = normalizeExportImportName(basename(path));
    exportName = normalizeExportImportName(exportName);

    const exportStr = exportName !== importName
        ? `${importName} as ${exportName}`
        : `${importName}`;

    return `export { ${exportStr} } from '${path}';\n`;
}

function getDeclarationExportString(path, exportName = '') {
    return `export * from '${path}';\n`;
}

function normalizeExportImportName(exportImportName) {
    return exportImportName.includes('.')
        ? exportImportName.replace(/\.[a-zA-z-0-9_-]+/, '')
        : exportImportName;
}

function exportGeneratorsFactory(type) {
    switch (type) {
        case 'node':
            return getNodeExportString;
        case 'browser':
            return getBrowserExportString;
        case 'declaration':
            return getDeclarationExportString;
        default:
            throw new Error(`Unknown module system type ${type}`);
    }
}

function normalizePath(path, rootDir, extension = '.js') {
    return path.replace((rootDir ? `${rootDir}${sep}` : ''), './').replace(extension, '');
}

function normalizePathsArray(paths, rootDir, extension = '.js') {
    return paths.map(path => normalizePath(path, rootDir, extension)).filter(path => basename(path) !== 'index');
}

async function recreateFile(path) {
    try {
        await access(path, constants.W_OK);
        await rm(path);
        await writeFile(path, '');
    } catch {
        await writeFile(path, '');
    }
}

main();