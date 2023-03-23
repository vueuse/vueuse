import type { Rules } from 'async-validator'
import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { useAsyncValidator } from '.'

describe('useAsyncValidator', () => {
  let form: {
    name: string
    age: number
  }

  beforeEach(() => {
    form = {
      name: 'jelf',
      age: 24,
    }
  })

  it('should be defined', () => {
    expect(useAsyncValidator).toBeDefined()
  })

  it('should pass', () => {
    const rules: Rules = {
      name: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    }
    const { pass, errors, isFinished, then } = useAsyncValidator(form, rules)
    then(() => {
      expect(isFinished.value).toBe(true)
      expect(pass.value).toBe(true)
      expect(errors.value).toMatchObject([])
    })
  })

  it('should async', async () => {
    const rules: Rules = {
      name: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    }
    const { pass, errors, isFinished, then } = useAsyncValidator(form, rules)
    expect(isFinished.value).toBe(false)
    expect(pass.value).toBe(false)
    expect(errors.value).toMatchObject([])

    then(() => {
      expect(isFinished.value).toBe(true)
      expect(pass.value).toBe(true)
      expect(errors.value).toMatchObject([])
    })
  })

  it('immediate should can be work', async () => {
    const rules: Rules = {
      name: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    }
    const { pass, errors, isFinished, then } = useAsyncValidator(form, rules, { immediate: false })
    expect(isFinished.value).toBe(true)
    expect(pass.value).toBe(true)
    expect(errors.value).toMatchObject([])

    then(() => {
      expect(isFinished.value).toBe(true)
      expect(pass.value).toBe(true)
      expect(errors.value).toMatchObject([])
    })
  })

  it('execute should can be work', async () => {
    const rules: Rules = {
      name: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    }
    const { isFinished, execute } = useAsyncValidator(form, rules, { immediate: false })
    const { pass, errors } = await execute()

    expect(isFinished.value).toBe(true)
    expect(pass).toBe(true)
    expect(errors).toMatchObject([])
  })

  it('should can be await', async () => {
    const rules: Rules = {
      name: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    }
    const { pass, errors, isFinished } = await useAsyncValidator(form, rules)
    expect(isFinished.value).toBe(true)
    expect(pass.value).toBe(true)
    expect(errors.value).toMatchObject([])
  })

  it('should fail to validate', async () => {
    const rules: Rules = {
      name: {
        type: 'string',
        min: 5,
        max: 20,
        message: 'name length must be 5-20',
      },
      age: {
        type: 'number',
      },
    }
    const { pass, errors, isFinished } = await useAsyncValidator(form, rules, {
      validateOption: {
        suppressWarning: true,
      },
    })
    expect(isFinished.value).toBe(true)
    expect(pass.value).toBe(false)
    expect(errors.value).toMatchInlineSnapshot(`
      [
        {
          "field": "name",
          "fieldValue": "jelf",
          "message": "name length must be 5-20",
        },
      ]
    `)
  })

  it('should fail to validate when use execute', async () => {
    const rules: Rules = {
      name: {
        type: 'string',
        min: 5,
        max: 20,
        message: 'name length must be 5-20',
      },
      age: {
        type: 'number',
      },
    }

    const { execute } = useAsyncValidator(form, rules, {
      validateOption: {
        suppressWarning: true,
      },
      immediate: false,
    })

    const { pass, errors } = await execute()

    expect(pass).toBe(false)
    expect(errors).toMatchInlineSnapshot(`
      [
        {
          "field": "name",
          "fieldValue": "jelf",
          "message": "name length must be 5-20",
        },
      ]
    `)
  })

  it('should reactive', async () => {
    const form = ref({
      name: 'jelf',
      age: 24,
    })

    const rules = ref({
      name: {
        type: 'string',
        min: 5,
        max: 20,
        message: 'name length must be 5-20',
      },
      age: {
        type: 'number',
      },
    }) as Ref<Rules>

    const { pass, errors, isFinished } = await useAsyncValidator(form, rules, {
      validateOption: {
        suppressWarning: true,
      },
    })
    expect(isFinished.value).toBe(true)
    expect(pass.value).toBe(false)
    expect(errors.value).toMatchInlineSnapshot(`
      [
        {
          "field": "name",
          "fieldValue": "jelf",
          "message": "name length must be 5-20",
        },
      ]
    `)

    form.value.name = 'okxiaoliang4'
  })
})
