export default class Note {
  name: string
  frequency: number
  midi: number
  fretIds: string[]

  constructor(name: string, frequency: number, midi: number, fretIds: string[] = []) {
    this.name = name
    this.frequency = frequency
    this.midi = midi
    this.fretIds = fretIds
  }
}
