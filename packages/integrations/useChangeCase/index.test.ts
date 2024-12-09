import type { Options } from 'change-case'
import type { ChangeCaseType } from '.'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useChangeCase } from '.'

describe('useChangeCase', () => {
  interface objectValue {
    helloWorld: string
    vueuse: string
    delimiterHelloWorld: string
    delimiterVueuse: string
  }
  type ObjectTypes = Omit<Record<ChangeCaseType, objectValue>, 'camelCase'>
  const helloWorld = 'helloWorld'
  const vueuse = 'vue use'
  const obj: ObjectTypes = {
    capitalCase: {
      helloWorld: 'Hello World',
      vueuse: 'Vue Use',
      delimiterHelloWorld: 'Hello-World',
      delimiterVueuse: 'Vue-Use',
    },
    constantCase: {
      helloWorld: 'HELLO_WORLD',
      vueuse: 'VUE_USE',
      delimiterHelloWorld: 'HELLO-WORLD',
      delimiterVueuse: 'VUE-USE',
    },
    dotCase: {
      helloWorld: 'hello.world',
      vueuse: 'vue.use',
      delimiterHelloWorld: 'hello-world',
      delimiterVueuse: 'vue-use',
    },
    trainCase: {
      helloWorld: 'Hello-World',
      vueuse: 'Vue-Use',
      delimiterHelloWorld: 'Hello-World',
      delimiterVueuse: 'Vue-Use',
    },
    noCase: {
      helloWorld: 'hello world',
      vueuse: 'vue use',
      delimiterHelloWorld: 'hello-world',
      delimiterVueuse: 'vue-use',
    },
    kebabCase: {
      helloWorld: 'hello-world',
      vueuse: 'vue-use',
      delimiterHelloWorld: 'hello-world',
      delimiterVueuse: 'vue-use',
    },
    pascalCase: {
      helloWorld: 'HelloWorld',
      vueuse: 'VueUse',
      delimiterHelloWorld: 'Hello-World',
      delimiterVueuse: 'Vue-Use',
    },
    pascalSnakeCase: {
      helloWorld: 'Hello_World',
      vueuse: 'Vue_Use',
      delimiterHelloWorld: 'Hello-World',
      delimiterVueuse: 'Vue-Use',
    },
    pathCase: {
      helloWorld: 'hello/world',
      vueuse: 'vue/use',
      delimiterHelloWorld: 'hello-world',
      delimiterVueuse: 'vue-use',
    },
    sentenceCase: {
      helloWorld: 'Hello world',
      vueuse: 'Vue use',
      delimiterHelloWorld: 'Hello-world',
      delimiterVueuse: 'Vue-use',
    },
    snakeCase: {
      helloWorld: 'hello_world',
      vueuse: 'vue_use',
      delimiterHelloWorld: 'hello-world',
      delimiterVueuse: 'vue-use',
    },
  };

  (Object.keys(obj) as Array<keyof ObjectTypes>).forEach((key) => {
    it(`base ${key}`, () => {
      const changeCase = useChangeCase(helloWorld, key)
      expect(changeCase.value).toBe(obj[key].helloWorld)
      changeCase.value = vueuse
      expect(changeCase.value).toBe(obj[key].vueuse)
    })

    it(`ref ${key}`, () => {
      const input = ref(helloWorld)
      const changeCase = useChangeCase(input, key)
      expect(changeCase.value).toBe(obj[key].helloWorld)
      changeCase.value = vueuse
      expect(changeCase.value).toBe(obj[key].vueuse)
    })

    it(`options ${key}`, () => {
      const options: Options = {
        delimiter: '-',
      }
      const changeCase = useChangeCase(helloWorld, key, options)
      expect(changeCase.value).toBe(obj[key].delimiterHelloWorld)
      changeCase.value = vueuse
      expect(changeCase.value).toBe(obj[key].delimiterVueuse)
    })

    it(`function ${key}`, () => {
      const input = () => helloWorld
      const changeCase = useChangeCase(input, key)
      expect(changeCase.value).toBe(obj[key].helloWorld)
    })
  })
})
