import { defineComponent, ref } from 'vue-demi'
import { onClickOutside } from '.'
import { defineDemo, html, jointWindow } from '../../_docs'

const styles = {
  wrapper: {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '420px',
    maxWidth: '100%',
  },
  inner: {
    backgroundColor: '#4d4d4d',
    padding: '1.2em',
  },
  dropdown_inner: {
    backgroundColor: '#4d4d4d',
    padding: '1.2em',
    position: 'absolute',
    left: '0',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginBottom: '1rem',
  },
  button: {
    position: 'absolute',
    top: '-1rem',
    right: '-1rem',
    fontWeight: 'bold',
  },
}

defineDemo(
  {
    name: 'onClickOutside',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const modal = ref(false)
      const modalRef = ref(null)

      onClickOutside(
        modalRef,
        (event) => {
          console.log(event)
          modal.value = false
        },
        { window: jointWindow },
      )

      const dropdown = ref(false)
      const dropdownRef = ref(null)

      onClickOutside(
        dropdownRef,
        (event) => {
          console.log(event)
          dropdown.value = false
        },
        { window: jointWindow },
      )

      return {
        ...styles,
        modal,
        modalRef,
        dropdown,
        dropdownRef,
      }
    },

    template: html`
      <div>
        <button @click="modal = true">Open Modal</button>
        <div class="relative" style="display: inline-block">
          <button @click="dropdown = true">
            Open Dropdown
          </button>
          <div v-if="dropdown" :style="dropdown_inner" ref="dropdownRef">
            Click outside of the dropdown to close it.
          </div>
        </div>
        <div v-if="modal" ref="modalRef" :style="wrapper">
          <div :style="inner">
            <button @click="modal = false" :style="button" title="Close modal">X</button>
            <p :style="heading">Demo Modal</p>
            <p>Click outside of the modal to close it.</p>
          </div>
        </div>
      </div>
    `,
  }),
)
