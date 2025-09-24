export type SerializerType = 'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date'

export function guessSerializerType<T extends (string | number | boolean | object | null)>(
  rawInit: T,
): SerializerType {
  if (rawInit == null)
    return 'any'

  if (rawInit instanceof Set)
    return 'set'
  if (rawInit instanceof Map)
    return 'map'
  if (rawInit instanceof Date)
    return 'date'

  const type = typeof rawInit
  if (type === 'number') {
    return Number.isNaN(rawInit) ? 'any' : 'number'
  }

  const map: Record<'boolean' | 'string' | 'object', SerializerType> = {
    boolean: 'boolean',
    string: 'string',
    object: 'object',
  }

  return map[type as keyof typeof map] ?? 'any'
}
