import { ref } from 'vue-demi'
import type { Ref } from 'vue-demi'

type TPrimitive = number | string | boolean | null | undefined
type TKey = string | symbol | number

export function useTags<T extends string | Record<U, TPrimitive>, U extends keyof T = keyof T>(initialTags?: T[], accessProperty?: U) {
  const tags = ref<T[]>(initialTags ?? []) as Ref<T[]>

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

  function toggleTag(tag: T) {
    isTagInTags(tag) ? removeTag(tag) : tags.value.push(tag)
  }

  function clearTags() {
    tags.value = []
  }

  return { tags, toggleTag, isTagInTags, clearTags }
}

function isObject(value: unknown): value is Record<TKey, TPrimitive> {
  return typeof value === 'object'
}
