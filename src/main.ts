#!/usr/bin/npx ts-node

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import * as child_process from 'node:child_process';

import * as metadata from './metadata';
import { encode } from './encode';
import { bmp2wsq } from './bmp2wsq';
import { withExtension } from './util';


async function main() {
    const zipFile = process.argv[2];

    if (!zipFile) {
        console.error('Usage: main.ts <zip file>');
        process.exit(1);
    }

    const tempPrefix = 'zip-';
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), tempPrefix));

    try {
        console.log(`Extracting zip file ${zipFile} to ${tempDir}`);

        child_process.execFileSync('unzip', [
            '-d', tempDir, zipFile,
        ]);

        const files = await fs.readdir(tempDir);
        console.log('Files in zip:', files);

        let md: metadata.Metadata | undefined;

        for (const file of files) {
            if (file.toLowerCase().endsWith('.json')) {
                const rawData = await fs.readFile(path.join(tempDir, file));
                md = metadata.parse(rawData);
                console.log('Metadata:', md);
            }
        }

        if (md == undefined) {
            throw new Error('No metadata file found in zip');
        }

        const bmpFiles = files
            .filter(f => f.toLowerCase().endsWith('.bmp'))
            .map(f => path.join(tempDir, f));

        var wsqFiles: string[] = [];


        for (const bmpFile of bmpFiles) {
            const wsqFile = withExtension('.wsq', bmpFile);
            console.log(`Convert: ${bmpFile} -> ${wsqFile}`);
            bmp2wsq(bmpFile);
            wsqFiles.push(wsqFile);
        }

        encode(md, wsqFiles);

    } finally {
        await fs.rm(tempDir, { recursive: true });
    }
}

main();