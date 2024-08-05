import * as child_process from "node:child_process"
import * as fs from "node:fs/promises"
import * as os from "node:os"
import * as path from "node:path"

import * as bmp2wsq from "./bmp2wsq"
import { encode } from "./encode"
import * as metadata from "./metadata"
import { withExtension } from "./util"
import iconv from "iconv-lite"

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
      type2FileWriteEncoding(nistBuffer, nistFile)
    }

    return nistBuffer
  } finally {
    await fs.rm(tempDir, { recursive: true })
  }
}

function type2FileWriteEncoding(nistBuffer: Buffer, fileName: string) {
  const encoding = "win1255"
  const nistBufferString = nistBuffer.toString()
  const type2StartIndex = nistBufferString.indexOf(String.fromCharCode(0x1c))
  const type2EndIndex = nistBufferString.indexOf(
    String.fromCharCode(0x1c),
    type2StartIndex + 1
  )
  let type2String = nistBufferString.slice(type2StartIndex, type2EndIndex)
  const encodedBuffer = iconv.encode(type2String, encoding)

  const type2Length = type2String
    .slice(0, type2String.indexOf(String.fromCharCode(0x1d)))
    .split(":")[1]

  const type2DigitLength = type2Length.length

  const newType2Length =
    encodedBuffer.length +
    (encodedBuffer.length.toString().length - type2DigitLength)

  type2String = type2String.replace(type2Length, newType2Length.toString())

  const updatedEncodedBuffer = iconv.encode(type2String, encoding)

  const type1String = nistBufferString.slice(0, type2StartIndex)
  const otherTypesString = nistBufferString.slice(type2EndIndex)

  fs.writeFile(fileName, type1String)
  fs.appendFile(fileName, updatedEncodedBuffer)
  fs.appendFile(fileName, otherTypesString)
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
