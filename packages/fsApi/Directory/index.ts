import type { MaybeRef } from '@vueuse/shared'
import { type Ref, computed, ref, unref } from 'vue-demi'
import type {
  FileSystemDirectoryHandle,
  FileSystemFileHandle,
} from '../types.js'
import { FsFile } from '../File/index.js'
import { FsHandle } from '../Handle.js'

type FileHandleInstance = (FileSystemFileHandle | FileSystemDirectoryHandle)
type FileHandleInstanceEntry = [string, FileHandleInstance]
type AccParams = Ref<string> | FsFile | FsDirectory | readonly [Ref<string>, FsFile | FsDirectory]

function reactiveWrapAsyncIterator<T extends string>(
  iterator: AsyncIterable<T>,
  _this: FsDirectory,
): AsyncIterable<Ref<string>>
function reactiveWrapAsyncIterator<T extends FileHandleInstance>(
  iterator: AsyncIterable<T>,
  _this: FsDirectory,
): AsyncIterable<FsFile | FsDirectory>
function reactiveWrapAsyncIterator<T extends [string, FileHandleInstance]>(
  iterator: AsyncIterable<T>,
  _this: FsDirectory,
): AsyncIterable<readonly [Ref<string>, FsFile | FsDirectory]>
function reactiveWrapAsyncIterator<T extends (
  string | FileHandleInstance | [string, FileHandleInstance]
)>(
  iterator: AsyncIterable<T>,
  _this: FsDirectory,
): AsyncIterable<AccParams> {
  const x = () => {
    const entries = iterator[Symbol.asyncIterator]()
    return {
      async next() {
        const { done, value } = await entries.next()
        const isHandle = (v: unknown): v is FileHandleInstance => v instanceof FileSystemHandle
        const isHandleEntry = (v: unknown): v is FileHandleInstanceEntry =>
          Array.isArray(v) && typeof v[0] == 'string' && isHandle(v[1])
        const getRet = <V>(v: V) => ({ done, value: v })
        function getInstance<K extends FileHandleInstance>(v: K): FsFile | FsDirectory {
          if (v.kind === 'file')
            return new FsFile ({ file: v, parent: _this })
          if (v.kind === 'directory')
            return new FsDirectory({ directory: v })
          throw new Error('unsupported file system handle kind')
        }
        if (typeof value == 'string')
          return getRet(ref(value))
        if (isHandle(value))
          return getRet(getInstance(value))
        if (isHandleEntry(value))
          return getRet([ref(value[0]), getInstance(value[1])] as const)
        throw new Error('unsupported file system iterable')
      },
      async return() {
        // This will be reached if the consumer called 'break' or 'return' early in the loop.
        return (<IteratorResult<AccParams>>(<unknown>(await entries.return?.()) || { done: true }))
      },
    }
  }
  return {
    [Symbol.asyncIterator]: x,
  }
}

function collectAsyncIterator<T>(iterator: AsyncIterable<T>): () => Promise<T[]> {
  return async () => {
    const result: T[] = []
    for await (const item of iterator)
      result.push(item)
    return result
  }
}

export interface FsDirectoryConstructorOptions {
  directory: MaybeRef<FsDirectory | FileSystemDirectoryHandle>
  parent?: MaybeRef<FsDirectory>
}

export class FsDirectory extends FsHandle<'directory'> {
  kind = 'directory' as const
  rawHandle: Ref<FileSystemDirectoryHandle>
  readonly parent?: FsDirectory
  constructor({ directory, parent }: FsDirectoryConstructorOptions) {
    super()
    const _directory = unref(directory)
    this.parent = parent === undefined ? undefined : unref(parent)
    if (_directory instanceof FsDirectory)
      this.rawHandle = ref(_directory.rawHandle)
    else
      this.rawHandle = ref(_directory)
  }

  get name() { return computed(() => this.rawHandle.value.name) }

  createFile = (name: string) => this.rawHandle.value
    .getFileHandle(name, { create: true })
    .then(v => new FsFile({ file: v, parent: this }))

  createDirectory = (name: string) => this.rawHandle.value
    .getDirectoryHandle(name, { create: true })
    .then(v => new FsDirectory(
      {
        directory: v,
        parent: this,
      },
    ))

  create = ({ name, type }: { name: string; type: FileSystemHandleKind }) => ({
    file: this.createFile,
    directory: this.createDirectory,
  })[type](name)

  delete = (name: string) => this.rawHandle.value.removeEntry(name)
  deleteDir = (name: string) => this.rawHandle.value.removeEntry(name, { recursive: true })

  /** Can only delete if there is a linked parent, otherwise the property is `undefined` */
  get deleteSelf() {
    const parent = this.parent
    if (parent instanceof FsDirectory) {
      return async () => {
        await parent.rawHandle.value.removeEntry(this.name.value)
      }
    }
    return undefined
  }

  resolve = (name: string) => this.rawHandle.value.resolve(name)

  // Simple ref'ed and re-classed wrap of native interfaces
  get entries() {
    return reactiveWrapAsyncIterator(this.rawHandle.value.entries(), this)
  }

  [Symbol.asyncIterator] = () => this.entries

  get keys() {
    return reactiveWrapAsyncIterator(this.rawHandle.value.keys(), this)
  }

  get values() {
    return reactiveWrapAsyncIterator(this.rawHandle.value.values(), this)
  }

  get allEntries() {
    return collectAsyncIterator(this.entries)
  }

  get allKeys() {
    return collectAsyncIterator(this.keys)
  }

  get allValues() {
    return collectAsyncIterator(this.values)
  }

  getFile = (name: string) => this.rawHandle.value
    .getFileHandle(name)
    .then(v => new FsFile(
      { file: v, parent: this },
    ))

  getDirectory = (name: string) => this.rawHandle.value
    .getDirectoryHandle(name)
    .then(v => new FsDirectory(
      { directory: v },
    ))

  // Methods from Map that would be familiar interfaces
  get = async (name: string) => {
    try {
      return await this.getFile(name)
    }
    catch (error) {}
    try {
      return await this.getDirectory(name)
    }
    catch (error) {}
    return undefined
  }

  has = async (name: string) => {
    for await (const entry of this.rawHandle.value.keys()) {
      if (entry === name)
        return true
    }
    return false
  }

  forEach = async (callback: (arg: readonly [Ref<string>, FsDirectory | FsFile ]) => PromiseLike<unknown>) => {
    for await (const entry of this.entries)
      await callback(entry)
  }
}
