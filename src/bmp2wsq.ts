import * as path from 'node:path';
import * as child_process from 'node:child_process';
import { withExtension } from './util';

export function bmp2wsq(bmpFile: string) {
    const rawFile = withExtension('.raw', bmpFile);

    const bitRate = '0.75';

    let child = child_process.spawnSync('convert', [
        bmpFile, '-verbose', `gray:${rawFile}`,
    ]);

    if (child.error) {
        throw new Error(`${child.error}`);
    }

    // Verbose output:
    // data/964664644/964664644_1.bmp=>foo BMP3 800x750 800x750+0+0 8-bit Grayscale Gray 600000B 0.030u 0:00.040
    let [, , geometry, , depthRaw] = child.stderr.toString().split(' ');
    let [width, height] = geometry.split('x');
    let [depth] = depthRaw.split('-');

    child_process.execFileSync('cwsq', [
        bitRate,
        'wsq', // File extension
        rawFile,
        '-raw_in', `${width},${height},${depth}`,
    ]);
}
