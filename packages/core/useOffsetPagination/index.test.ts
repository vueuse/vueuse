import { isRef, nextTick, ref } from 'vue-demi'
import type { UseOffsetPaginationOptions, UseOffsetPaginationReturn } from '.'
import { useOffsetPagination } from '.'

describe('useOffsetPagination', () => {
  it('should be defined', () => {
    expect(useOffsetPagination).toBeDefined()
  })

  it('returns refs', () => {
    const {
      currentPage,
      currentPageSize,
      pageCount,
      isFirstPage,
      isLastPage,
    } = useOffsetPagination({
      total: 40,
      page: 1,
      pageSize: 10,
    })

    expect(isRef(currentPage)).toBe(true)
    expect(isRef(currentPageSize)).toBe(true)
    expect(isRef(pageCount)).toBe(true)
    expect(isRef(isFirstPage)).toBe(true)
    expect(isRef(isLastPage)).toBe(true)
  })

  describe('when page is 1', () => {
    let currentPage: UseOffsetPaginationReturn['currentPage']
    let prev: UseOffsetPaginationReturn['prev']
    let next: UseOffsetPaginationReturn['next']

    beforeEach(() => {
      ({
        currentPage,
        prev,
        next,
      } = useOffsetPagination({
        total: 40,
        page: 1,
        pageSize: 10,
      }))
    })

    it('returns a ref for currentPage', () => {
      expect(isRef(currentPage)).toBe(true)
    })

    it('returns the initial page number when prev() or next() haven\'t been called', () => {
      expect(currentPage.value).toBe(1)
    })

    it('increments after calling next() when there are still pages left', () => {
      next()
      expect(currentPage.value).toBe(2)
      next()
      expect(currentPage.value).toBe(3)
    })

    it('doesn\'t decrement after calling prev() when still on the first page', () => {
      prev()
      expect(currentPage.value).toBe(1)
    })

    it('doesn\'t increment past the last page', () => {
      next()
      next()
      next() // this puts us on the last page
      next()
      expect(currentPage.value).toBe(4)
    })
  })

  describe('when page is something other than 1', () => {
    let currentPage: UseOffsetPaginationReturn['currentPage']

    beforeEach(() => {
      ({
        currentPage,
      } = useOffsetPagination({
        total: 40,
        page: 3,
        pageSize: 10,
      }))
    })

    it('returns the page number when prev() or next() haven\'t been called', () => {
      expect(currentPage.value).toBe(3)
    })
  })

  describe('when total is 0', () => {
    let currentPage: UseOffsetPaginationReturn['currentPage']

    beforeEach(() => {
      ({
        currentPage,
      } = useOffsetPagination({
        total: 0,
      }))
    })

    it('returns a currentPage of 1', () => {
      expect(currentPage.value).toBe(1)
    })
  })

  describe('when the page is outside of the range of possible pages', () => {
    let currentPage: UseOffsetPaginationReturn['currentPage']
    const page: UseOffsetPaginationOptions['page'] = ref(0)

    beforeEach(() => {
      ({
        currentPage,
      } = useOffsetPagination({
        total: 40,
        page,
        pageSize: 10,
      }))
    })

    it('returns the maximum page number possible', () => {
      page.value = 123456 // outside maximum range
      expect(currentPage.value).toBe(4)
    })

    it('clamps the lower end of the range to 1', () => {
      page.value = 1
      expect(currentPage.value).toBe(1)
      page.value = 0
      expect(currentPage.value).toBe(1)
      page.value = -1234
      expect(currentPage.value).toBe(1)
    })
  })

  describe('when the page is a ref', () => {
    let currentPage: UseOffsetPaginationReturn['currentPage']
    const pageRef = ref(0)

    beforeEach(() => {
      pageRef.value = 2;

      ({
        currentPage,
      } = useOffsetPagination({
        total: 40,
        page: pageRef,
        pageSize: 10,
      }))
    })

    it('returns the correct currentPage', async () => {
      expect(currentPage.value).toBe(2)
      pageRef.value = 3
      expect(currentPage.value).toBe(3)
      pageRef.value = 1
      expect(currentPage.value).toBe(1)
      pageRef.value = -1
      expect(currentPage.value).toBe(1)
    })

    it('clamps out of range numbers to the first and last pages', () => {
      pageRef.value = -1
      expect(currentPage.value).toBe(1)

      pageRef.value = Infinity
      expect(currentPage.value).toBe(4)
    })
  })

  describe('currentPageSize', () => {
    describe('when pageSize is given as a value', () => {
      let currentPageSize: UseOffsetPaginationReturn['currentPageSize']
      let next: UseOffsetPaginationReturn['next']

      beforeEach(() => {
        ({
          currentPageSize,
          next,
        } = useOffsetPagination({
          total: 45,
          page: 1,
          pageSize: 14,
        }))
      })

      it('returns the given initial page size', () => {
        expect(currentPageSize.value).toBe(14)
      })

      it('does not change currentPageSize when navigating through to the last page', () => {
        next()
        expect(currentPageSize.value).toBe(14)
        next()
        expect(currentPageSize.value).toBe(14)
        next()
        expect(currentPageSize.value).toBe(14)
        next()
        expect(currentPageSize.value).toBe(14)
      })
    })

    describe('when pageSize is given as a ref', () => {
      let currentPageSize: UseOffsetPaginationReturn['currentPageSize']
      const pageSize = ref(11)

      beforeEach(() => {
        ({
          currentPageSize,
        } = useOffsetPagination({
          pageSize,
        }))
      })

      it('changes when the given pageSize changes', () => {
        expect(currentPageSize.value).toBe(11)
        pageSize.value = 23
        expect(currentPageSize.value).toBe(23)
      })
    })

    describe('when pageSize is not given', () => {
      let currentPageSize: UseOffsetPaginationReturn['currentPageSize']

      beforeEach(() => {
        ({
          currentPageSize,
        } = useOffsetPagination({
          total: 45,
          page: 1,
        }))
      })

      it('defaults to 10', () => {
        expect(currentPageSize.value).toBe(10)
      })
    })
  })

  describe('isFirstPage', () => {
    it('returns true when on the first page', () => {
      const {
        isFirstPage,
        prev,
      } = useOffsetPagination({
        total: 35,
        pageSize: 10,
      })

      expect(isFirstPage.value).toBe(true)
      prev()
      expect(isFirstPage.value).toBe(true)
    })

    it('returns false when not the first page', () => {
      const {
        isFirstPage,
        next,
      } = useOffsetPagination({
        total: 35,
        pageSize: 10,
      })

      next()
      expect(isFirstPage.value).toBe(false)
      next()
      expect(isFirstPage.value).toBe(false)
      next()
      expect(isFirstPage.value).toBe(false)
    })
  })

  describe('isLastPage', () => {
    it('returns true when on the last page', () => {
      const {
        isLastPage,
        next,
      } = useOffsetPagination({
        total: 35,
        pageSize: 20,
      })

      next()
      expect(isLastPage.value).toBe(true)
      next()
      expect(isLastPage.value).toBe(true)
    })

    it('returns false when not the last page', () => {
      const {
        isLastPage,
        prev,
      } = useOffsetPagination({
        total: 35,
        pageSize: 20,
      })

      expect(isLastPage.value).toBe(false)
      prev()
      expect(isLastPage.value).toBe(false)
    })
  })

  describe('onPageChange', () => {
    it('is called when the page changes', async () => {
      const onPageChange = vi.fn()
      const page = ref(1)

      useOffsetPagination({
        total: 50,
        page,
        onPageChange,
      })

      expect(onPageChange).toBeCalledTimes(0)
      page.value = 2
      await nextTick()
      expect(onPageChange).toBeCalledTimes(1)
      page.value = 1
      await nextTick()
      expect(onPageChange).toBeCalledTimes(2)
      page.value = 9999 // out of range, so we go to the last page
      await nextTick()
      expect(onPageChange).toBeCalledTimes(3)
      page.value = 9998 // still out of range, so we stay on the last page
      await nextTick()
      expect(onPageChange).toBeCalledTimes(3) // does not change
    })

    it('is called with the correct UseOffsetPaginationReturn values', async () => {
      const onPageChange = vi.fn()
      const page = ref(1)

      useOffsetPagination({
        total: 35,
        page,
        onPageChange,
      })

      page.value = 2
      await nextTick()
      expect(onPageChange).toBeCalledWith(expect.objectContaining({
        currentPage: 2,
        currentPageSize: 10,
        isFirstPage: false,
        isLastPage: false,
        next: expect.any(Function),
        pageCount: 4,
        prev: expect.any(Function),
      }))

      page.value = 3
      await nextTick()
      expect(onPageChange).toBeCalledWith(expect.objectContaining({
        currentPage: 3,
        currentPageSize: 10,
        isFirstPage: false,
        isLastPage: false,
        next: expect.any(Function),
        pageCount: 4,
        prev: expect.any(Function),
      }))

      page.value = 4
      await nextTick()
      expect(onPageChange).toBeCalledWith(expect.objectContaining({
        currentPage: 4,
        currentPageSize: 10,
        isFirstPage: false,
        isLastPage: true,
        next: expect.any(Function),
        pageCount: 4,
        prev: expect.any(Function),
      }))

      page.value = 1
      await nextTick()
      expect(onPageChange).toBeCalledWith(expect.objectContaining({
        currentPage: 1,
        currentPageSize: 10,
        isFirstPage: true,
        isLastPage: false,
        next: expect.any(Function),
        pageCount: 4,
        prev: expect.any(Function),
      }))
    })
  })

  describe('onPageSizeChange', () => {
    it('is called when the page size changes', async () => {
      const onPageSizeChange = vi.fn()
      const pageSize = ref(5)

      useOffsetPagination({
        total: 50,
        pageSize,
        onPageSizeChange,
      })

      expect(onPageSizeChange).toBeCalledTimes(0)
      pageSize.value = 2
      await nextTick()
      expect(onPageSizeChange).toBeCalledTimes(1)
      pageSize.value = 7
      await nextTick()
      expect(onPageSizeChange).toBeCalledTimes(2)
    })

    it('is called with the correct UseOffsetPaginationReturn values', async () => {
      const pageSize = ref(5)
      const onPageSizeChange = vi.fn()

      useOffsetPagination({
        total: 35,
        pageSize,
        onPageSizeChange,
      })

      pageSize.value = 3
      await nextTick()
      expect(onPageSizeChange).toBeCalledWith(expect.objectContaining({
        currentPage: 1,
        currentPageSize: 3,
        isFirstPage: true,
        isLastPage: false,
        next: expect.any(Function),
        pageCount: 12,
        prev: expect.any(Function),
      }))

      pageSize.value = 30
      await nextTick()
      expect(onPageSizeChange).toBeCalledWith(expect.objectContaining({
        currentPage: 1,
        currentPageSize: 30,
        isFirstPage: true,
        isLastPage: false,
        next: expect.any(Function),
        pageCount: 2,
        prev: expect.any(Function),
      }))
    })
  })

  describe('onPageCountChange', () => {
    it('is called when the page count changes', async () => {
      const onPageCountChange = vi.fn()
      const pageSize = ref(5)

      useOffsetPagination({
        total: 50,
        pageSize,
        onPageCountChange,
      })

      expect(onPageCountChange).toBeCalledTimes(0)
      pageSize.value = 2
      await nextTick()
      expect(onPageCountChange).toBeCalledTimes(1)
      pageSize.value = 7
      await nextTick()
      expect(onPageCountChange).toBeCalledTimes(2)
    })

    it('is called with the correct UseOffsetPaginationReturn values', async () => {
      const pageSize = ref(5)
      const onPageCountChange = vi.fn()

      useOffsetPagination({
        total: 35,
        pageSize,
        onPageCountChange,
      })

      pageSize.value = 3
      await nextTick()
      expect(onPageCountChange).toBeCalledWith(expect.objectContaining({
        currentPage: 1,
        currentPageSize: 3,
        isFirstPage: true,
        isLastPage: false,
        next: expect.any(Function),
        pageCount: 12,
        prev: expect.any(Function),
      }))

      pageSize.value = 30
      await nextTick()
      expect(onPageCountChange).toBeCalledWith(expect.objectContaining({
        currentPage: 1,
        currentPageSize: 30,
        isFirstPage: true,
        isLastPage: false,
        next: expect.any(Function),
        pageCount: 2,
        prev: expect.any(Function),
      }))
    })
  })
})
