import SparkMD5 from 'spark-md5'

export interface useSliceUploadOptions {
  /**
   * The file chunk upload failed retry times.
   *
   * @default 1
   */
  retryTimes?: number
  chunkSize: number
  initFileUpload: () => Promise<any>
  uploadPartFile: (chunk: Blob, index: number) => Promise<any>
  finishFileUpload: (md5: string) => Promise<any>
}

export function useSliceUpload(file: File, options: useSliceUploadOptions) {
  async function uploadFile() {
    const {
      initFileUpload,
      uploadPartFile,
      finishFileUpload,
      chunkSize,
      retryTimes = 1,
    } = options
    const retryList = []
    const { md5, chunklist } = await getChunkListAndFileMD5(file, chunkSize)
    await initFileUpload()
    for (let i = 0; i < chunklist.length; i++) {
      try {
        await uploadPartFile(chunklist[i], i)
      }
      catch (error) {
        retryList.push(i)
      }
    }

    for (let retry = 0; retry < retryTimes; retry++) {
      if (retryList.length === 0)
        break
      for (let j = 0; j < retryList.length; j++) {
        const blobIndex = retryList[j]
        try {
          await uploadPartFile(chunklist[blobIndex], blobIndex)
          retryList.splice(j, 1)
        }
        catch (error) {
          console.error(`Index ${blobIndex} file chunk failed to upload at ${retry} time`)
        }
      }
    }

    if (retryList.length === 0) {
      return await finishFileUpload(md5)
    }
    else {
      throw new Error(
        `Failed to upload '${
          file.name
        }', some chunks upload failed, these index failed to upload: ${JSON.stringify(retryList)}`,
      )
    }
  }

  return {
    uploadFile,
  }
}

function getChunkListAndFileMD5(
  file: File,
  chunkSize: number,
): Promise<{ chunklist: Blob[]; md5: string }> {
  return new Promise((resolve, reject) => {
    let currentChunkCount = 0
    const chunkList: Blob[] = []
    const blobSlice = File.prototype.slice
    const chunkCount = Math.ceil(file.size / chunkSize)
    const sparkMd5 = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()

    fileReader.onload = function(event) {
      if (event.target?.result instanceof ArrayBuffer)
        sparkMd5.append(event.target.result)
      if (currentChunkCount < chunkCount) {
        loadNext()
      }
      else {
        const computedHash = sparkMd5.end()
        resolve({ md5: computedHash, chunklist: chunkList })
      }
    }

    fileReader.onerror = function(error) {
      console.error('Failed to read the file content: ', error)
      reject(error)
    }

    function loadNext() {
      const start = currentChunkCount * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      const chunk = blobSlice.call(file, start, end)
      chunkList.push(chunk)
      fileReader.readAsArrayBuffer(chunk)
      currentChunkCount++
    }
    loadNext()
  })
}
