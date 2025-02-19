import depsParser from './depsParser'
import jobRunner from './jobRunner'

/**
 * Converts the "fn" function into the syntax needed to be executed within a web worker
 *
 * @param fn the function to run with web worker
 * @param deps array of strings, imported into the worker through "importScripts"
 * @param localDeps array of function, local dependencies
 *
 * @returns a blob url, containing the code of "fn" as a string
 *
 * @example
 * createWorkerBlobUrl((a,b) => a+b, [])
 * // return "onmessage=return Promise.resolve((a,b) => a + b)
 * .then(postMessage(['SUCCESS', result]))
 * .catch(postMessage(['ERROR', error])"
 */
function createWorkerBlobUrl(fn: Function, deps: string[], localDeps: Function[]) {
  const blobCode = `${depsParser(deps, localDeps)}; onmessage=(${jobRunner})(${fn})`
  const blob = new Blob([blobCode], { type: 'text/javascript' })
  const url = URL.createObjectURL(blob)
  return url
}

export default createWorkerBlobUrl
