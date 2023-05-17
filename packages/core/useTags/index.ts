import { computed, ref } from 'vue-demi'
import type { Ref } from 'vue-demi'

type TPrimitive = number | string | boolean | null | undefined
type TKey = string | symbol | number

export function useTags<T extends string | Record<U, TPrimitive>, U extends keyof T = keyof T>(initialTags?: T[], accessProperty?: U) {
  const tags = ref<T[]>(initialTags ?? []) as Ref<T[]>

  /**
   * Compares two tags
   * @param obj_one Tag one
   * @param obj_two Tag two
   * @returns boolean of comparison between two tags
   */
  function compareObjects(obj_one: T, obj_two: T) {
    if (typeof obj_one === 'string' || typeof obj_two === 'string')
      return
    if (accessProperty) {
      return obj_one[accessProperty] === obj_two[accessProperty]
    }
    else {
      const [keys_one, keys_two] = [Object.keys(obj_one), Object.keys(obj_two)]

      const intersectingKey = keys_one.find(k => keys_two.includes(k)) as
        | U
        | undefined

      if (!intersectingKey)
        return false

      return obj_one[intersectingKey] === obj_two[intersectingKey]
    }
  }

  /**
   * Check if tag is toggled
   * @param tag Tag itself
   * @returns true if tag is toggled is tags, false otherwise
   */
  function isTagInTags(tag: T) {
    const isobj = isObject(tag)
    if (isobj) {
      return tags.value.some((t) => {
        if (isObject(t))
          return compareObjects(t, tag)
        else return undefined
      })
    }
    else {
      return tags.value.includes(tag)
    }
  }

  /**
   * Removes tag
   * @param tag Tag itself
   */
  function removeTag(tag: T) {
    const isobj = isObject(tag)

    if (isobj) {
      tags.value = [
        ...tags.value.filter((t) => {
          if (isObject(t))
            return !compareObjects(t, tag)
          else return undefined
        }),
      ]
    }
    else {
      tags.value = tags.value.filter(t => t !== tag)
    }
  }

  /**
   * Toggles tag
   * @param tag Tag itself
   */
  function toggleTag(tag: T) {
    isTagInTags(tag) ? removeTag(tag) : tags.value.push(tag)
  }

  /**
   * Untoggles all tags
   */
  function clearTags() {
    tags.value = []
  }

  /**
   * Checks if there is no tags enabled
   */
  const isClear = computed<boolean>(() => tags.value.length === 0)

  return { tags, toggleTag, isTagInTags, clearTags, isClear }
}

function isObject(value: unknown): value is Record<TKey, TPrimitive> {
  return typeof value === 'object'
}
