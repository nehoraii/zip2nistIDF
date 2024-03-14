import * as path from 'node:path';

export function withExtension(extension: string, filename: string): string {
    return path.format({ ...path.parse(filename), base: '', ext: extension })
}

export function date2ymd(date: Date): string {
    const [ymd,] = date.toISOString().split('T');
    return ymd.replace(/-/g, '');
}

export function date2ymdhms(date: Date): string {
    const [ymd, hms_] = date.toISOString().split('T');
    const hms = hms_.substring(0, 8);
    ymd.replace(/-/g, '');
    hms.replace(/[-:.]/g, '');
    return ymd + hms;
}