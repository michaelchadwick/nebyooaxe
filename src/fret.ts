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
}
