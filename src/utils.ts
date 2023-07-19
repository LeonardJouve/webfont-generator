import fs from 'fs';
import {fromBuffer, type Entry} from 'yauzl';
import type {Icon} from '../types/svg';

export const parseArguments = <Args extends Record<string, number>>(args: string[], searched: Args): Record<keyof Args, string[]> => {
    const invalidIndex: number[] = [];
    const argsLength = args.length;
    return Object.entries(searched).reduce((acc, [search, number]) => {
        const searchArgs: string[] = [];
        const newInvalidIndex: number[] = [];
        const searchIndex = args.indexOf(`--${search}`);
        let isArgAvailable = true;
        if (searchIndex !== -1) {
            for (let i = 0; i < number; i++) {
                const index = searchIndex + i;
                newInvalidIndex.push(index);
                searchArgs.push(args[index]);
                if (invalidIndex.includes(index) || index >= argsLength) {
                    isArgAvailable = false;
                    break;
                }
            }
        }
        if (isArgAvailable) {
            invalidIndex.push(...newInvalidIndex);
        }
        return {
            ...acc,
            [search]: isArgAvailable ? searchArgs : [],
        };
    }, {} as Record<keyof Args, string[]>);
};

export const unzip = async (zip: Buffer, outPath: string): Promise<true> => new Promise((resolve, reject) => {
    fromBuffer(zip, {lazyEntries: true}, (error, zipFile) => {
        if (error) {
            reject(error);
            return;
        }

        let directory: string;

        zipFile.readEntry();

        zipFile.on('entry', (entry: Entry) => {
            const {fileName} = entry;
            if (/\/$/.test(fileName)) {
                [directory] = fileName.split('/');
                const directoryName = fileName.replace(directory, outPath);
                if (fs.existsSync(directoryName)) {
                    fs.rmSync(directoryName, {recursive: true});
                }
                fs.mkdirSync(directoryName);
                zipFile.readEntry();
            } else {
                zipFile.openReadStream(entry, (error, readStream) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    const writeStream = fs.createWriteStream(fileName.replace(directory, outPath));

                    readStream.pipe(writeStream);

                    writeStream.on('finish', () => zipFile.readEntry());
                });
            }
        });

        zipFile.on('end', () => resolve(true));
    });
});

export const updateConfig = (icons: Icon[]) => {
    const config = JSON.parse(fs.readFileSync('./config.json', {encoding: 'utf-8'}));
    const code = 0xE800;
    config['glyphs'] = icons.map(({name, path, width}, index) => ({
        uid: String(index),
        css: name,
        code: code + index,
        src: 'custom_icons',
        selected: true,
        svg: {
            path,
            width,
        },
    }));
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
};
