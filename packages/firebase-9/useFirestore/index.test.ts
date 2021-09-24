import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { collection, doc } from 'firebase/firestore'
import { useFirestore } from './index'

describe('useFirestore', () => {
  const setupFirebaseEnv = async() => {
    const testEnv = await initializeTestEnvironment({
      projectId: 'demo-test',
      firestore: {
        host: 'localhost',
        port: 9999,
      },
    })
    await testEnv.withSecurityRulesDisabled(async(ctx) => {
      const db = ctx.firestore()
      await db.collection('users').doc('foo').collection('todos')
    })

    return testEnv
  }

  const expectArrayRef = async(fn: Function, path: string, initialValue: any, result: boolean) => {
    const env = await setupFirebaseEnv()
    const ctx = env.unauthenticatedContext()
    const docRef = fn(ctx.firestore(), path)

    const ref = useFirestore(docRef, initialValue)

    expect(Array.isArray(ref.value)).toBe(result)
  }

  it('should return an array ref when applied on a (sub-)collection', async() => {
    await Promise.all([
      expectArrayRef(collection, 'users', [], true),
      expectArrayRef(collection, 'users/foo/todos', [], true),
    ])
  })

  it('should not return an array ref object when applied on a document', async() => {
    await expectArrayRef(doc, 'users/foo', {}, false)
  })
})
