import type { FileHandleKind, FileSystemHandle } from 'packages/fsApi/types.js'
import { type ComputedRef, type Ref, computed } from 'vue-demi'

export abstract class FsHandle<K extends FileHandleKind> {
  abstract kind: K
  abstract name: ComputedRef<string>
  abstract rawHandle: Ref<FileSystemHandle<FileHandleKind>>

  sameAs(handle: FsHandle<FileHandleKind>) {
    return computed(() => this.rawHandle.value.isSameEntry(handle.rawHandle.value))
  }

  permission = {
    read: computed(() => this.rawHandle.value
      .queryPermission({ mode: 'read' })
      .then(v => v === 'granted')),
    write: computed(() => this.rawHandle.value
      .queryPermission({ mode: 'readwrite' })
      .then(v => v === 'granted')),
    requestRead: computed(() => this.rawHandle.value
      .requestPermission({ mode: 'read' })
      .then(v => v === 'granted')),
    requestWrite: computed(() => this.rawHandle.value
      .requestPermission({ mode: 'readwrite' })
      .then(v => v === 'granted')),
  }
}
