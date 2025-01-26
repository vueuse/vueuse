import type { Ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { usePreload } from '.'

describe('usePreload', () => {
  let mockHead: Ref<HTMLHeadElement>

  beforeEach(() => {
    mockHead = ref(document.createElement('head'))
    vi.spyOn(document, 'head', 'get').mockImplementation(() => mockHead.value)
  })

  it('should create a basic preload link', () => {
    const url = 'https://example.com/style.css'
    usePreload(url)

    const link = mockHead.value.querySelector('link')
    expect(link).toBeTruthy()
    expect(link?.rel).toBe('preload')
    expect(link?.href).toBe(url)
  })

  it('should not create duplicate links if one already exists', () => {
    const url = 'https://example.com/style.css'
    usePreload(url)
    usePreload(url)

    const links = mockHead.value.querySelectorAll('link')
    expect(links.length).toBe(1)
  })

  it('should set optional attributes correctly', () => {
    const url = 'https://example.com/style.css'
    usePreload(url, {
      as: 'style',
      crossOrigin: 'anonymous',
      media: 'print',
    })

    const link = mockHead.value.querySelector('link')
    expect(link?.getAttribute('as')).toBe('style')
    expect(link?.crossOrigin).toBe('anonymous')
    expect(link?.media).toBe('print')
  })

  it('should handle different types of resources', () => {
    const urls = [
      'https://example.com/image.png',
      'https://example.com/script.js',
      'https://example.com/font.woff2',
    ]

    urls.forEach((url, index) => {
      usePreload(url, {
        as: ['image', 'script', 'font'][index] as 'image' | 'script' | 'font',
      })
    })

    const links = mockHead.value.querySelectorAll('link')
    expect(links.length).toBe(3)
    expect(links[0].getAttribute('as')).toBe('image')
    expect(links[1].getAttribute('as')).toBe('script')
    expect(links[2].getAttribute('as')).toBe('font')
  })
})
