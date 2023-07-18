import fs from 'fs';
import {fromBuffer, type Entry} from 'yauzl';
import type {Icon} from 'types/svg';

export const unzip = async (zip: Buffer, dist: string): Promise<true> => new Promise((resolve, reject) => {
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
                const directoryName = fileName.replace(directory, dist);
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

                    const writeStream = fs.createWriteStream(fileName.replace(directory, dist));

                    readStream.pipe(writeStream);

                    writeStream.on('finish', () => zipFile.readEntry());
                });
            }
        });

        zipFile.on('end', () => resolve(true));
    });
});

export const updateConfig = (configPath: string, icons: Icon[]) => {
    const config = JSON.parse(fs.readFileSync(configPath, {encoding: 'utf-8'}));
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
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
};
