## When to use

> useReducer lets you optimize performance for components that trigger deep updates because you can pass dispatch down instead of callbacks.

## Advanced Example
```jsx
// Initial State
const initialState = {
  loading: false,
  data: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'loadData':
      state.error = undefined
      state.loading = true
      return fetch()
        .then(data => (state.data = data))
        .catch(e => (state.error = e))
        .finally(() => (state.loading = false))
    case 'addItem':
      state.data.push(action.payload)
      return
    case 'removeItem':
      state.data = state.data.filter((ele: number) => ele !== action.payload)
  }
}

// ComplexDemo.vue
export const ComplexDemo = defineComponent({
  setup() {
    const { state, dispatch } = useReducer(reducer, initialState)
    provide('dispatch', dispatch)
    dispatch({ type: 'loadData' })

    return {
      state,
    }
  },
  render(this: Vue & { state: ComplexState }) {
    return (
      <div class="demo">
        {this.state.loading ? (
          'Loading'
        ) : this.state.error ? (
          <ErrorUi message={this.state.error.message} />
        ) : (
          <DataUi data={this.state.data} />
        )}
      </div>
    )
  },
})

// ErrorUi.vue
const ErrorUi = defineComponent({
  props: {
    message: String,
  },
  setup() {
    const dispatch = inject<Function>('dispatch', () => {})
    const triggerReload = () => dispatch({ type: 'loadData' })

    return { triggerReload }
  },

  render(this: Vue & { triggerReload: () => void }) {
    return (
      <div>
        {this.$props.message}
        <button onClick={() => this.triggerReload()}>Reload</button>
      </div>
    )
  },
})

// DataUi.vue
const DataUi = defineComponent({
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  render(this: Vue) {
    return (
      <ul>
        {this.$props.data.map((ele: number) => (
          <ListItem id={ele} />
        ))}
        <AddListItem />
      </ul>
    )
  },
})
// ListItem.vue
const ListItem = defineComponent({
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup({ id }) {
    const dispatch = inject<Function>('dispatch', () => {})
    const removeListItem = () => {
      dispatch({ type: 'removeItem', payload: id })
    }
    return { removeListItem }
  },
  render(this: Vue & { removeListItem: Function }) {
    return (
      <li>
        {this.$props.id}
        <button onClick={() => this.removeListItem()}>Remove Item</button>
      </li>
    )
  },
})

// AddListItem.vue
const AddListItem = defineComponent({
  setup() {
    const dispatch = inject<Function>('dispatch', () => {})
    const addListItem = (id: number) => {
      dispatch({ type: 'addItem', payload: id })
    }
    return { addListItem }
  },
  render(this: Vue & { addListItem: Function }) {
    return (
      <li>
        <button
          onClick={() => this.addListItem(Math.floor(Math.random() * 10000))}
        >
          Add List Item
        </button>
      </li>
    )
  },
})

```
