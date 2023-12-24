import type { MaybeRef } from '@vueuse/shared'
import { toRef, toValue } from '@vueuse/shared'
import { type ComputedRef, type Ref, computed, ref } from 'vue-demi'
import type { FileSystemFileHandle, Writable } from '../types.js'
import { FsHandle } from '../Handle.js'
import { FsDirectory } from '../Directory/index.js'

export interface FsFileConstructorOptions {
  file: MaybeRef<FsFile | FileSystemFileHandle>
  parent?: MaybeRef<FsDirectory>
}

export class FsFile extends FsHandle<'file'> {
  kind = 'file' as const
  rawHandle: Ref<FileSystemFileHandle>
  readonly parent?: FsDirectory
  __rawFile: Ref<File | undefined>
  __cacheRawFile: ComputedRef<Promise<Ref<File>>> | undefined
  constructor({ file, parent }: FsFileConstructorOptions) {
    super()
    this.parent = parent === undefined ? undefined : toValue(parent)
    this.__rawFile = ref(undefined)
    const _file = toValue(file)
    if (_file instanceof FsFile)
      this.rawHandle = ref(_file.rawHandle)
    else
      this.rawHandle = ref(_file)

    this.__cacheRawFile = computed(async () => {
      if (!toValue(this.__rawFile))
        this.__rawFile.value = await toValue(this.rawHandle).getFile()

      return (<Ref<File>>(this.__rawFile))
    })
  }

  /** invalidate the cache by setting to `undefined`, only caches file info between file updates */
  __cachedRawFile: ComputedRef<Promise<Ref<File>>> | undefined

  /** Can only delete if there is a linked parent, otherwise the property is `undefined` */
  get delete() {
    const parent = this.parent
    if (parent instanceof FsDirectory) {
      return async () => {
        await toValue(parent.rawHandle).removeEntry(toValue(this.name))
      }
    }
    return undefined
  }

  getWriteStream() { return toValue(this.rawHandle).createWritable({ keepExistingData: false }) }
  getWriteStreamAppend() { return toValue(this.rawHandle).createWritable({ keepExistingData: true }) }

  write = async (writable: Writable) => {
    const stream = await this.getWriteStream()
    const writer = stream.getWriter()
    await writer.ready
    await writer.write(toValue(writable))
    await writer.ready
    await writer.close()
    this.__rawFile.value = undefined
  }

  append = async (writable: Writable) => {
    const stream = await this.getWriteStreamAppend()
    const writer = stream.getWriter()
    await writer.ready
    await writer.write(toValue(writable))
    await writer.ready
    await writer.close()
    this.__rawFile.value = undefined
  }

  writeFromStream = async (readableStream: MaybeRef<ReadableStream>) => {
    const _readableStream = toValue(readableStream)
    const stream = await this.getWriteStream()
    await _readableStream.pipeTo(stream)
    this.__rawFile.value = undefined
  }

  appendFromStream = async (readableStream: MaybeRef<ReadableStream>) => {
    const _readableStream = toValue(readableStream)
    const stream = await this.getWriteStreamAppend()
    await _readableStream.pipeTo(stream)
    this.__rawFile.value = undefined
  }

  /*
  for future: implement additional read/write functions that provide
  reactive progress tracking values and are cancelable
  monitored = {

  } */

  get name() { return computed(() => toValue(this.rawHandle).name) }
  get MIME() {
    return async () => {
      const file = await toValue(this.__cacheRawFile)
      if (!file)
        return ref('')
      return toRef(toValue(file), 'type', '')
    }
  }

  get size() {
    return async () => {
      const file = await toValue(this.__cacheRawFile)
      if (!file)
        return ref(0)
      return toRef(toValue(file), 'size', 0)
    }
  }

  get lastModified() {
    return async () => {
      const file = await toValue(this.__cacheRawFile)
      if (!file)
        return ref(0)
      return toRef(toValue(file), 'lastModified', 0)
    }
  }

  get relativePath() {
    return async () => {
      const file = await toValue(this.__cacheRawFile)
      if (!file)
        return ref('')
      return toRef(toValue(file), 'webkitRelativePath', '')
    }
  }

  webkitRelativePath = this.relativePath
  get blob() { return this.__cacheRawFile }
  get stream() { return computed(() => toValue(this.__cacheRawFile)?.then(v => v.value.stream())) }
  get arrayBuffer() { return computed(() => toValue(this.__cacheRawFile)?.then(v => v.value.arrayBuffer())) }
  get text() { return computed(() => toValue(this.__cacheRawFile)?.then(v => v.value.text())) }
}
