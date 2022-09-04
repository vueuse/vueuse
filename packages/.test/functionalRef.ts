import type { Ref } from '@vue/runtime-core'

export const getRawRef = <T>(ref: Ref<T>): Ref<T> => (ref as any).__raw_ref || ref
