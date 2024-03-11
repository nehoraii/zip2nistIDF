import * as fs from 'node:fs';

import { nistEncode, NistFile } from 'node-nist';
import { Fields1, Fields2, Fields13, EAT_VALUES, EAO_VALUES, CFO_VALUES, CAL_VALUES } from './enums';

const nist: NistFile = {
    1: {
        [Fields1.VER]: '0503',
        [Fields1.TOT]: 'MPS',
        [Fields1.DAT]: '20240216',
        [Fields1.PRY]: '4',
        [Fields1.DAI]: 'IL/IDFAFIS',
        [Fields1.ORI]: 'IL/IDFDIGC',
        [Fields1.TCN]: 'LS000L2402160033',
        [Fields1.NSR]: '19.68',
        [Fields1.NTR]: '19.68',
    },
    2: {
        [Fields2.SYS]: '0503',
        [Fields2.CNO]: '215270121T',
        [Fields2.SEX]: 'M',
        [Fields2.EVN]: '001',
        [Fields2.EAD]: '202101272118',
        [Fields2.EAT]: EAT_VALUES.NIST,
        [Fields2.EALO]: 'רמת גן',
        [Fields2.EAO]: EAO_VALUES.Lab,
        [Fields2.EAQ]: '6870105',
        [Fields2.EAF]: 'יוסי',
        [Fields2.EAL]: 'כהן',
        [Fields2.LCE]: '12',
        [Fields2.CFO]: CFO_VALUES.Corpse,
        [Fields2.CSR]: '',
        [Fields2.EVNT]: '',
        [Fields2.CAL]: CAL_VALUES.Field,
    },
    13: [
        {
            [Fields13.IMP]: '4',
            [Fields13.SRC]: 'IDF/DIGC',
            [Fields13.LCD]: '20210127211821',
            [Fields13.HLL]: '800',
            [Fields13.VLL]: '750',
            [Fields13.SLC]: '1',
            [Fields13.THPS]: '500',
            [Fields13.TVPS]: '500',
            [Fields13.CGA]: 'WSQ20',
            [Fields13.BPX]: '8',
            [Fields13.FGP]: ['1'],
            [Fields13.EVN]: '001',
            [Fields13.LTN]: '001',
            [Fields13.DATA]: Buffer.from([0x41, 0x42, 0x43]),
        },
    ],
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
