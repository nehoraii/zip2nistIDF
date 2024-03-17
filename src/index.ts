import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

import express from 'express';
import { convert } from "./convert";


const { PORT = 3000 } = process.env;
const app = express();

// TODO: expressAsyncHandler? See bridgeReceiver/mainRouter.ts
app.post('/zip2nist', async function (req, res) {
    const zipFile = req.body; // TODO: Check for valid zip file and/or mime type

    const tempPrefix = 'request-';
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), tempPrefix));

    // Save request to file
    fs.writeFile()

    const responseBuffer = await convert(zipFile, false);

    // Send response
    // res.send('Hello World');
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});