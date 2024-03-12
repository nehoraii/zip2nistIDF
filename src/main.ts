#!/usr/bin/npx ts-node

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import * as child_process from 'node:child_process';

import * as metadata from './metadata';

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

        child_process.execFileSync(
            'unzip',
            ['-d', tempDir, zipFile],
        );

        const files = await fs.readdir(tempDir);
        console.log('Files in zip:', files);

        for (const file of files) {
            if (file.endsWith('.json')) {
                const rawData = await fs.readFile(path.join(tempDir, file));
                const md = metadata.parse(rawData);
                console.log('Metadata:', md);
            }
        }

    } finally {
        await fs.rm(tempDir, { recursive: true });
    }
}

main();
