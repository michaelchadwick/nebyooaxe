export default class Fret {
  /** Guitar string – “1” ... “6” (1 = low‑E, 6 = high‑E) */
  str: string
  /** Fret number – “0”, “1”, ...; 'x' means not played */
  offset: string

  constructor(str: string, offset: string = 'x') {
    this.str = str
    this.offset = offset
  }

  // 6_3: sixth string from bottom, 3rd fret over
  toString = () => {
    return `${this.str}_${this.offset}`
  }

  // 6_3 => { str: '6', offset: '3' }
  static fromString(id: string): Fret {
    const [s, o] = id.split('_')
    return new Fret(s, o)
  }

  equals(other: Fret) {
    return this.str === other.str && this.offset === other.offset
  }
}
