import { ref } from 'vue-demi'

export function useAxios<T>(url: string) {
  const data = ref(0)
  // TODO:
  return { data }
}
