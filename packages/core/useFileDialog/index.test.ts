import { describe, expect, it, vi } from 'vitest'
import { useFileDialog } from './index'

class DataTransferMock {
  items = new Set()

  get files() {
    return this.items.values()
  }
}

vi.stubGlobal('DataTransfer', DataTransferMock)

describe('useFileDialog', () => {
  const file1 = new File(['content1'], 'file1.txt', { type: 'text/plain' })
  const file2 = new File(['content2'], 'file2.txt', { type: 'text/plain' })

  it('should initialize with initialFiles as FileList', () => {
    const initialFiles = new DataTransfer()
    initialFiles.items.add(file1)
    initialFiles.items.add(file2)

    const { files } = useFileDialog({ initialFiles: initialFiles.files })

    expect(files.value).toEqual(initialFiles.files)
  })

  it('should initialize with initialFiles as Array<File>', () => {
    const { files } = useFileDialog({ initialFiles: [file1, file2] })

    const expectedFiles = new DataTransfer()
    expectedFiles.items.add(file1)
    expectedFiles.items.add(file2)

    expect(files.value).toEqual(expectedFiles.files)
  })

  it('should initialize with initialFiles as null', () => {
    const { files } = useFileDialog()

    expect(files.value).toBeNull()
  })

  it('should reset files when reset option is true', () => {
    const { files, open } = useFileDialog({ initialFiles: [file1], reset: true })

    open()
    expect(files.value).toBeNull()
  })
})
