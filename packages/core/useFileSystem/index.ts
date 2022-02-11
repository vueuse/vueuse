import { ref } from 'vue-demi'

export function useFileSystem() {
  const win = window as any
  const isSupported = win.showSaveFilePicker && win.showOpenFilePicker

  const fileHandle = ref()
  const content = ref()

  async function open() {
    if (isSupported) {
      const [handle] = await win.showOpenFilePicker({
        multiple: false,
      })
      fileHandle.value = handle
      await readContent()
    }
  }

  async function create() {
    if (isSupported) {
      fileHandle.value = await win.showSaveFilePicker()
      content.value = undefined
    }
  }

  async function save() {
    if (isSupported) {
      if (!fileHandle.value)
        // save as
        fileHandle.value = await win.showSaveFilePicker()

      const writableStream = await fileHandle.value.createWritable()
      await writableStream.write(content.value)
      await writableStream.close()
    }
  }

  async function readContent() {
    const file = await fileHandle.value.getFile()
    content.value = await file.text()
  }

  return {
    isSupported,
    content,
    open,
    create,
    save,
  }
}
