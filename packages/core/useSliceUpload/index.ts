import { ref, watch } from 'vue-demi'

export interface SliceUploadOptions {
  /**
   * Size of each slice in bytes
   *
   * @default 1MB
   */
  sliceSize: number

  /**
   * Function to upload each slice
   */
  uploadFunction: (slice: Blob) => Promise<any>
}

const DEFAULT_OPTIONS: Omit<SliceUploadOptions, 'uploadFunction'> = {
  sliceSize: 1024 * 1024, // 1MB per slice
}

export function useSliceUpload(file: File, options: SliceUploadOptions) {
  const fileSlices = ref<Blob[]>([])

  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options, // Merge user-provided options
  }

  watch(() => file, () => sliceFile())

  // Slice the file into an blob array
  function sliceFile() {
    try {
      const slices: Blob[] = []
      const totalSlices = Math.ceil(file.size / mergedOptions.sliceSize)

      for (let i = 0; i < totalSlices; i++) {
        const start = i * mergedOptions.sliceSize
        const end = Math.min(start + mergedOptions.sliceSize, file.size)
        slices.push(file.slice(start, end))
      }

      fileSlices.value = slices
    }
    catch (error) {
      console.error('Error slicing the file:', error)
    }
  }

  // Upload function
  async function upload<T>() {
    try {
      const { uploadFunction } = mergedOptions
      if (uploadFunction) {
        return await Promise.all<T>(fileSlices.value.map(slice => uploadFunction(slice)))
      }
      else {
        console.error('Upload function is not provided.')
      }
    }
    catch (error) {
      console.error('Error uploading file slices:', error)
    }
  }

  return { fileSlices, upload }
}
