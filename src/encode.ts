import * as fs from 'node:fs';

import * as nist from 'node-nist';
import { Fields1, Fields2, Fields13, EAT_VALUES, EAO_VALUES, CFO_VALUES, CAL_VALUES } from './enums';
import { Metadata } from './metadata';

// TODO:
// - Use fsPromises instead of sync fs
// - Interface to shell commands: via script? Directly?
// - unzip, convert, cwsq

function makeRecord(metadata: Metadata, imageBuffer: Buffer): nist.NistType13Record {
    return {
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
        [Fields13.DATA]: imageBuffer,
    };
}

export function encode(metadata: Metadata, wsqFiles: string[]) {
    var imageRecords: nist.NistType13Record[] = [];

    for (const wsqFile of wsqFiles) {
        const imageBuffer = fs.readFileSync(wsqFile);
        imageRecords.push(makeRecord(metadata, imageBuffer));
    }

    const nistFile: nist.NistFile = {
        1: {
            [Fields1.VER]: '0503',
            [Fields1.TOT]: 'MPS',
            [Fields1.DAT]: '20240216',
            [Fields1.PRY]: '4',
            [Fields1.DAI]: 'IL/IDFAFIS',
            [Fields1.ORI]: 'IL/IDFDIGC',
            [Fields1.TCN]: 'LS000L2402160033', // YYSSSSSSSSC
            [Fields1.NSR]: '19.68',
            [Fields1.NTR]: '19.68',
        },
        2: {
            [Fields2.SYS]: '0503',
            [Fields2.CNO]: metadata.case_no, //'215270121T',
            [Fields2.SEX]: metadata.sex, // 'M',
            [Fields2.EVN]: metadata.evid_no, // '001',
            [Fields2.EAD]: metadata.evid_acq_date, // FIXME: Convert -> '202101272118',
            [Fields2.EAT]: metadata.evid_acq_type, // EAT_VALUES.NIST,
            [Fields2.EALO]: metadata.evid_acq_loc,
            [Fields2.EAO]: metadata.evid_acq_orig, // EAO_VALUES.Lab,
            [Fields2.EAQ]: metadata.evid_acq_no,
            [Fields2.EAF]: metadata.evid_acq_first_name,
            [Fields2.EAL]: metadata.evid_acq_last_name,
            [Fields2.LCE]: '12',
            [Fields2.CFO]: metadata.orig_cause, // CFO_VALUES.Corpse,
            [Fields2.CSR]: '',
            [Fields2.EVNT]: metadata.event_name,
            [Fields2.CAL]: metadata.case_acq_loc_type, // CAL_VALUES.Field,
        },
        13: imageRecords,
    };

    const encodeResult = nist.nistEncode(nistFile, {});
    if (encodeResult.tag === 'success') {
        const buffer = encodeResult.value;
        // perform action on successfull encode, such as sending out the buffer
        fs.writeFileSync('file.nist', buffer);
    } else {
        const error = encodeResult.error;
        // perform action on unsuccessfull encode, such as logging an error
        console.log(error);
    }
}