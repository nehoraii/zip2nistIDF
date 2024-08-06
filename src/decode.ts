import * as fs from 'node:fs';

import { nistDecode } from '../node-nist/src/index';

// const buffer = fs.readFileSync('data/300056859.tdf');
const buffer = fs.readFileSync('data/215270121T_001.tdf');

const decodeResult = nistDecode(buffer);
if (decodeResult.tag === 'success') {
    const nistFile = decodeResult.value;
    // perform action on successfull decode, such as sending out the buffer
    console.log(nistFile);
} else {
    const error = decodeResult.error;
    // perform action on unsuccessfull decode, such as logging an error
    console.log(error);
}
