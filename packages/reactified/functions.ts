import { reactify } from '@vueuse/shared'

/*@__PURE__*/
export const invert = reactify((n: number) => -n)

/*@__PURE__*/
export const sum = reactify((...numbers: number[]) => {
  let result = 0
  numbers.forEach(i => result += i)
  return result
})

/*@__PURE__*/
export const multiply = reactify((...numbers: number[]) => {
  let result = 1
  numbers.forEach(i => result *= i)
  return result
})

/*@__PURE__*/
export const divide = reactify((a: number, b: number) => a / b)

/*@__PURE__*/
export const subtract = reactify((a: number, b: number) => a - b)
