// Record Type-1: Transaction information record
export enum Fields1 {
    LEN = 1, // Logical Record Length
    VER = 2, // Version number: '0503'
    CNT = 3, // File content

    TOT = 4, // Type of transaction: 'MPS'
    DAT = 5, // Date: YYYYMMDD
    PRY = 6, // Priority: {1: High, 4: Medium, 8: Low}
    DAI = 7, // Destination Agency Identifier: 'IL/IDFAFIS'
    ORI = 8, // Originating Agency Identifier: 'IL/IDFDIGC'
    TCN = 9, // Transaction Control Number: YYSSSSSSSSC
    // TCR = 10, // Transaction Control Reference (Response?)
    NSR = 11, // Native Scanning Resolution: '19.68' for 500 ppi, '39.37' for 1000 ppi
    NTR = 12, // Nominal Transmitted Resolution (as above)
}

// Evidence Acquisition Type
export enum EAT_VALUES {
    Live = '1',
    File = '2',
    NIST = '3',
}

// Evidence Acquisition Origin
export enum EAO_VALUES {
    Lab = '1',
    DIGC = '2',
    Portable = '3',
}

// Cause for Originating
export enum CFO_VALUES {
    Corpse = '1',
    UnknownWounded = '2',
    Finger = '3',
    PartialFinger = '4',
    Palm = '5',
    Other = '6',
}

// Case Acquisition Location Type
export enum CAL_VALUES {
    DIGC = '1',
    ForensicInstitute = '2',
    Field = '3',
}

// Record Type-2: User-defined descriptive text record
export enum Fields2 {
    LEN = 1, // Logical Record Length
    IDC = 2, // Image Designation Character: '00'

    SYS = 3, // System Information: '0503'
    CNO = 7, // Case Number: IDF Case Numbers will be 10 numeric characters.
    // If the case is a training case the Case Number will end with a “T”
    SEX = 39, // Sex: Male = M, Female = F, Unknown = U
    EVN = 400, // Evidence Number: 001
    EAD = 401, // Evidence Acquisition Date: 20240216020140
    EAT = 402, // Evidence Acquisition Type: EAT_VALUES
    EALO = 403, // Evidence Acquisition Location: Where Location is 100 char. Free Text field
    EAO = 404, // Evidence Acquisition Origin: EAO_VALUES
    EAQ = 405, // Military ID of Acquirer (Mispar Ishi)
    EAF = 406, // Evidence Acquirer First Name
    EAL = 407, // Evidence Acquirer Last Name
    LCE = 408, // Latent Count in Evidence: 10
    CFO = 409, // Cause for Originating: CFO_VALUES
    CSR = 410, // Case Reason (<= 100 chars)
    EVNT = 411, // Event Name (<= 100 chars)
    CSD = 412, // Case Details (<= 200 chars)
    CAL = 413, // Case Acquisition Location Type: “DIGC” = 1, “Forensic Institute” = 2, “Field” = 3
    LTN = 414, // Latent Number: Multi occurrence list of latent numbers in order of type-13 images.
}

// Record Type-13: Friction-ridge latent image record
export enum Fields13 {
    LEN = 1, // Logical Record Length: '27816'
    IDC = 2, // Image Designation Character: '01'

    IMP = 3, // Impression Type: '4'
    SRC = 4, // Source Agency/ORI: 'IL/IDFDIGC'
    LCD = 5, // Latent Capture Date: YYYYMMDDHHMMSS '20210127211821'
    HLL = 6, // Horizontal Line Length: '800', '500'
    VLL = 7, // Vertical Line Length: '750', '500'
    SLC = 8, // Scale Units: '1'
    THPS = 9, // Horizonal Pixel Scale: 500/1000
    TVPS = 10, // Vertical Pixel Scale: 500/1000
    CGA = 11, // Compression Algorithm: 'WSQ20'
    BPX = 12, // Bits Per Pixel: '8'
    FGP = 13, // Finger/Palm Position in Buffer: '1'..'10'
    SPD = 14, // Search Position Descriptors N Optional: If 13.013 = 19, Per ITL-1_5.03 Table 44
    PPC = 15, // Print Position Coordinates N Optional: If 13.013 = 19

    EVN = 400, // Evidence Number N 3-digit numeric, matches Type-2 record: '001'
    LTN = 401, // Latent Number N 3-digit numeric: '001'..'010' (similar to FGP but 3 digits)

    DATA = 999, // Latent Friction Ridge Image
}