#!/usr/bin/npx ts-node

import { convert } from "./convert";

async function main() {
  const zipFile = process.argv[2];

  if (!zipFile) {
    console.error("Usage: main.ts <zip file>");
    process.exit(1);
  }

  convert(zipFile, true);
}

main();
