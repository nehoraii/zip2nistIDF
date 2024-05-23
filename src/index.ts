import express from "express";
import { zip2nist } from "./convert";

const { PORT = 3000 } = process.env;
const app = express();

app.post("/zip2nist", async (req, res) => {
  console.log("Received fingerprint message");

  let data: Uint8Array[] = [];

  req.on("data", (chunk: Uint8Array) => {
    data.push(chunk);
  });

  req.on("end", async () => {
    try {
      const zipData = Buffer.concat(data);
      const responseData: Buffer = await zip2nist(zipData);
      res.send(responseData);
      res.end();
    } catch (e) {
      res.statusCode = 400;
      return res.end(`Error: ${e}`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
