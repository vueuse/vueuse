const defaults = {
  array: (v: unknown[]) => JSON.stringify(v),
  object: (v: Record<string, unknown>) => JSON.stringify(v),
  set: (v: Set<unknown>) => JSON.stringify(Array.from(v)),
  map: (v: Map<string, unknown>) => JSON.stringify(Object.fromEntries(v)),
  null: () => '',
}

export function getDefaultSerialization<T extends Object>(target: T) {
  if (!target)
    return defaults.null

  if (target instanceof Map)
    return defaults.map
  else if (target instanceof Set)
    return defaults.set
  else if (Array.isArray(target))
    return defaults.array
  else
    return defaults.object
}
