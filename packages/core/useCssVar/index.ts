import { ref, Ref, watch, computed } from 'vue-demi'
import { tryOnMounted } from '../utils'

export function useCssVar(
  prop: string,
  refEl?: Ref<Element | null>,
) {
  const varRef = ref('')
  const el = computed(() => refEl?.value || document.documentElement)

  tryOnMounted(() => {
    // @ts-ignore
    varRef.value = getComputedStyle(el.value).getPropertyValue(prop)
  })

  watch(
    varRef,
    (val) => {
      // @ts-ignore
      el.value && el.value.style && el.value.style.setProperty(prop, val)
    },
  )

  return varRef
}
