import { useDialog } from '@vueuse/core'

/**
 * Creates a composable for a custom dialog.
 */
export function makeDialogComposable<
 Properties = any,
 Result = Properties,
>() {
  return () => useDialog<Properties, Result>()
}
