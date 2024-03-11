enum Fields1 {
    LEN = 1, // Logical Record Length
    VER = 2, // Version number
    CNT = 3, // File content

    TOT = 4, // Type of transaction
    DAT = 5, // Date
    PRY = 6, // Priority
    DAI = 7, // Destination Agency Identifier
    ORI = 8, // Originating Agency Identifier
    TCN = 9, // Transaction Control Number
    // TCR = 10, // Transaction Control Reference
    NSR = 11, // Native Scanning Resolution
    NTR = 12, // Nominal Transmitted Resolution
}

enum Fields2 {
    LEN = 1, // Logical Record Length
    IDC = 2, // Image Designation Character
    SYS = 3, // System Information
    CNO = 7, // Case Number
    SEX = 39, // Sex (M/F)
    N400 = 400, // 001
    N401 = 401, // 20240216020140
    N402 = 402, // '1', '3'
    N403 = 403, // (hebrew text?)
    N404 = 404, // '3', '1'
    N405 = 405, // 6416307, 6870105 (Mispar Ishi?)
    N406 = 406, // (hebrew text?)
    N407 = 407, // (hebrew text?)
    N408 = 408, // 10, 12
    N409 = 409, // 1
    N410 = 410, // (hebrew text? or empty)
    N411 = 411, // (hebrew text? or empty)
    // N412 = 412,
    N413 = 413, // '3'
}

enum Fields13 {
    LEN = 1, // Logical Record Length: '27816'
    IDC = 2, // Image Designation Character: '01'
    IMP = 3, // Impression Type: '4'
    SRC = 4, // Source Agency/ORI: 'IDF/DIGC'
    LCD = 5, // Latent Capture Date: '20210127211821'
    HLL = 6, // Horizontal Line Length: '800', '500'
    VLL = 7, // Vertical Line Length: '750', '500'
    SLC = 8, // Scale Units: '1'
    HPS = 9, // Horizonal Pixel Scale: '500'
    VPS = 10, // Vertical Pixel Scale: '500'
    CGA = 11, // Compression Algorithm: 'WSQ20'
    BPX = 12, // Bits Per Pixel: '1'..'10' (bug?) or '8'
    FGP = 13, // Finger/Palm Position in Buffer: '1'..'10'
    N400 = 400, // '001'
    N401 = 401, // '001'..'010' (similar to FGP but 3 digits)
    N999 = 999, // Image data
}