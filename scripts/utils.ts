import fg from 'fast-glob'

export async function listFunctions(dir: string, ignore: string[] = []) {
  return (await fg('*', {
    onlyDirectories: true,
    cwd: dir,
    ignore: [
      '_*',
      'dist',
      'node_modules',
      ...ignore,
    ],
  }))
    .sort()
}
