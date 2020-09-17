# useMutationObserver

> Watch for changes being made to the DOM tree

## Usage

```tsx
import { ref } from '@vue/composition-api';
import { useMutationObserver } from '@vueuse/core'

export default {
  setup() {
    const el = ref(null)
    const messages = ref([])
    const className = ref({})
    const style = ref({})

    useMutationObserver(el, (mutations) => {
      const mutation = mutations[0]
      if (!mutation) return;

      messages.value.push(mutation.attributeName)
    }, {
      attributes: true,
    })

    onMounted(() => {
      setTimeout(() => {
        className.value = {
          'test': true,
          'test2': true,
        }
      }, 1000)
      setTimeout(() => {
        style.value = {
          backgroundColor: 'red',
        }
      }, 1500);
    })

    return {
      el,
      messages,
      className,
      style,
    }
  },
  render() {
    const {
      messages,
      className,
      style,
    } = this

    return (
      <div ref="el" class={className} style={style}>
        {
          messages.map((text) => (
            <div>Mutation Attribute: {text}</div>
          ))
        }
      </div>
    )
  }
}
```

[MutationObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
