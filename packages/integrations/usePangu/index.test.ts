import { usePangu } from '.'

describe('usePangu', () => {
  it('should be defined', () => {
    expect(usePangu).toBeDefined()
  })

  it('should pass', () => {
    const str1 = usePangu('当你凝视bug时，bug也在凝视你')
    const str2 = usePangu('hello world')
    const str3 = usePangu('你好')

    expect(str1.value).toBe('当你凝视 bug 时，bug 也在凝视你')
    expect(str2.value).toBe('hello world')
    expect(str3.value).toBe('你好')
  })
})
