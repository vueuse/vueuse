import { describe, expect, it } from 'vitest'
import { useIndexedDB } from './index'
import 'fake-indexeddb/auto'

describe('useIndexedDB', () => {
  const { saveRecord, getRecord, getAllRecords, deleteRecord } = useIndexedDB(
    'testDB',
    'testStore',
    'id',
  )

  it('should save a record', async () => {
    await saveRecord({ id: 1, name: 'Test' })
    const record = await getRecord(1)
    expect(record).toEqual({ id: 1, name: 'Test' })
  })

  it('should get all records', async () => {
    await saveRecord({ id: 2, name: 'Item 2' })
    const records = await getAllRecords()
    expect(records.length).toBeGreaterThanOrEqual(1)
  })

  it('should delete a record', async () => {
    await deleteRecord(1)
    const record = await getRecord(1)
    expect(record).toBeUndefined()
  })
})
