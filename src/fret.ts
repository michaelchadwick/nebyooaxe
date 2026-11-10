export default class Fret {
  str: string
  offset: string

  constructor(str: string, offset: string = 'x') {
    this.str = str
    this.offset = offset
  }

  toString = () => {
    return `${this.str}_${this.offset}`
  }

  static fromString(id: string): Fret {
    const [s, o] = id.split('_')
    return new Fret(s, o)
  }

  equals(other: Fret) {
    return this.str === other.str && this.offset === other.offset
  }
}
