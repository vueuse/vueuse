export function guessSerializerType<T extends(string | number | boolean | object | null)>(rawInit: T) {
  return rawInit == null
    ? 'any'
    : rawInit instanceof Set
      ? 'set'
      : rawInit instanceof Map
        ? 'map'
        : typeof rawInit === 'boolean'
          ? 'boolean'
          : typeof rawInit === 'string'
            ? 'string'
            : typeof rawInit === 'object'
              ? 'object'
              : Array.isArray(rawInit)
                ? 'object'
                : !Number.isNaN(rawInit)
                  ? 'number'
                  : 'any'
}
