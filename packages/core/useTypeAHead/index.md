---
category: Utilities
---

# useTypeAHead

Simulate the implementation of the `'TypeAHead'` feature in the native UI and native < Select > elements. 
If you want to write a component with the `'TypeAHead'` feature yourself, 
you can use `'useTypeAHead'` to obtain the focus index after keyboard interaction

## Usage

You can initialize `useTypeAHead` by passing in a text list and the corresponding text field key name.
It will return an object of `useTypeAHead`,
and then you can call the method `match` on the `useTypeAHead` object in the Keydown event. 
The method `match` returns a `"matching function"`. At this point, 
you only need to pass `KeyboardEvent` to this function `"matching function"`, 
so that you can get the matched index.

```js
const AppTest1 = defineComponent({
  setup() {
    const testList = ref([
      { label: 'Amy', id: 'Amy' },
      { label: 'Ascy', id: 'Ascy' },
      { label: 'Acy', id: 'Acy' },
      { label: 'Aty', id: 'Aty' },
      { label: 'A s', id: 'Al' },
      { label: 'Acys', id: 'Acy' },
      { label: 'vl', id: 'Alqw' },
      { label: 'cmy', id: 'A2my' },
      { label: 'ccy', id: 'Acqwey' },
      { label: 'vscy', id: 'Asrcy' },
      { label: 'bty', id: 'Aqwty' },
      { label: 'bl', id: 'Aasdl' },
      { label: 'Acasy', id: 'wdcy' },
    ])
    const typeAHead = useTypeAHead(testList, 'label')
    const activeIndex = ref < number > (-1)
    const handleKeyDown = (e: KeyboardEvent) => {
      activeIndex.value = typeAHead.match()(e)
    }

    return {
      activeIndex,
      handleKeyDown,
    }
  },
  template: `
        {{activeIndex}}
        <input @keydown="(e)=>handleKeyDown(e)" data-test="element"/>
  `,
})
```

## Disabled and Skip

You can ignore the matching item by setting `__th_disabled` or `__th_skip` in the item in the text list

```js
const AppTest1 = defineComponent({
  setup() {
    const testList = ref([
      { label: 'Amy', id: 'Amy', __th_disabled: true },
      { label: 'Ascy', id: 'Ascy' },
      { label: 'Acy', id: 'Acy', __th_skip: true },
      { label: 'Aty', id: 'Aty' },
      { label: 'A s', id: 'Al' },
      { label: 'Acys', id: 'Acy' },
      { label: 'vl', id: 'Alqw' },
      { label: 'cmy', id: 'A2my' },
      { label: 'ccy', id: 'Acqwey' },
      { label: 'vscy', id: 'Asrcy' },
      { label: 'bty', id: 'Aqwty' },
      { label: 'bl', id: 'Aasdl' },
      { label: 'Acasy', id: 'wdcy', __th_skip: true },
    ])
    const typeAHead = useTypeAHead(testList, 'label')
    const activeIndex = ref < number > (-1)
    const handleKeyDown = (e: KeyboardEvent) => {
      activeIndex.value = typeAHead.match()(e)
    }

    return {
      activeIndex,
      handleKeyDown,
    }
  },
  template: `
        {{activeIndex}}
        <input @keydown="(e)=>handleKeyDown(e)" data-test="element"/>
  `,
})
