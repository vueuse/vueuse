import { useFirestore } from './index'
import type firebase from 'firebase'

describe('useFirestore', () => {
  const expectArrayRef = (path: string, initialValue: any, result: boolean) => {
    // @ts-ignore
    const docRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData> = {
      path,
      onSnapshot: jest.fn(),
    }

    const ref = useFirestore(docRef, initialValue)

    expect(Array.isArray(ref.value)).toBe(result)
  }

  it('should return an array ref when applied on a (sub-)collection', () => {
    expectArrayRef('users', [], true)
    expectArrayRef('users/foo/todos', [], true)
  })

  it('should not return an array ref object when applied on a document', () => {
    expectArrayRef('users/foo', {}, false)
  })
})
