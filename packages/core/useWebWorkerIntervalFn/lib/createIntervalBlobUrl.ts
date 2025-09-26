import { createIntervalStr } from './intervalParser.ts'

export function createIntervalBlobUrl() {
  const blobCode = createIntervalStr()
  const blob = new Blob([blobCode], { type: 'text/javascript' })
  return URL.createObjectURL(blob)
}
