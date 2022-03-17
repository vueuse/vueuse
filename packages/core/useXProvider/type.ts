/**
 * Support type-safe string dot notation
 * author phillyx
 * email 1020450921@qq.com
 * ts playground https://www.typescriptlang.org/play#code/PTAEGUFcAdoewE4BdRIJ7QKYFoDOBDAM01FyQQEsA7Ac1ABM4Uqn8kK4qAoYAKlEy4ANtSTZ6FAgCMhJFtki4cUzIUQ56q6iV7Au6LKAAqcKQCtQAXlABvUAG0A1pjQAuUAAUEcLMjQBpFwBdd3wqNFAAXy59DBIoKWg2AAsAHiMAGlBAtAA+Ky5QbJcBAA8kTCp6XFAAUXKEfABjJFTnNDhCYyyySlp8gH5CouN7HKCyiqqagEEERrRU6mIET0HQAAMAEhscyIA6HYS5hY8U1I9cyI3QV2GR0AAKe4fR8cnK6tAAJUwmxHoqV61BoWTCeVAQwe212LgOOzOSGSRkwAFtoOkxsErhsXq9bnjXlRMAA3TAIACUL3cxLJCBiBhIiORaIxmWKEWs7U6xnylmGOQ+0zqDWarW5XXZwP6kI5oAAPhBIIlzuycvkaaTyTEQKQYPBkKB8PN8BFGMwmBR2JxYoZjia0MyLkKvjZInynjCqJBUSoENcFZsdt7feT4TZmSj0RccVTbUzVVlBZhyp8ahLjFZQBmjHzhrqAMJwdFsCgyEgnU2gUxmP5IYZGF2zB1LKgrNay+2nc6XQMhv0Eoq6gDyVCEEX+JfY5dAhAoCDI4kw0CRRqQ5DLkAqNUZ9FIaFwvrgQmrq372oeydTwtwaCPJ8V59WAzl7kjrPSuQZcU8KQAavgQiQJg6RZB4Ta-kin4es8RTgSmUxfDCyzkhy4YoasvxkAGUIjMyAFASBRhYhEABk2YuDyRhBFkWEoORTrEYK5E5kEuRfg8dwPMR4EsZRkpBFwcaEJAVAtBwVCkJgSAACJsPgoGeBBjHsY8NbuOySRIm+WQkoBwFvv++lEWBuQUrYwwUF0jyMjyWnJKAACEljWAA5NKNCueZNgvLqAACSC4NgFA0CwCCYC8Nb2PZEzWHphEvOFSCQAg3BFNERT-FQZBGvMWb2fsuDQCISCPK5+xecMWU5bIknWMaCD7LVNBIsMDX7OF9CQE0mCwSMjzQOFJIaTWWTtKE4RZE0KXhVQSAAJJVCmNI+n65mWPkPn4lZTzTfMlQLUtpSgKkoC1aA2CgAAjKApHkQNQ1OMEVguaAomaHOxJ7vKiqDaST1oLFr3ekIQgUlS+JFH9JIA7FoCSAAYtQVq9QA1A19h7bNh2aMdqPXUE5kvvYEzuG6MTbdZWMHYtuMvdY52XVdEOQ9DsNZvFwEU68SUpZJbPtIJDyRFkNZUtEXCiOShDNCQ80FkITDJIIFmZceiDuK5nWuYGrkyMBOuKnrQjNI4rnDLgFAAF6YJr4CG6ArkALIO65AAyrsABoe7rnve+bRSomw5IUIBmuW0IZu6-866cK7IjElQrseLURjm9EjLGAWxpGD+bngAAqn+rtOx4xe6x4AAStTl0bNfm1LCAyz1oDy8aqugFIjRVO4HnDIyuBk6AAD6jIadnCC54YkQk1w0TVSg4AAJpO-4tRL1m4B3lIx77GoCBlduSCVY3zdyx45K4JwHf2Mvq-ryE+73sMVD4KitukButBtTQH9Pm14lODuD-HACg9AEaiUAWleG9ABjuC3s-IoAAGOBoAAByq0LyOyuq5VBfdMqKyRIIMmLwzCm2ku4eWhDla4BeOQOAihL6UIVkrQQwwMqgCaMaQercJ6z3npwHKXCFxZnsMMOwXcwj0E1lINA9AdYiy4BMfANRRKOBYAAd0kio3hxpZ4L1AL4K+dUO6v3fpraAyQKCgzQKUVyGQf4fwAMxIIcUUMUEl3CPHWptF41VjyYCanAGgZVlagzgBoxAQh5Es0Ucg9wriqrUOIR3IoZCmjOCQCQ-Elsbaa39m414-xFYIBkSbDJ9iXhxKiIU4RuAHGRCNKoqg6iInaJqPNC+C4bRGM4PsOp9gkFBH2APQZwzR550doXYuXAlCyXkgNS+nAsh3zXkvFZ29jyH0EMfcGszpJySQPgRZ3SqBZFcaAJBVI5mHOOb0s52D7GOyPqAJ8eAv6eWuQchZ9ysiuTqU8kmXz5lHJOcYv5dT9hIKeRI7u0jHayPoNgNAkAwhPIHu4ewdgJlYE1vXKIExIjAtuWC5ZmxIU7CQQcSRVQNh-MRZVG5PylkPP+dwqFIy4i4ChTCkeY8plFwUcShZdS-nQqyLCqRMi5Hoq5Zi7F-LnZlwUYS4VoLRWXIlZ3OF0r5FZAxQ4BVcRNal3LpEVVMR-GyCCSE+5VIgA
 */

export type Tobj = Record<PropertyKey, any>

type Subpath<T, Key> =
  Key extends Extract<keyof T, string> ?
    T[Key] extends Array<infer P> ? `${Key}.${SubArrayPath<P>}` :
      (
        T[Key] extends Record<string, any> ?
    `${Key}.${PathTemp<T[Key]>}`
          :
          never)
    : never

type PathTemp<T, Key = keyof T> =
  Key extends Extract<keyof T, string> ? Key | Subpath<T, Key> : never

// support array dot notition
type SubArrayPath<P extends {}> = (`${number}` | `${number}.${PathTemp<P>}`)

export type Path<T, Key extends keyof T = keyof T> =
  // Compatible Array object
  T extends Array<infer P> ? SubArrayPath<P> | number :
  // Only compatible first-depth attributes typed sysmbol or number
    Key extends symbol | number ? Key : PathTemp<T>

export type PathValue<T, P extends Path<T>> = (
  P extends `${infer Key}.${infer Rest}` ?
    PathValue<T[Key & keyof T], Rest & Path<T[Key & keyof T]>>
    :
    T[P & keyof T]
)

export function setData<T, P extends Path<T>>(obj: T, path: P, value: PathValue<T, P>) {
  if (typeof path !== 'string') {
    // @ts-expect-error  no need for tslint
    obj[path] = value
    return
  }
  const arr = path.split('.')
  const len = arr.length
  arr.reduce(
    (prev: Tobj, key: any, currentIndex: number) => {
      if (currentIndex < len - 1 && (prev[key] === undefined || prev[key] === null))
        prev[key] = isFinite(+arr[currentIndex + 1]) ? [] : {}

      if (currentIndex === len - 1)
        prev[key] = value

      return prev[key]
    }, obj)
}
