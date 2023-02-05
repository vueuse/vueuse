import { ref, unref, watchEffect } from 'vue-demi'
import { get } from '@vueuse/core'

/**
 * Simple object clone
 */
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Make a ref to copy of given field of the given object that gets updated when
 * the original object's property gets changed.
 * This is used in editor components where the local copy of a value is needed
 * so that the editor can decide when the value gets updated (or never if the user
 * cancels the edit)
 *
 * @param obj object to get the value from (usually "props")
 * @param name name of the field to use
 * @param defaultValue default value in case the field was undefined
 */
export const editorRef = <T extends object, K extends keyof T>(
  obj: T,
  name: K,
  defaultValue?: T[K],
) => {
  const data = ref<T[K]>()

  watchEffect(() => {
    data.value = clone(unref(get(obj, name)) ?? unref(defaultValue))
  })

  return data
}
