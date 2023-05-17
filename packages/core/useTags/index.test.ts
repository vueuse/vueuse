import { describe, expect, it } from 'vitest'
import { useTags } from '.'

interface IObjectTag {
  name: string
  value: string
}

const tag = 'Tag'

const objectTag: IObjectTag = { name: 'Joe', value: '13' }

const objectTags: IObjectTag[] = [
  { name: 'Joe', value: '13' },
  { name: 'Mushi', value: '13' },
  { name: 'Shin', value: '23' },
]

describe('it works', () => {
  it('works', () => {
    const { toggleTag, clearTags, tags, isTagInTags } = useTags()

    expect(tags.value.length)

    toggleTag(tag)

    expect(tags.value.length).toEqual(1)

    expect(isTagInTags(tag)).toEqual(true)

    clearTags()

    expect(tags.value.length).toEqual(0)
  })

  it('works with objects', () => {
    const { toggleTag, clearTags, tags, isTagInTags } = useTags()

    toggleTag(objectTag)

    expect(tags.value.length).toEqual(1)

    expect(isTagInTags(objectTag)).toEqual(true)

    clearTags()

    expect(tags.value.length).toEqual(0)
  })

  it('works with initial tags', () => {
    const { toggleTag, clearTags, tags, isTagInTags } = useTags(objectTags)

    expect(tags.value.length).toEqual(3)

    objectTags.forEach(t => expect(isTagInTags(t)))

    toggleTag(objectTags[0])

    expect(tags.value.length).toEqual(2)

    expect(tags.value.some(t => t.name === objectTags[0].name)).toEqual(false)

    clearTags()

    expect(tags.value.length).toEqual(0)
  })

  it('works with access property', () => {
    const { toggleTag, tags } = useTags(objectTags, 'value')

    expect(tags.value.length).toEqual(3)

    toggleTag(objectTags[0])

    expect(tags.value.length).toEqual(1)

    expect(tags.value.some(t => t.value === '13')).toBe(false)
  })
})
