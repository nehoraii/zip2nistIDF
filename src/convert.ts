import * as child_process from "node:child_process"
import * as fs from "node:fs/promises"
import * as os from "node:os"
import * as path from "node:path"

import * as bmp2wsq from "./bmp2wsq"
import { encode } from "./encode"
import * as metadata from "./metadata"
import { withExtension } from "./util"

export async function convert(
  zipFile: string,
  writeFile: boolean = false
): Promise<Buffer> {
  const tempPrefix = "zip-"
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), tempPrefix))

  try {
    console.info(`Extracting zip file ${zipFile} to ${tempDir}`)

    child_process.execFileSync("unzip", ["-d", tempDir, zipFile])

    const files = await fs.readdir(tempDir)
    console.info("Files in zip:", files)

    let md: metadata.Metadata | undefined

    for (const file of files) {
      if (file.toLowerCase().endsWith(".json")) {
        const rawData = await fs.readFile(path.join(tempDir, file))
        md = metadata.parse(rawData)
        console.info("Metadata:", md)
      }
    }

    if (md == undefined) {
      throw new Error("No metadata file found in zip")
    }

    let wsqInfos: bmp2wsq.WsqInfo[] = []

    const fingers = md.finger_order.split(",")

    for (const [index, finger] of fingers.entries()) {
      const bmpFile = path.join(tempDir, `${md.case_no}_${finger}.bmp`)
      console.info(`Convert: ${bmpFile}`)
      const w = bmp2wsq.bmp2wsq(bmpFile)
      wsqInfos[index] = w
    }

    const nistBuffer = encode(md, wsqInfos, tempDir)

    if (writeFile) {
      const nistFile = withExtension(".tdf", zipFile)
      console.info(`Writing NIST file: ${nistFile}`)
      fs.writeFile(nistFile, nistBuffer)
    }

    return nistBuffer
  } finally {
    await fs.rm(tempDir, { recursive: true })
  }
}

export async function zip2nist(zipData: Buffer): Promise<Buffer> {
  // TODO: Check for valid zip file and/or mime type

  const tempPrefix = "data-"
  const tempPath = path.join(os.tmpdir(), tempPrefix)
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), tempPrefix))

  console.info(`Created temp directory ${tempPath.toString()}`)

  try {
    // Save request body to file
    const zipFile = path.join(tempDir, "data.zip")
    await fs.writeFile(zipFile, zipData)
    console.info(`Written zip file to ${zipFile}`)

    const nistBuffer = await convert(zipFile, false)
    return nistBuffer
  } finally {
    await fs.rm(tempDir, { recursive: true })
  }
}
