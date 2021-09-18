import { ref, Ref } from 'vue-demi'

export interface RandomString {
  randomString: Ref<String>
  generateRandomString: Function
}

export interface RandomStringOptions {
  prefix?: string
  charLength?: number
}

/**
 * Random string generator
 *
 * Random string generation taken from here: https://stackoverflow.com/a/47496558 with minor additions for modularity.
 * @param {String} prefix
 * @param {Integer} charLength
 * @returns {Object}
 */
export function useRandomString(options: RandomStringOptions | undefined = {}): RandomString {
  const { prefix = '', charLength = 10 } = options
  const generateRandomString = (genPrefix = '', genCharacterLength: Number = 10) => genPrefix + [...Array(genCharacterLength)].map(() => Math.random().toString(36)[2]).join('')

  const randomString = ref()
  randomString.value = generateRandomString(prefix, charLength)

  return { randomString, generateRandomString }
}
