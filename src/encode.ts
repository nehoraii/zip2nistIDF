import * as fs from 'node:fs';

import { nistEncode, NistFile } from 'node-nist';

const nist: NistFile = {
    1: {
        2: '0502', // version
        4: 'CRM', // TOT
        5: '20190717', // date
        7: 'DAI035454', // DAI
        8: 'ORI38574354', // ORI
        9: 'TCN2487S054', // TCN
    },
    2: {
        4: 'John',
        5: 'Doe',
        7: '1978-05-12',
    },
};

const encodeResult = nistEncode(nist, {});
if (encodeResult.tag === 'success') {
    const buffer = encodeResult.value;
    // perform action on successfull encode, such as sending out the buffer
    fs.writeFileSync('file.nist', buffer);
} else {
    const error = encodeResult.error;
    // perform action on unsuccessfull encode, such as logging an error
    console.log(error);
}
