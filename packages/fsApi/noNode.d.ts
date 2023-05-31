declare interface File {
  stream: () => Promise<ReadableStream<any>>
}

declare interface FileSystemDirectoryHandle extends import('./types.js').FileSystemDirectoryHandle {}
declare interface FileSystemFileHandle extends import('./types.js').FileSystemFileHandle {}
declare interface FileSystemHandle extends import('./types.js').FileSystemHandle {}

declare interface globalThis {
  FileSystemDirectoryHandle: import('./types.js').FileSystemDirectoryHandle
  FileSystemFileHandle: import('./types.js').FileSystemFileHandle
  FileSystemHandle: import('./types.js').FileSystemHandle
}
