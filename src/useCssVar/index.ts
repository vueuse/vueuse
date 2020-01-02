import { onMounted } from '@vue/composition-api'
import { ref, Ref, watch, computed } from '../api'

export function useCssVar (
  prop: string,
  refEl?: Ref<HTMLElement | null>,
) {
  const varRef = ref('')
  const el = computed(() => refEl?.value || document.documentElement)

  onMounted(() => {
    varRef.value = getComputedStyle(el.value).getPropertyValue(prop)
  })

  watch(
    varRef,
    (val) => {
      el.value && el.value.style.setProperty(prop, val)
    },
    { lazy: true },
  )

  return varRef
}
