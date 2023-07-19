#!/usr/bin/env node

import {openSession, download} from './client';
import {parseArguments, updateConfig, unzip} from './utils';
import {getIcons} from './svg_parser';

const main = async (iconsPath = 'icons', outPath = 'webfont') => {
    try {
        const icons = getIcons(iconsPath);
        updateConfig(icons);
        const sessionId = await openSession();
        const zip = await download(sessionId);
        await unzip(zip, outPath);
        console.log('✅ Done');
    } catch (error) {
        console.error(`❌ ${error}`);
    }
};

const [,, ...args] = process.argv;
const searchedArgs = {
    'help': 1,
    'icons': 2,
    'out': 2,
};
const {help, icons: [, icons], out: [, out]} = parseArguments(args, searchedArgs);

if (help.length) {
    console.log(
        '\n',
        'Usage:\n',
        'webfont-generator {options}\n',
        '----------------------------------------------------------------\n',
        '--icons {path} | default "icons" | Path to the svg icons folder\n',
        '--out {path} | default "webfont" | Path to the output folder\n',
        '----------------------------------------------------------------\n',
    );
} else {
    main(icons, out);
}

