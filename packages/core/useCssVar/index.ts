import { ref, Ref, watch, computed } from 'vue-demi'
import { tryOnMounted } from '@vueuse/shared'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export function useCssVar(
  prop: string,
  refEl?: Ref<HTMLElement | null>,
  { window = defaultWindow }: ConfigurableWindow = {},
) {
  if (!window)
    return ref('')

  const varRef = ref('')
  const el = computed(() => refEl?.value || window.document.documentElement)

  tryOnMounted(() => {
    varRef.value = window.getComputedStyle(el.value).getPropertyValue(prop)
  })

  watch(
    varRef,
    (val) => {
      el.value && el.value.style && el.value.style.setProperty(prop, val)
    },
  )

  return varRef
}
