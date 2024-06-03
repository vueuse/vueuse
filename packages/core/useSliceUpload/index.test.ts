import type { Ref } from 'vue-demi'
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { useSliceUpload } from './index'

describe('useSliceUpload', () => {
  const mockFile = new File([new Blob(['file content'], { type: 'text/plain' })], 'test-file')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('slices the file into an array of blobs', () => {
    const options = {
      sliceSize: 10,
      uploadFunction: vi.fn(),
    }

    const { fileSlices } = useSliceUpload(mockFile, options)

    expectTypeOf(fileSlices).toEqualTypeOf<Ref<Blob[]>>()
    expect(fileSlices.value.length).toBeGreaterThan(0)
    expect(fileSlices.value[0]).toBeInstanceOf(Blob)
  })

  it('uploads the slices using the provided upload function', async () => {
    const mockUploadFunction = vi.fn()
    const options = {
      sliceSize: 10,
      uploadFunction: mockUploadFunction,
    }

    const { upload } = useSliceUpload(mockFile, options)

    await upload()

    expect(mockUploadFunction).toHaveBeenCalledTimes(Math.ceil(mockFile.size / options.sliceSize))
  })

  it('throws an error if the upload function is not provided', async () => {
    const options = {
      sliceSize: 10,
    }

    const { upload } = useSliceUpload(mockFile, options as any)

    const consoleSpy = vi.spyOn(console, 'error')

    await upload()

    expect(consoleSpy).toHaveBeenCalledWith('Upload function is not provided.')

    consoleSpy.mockRestore()
  })
})
