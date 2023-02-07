/**
 * Reactively convert a ref to string.
 *
 * @see https://vueuse.org/useBitSet
 */

class BitSet {
  private bits: number[] = []

  public add(n: number) {
    this.bits[n >> 5] |= 1 << (n & 31)
  }

  public has(n: number) {
    return !!(this.bits[n >> 5] & (1 << (n & 31)))
  }

  public reset() {
    this.bits = []
  }

  public isEmpty() {
    return this.bits.length === 0
  }
}

export function useBitSet() {
  return new BitSet()
}
