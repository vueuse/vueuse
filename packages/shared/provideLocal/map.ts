import type { InjectionKey } from 'vue'
import type { InstanceProxy } from '../utils'

export type LocalProvidedKey<T> = InjectionKey<T> | string | number
export type LocalProvidedState<T> = Record<LocalProvidedKey<T>, unknown>

export const localProvidedStateMap = new WeakMap<InstanceProxy, LocalProvidedState<any>>()
