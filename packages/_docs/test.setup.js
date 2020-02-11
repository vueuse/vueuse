let state = {}

const localStorageMock = {
  getItem: jest.fn(x => state[x]),
  setItem: jest.fn((x, v) => state[x] = v),
  clear: jest.fn(() => state = {}),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})
