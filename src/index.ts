#!/usr/bin/npx ts-node

import express from "express";
import { zip2nist } from "./convert";

const { PORT = 3000 } = process.env;
const app = express();

app.post("/zip2nist", async (req, res) => {
  console.info("Received fingerprint message");

  let data: Uint8Array[] = [];

  req.on("data", (chunk: Uint8Array) => {
    try {
      data.push(chunk);
      console.info(`Received data chunk, current chunk total: ${data.length}`);
    } catch (e) {
      console.error(`Request data event raised an error: ${e}`);
      return res.end(`Error: ${e}`);
    }
  });

  req.on("end", async () => {
    try {
      console.info("Request finished receiving");
      const zipData = Buffer.concat(data);
      const responseData: Buffer = await zip2nist(zipData);
      res.send(responseData);
      res.end();
    } catch (e) {
      res.statusCode = 400;
      console.error(`Request end event raised an error: ${e}`);
      return res.end(`Error: ${e}`);
    }
  });

  req.on("error", (err) => {
    console.error(`Request error event: ${err}`);
  });
});

app.listen(PORT, () => {
  console.info(`Server is listening on port ${PORT}`);
});
