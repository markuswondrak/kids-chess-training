import type { PieceType } from './types'

const NOTE: Record<PieceType, number> = {
  p: 494,
  n: 587,
  b: 659,
  r: 740,
  q: 831,
  k: 880,
}

let ctx: AudioContext | null = null
let audioBroken = false
let muted = false

export function setMuted(value: boolean) {
  muted = value
}

function audio(): AudioContext | null {
  if (muted || audioBroken) return null
  try {
    if (!ctx) {
      const Ctor =
        typeof AudioContext !== 'undefined'
          ? AudioContext
          : (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) {
        audioBroken = true
        return null
      }
      ctx = new Ctor()
    }
    if (typeof ctx.createGain !== 'function' || typeof ctx.createOscillator !== 'function') {
      audioBroken = true
      return null
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    return ctx
  } catch {
    audioBroken = true
    return null
  }
}

function tone(freq: number, dur = 0.16, type: OscillatorType = 'triangle', when = 0, gain = 0.06) {
  try {
    const c = audio()
    if (!c) return
    const t = c.currentTime + when
    const osc = c.createOscillator()
    const vol = c.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    vol.gain.setValueAtTime(0.0001, t)
    vol.gain.exponentialRampToValueAtTime(gain, t + 0.015)
    vol.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(vol)
    vol.connect(c.destination)
    osc.start(t)
    osc.stop(t + dur + 0.05)
  } catch {
    audioBroken = true
  }
}

export const sfx = {
  pick() {
    tone(660, 0.09)
  },
  move(piece: PieceType) {
    tone(NOTE[piece], 0.15)
    tone(NOTE[piece] * 2, 0.08, 'sine', 0.02, 0.025)
  },
  capture() {
    tone(310, 0.1, 'sawtooth', 0, 0.04)
    tone(185, 0.16, 'triangle', 0.055, 0.055)
  },
  castle() {
    tone(494, 0.1)
    tone(740, 0.12, 'triangle', 0.09)
  },
  promotion() {
    tone(587, 0.1)
    tone(740, 0.1, 'triangle', 0.08)
    tone(880, 0.16, 'triangle', 0.16)
  },
  check() {
    tone(880, 0.11, 'square', 0, 0.035)
    tone(740, 0.18, 'square', 0.11, 0.035)
  },
  mate() {
    ;[523, 659, 784, 1046].forEach((f, i) => tone(f, 0.3, 'triangle', i * 0.12, 0.07))
  },
  undo() {
    tone(420, 0.1)
    tone(305, 0.14, 'triangle', 0.075)
  },
  nudge() {
    tone(215, 0.1, 'sine', 0, 0.045)
  },
  place() {
    tone(523, 0.12)
    tone(659, 0.12, 'triangle', 0.08)
  },
  wrong() {
    tone(330, 0.12, 'sine', 0, 0.05)
    tone(247, 0.2, 'sine', 0.1, 0.05)
  },
  hint() {
    ;[988, 1319, 1568].forEach((f, i) => tone(f, 0.14, 'sine', i * 0.06, 0.035))
  },
  star(i: number) {
    tone(784 + i * 196, 0.18, 'triangle', 0, 0.06)
    tone((784 + i * 196) * 2, 0.1, 'sine', 0.03, 0.02)
  },
  step() {
    tone(392, 0.06, 'triangle', 0, 0.03)
  },
  chest() {
    ;[523, 659, 784, 1046, 1319].forEach((f, i) => tone(f, 0.32, 'triangle', i * 0.1, 0.07))
  },
}
