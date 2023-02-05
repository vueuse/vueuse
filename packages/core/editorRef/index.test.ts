import { reactive } from 'vue-demi'
import { editorRef } from '.'

describe('createUnrefFn', () => {
  it('should be defined', () => {
    expect(editorRef).toBeDefined()
  })

  it('should have the original prop value by default', () => {
    const props = reactive({ x: 1, y: 2 })
    const editor = editorRef(props, 'x')
    expect(editor.value).toBe(props.x)
  })

  it('should not change the original prop value', () => {
    const props = reactive({ x: 1, y: 2 })
    const editor = editorRef(props, 'x')
    editor.value = 123
    expect(props.x).toBe(1)
    expect(editor.value).toBe(123)
  })

  it('should change the value if the original prop value changes', () => {
    const props = reactive({ x: 1, y: 2 })
    const editor = editorRef(props, 'x')
    editor.value = 123
    props.x = 321
    expect(props.x).toBe(321)
    expect(editor.value).toBe(321)
  })
})
