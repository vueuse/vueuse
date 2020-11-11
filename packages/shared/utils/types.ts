import { Ref } from 'vue-demi'

export type Fn = () => void

export type MaybeRef<T> = T | Ref<T>
