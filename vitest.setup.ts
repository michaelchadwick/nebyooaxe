// vitest.setup.ts   (or any file listed in `setupFilesAfterEnv`)
import { vi } from 'vitest'

// A *tiny* stub – it only needs to be a constructor.
class DummyAudioContext {
  // The real API has many methods, but the component only calls the ctor.
  // If you need a method later add it here, e.g. createGain() { … }
}

vi.stubGlobal('AudioContext', DummyAudioContext) // ← done!
