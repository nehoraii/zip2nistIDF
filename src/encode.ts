import * as fs from "node:fs";
import * as path from "node:path";

import * as nist from "node-nist";
import { WsqInfo } from "./bmp2wsq";
import { Fields1, Fields13, Fields2 } from "./enums";
import { Metadata, environment } from "./metadata";
import { date2ymd, date2ymdhms } from "./util";

function makeRecord(
  md: Metadata,
  fingerPosition: string,
  wsqInfo: WsqInfo,
  imageBuffer: Buffer
): nist.NistType13Record {
  return {
    [Fields13.IMP]: "4",
    [Fields13.SRC]: "IDF/DIGC",
    [Fields13.LCD]: date2ymdhms(md.evid_acq_date), //'20210127211821',
    [Fields13.HLL]: wsqInfo.width.toString(),
    [Fields13.VLL]: wsqInfo.height.toString(),
    [Fields13.SLC]: "1",
    [Fields13.THPS]: "500",
    [Fields13.TVPS]: "500",
    [Fields13.CGA]: "WSQ20",
    [Fields13.BPX]: wsqInfo.depth.toString(),
    [Fields13.FGP]: [fingerPosition],
    [Fields13.EVN]: md.evid_no,
    [Fields13.LTN]: String(fingerPosition).padStart(2, "0"),
    [Fields13.DATA]: imageBuffer,
  };
}

export function encode(md: Metadata, wsqInfos: WsqInfo[], dir: string): Buffer {
  var imageRecords: nist.NistType13Record[] = [];

  const fingers = md.finger_order.split(",");

  for (const [index, finger] of fingers.entries()) {
    const wsqFile = path.join(dir, `${md.case_no}_${finger}.wsq`);
    const imageBuffer = fs.readFileSync(wsqFile);
    const r = makeRecord(md, finger, wsqInfos[index], imageBuffer);
    imageRecords.push(r);
  }

  const nistFile: nist.NistFile = {
    1: {
      [Fields1.VER]: "0503",
      [Fields1.TOT]: "MPS",
      [Fields1.DAT]: date2ymd(md.evid_acq_date), // '20240216',
      [Fields1.PRY]: "4",
      [Fields1.DAI]: "IL/IDFAFIS",
      [Fields1.ORI]: "IL/IDFDIGC",
      [Fields1.TCN]: "LS000L2402160033", // YYSSSSSSSSC
      [Fields1.NSR]: "19.68",
      [Fields1.NTR]: "19.68",
    },
    2: {
      [Fields2.SYS]: "0503",
      [Fields2.CNO]: [environment.preprod].includes(md.environment)
        ? md.case_no.concat("T")
        : md.case_no, //'215270121T',
      [Fields2.SEX]: md.sex, // 'M',
      [Fields2.EVN]: md.evid_no, // '001',
      [Fields2.EAD]: date2ymdhms(md.evid_acq_date), // '202101272118',
      [Fields2.EAT]: md.evid_acq_type, // EAT_VALUES.NIST,
      [Fields2.EALO]: md.evid_acq_loc,
      [Fields2.EAO]: md.evid_acq_orig, // EAO_VALUES.Lab,
      [Fields2.EAQ]: md.evid_acq_no,
      [Fields2.EAF]: md.evid_acq_first_name,
      [Fields2.EAL]: md.evid_acq_last_name,
      [Fields2.LCE]: md.finger_count.toString(),
      [Fields2.CFO]: md.orig_cause, // CFO_VALUES.Corpse,
      [Fields2.CSR]: "",
      [Fields2.EVNT]: md.event_name,
      [Fields2.CAL]: md.case_acq_loc_type, // CAL_VALUES.Field,
    },
    13: imageRecords,
  };

  const encodeResult = nist.nistEncode(nistFile, {});
  if (encodeResult.tag !== "success") {
    const error = encodeResult.error;
    // perform action on unsuccessfull encode, such as logging an error
    throw new Error(error.toString());
  }

  const buffer = encodeResult.value;
  return buffer;
}
