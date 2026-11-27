// Keep ambient Temporal optional for consumers importing unrelated utilities.
// Native declarations provide the complete types when they are available.
type TemporalInstance<K extends string> = typeof globalThis extends { Temporal: Record<K, { prototype: infer T }> } ? T : any
export declare const Temporal: typeof globalThis extends { Temporal: infer T } ? T : any

// eslint-disable-next-line ts/no-redeclare -- This ambient declaration merges the value and type namespaces.
export declare namespace Temporal {
  type ZonedDateTime = TemporalInstance<'ZonedDateTime'>
  type PlainDate = TemporalInstance<'PlainDate'>
  type PlainTime = TemporalInstance<'PlainTime'>
  type PlainDateTime = TemporalInstance<'PlainDateTime'>
  type DurationLike = typeof globalThis extends {
    Temporal: { ZonedDateTime: { prototype: { add: (duration: infer T) => unknown } } }
  } ? T : any
}
