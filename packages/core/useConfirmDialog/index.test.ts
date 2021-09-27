import { ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { useConfirmDialog } from '.'

describe('useCounter', () => {
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
})
