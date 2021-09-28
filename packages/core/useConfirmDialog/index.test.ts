import { ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { useConfirmDialog } from '.'

describe('useConfirmDialog', () => {
  it('should be defined', () => {
    expect(useConfirmDialog).toBeDefined()
  })

  it('should open the dialog and close on confirm', () => {
    useSetup(() => {
      const show = ref(false)

      const {
        showDialog,
        confirm,
      } = useConfirmDialog(show)

      showDialog()
      expect(show.value).toBe(true)

      confirm()
      expect(show.value).toBe(false)
    })
  })
  it('should close on cancel', () => {
    useSetup(() => {
      const show = ref(false)

      const {
        showDialog,
        cancel,
      } = useConfirmDialog(show)

      showDialog()
      expect(show.value).toBe(true)

      cancel()
      expect(show.value).toBe(false)
    })
  })
  it('should execute a callback inside `onConfirm` hook only after confirming', () => {
    useSetup(() => {
      const show = ref(false)
      const message = ref('initial')

      const {
        showDialog,
        confirm,
        onConfirm,
      } = useConfirmDialog(show)

      onConfirm(() => {
        message.value = 'final'
      })
      expect(message.value).toBe('initial')

      showDialog()
      expect(message.value).toBe('initial')
      confirm()
      expect(message.value).toBe('final')
    })
  })

  it('should execute a callback inside `onCancel` hook only after canceling dialog', () => {
    useSetup(() => {
      const show = ref(false)
      const message = ref('initial')

      const {
        showDialog,
        cancel,
        onCancel,
      } = useConfirmDialog(show)

      onCancel(() => {
        message.value = 'final'
      })
      expect(message.value).toBe('initial')

      showDialog()
      expect(message.value).toBe('initial')
      cancel()
      expect(message.value).toBe('final')
    })
  })
})
