import type { getCurrentInstance } from 'vue-demi'

export const localProvidedStateMap = new WeakMap<NonNullable<ReturnType<typeof getCurrentInstance>>, Record<string | symbol, any>>()
