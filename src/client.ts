import fs from 'fs';
import FormData from 'form-data';
import https, {type RequestOptions} from 'https';
import type {IncomingMessage} from 'http';

export const openSession = (): Promise<string> => new Promise((resolve, reject) => {
    const config = fs.createReadStream('./config.json');

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

export const download = (sessionId: string): Promise<Buffer> => new Promise((resolve, reject) => {
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
