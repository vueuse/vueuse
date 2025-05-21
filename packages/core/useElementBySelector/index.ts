// eslint-disable-next-line no-restricted-imports
import { ref as deepRef, onMounted } from 'vue'

export function useElementBySelector(selector: string) {
  const select = (): HTMLElement | null => document.querySelector(selector)

  const el = deepRef<HTMLElement | null>(select())

  onMounted(() => el.value = select())

  return el
}
