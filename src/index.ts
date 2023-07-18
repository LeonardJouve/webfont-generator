import {openSession, download} from './client';
import {updateConfig, unzip} from './utils';
import {getIcons} from './svg_parser';

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
