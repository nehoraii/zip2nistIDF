import * as path from 'node:path';

export function withExtension(extension: string, filename: string): string {
    return path.format({ ...path.parse(filename), base: '', ext: extension })
}