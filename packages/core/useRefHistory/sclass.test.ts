import { nextTick, ref } from 'vue-demi'
import { klona } from 'klona'
import { useRefHistory } from '.'

class Dum {
  x = 0

  constructor() {
    this.x = Math.random()
  }

  sayHi() {
    console.log('hello world:', this.x)
  }
}

const dum = ref(new Dum())
const { undo, redo, canUndo } = useRefHistory(dum, {
  deep: true,
  flush: 'sync',
  clone: structuredClone,
})

describe('useRefHistory - sync', () => {
  test('sync: should record', () => {
    const tt = new Dum()
    console.log(tt)

    console.log('1', dum.value.x)
    console.log('1:1')
    dum.value.sayHi()

    dum.value = new Dum()
    console.log('2', dum.value.x)
    dum.value = new Dum()
    console.log('3', dum.value.x)
    dum.value = new Dum()
    console.log('4', dum.value.x)
    console.log('4:1')
    dum.value.sayHi()
    console.log(Object.keys(dum.value))

    console.log('canUndo', canUndo.value)
    undo()
    console.log('5', dum.value.x)
    console.log('5:1')
    dum.value.sayHi()
    redo()
    console.log('6', dum.value.x)
    // here
  })
})

