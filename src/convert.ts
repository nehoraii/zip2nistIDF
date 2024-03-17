import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import * as child_process from 'node:child_process';

import * as metadata from './metadata';
import { encode } from './encode';
import * as bmp2wsq from './bmp2wsq';
import { withExtension } from './util';

export async function convert(zipFile: string, writeFile: boolean = false): Promise<Buffer> {
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

        let wsqInfos: bmp2wsq.WsqInfo[] = [];

        for (let i = 1; i <= md.finger_count; i++) {
            const bmpFile = path.join(tempDir, `${md.case_no}_${i}.bmp`);
            console.log(`Convert: ${bmpFile}`);
            const w = bmp2wsq.bmp2wsq(bmpFile);
            wsqInfos[i] = w;
        }

        const nistBuffer = encode(md, wsqInfos, tempDir);

        if (writeFile) {
            const nistFile = withExtension('.tdf', zipFile);
            console.log(`Writing NIST file: ${nistFile}`);
            fs.writeFile(nistFile, nistBuffer);
        }

        return nistBuffer;

    } finally {
        await fs.rm(tempDir, { recursive: true });
    }
}