declare module 'virtual:pwa' {
  export interface NormalizedPath {
    url: string
    hash: string
  }
  export const packageNames: [path: string, NormalizedPath][]
}
