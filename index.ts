import fs from 'fs';
import FormData from 'form-data';
import SvgPath from 'svgpath';
import {fromBuffer, type Entry} from 'yauzl';
import https, {type RequestOptions} from 'https';
import type {IncomingMessage} from 'http';

type Icon = {
    name: string;
    path: string;
    width: number;
}

const openSession = (configPath: string): Promise<string> => new Promise((resolve, reject) => {
    const config = fs.createReadStream(configPath);

    const data = new FormData();

    data.append('config', config);

    const options: RequestOptions = {
        hostname: 'fontello.com',
        port: 443,
        path: '/',
        method: 'POST',
        protocol: 'https:',
        headers: data.getHeaders(),
    };

    const request = https.request(options);

    request.on('response', (response: IncomingMessage) => {
        const buffers: Buffer[] = [];
        response.on('data', (data: Buffer) => buffers.push(data));
        response.on('end', () => {
            const {statusCode} = response;
            if (statusCode && statusCode >= 400) {
                reject(buffers.toString());
                return;
            }
            resolve(Buffer.concat(buffers).toString());
        });
        response.on('error', (error: Error) => reject(error));
    });

    data.pipe(request);
});

const download = (sessionId: string): Promise<Buffer> => new Promise((resolve, reject) => {
    const request = https.get(`https://fontello.com/${sessionId}/get`);
    request.on('response', (response: IncomingMessage) => {
        const buffers: Buffer[] = [];
        response.on('data', (data: Buffer) => buffers.push(data));
        response.on('end', () => {
            const {statusCode} = response;
            if (statusCode && statusCode >= 400) {
                reject(buffers.toString());
                return;
            }
            resolve(Buffer.concat(buffers));
        });
        response.on('error', (error: Error) => reject(error));
    });
});

const unzip = async (zip: Buffer, dist: string): Promise<true> => new Promise((resolve, reject) => {
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

const getAttribute = (content: string, name: string): string => {
    const patternStart = `${name}="`;
    const start = content.indexOf(patternStart) + patternStart.length;
    const end = content.indexOf('"', start);
    return content.slice(start, end);
};

// TODO
// viewbox width as fallback
// merge all paths
// handle other svg elements than path
// handle invalid svg
const getIcons = (iconsPath: string): Icon[] => {
    const icons = fs.readdirSync(iconsPath, {encoding: 'utf-8'});
    return icons.
        filter((icon) => /\.svg$/.test(icon)).
        map((icon) => {
            const svg = fs.readFileSync(`${iconsPath}/${icon}`, {encoding: 'utf-8'});
            const name = icon.replace('.svg', '');
            const path = getAttribute(svg, 'd');
            const width = Number(getAttribute(svg, 'width'));
            return {
                name,
                path,
                width,
            };
        });
};

const updateConfig = (configPath: string, icons: Icon[]) => {
    const config = JSON.parse(fs.readFileSync(configPath, {encoding: 'utf-8'}));
    const code = 0xE800;
    config['glyphs'] = icons.map(({name, path, width}, index) => ({
        uid: String(index),
        css: name,
        code: code + index,
        src: 'custom_icons',
        selected: true,
        svg: {
            path: new SvgPath(path)
                .scale(config.units_per_em / width)
                .abs()
                .round(1)
                .toString(),
            width: config.units_per_em,
        },
    }));
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
};

const main = async (configPath = './config.json', iconsPath = './icons', dist = './webfont') => {
    try {
        const icons = getIcons(iconsPath);
        updateConfig(configPath, icons);
        const sessionId = await openSession(configPath);
        const zip = await download(sessionId);
        await unzip(zip, dist);
        console.log('✅ Done');
    } catch (error) {
        console.error('❌', error);
    }
};

main();
