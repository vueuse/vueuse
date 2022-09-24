import { ref } from 'vue-demi'
import { onSnapshot } from 'firebase/firestore'
import type { Mock } from 'vitest'
import { useFirestore } from './index'

vi.mock('firebase/firestore', () => ({
  onSnapshot: vi.fn(),
}))

describe('useFirestore', () => {
  beforeEach(() => {
    (onSnapshot as Mock).mockClear()
  })

  it('should call onSnapshot with document reference', () => {
    const docRef = { path: 'users' } as any
    useFirestore(docRef)
    expect((onSnapshot as Mock).mock.calls[0][0]).toStrictEqual(docRef)
  })

  it('should call onSnapshot with ref value of document reference', () => {
    const docRef = { path: 'posts' } as any
    const refOfDocRef = ref(docRef)
    useFirestore(refOfDocRef)
    expect((onSnapshot as Mock).mock.calls[0][0]).toStrictEqual(docRef)
  })
})
