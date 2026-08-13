import { describe, expect, it, vi } from 'vitest'
import { buildKeybindTree, createDefaultNormalizeCombinedKeyCode } from './internal'

describe('useKeybinds - internal functions', () => {
  describe('normalizeCombinedKeyCode', () => {
    it('should keep modifiers intact for MacOS', () => {
      const normalizeCombinedKeyCode = createDefaultNormalizeCombinedKeyCode({ macOS: true })

      expect(normalizeCombinedKeyCode('alt_ctrl_meta_shift_KeyA')).toEqual('alt_ctrl_meta_shift_KeyA')
    })

    it('should update meta modifier for other OS', () => {
      const normalizeCombinedKeyCode = createDefaultNormalizeCombinedKeyCode({ macOS: false })

      expect(normalizeCombinedKeyCode('alt_meta_shift_KeyA')).toEqual('alt_ctrl_shift_KeyA')
    })
  })

  describe('buildKeybindTree', () => {
    it('should build one node tree', () => {
      const handler = vi.fn()

      const tree = buildKeybindTree({
        x: handler,
      })

      expect(tree).toStrictEqual({
        x: { handler },
      })
    })

    it('should assign handlers correctly', () => {
      const handlerX = vi.fn()
      const handlerY = vi.fn()
      const handlerZ = vi.fn()

      const tree = buildKeybindTree({
        x: handlerX,
        y: handlerY,
        z: handlerZ,
      })

      expect(tree).toStrictEqual({
        x: { handler: handlerX },
        y: { handler: handlerY },
        z: { handler: handlerZ },
      })
    })

    it('should build a deep tree for key sequence', () => {
      const handler = vi.fn()

      const tree = buildKeybindTree({
        'a-s-d-f-g-h': handler,
      })

      expect(tree).toStrictEqual({
        a: {
          next: {
            s: {
              next: {
                d: {
                  next: {
                    f: {
                      next: {
                        g: {
                          next: {
                            h: { handler },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })
    })

    it('should build a deep tree with combined keys', () => {
      const handler = vi.fn()

      const tree = buildKeybindTree({
        'meta_a-alt_f-ctrl_g-shift_h': handler,
      })

      expect(tree).toStrictEqual({
        meta_a: {
          next: {
            alt_f: {
              next: {
                ctrl_g: {
                  next: {
                    shift_h: { handler },
                  },
                },
              },
            },
          },
        },
      })
    })

    it('should build a deep tree with common prefixes', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const handler3 = vi.fn()

      const tree = buildKeybindTree({
        'a-s-d-f-g-h': handler1,
        'a-s-d': handler2,
        'a-s-d-f-x': handler3,
      })

      expect(tree).toStrictEqual({
        a: {
          next: {
            s: {
              next: {
                d: {
                  handler: handler2,
                  next: {
                    f: {
                      next: {
                        g: {
                          next: {
                            h: { handler: handler1 },
                          },
                        },
                        x: { handler: handler3 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })
    })

    it('should build a tree for different combinations of sequence keys and combined keys', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const handler3 = vi.fn()
      const handler4 = vi.fn()
      const handler5 = vi.fn()

      const tree = buildKeybindTree({
        'meta_a-alt_f-ctrl_g-shift_g': handler1,
        'meta_a-alt_f-ctrl_g-shift_h': handler2,
        'a-alt_ctrl_meta_shift_o': handler3,
        'a-o': handler4,
        'b': handler5,
      })

      expect(tree).toStrictEqual({
        a: {
          next: {
            alt_ctrl_meta_shift_o: { handler: handler3 },
            o: { handler: handler4 },
          },
        },
        b: { handler: handler5 },
        meta_a: {
          next: {
            alt_f: {
              next: {
                ctrl_g: {
                  next: {
                    shift_g: { handler: handler1 },
                    shift_h: { handler: handler2 },
                  },
                },
              },
            },
          },
        },
      })
    })
  })
})
