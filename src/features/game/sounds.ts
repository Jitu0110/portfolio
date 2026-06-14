/**
 * Synthesized race audio via Web Audio — no asset files.
 * Engine: two sawtooth oscillators (fundamental + fifth) through a lowpass,
 * with a 6-speed virtual gearbox so pitch rises and "shifts" as speed climbs.
 * Wind: lowpassed noise that scales with the square of speed.
 */
export class RaceSounds {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private engineOsc1: OscillatorNode | null = null;
  private engineOsc2: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private engineGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private muted = false;

  /** Must be called from a user gesture (browser autoplay policy). */
  init() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume();
      return;
    }
    const ctx = new AudioContext();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = this.muted ? 0 : 0.5;
    master.connect(ctx.destination);
    this.master = master;

    // Shared noise buffer (2s of white noise, looped)
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    // Wind / road noise
    const windSrc = ctx.createBufferSource();
    windSrc.buffer = noiseBuf;
    windSrc.loop = true;
    const windLp = ctx.createBiquadFilter();
    windLp.type = "lowpass";
    windLp.frequency.value = 650;
    const windGain = ctx.createGain();
    windGain.gain.value = 0;
    windSrc.connect(windLp).connect(windGain).connect(master);
    windSrc.start();
    this.windGain = windGain;

    // Engine
    const osc1 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.value = 75;
    const osc2 = ctx.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.value = 75 * 1.5;
    osc2.detune.value = 9;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;
    filter.Q.value = 1.2;
    const engineGain = ctx.createGain();
    engineGain.gain.value = 0;
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(engineGain).connect(master);
    osc1.start();
    osc2.start();
    this.engineOsc1 = osc1;
    this.engineOsc2 = osc2;
    this.engineFilter = filter;
    this.engineGain = engineGain;

    // Idle rumble
    engineGain.gain.setTargetAtTime(0.085, ctx.currentTime, 0.4);
  }

  /** Map speed (km/h) through a virtual 6-speed gearbox to engine pitch. */
  setSpeed(kmh: number) {
    if (!this.ctx || !this.engineOsc1 || !this.engineOsc2 || !this.engineFilter || !this.engineGain || !this.windGain) return;
    const GEARS = [0, 42, 82, 122, 162, 202, 260];
    let gear = 0;
    while (gear < GEARS.length - 2 && kmh >= GEARS[gear + 1]) gear++;
    const frac = Math.min(Math.max((kmh - GEARS[gear]) / (GEARS[gear + 1] - GEARS[gear]), 0), 1);
    const rpm = 0.18 + frac * 0.82;

    const t = this.ctx.currentTime;
    const f = 70 + rpm * 430 + gear * 14;
    this.engineOsc1.frequency.setTargetAtTime(f, t, 0.05);
    this.engineOsc2.frequency.setTargetAtTime(f * 1.5, t, 0.05);
    this.engineFilter.frequency.setTargetAtTime(400 + rpm * 2600, t, 0.07);
    this.engineGain.gain.setTargetAtTime(0.07 + rpm * 0.12, t, 0.08);
    this.windGain.gain.setTargetAtTime((kmh / 250) ** 2 * 0.22, t, 0.15);
  }

  engineIdle() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.engineOsc1?.frequency.setTargetAtTime(75, t, 0.3);
    this.engineOsc2?.frequency.setTargetAtTime(112, t, 0.3);
    this.engineGain?.gain.setTargetAtTime(0.085, t, 0.3);
    this.windGain?.gain.setTargetAtTime(0, t, 0.2);
  }

  engineOff() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.engineGain?.gain.setTargetAtTime(0, t, 0.4);
    this.windGain?.gain.setTargetAtTime(0, t, 0.2);
  }

  countdownBeep() {
    this.beep(440, 0.18, 0.22);
  }

  /** Lights out — long high beep. */
  go() {
    this.beep(880, 0.55, 0.25);
  }

  /** Chequered flag — ascending fanfare, then engine off. */
  finish() {
    this.beep(660, 0.14, 0.2, 0);
    this.beep(830, 0.14, 0.2, 0.16);
    this.beep(990, 0.4, 0.24, 0.32);
    this.engineOff();
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(m ? 0 : 0.5, this.ctx.currentTime, 0.05);
    }
  }

  isMuted() {
    return this.muted;
  }

  dispose() {
    this.ctx?.close();
    this.ctx = null;
  }

  private beep(freq: number, dur: number, vol: number, delay = 0) {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.015);
    g.gain.setValueAtTime(vol, t + dur - 0.04);
    g.gain.linearRampToValueAtTime(0, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }
}
