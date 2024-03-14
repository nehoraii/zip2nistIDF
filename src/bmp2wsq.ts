import * as child_process from 'node:child_process';
import { withExtension } from './util';

export interface WsqInfo {
    width: number;
    height: number;
    depth: number;
}

export function bmp2wsq(bmpFile: string): WsqInfo {
    const rawFile = withExtension('.raw', bmpFile);

    // <r bitrate>
    // determines the amount of lossy compression.
    // Suggested settings:
    //    r bitrate = 2.25 yields around 5:1 compression
    //    r bitrate = 0.75 yields around 15:1 compression
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

    return {
        width: Number(width),
        height: Number(height),
        depth: Number(depth),
    }
}
