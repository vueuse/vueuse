import { useCssSupports } from '@vueuse/core'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { computed, defineComponent, shallowRef } from 'vue'

const BasicComponent = defineComponent({
  template: `<pre data-testid="data">{{ serialized }}</pre>`,
  setup() {
    const { isSupported: textDecoration } = useCssSupports(
      'text-decoration-style',
      'blink',
    )
    const { isSupported: transformOrigin } = useCssSupports(
      'transform-origin',
      '5%',
    )
    const { isSupported: flex } = useCssSupports('display: flex')
    const { isSupported: variable } = useCssSupports('(--foo: red)')
    const { isSupported: selectorHas } = useCssSupports('selector(:has(a))')
    const { isSupported: query } = useCssSupports(
      '(transform-style: preserve) or (-moz-transform-style: preserve) or (-webkit-transform-style: preserve)',
    )
    const { isSupported: doesNotExists } = useCssSupports('doesNotExist')

    const serialized = computed(() =>
      JSON.stringify({
        textDecoration: textDecoration.value,
        transformOrigin: transformOrigin.value,
        flex: flex.value,
        variable: variable.value,
        selectorHas: selectorHas.value,
        query: query.value,
        doesNotExists: doesNotExists.value,
      }),
    )

    return { serialized }
  },
})

const ReactiveComponent = defineComponent({
  template: `
    <pre data-testid="conditionResult">{{ conditionSupported }}</pre>
    <pre data-testid="propValueResult">{{ propValueSupported }}</pre>
    <button data-testid="setInvalidCondition" @click="condition = 'e18e'">invalid condition</button>
    <button data-testid="setInvalidValue" @click="value = 'e18e'">invalid value</button>
    <button data-testid="setValidValue" @click="value = '5%'">valid value</button>
    <button data-testid="setInvalidProp" @click="prop = 'e18e'">invalid prop</button>
  `,
  setup() {
    const condition = shallowRef('display: flex')
    const { isSupported: conditionSupported } = useCssSupports(condition)

    const prop = shallowRef('transform-origin')
    const value = shallowRef('5%')
    const { isSupported: propValueSupported } = useCssSupports(prop, value)

    return {
      condition,
      prop,
      value,
      conditionSupported,
      propValueSupported,
    }
  },
})

const ConditionTextComponent = defineComponent({
  template: `
    <pre data-testid="noOptions">{{ noOptionsResult }}</pre>
    <pre data-testid="withOptions">{{ withOptionsResult }}</pre>
  `,
  setup() {
    const { isSupported: noOptionsResult } = useCssSupports('display: flex')
    const { isSupported: withOptionsResult } = useCssSupports(
      'display: flex',
      {},
    )

    return { noOptionsResult, withOptionsResult }
  },
})

const PropValueOverloadComponent = defineComponent({
  template: `
    <pre data-testid="conditionOnly">{{ conditionOnlyResult }}</pre>
    <pre data-testid="withUndefined">{{ withUndefinedResult }}</pre>
    <pre data-testid="withRefUndefined">{{ withRefUndefinedResult }}</pre>
  `,
  setup() {
    const { isSupported: conditionOnlyResult }
      = useCssSupports('display: flex')
    const { isSupported: withUndefinedResult } = useCssSupports(
      'display: flex',
      undefined,
    )
    const { isSupported: withRefUndefinedResult } = useCssSupports(
      'display: flex',
      // @ts-expect-error overload catches this issue correctly
      shallowRef(undefined),
    )

    return { conditionOnlyResult, withUndefinedResult, withRefUndefinedResult }
  },
})

describe('useCssSupports', () => {
  it('should be defined', () => {
    expect(useCssSupports).toBeDefined()
  })

  it('should correctly support existing features', async () => {
    const screen = page.render(BasicComponent)
    const pre = screen.getByTestId('data')
    await expect.element(pre).toBeVisible()

    const results = JSON.parse(pre.query()!.textContent!)

    expect(results.textDecoration).toBe(false)
    expect(results.transformOrigin).toBe(true)
    expect(results.flex).toBe(true)
    expect(results.variable).toBe(true)
    expect(results.selectorHas).toBe(true)
    expect(results.query).toBe(false)
    expect(results.doesNotExists).toBe(false)
  })

  it('should reactively update if condition, prop or value changes', async () => {
    const screen = page.render(ReactiveComponent)
    const conditionResult = screen.getByTestId('conditionResult')
    const propValueResult = screen.getByTestId('propValueResult')
    await expect.element(conditionResult).toBeVisible()
    await expect.element(propValueResult).toBeVisible()

    expect(conditionResult.query()!.textContent!.trim()).toBe('true')
    expect(propValueResult.query()!.textContent!.trim()).toBe('true')

    await screen.getByTestId('setInvalidCondition').click()
    expect(conditionResult.query()!.textContent!.trim()).toBe('false')

    await screen.getByTestId('setInvalidValue').click()
    expect(propValueResult.query()!.textContent!.trim()).toBe('false')

    await screen.getByTestId('setValidValue').click()
    expect(propValueResult.query()!.textContent!.trim()).toBe('true')

    await screen.getByTestId('setInvalidProp').click()
    expect(propValueResult.query()!.textContent!.trim()).toBe('false')
  })

  it('should not treat conditionText as prop when options is set and value is undefined', async () => {
    const screen = page.render(ConditionTextComponent)
    const noOptions = screen.getByTestId('noOptions')
    const withOptions = screen.getByTestId('withOptions')
    await expect.element(noOptions).toBeVisible()
    await expect.element(withOptions).toBeVisible()

    expect(noOptions.query()!.textContent!.trim()).toBe('true')
    expect(withOptions.query()!.textContent!.trim()).toBe('true')
  })

  it('should use prop + value instead of condition if value is explicitly undefined', async () => {
    const screen = page.render(PropValueOverloadComponent)
    const conditionOnly = screen.getByTestId('conditionOnly')
    const withUndefined = screen.getByTestId('withUndefined')
    const withRefUndefined = screen.getByTestId('withRefUndefined')
    await expect.element(conditionOnly).toBeVisible()
    await expect.element(withUndefined).toBeVisible()
    await expect.element(withRefUndefined).toBeVisible()

    expect(conditionOnly.query()!.textContent!.trim()).toBe('true')
    expect(withUndefined.query()!.textContent!.trim()).toBe('false')
    expect(withRefUndefined.query()!.textContent!.trim()).toBe('false')
  })
})
