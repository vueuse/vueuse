import * as isoworker from 'isoworker'
import jobRunner from './jobRunner'
import depsParser from './depsParser'

/**
 * Converts the "fn" function into the syntax needed to be executed within a web worker
 *
 * @param {Function} fn the function to run with web worker
 * @param {Array.<String>} deps array of strings, imported into the worker through "importScripts"
 * @param {Function} localDeps imported local functions
 *
 * @returns {String} a blob url, containing the code of "fn" as a string
 *
 * @example
 * createWorkerBlobUrl((a,b) => a+b, [], () => [])
 * // return "onmessage=return Promise.resolve((a,b) => a + b)
 * .then(postMessage(['SUCCESS', result]))
 * .catch(postMessage(['ERROR', error])"
 */
function createWorkerBlobUrl(fn: Function, deps: string[], localDeps: () => unknown[]) {
  const [context] = isoworker.createContext(localDeps)
  const blobCode = `${depsParser(deps)}; ${context} onmessage=(${jobRunner})(${fn})`
  const blob = new Blob([blobCode], { type: 'text/javascript' })
  const url = URL.createObjectURL(blob)
  return url
}

export default createWorkerBlobUrl
