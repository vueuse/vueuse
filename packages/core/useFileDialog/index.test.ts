import { describe, expect, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
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

  it('should work with custom input element', () => {
    const input = document.createElement('input')
    input.click = vi.fn()
    const { open } = useFileDialog({ input })

    open()
    expect(input.type).toBe('file')
    expect(input.click).toBeCalled()
  })

  it('should work with input element passed as template ref', async () => {
    const inputEl1 = document.createElement('input')
    inputEl1.click = vi.fn()
    const input = shallowRef<HTMLInputElement>(inputEl1)
    const { open } = useFileDialog({ input })

    expect(inputEl1.click).toHaveBeenCalledTimes(0)
    open()
    expect(inputEl1.type).toBe('file')
    expect(inputEl1.click).toHaveBeenCalledTimes(1)

    const inputEl2 = document.createElement('input')
    inputEl2.click = vi.fn()

    input.value = inputEl2
    await nextTick()

    expect(inputEl2.type).toBe('file')
    expect(inputEl2.click).toHaveBeenCalledTimes(0)

    open()

    expect(inputEl2.click).toHaveBeenCalledTimes(1)
  })

  it('should trigger onchange and update files when file is selected', async () => {
    const input = document.createElement('input')
    const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' })

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: true,
    })

    const { open, onChange, files } = useFileDialog({ input })

    const changeHandler = vi.fn()
    onChange(changeHandler)

    open()

    input.dispatchEvent(new Event('change'))

    expect(files.value?.[0]).toEqual(file)
    expect(changeHandler).toHaveBeenCalledWith(files.value)
  })

  it('should work with ref value for multiple option', async () => {
    const input = document.createElement('input')
    input.click = vi.fn()

    const multipleRef = shallowRef(true)

    const { open } = useFileDialog({
      input,
      multiple: multipleRef,
    })

    expect(input.multiple).toBe(true)

    open()

    expect(input.multiple).toBe(true)

    multipleRef.value = false
    await nextTick()

    expect(input.multiple).toBe(false)

    open()

    expect(input.multiple).toBe(false)
  })

  it('should work with ref value for accept option', async () => {
    const input = document.createElement('input')
    input.click = vi.fn()

    const acceptRef = shallowRef('image/*')

    const { open } = useFileDialog({
      input,
      accept: acceptRef,
    })

    expect(input.accept).toBe('image/*')

    open()

    expect(input.accept).toBe('image/*')

    acceptRef.value = 'video/*'
    await nextTick()

    expect(input.accept).toBe('video/*')

    open()

    expect(input.accept).toBe('video/*')
  })

  it('should work with ref value for directory option', async () => {
    const input = document.createElement('input')
    input.click = vi.fn()

    const directoryRef = shallowRef(true)

    const { open } = useFileDialog({
      input,
      directory: directoryRef,
    })

    expect(input.webkitdirectory).toBe(true)

    open()

    expect(input.webkitdirectory).toBe(true)

    directoryRef.value = false
    await nextTick()

    expect(input.webkitdirectory).toBe(false)

    open()

    expect(input.webkitdirectory).toBe(false)
  })

  it('should work with ref value for reset option', () => {
    const input = document.createElement('input')
    input.click = vi.fn()

    const resetRef = shallowRef(true)

    const { open } = useFileDialog({
      input,
      reset: resetRef,
    })
    open()

    expect(input.click).toHaveBeenCalled() // Assuming reset does not change input attributes
  })

  it('should work with ref value for capture option', async () => {
    const input = document.createElement('input')
    input.click = vi.fn()

    const captureRef = shallowRef('user')

    const { open } = useFileDialog({
      input,
      capture: captureRef,
    })

    expect(input.capture).toBe('user')

    open()

    expect(input.capture).toBe('user')

    captureRef.value = 'environment'
    await nextTick()

    expect(input.capture).toBe('environment')

    open()

    expect(input.capture).toBe('environment')
  })
})
