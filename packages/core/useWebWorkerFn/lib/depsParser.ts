/**
 *
 * Concatenates the dependencies into a comma separated string.
 * this string will then be passed as an argument to the "importScripts" function
 *
 * @param deps array of string
 * @param localDeps array of function
 * @returns a string composed by the concatenation of the array
 * elements "deps" and "importScripts".
 *
 * @example
 * depsParser(['demo1', 'demo2']) // return importScripts('demo1', 'demo2')
 */
function depsParser(deps: string[], localDeps: Function[]) {
  if (deps.length === 0 && localDeps.length === 0)
    return ''

  const depsString = deps.map(dep => `'${dep}'`).toString()
  const depsFunctionString = localDeps.filter(dep => typeof dep === 'function').map((fn) => {
    const str = fn.toString()
    if (str.trim().startsWith('function')) {
      return str
    }
    else {
      const name = fn.name
      return `const ${name} = ${str}`
    }
  }).join(';')
  const importString = `importScripts(${depsString});`

  return `${depsString.trim() === '' ? '' : importString} ${depsFunctionString}`
}

export default depsParser
