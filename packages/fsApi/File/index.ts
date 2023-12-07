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
  constructor({ file, parent }: FsFileConstructorOptions) {
    super()
    this.parent = parent === undefined ? undefined : toValue(parent)
    this.__rawFile = ref(undefined)
    const _file = toValue(file)
    if (_file instanceof FsFile)
      this.rawHandle = ref(_file.rawHandle)
    else
      this.rawHandle = ref(_file)
  }

  __cachedRawFile: ComputedRef<Promise<Ref<File>>> | undefined
  __cacheRawFile = computed(async () => {
    if (!this.__rawFile.value)
      this.__rawFile.value = await this.rawHandle.value.getFile()

    return (<Ref<File>>(this.__rawFile))
  })

  /** Can only delete if there is a linked parent, otherwise the property is `undefined` */
  get delete() {
    const parent = this.parent
    if (parent instanceof FsDirectory) {
      return async () => {
        await parent.rawHandle.value.removeEntry(this.name.value)
      }
    }
    return undefined
  }

  getWriteStream() { return this.rawHandle.value.createWritable({ keepExistingData: false }) }
  getWriteStreamAppend() { return this.rawHandle.value.createWritable({ keepExistingData: true }) }

  write = async (writable: Writable) => {
    const stream = await this.getWriteStream()
    await stream.write(toValue(writable))
    await stream.getWriter().ready
    await stream.close()
  }

  append = async (writable: Writable) => {
    const stream = await this.getWriteStreamAppend()
    await stream.write(toValue(writable))
    await stream.getWriter().ready
    await stream.close()
  }

  writeFromStream = async (readableStream: MaybeRef<ReadableStream>) => {
    const _readableStream = toValue(readableStream)
    const stream = await this.getWriteStream()
    _readableStream.pipeTo(stream)
    await stream.getWriter().ready
    await stream.close()
  }

  appendFromStream = async (readableStream: MaybeRef<ReadableStream>) => {
    const _readableStream = toValue(readableStream)
    const stream = await this.getWriteStreamAppend()
    _readableStream.pipeTo(stream)
    await stream.getWriter().ready
    await stream.close()
  }

  /*
  for future: implement additional read/write functions that provide
  reactive progress tracking values and are cancelable
  monitored = {

  } */

  get name() { return computed(() => this.rawHandle.value.name) }
  get MIME() { return this.__cacheRawFile.value.then(v => toRef(v.value, 'type', '')) }
  get size() { return this.__cacheRawFile.value.then(v => toRef(v.value, 'size', 0)) }
  get lastModified() { return this.__cacheRawFile.value.then(v => toRef(v.value, 'lastModified', 0)) }
  get relativePath() { return this.__cacheRawFile.value.then(v => toRef(v.value, 'webkitRelativePath', '')) }
  webkitRelativePath = this.relativePath
  get blob() { return this.__cacheRawFile }
  get stream() { return computed(() => this.__cacheRawFile.value.then(v => v.value.stream())) }
  get arrayBuffer() { return computed(() => this.__cacheRawFile.value.then(v => v.value.arrayBuffer())) }
  get text() { return computed(() => this.__cacheRawFile.value.then(v => v.value.text())) }
}
