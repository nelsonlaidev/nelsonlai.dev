import fs from 'node:fs/promises'
import path from 'node:path'

const dummyImagePath = path.join(process.cwd(), 'public/images/dummy.png')

export async function makeDummyImage(outputPath: string): Promise<void> {
  await fs.copyFile(dummyImagePath, outputPath)
}
