import type { getCurrentInstance } from 'vue'

export const localProvidedStateMap = new WeakMap<NonNullable<NonNullable<ReturnType<typeof getCurrentInstance>>['proxy']>, Record<string | symbol, any>>()
