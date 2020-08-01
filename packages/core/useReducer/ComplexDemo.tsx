import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { defineComponent, provide, inject } from 'vue-demi'
import { useReducer } from '.'

const initialState = {
  loading: false,
  data: [],
}

const fetchMock = () =>
  new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (Math.random() > 0.5) resolve([1, 2, 3, 4, 5])
      else reject(new Error('Request Error'))
    }, 1500)
  })

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'loadData':
      state.error = undefined
      state.loading = true
      return fetchMock()
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

const ErrorUi = defineComponent({
  props: {
    message: {
      type: String,
    },
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

const DataUi = defineComponent({
  props: {
    data: {
      type: Array,
      default: () => {},
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

const ListItem = defineComponent({
  props: {
    id: {
      type: Number,
    },
  },
  setup() {
    const dispatch = inject<Function>('dispatch', () => {})
    const removeListItem = (id: number) => {
      dispatch({ type: 'removeItem', payload: id })
    }
    return { removeListItem }
  },
  render(this: Vue & { removeListItem: Function }) {
    return (
      <li>
        {this.$props.id}
        <button
          onClick={() => this.removeListItem()}
        >
          Remove Item
        </button>
      </li>
    )
  },
})
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

export const ComplexDemo = defineComponent({
  setup() {
    const { state, dispatch } = useReducer(reducer, initialState)
    provide('dispatch', dispatch)
    dispatch({ type: 'loadData' })

    return {
      state,
    }
  },
  render(this: Vue & { state: any }) {
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
