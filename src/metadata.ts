import { mapValues } from "lodash";

export enum environment {
  development = "development",
  preprod = "preprod",
  production = "production",
}
export interface Metadata {
  case_no: string; //'964664644',
  finger_count: number; //1,
  evid_acq_date: Date; //'2024-02-13T11:39:47.142+00:00',
  evid_acq_no: string; // '212351571',
  evid_acq_first_name: string; // 'תומר',
  evid_acq_last_name: string; // 'צב',
  evid_acq_type: string; // 3,
  evid_acq_orig: string; // 3,
  case_acq_loc_type: string; // 3,
  finger_order: string; // '1',
  scanner_id: string; // 'WATSON_v2.0.1 (WM1129C-31900089-000K)',
  extra_data: string; // '{}',
  evid_no: string; // '001',
  sex: string; // 'F',
  evid_acq_loc: string; // 'רמת גן',
  orig_cause: string; // 3,
  event_name: string; // 'חכחכחכח',
  environment: environment;
}

export function parse(rawData: Buffer): Metadata {
  const metadata = JSON.parse(rawData.toString());
  // console.log('Metadata:', metadata);

  const fields = metadata["data"][0]["fields"];
  var data: any = {};

  for (const field of fields) {
    data[field["name"]] = field["value"];
  }

  const case_no = data["case_no"].toString();

  const md = {
    case_no: case_no,
    finger_count: Number(data["finger_count"]),
    evid_acq_date: new Date(data["evid_acq_date"]),
    evid_acq_no: data["evid_acq_no"]?.toString(),
    evid_acq_first_name: data["evid_acq_first_name"]?.toString(),
    evid_acq_last_name: data["evid_acq_last_name"]?.toString(),
    evid_acq_type: data["evid_acq_type"]?.toString(),
    evid_acq_orig: data["evid_acq_orig"]?.toString(),
    case_acq_loc_type: data["case_acq_loc_type"]?.toString(),
    finger_order: data["finger_order"]?.toString(),
    scanner_id: data["scanner_id"]?.toString(),
    extra_data: data["extra_data"]?.toString(),
    evid_no: data["evid_no"]?.toString(),
    sex: data["sex"]?.toString(),
    evid_acq_loc: data["evid_acq_loc"]?.toString(),
    orig_cause: data["orig_cause"]?.toString(),
    event_name: data["event_name"]?.toString(),
    environment: data["environment"]?.toString(),
  };

  return mapValues(md, (v) => v ?? "");
}
