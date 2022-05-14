import { nextTick, ref } from 'vue-demi'
import { useSetup } from '../../.test'
import { useForm } from '.'

describe('useForm', () => {
  it('should be defined', () => {
    expect(useForm).toBeDefined()
  })

  it('should work', async () => {
    const wrapper = useSetup(() => {
      const { form, status } = useForm({
        form: () => ({
          name: '',
          age: '',
        }),
        rule: {
          age: val => !isNaN(val) || 'expect numbers',
        },
      })
      return { form, status }
    })

    wrapper.form.age = 'abc'

    await nextTick()
    // age
    expect(wrapper.form.age).toBe('abc')
    expect(wrapper.status.age.isError).true
    expect(wrapper.status.age.message).toBe('expect numbers')
    // name
    expect(wrapper.form.name).toBe('')
    expect(wrapper.status.name.isError).false
    expect(wrapper.status.name.message).toBe('')

    wrapper.form.age = '18'

    await nextTick()
    // age
    expect(wrapper.form.age).toBe('18')
    expect(wrapper.status.age.isError).false
    expect(wrapper.status.age.message).toBe('')
    // name
    expect(wrapper.form.name).toBe('')
    expect(wrapper.status.name.isError).false
    expect(wrapper.status.name.message).toBe('')

    wrapper.unmount()
  })

  it('Rule validation starts working after the first value change', async () => {
    const wrapper = useSetup(() => {
      const { form, status } = useForm({
        form: () => ({
          name: '',
          age: '',
        }),
        rule: {
          age: val => !!val || 'required',
          name: val => !!val || 'required',
        },
      })
      return { form, status }
    })

    await nextTick()
    // age
    expect(wrapper.status.age.isError).false
    expect(wrapper.status.age.message).toBe('')
    // name
    expect(wrapper.status.name.isError).false
    expect(wrapper.status.name.message).toBe('')

    wrapper.form.age = '18'

    await nextTick()
    // age
    expect(wrapper.status.age.isError).false
    expect(wrapper.status.age.message).toBe('')
    // name
    expect(wrapper.status.name.isError).false
    expect(wrapper.status.name.message).toBe('')

    wrapper.form.age = ''

    await nextTick()
    // age
    expect(wrapper.status.age.isError).true
    expect(wrapper.status.age.message).toBe('required')
    // name
    expect(wrapper.status.name.isError).false
    expect(wrapper.status.name.message).toBe('')

    wrapper.unmount()
  })

  it('Responding to rule changes', async () => {
    const useI18n = () => {
      const local = ref('en')
      return {
        local,
        t: (key: string) => local.value === 'en' ? key : '必填',
      }
    }

    const wrapper = useSetup(() => {
      const { t, local } = useI18n()
      const { form, status } = useForm({
        form: () => ({
          age: '',
        }),
        rule: {
          age: val => !!val || t('required'),
        },
      })
      return { form, status, local }
    })

    await nextTick()
    expect(wrapper.status.age.isError).false
    expect(wrapper.status.age.message).toBe('')

    // Rule validation starts working after the first value change
    wrapper.local = 'zh-CN'

    await nextTick()
    expect(wrapper.status.age.isError).false
    expect(wrapper.status.age.message).toBe('')

    wrapper.form.age = '18'
    await nextTick()
    wrapper.form.age = ''

    await nextTick()
    expect(wrapper.status.age.isError).true
    expect(wrapper.status.age.message).toBe('必填')

    wrapper.local = 'en'

    await nextTick()
    expect(wrapper.status.age.isError).true
    expect(wrapper.status.age.message).toBe('required')

    wrapper.unmount()
  })

  it('Define multiple rules using an array', async () => {
    const wrapper = useSetup(() => {
      const { form, status } = useForm({
        form: () => ({
          age: '',
        }),
        rule: {
          age: [
            val => !!val || 'required',
            val => !isNaN(val) || 'expect numbers',
          ],
        },
      })
      return { form, status }
    })

    wrapper.form.age = 'abc'

    await nextTick()
    expect(wrapper.status.age.isError).true
    expect(wrapper.status.age.message).toBe('expect numbers')

    wrapper.form.age = ''

    await nextTick()
    expect(wrapper.status.age.isError).true
    expect(wrapper.status.age.message).toBe('required')

    wrapper.unmount()
  })

  it('Manually trigger validation and clearErrors', () => {
    const wrapper = useSetup(() => {
      const { form, status, clearErrors, verify } = useForm({
        form: () => ({
          age: '',
        }),
        rule: {
          age: val => !!val || 'required',
        },
      })
      return { form, status, clearErrors, verify }
    })

    wrapper.verify()

    expect(wrapper.status.age.isError).true
    expect(wrapper.status.age.message).toBe('required')

    wrapper.clearErrors()

    expect(wrapper.status.age.isError).false
    expect(wrapper.status.age.message).toBe('')

    wrapper.unmount()
  })

  it('reset the form', async () => {
    const wrapper = useSetup(() => {
      const { form, status, reset } = useForm({
        form: () => ({
          age: '',
          isAgree: true,
        }),
        rule: {
          isAgree: val => !!val || 'required',
          age: [
            val => !!val || 'required',
            val => !isNaN(val) || 'expect numbers',
          ],
        },
      })
      return { form, status, reset }
    })

    wrapper.form.isAgree = false
    wrapper.form.age = 'abc'

    await nextTick()
    expect(wrapper.status.isAgree.isError).true
    expect(wrapper.status.isAgree.message).toBe('required')
    expect(wrapper.status.age.isError).true
    expect(wrapper.status.age.message).toBe('expect numbers')

    wrapper.reset()

    await nextTick()
    expect(wrapper.form.isAgree).toBe(true)
    expect(wrapper.status.isAgree.isError).false
    expect(wrapper.status.isAgree.message).toBe('')
    expect(wrapper.form.age).toBe('')
    expect(wrapper.status.age.isError).false
    expect(wrapper.status.age.message).toBe('')

    wrapper.unmount()
  })
})
