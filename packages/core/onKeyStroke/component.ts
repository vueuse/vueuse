import { defineComponent } from 'vue-demi'
import { onKeyStroke, onKeyPressed, onKeyDown, onKeyUp, KeyStrokeOptions, KeyFilter } from '.'

export const OnKeyStroke = defineComponent<{ key: KeyFilter; options?: KeyStrokeOptions }>({
  name: 'OnKeyStroke',
  setup(props, { slots, emit }) {
    onKeyStroke(props.key, e => emit('trigger', e), props.options)

    return () => {
      if (slots.default)
        return slots.default()
    }
  },
})

export const OnKeyPressed = defineComponent<{ key: KeyFilter; options?: KeyStrokeOptions }>({
  name: 'OnKeyPressed',
  setup(props, { slots, emit }) {
    onKeyPressed(props.key, e => emit('trigger', e), props.options)

    return () => {
      if (slots.default)
        return slots.default()
    }
  },
})

export const OnKeyDown = defineComponent<{ key: KeyFilter; options?: KeyStrokeOptions }>({
  name: 'OnKeyDown',
  setup(props, { slots, emit }) {
    onKeyDown(props.key, e => emit('trigger', e), props.options)

    return () => {
      if (slots.default)
        return slots.default()
    }
  },
})

export const OnKeyUp = defineComponent<{ key: KeyFilter; options?: KeyStrokeOptions }>({
  name: 'OnKeyUp',
  setup(props, { slots, emit }) {
    onKeyUp(props.key, e => emit('trigger', e), props.options)

    return () => {
      if (slots.default)
        return slots.default()
    }
  },
})
