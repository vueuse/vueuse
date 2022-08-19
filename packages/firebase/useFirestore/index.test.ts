import { computed, nextTick, ref } from 'vue-demi'
import { useFirestore } from './index'

const getMockSnapFromRef = (docRef: any) => ({
  id: `${docRef.path}-id`,
  data: () => (docRef),
})

const getData = (docRef: any) => ({
  ...docRef.data(),
  id: docRef.id,
})

const unsubscribe = vi.fn()

vi.mock('firebase/firestore', () => {
  const onSnapshot = vi.fn((docRef: any, callbackFn: (payload: any) => {}) => {
    if (docRef.path.includes('//'))
      throw new Error('Invalid segment')

    callbackFn({
      ...getMockSnapFromRef(docRef),
      docs: [getMockSnapFromRef(docRef)],
    })
    return unsubscribe
  })
  return { onSnapshot }
})

describe('useFirestore', () => {
  beforeEach(() => {
    unsubscribe.mockClear()
  })

  it('should get `users` collection data', () => {
    const collectionRef = { path: 'users' } as any
    const data = useFirestore(collectionRef)
    expect(data.value).toMatchObject([getData(getMockSnapFromRef(collectionRef))])
  })

  it('should get `users/userId` document data', () => {
    const docRef = { path: 'users/userId' } as any
    const data = useFirestore(docRef)
    expect(data.value).toMatchObject(getData(getMockSnapFromRef(docRef)))
  })

  it('should get `posts` computed query data', () => {
    const queryRef = { path: 'posts', orderBy: 'desc' } as any
    const data = useFirestore(computed(() => queryRef))
    expect(data.value).toMatchObject([getData(getMockSnapFromRef(queryRef))])
  })

  it('should get `todos` function query data', () => {
    const collectionRef = { path: 'todos' } as any
    const data = useFirestore(() => collectionRef)
    expect(data.value).toMatchObject([getData(getMockSnapFromRef(collectionRef))])
  })

  it('should get initial value when pass falsy value', () => {
    const collectionRef = { path: 'todos' } as any
    const falsy = computed(() => false)
    const data = useFirestore(() => falsy.value && collectionRef, [{ id: 'default' }])
    expect(data.value).toMatchObject([{ id: 'default' }])
  })

  it('should get reactive query data & unsubscribe previous query when re-querying', async () => {
    const queryRef = { path: 'posts', orderBy: 'desc' } as any
    const reactiveQueryRef = ref(queryRef)
    const data = useFirestore(reactiveQueryRef)
    expect(data.value).toMatchObject([getData(getMockSnapFromRef(reactiveQueryRef.value))])
    reactiveQueryRef.value = { ...queryRef, orderBy: 'asc' }
    await nextTick()
    expect(unsubscribe).toHaveBeenCalled()
    expect(data.value).toMatchObject([getData(getMockSnapFromRef(reactiveQueryRef.value))])
  })

  it('should get user data only when user id exists', async () => {
    const userId = ref('')
    const data = useFirestore(() => !!userId.value && { path: `users/${userId.value}/posts` } as any, [{ id: 'default' }])
    expect(data.value).toMatchObject([{ id: 'default' }])
    userId.value = 'userId'
    await nextTick()
    expect(data.value).toMatchObject([getData(getMockSnapFromRef({ path: `users/${userId.value}/posts` }))])
    userId.value = ''
    await nextTick()
    expect(unsubscribe).toHaveBeenCalled()
    expect(data.value).toMatchObject([{ id: 'default' }])
  })
})
