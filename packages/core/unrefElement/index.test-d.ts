import type { ComponentPublicInstance, ShallowRef } from 'vue'
import type { VueInstance } from './index'
import { expectTypeOf } from 'vitest'
import { useElementSize } from '../useElementSize'
import { useFocusWithin } from '../useFocusWithin'

type EmitsInstance = ComponentPublicInstance<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  { mounted: () => void }
>

declare const componentRef: Readonly<ShallowRef<EmitsInstance | null>>

expectTypeOf<EmitsInstance>().toMatchTypeOf<VueInstance>()

useElementSize(componentRef)
useFocusWithin(componentRef)
