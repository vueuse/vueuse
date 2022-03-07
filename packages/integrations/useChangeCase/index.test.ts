import type { Options } from 'change-case'
import { ref } from 'vue-demi'
import type { ChangeCaseType } from '.'
import { useChangeCase } from '.'
describe('useChangeCase', () => {
  interface objectValue {
    helloWorld: string
    vueuse: string
  }
  type ObjectTypes = Omit<Record<ChangeCaseType, objectValue>, 'camelCase'>
  const helloWorld = 'helloWorld'
  const vueuse = 'vue use'
  test('base', () => {
    const obj: ObjectTypes = {
      capitalCase: {
        helloWorld: 'Hello World',
        vueuse: 'Vue Use',
      },
      constantCase: {
        helloWorld: 'HELLO_WORLD',
        vueuse: 'VUE_USE',
      },
      dotCase: {
        helloWorld: 'hello.world',
        vueuse: 'vue.use',
      },
      headerCase: {
        helloWorld: 'Hello-World',
        vueuse: 'Vue-Use',
      },
      noCase: {
        helloWorld: 'hello world',
        vueuse: 'vue use',
      },
      paramCase: {
        helloWorld: 'hello-world',
        vueuse: 'vue-use',
      },
      pascalCase: {
        helloWorld: 'HelloWorld',
        vueuse: 'VueUse',
      },
      pathCase: {
        helloWorld: 'hello/world',
        vueuse: 'vue/use',
      },
      sentenceCase: {
        helloWorld: 'Hello world',
        vueuse: 'Vue use',
      },
      snakeCase: {
        helloWorld: 'hello_world',
        vueuse: 'vue_use',
      },
    }
    const arr = Object.keys(obj) as Array<keyof ObjectTypes>
    arr.forEach((key) => {
      const changeCase = useChangeCase(helloWorld, key)
      expect(changeCase.value).toBe(obj[key].helloWorld)
      changeCase.value = vueuse
      expect(changeCase.value).toBe(obj[key].vueuse)
    })
  })
  test('ref', () => {
    const input = ref(helloWorld)
    const changeCase = useChangeCase(input, 'camelCase')
    expect(changeCase.value).toBe('helloWorld')
    input.value = vueuse
    expect(changeCase.value).toBe('vueUse')
  })
  test('options', () => {
    const options: Options = {
      delimiter: '-',
    }
    const changeCase = useChangeCase(helloWorld, 'camelCase', options)
    expect(changeCase.value).toBe('hello-World')
    changeCase.value = vueuse
    expect(changeCase.value).toBe('vue-Use')
  })
})
