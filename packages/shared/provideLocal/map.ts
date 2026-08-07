import type { EffectScope, InjectionKey } from 'vue'
import type { InstanceProxy } from '../utils'

export type LocalProvidedKey<T> = InjectionKey<T> | string | number
export type LocalProvidedState<T> = Record<LocalProvidedKey<T>, unknown>

export type LocalProvidedOwner = InstanceProxy | EffectScope

export const localProvidedStateMap = new WeakMap<LocalProvidedOwner, LocalProvidedState<any>>()
