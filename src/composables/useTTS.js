import { ref } from 'vue'

const EL_KEY  = import.meta.env.VITE_ELEVENLABS_KEY || ''

// Cached at module level — shared across all useTTS() instances
const elVoiceIds = { george: null, marx: null }

export function useTTS() {
  const ttsReady = !!EL_KEY || ('speechSynthesis' in window)

  const ttsState   = ref('idle')   // 'idle' | 'loading' | 'playing' | 'paused'
  const ttsSpeaker = ref(null)
  const ttsText    = ref('')
  const ttsLineIdx = ref(0)
  const ttsTotal   = ref(0)
  const elError    = ref('')

  let ttsLines      = []
  let ttsIdx        = 0
  let currentAudio  = null
  let fetchAbort    = null
  let playResolve   = null
  let pauseResolve  = null
  let usingFallback = false

  async function elResolveVoices() {
    if (elVoiceIds.george && elVoiceIds.marx) return
    const res = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': EL_KEY }
    })
    if (!res.ok) throw new Error(`ElevenLabs voices ${res.status}`)
    const { voices } = await res.json()
    for (const v of voices) {
      if (v.name.startsWith('George'))  elVoiceIds.george = v.voice_id
      if (v.name.startsWith('Marshal')) elVoiceIds.marx   = v.voice_id
    }
    if (!elVoiceIds.george || !elVoiceIds.marx) throw new Error('Voice not found — check ElevenLabs account')
  }

  async function elFetchAudio(text, voiceId, speaker) {
    if (fetchAbort) fetchAbort.abort()
    fetchAbort = new AbortController()
    const settings = speaker === 'george'
      ? { stability: 0.48, similarity_boost: 0.80, style: 0.28, use_speaker_boost: true }
      : { stability: 0.65, similarity_boost: 0.80, style: 0.52, use_speaker_boost: true }
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: { 'xi-api-key': EL_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model_id: 'eleven_turbo_v2_5', voice_settings: settings }),
      signal: fetchAbort.signal
    })
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}`)
    const blob = await res.blob()
    return URL.createObjectURL(blob)
  }

  function elPlayUrl(url) {
    return new Promise((resolve, reject) => {
      playResolve  = resolve
      currentAudio = new Audio(url)
      currentAudio.onended = () => { URL.revokeObjectURL(url); playResolve = null; resolve() }
      currentAudio.onerror = () => { URL.revokeObjectURL(url); playResolve = null; reject(new Error('audio error')) }
      currentAudio.play().catch(reject)
    })
  }

  function synthPlay(text) {
    return new Promise((resolve) => {
      const utt = new SpeechSynthesisUtterance(text)
      utt.rate  = 0.88
      utt.onend   = resolve
      utt.onerror = resolve  // resolve so the loop continues even on synth error
      window.speechSynthesis.speak(utt)
    })
  }

  async function fallbackRunLoop() {
    usingFallback = true
    if (!('speechSynthesis' in window)) {
      elError.value = 'Audio unavailable.'
      ttsStop()
      return
    }
    while (ttsIdx < ttsLines.length && ttsState.value !== 'idle') {
      const line = ttsLines[ttsIdx]
      ttsSpeaker.value = line.speaker
      ttsText.value    = line.text
      ttsLineIdx.value = ttsIdx
      ttsState.value   = 'playing'
      await synthPlay(line.text)
      ttsIdx++
      if (ttsIdx < ttsLines.length && ttsState.value !== 'idle') {
        await new Promise(r => setTimeout(r, 160))
        if (ttsState.value === 'paused') await new Promise(r => { pauseResolve = r })
      }
    }
    if (ttsState.value !== 'idle') ttsStop()
  }

  async function elRunLoop() {
    while (ttsIdx < ttsLines.length && ttsState.value !== 'idle') {
      const line    = ttsLines[ttsIdx]
      const voiceId = line.speaker === 'george' ? elVoiceIds.george : elVoiceIds.marx
      ttsSpeaker.value = line.speaker
      ttsText.value    = line.text
      ttsLineIdx.value = ttsIdx
      try {
        const url = await elFetchAudio(line.text, voiceId, line.speaker)
        if (ttsState.value === 'idle') { URL.revokeObjectURL(url); break }
        ttsState.value = 'playing'
        await elPlayUrl(url)
        ttsIdx++
        if (ttsIdx < ttsLines.length && ttsState.value !== 'idle') {
          await new Promise(r => setTimeout(r, 320))
          if (ttsState.value === 'paused') await new Promise(r => { pauseResolve = r })
        }
      } catch (e) {
        if (e.name === 'AbortError') break
        elError.value = 'ElevenLabs unavailable — using browser voice.'
        fallbackRunLoop()
        return
      }
    }
    if (ttsState.value !== 'idle') ttsStop()
  }

  async function listenFrom(lines, startIdx = 0) {
    ttsStop()
    elError.value  = ''
    ttsLines       = lines
    ttsIdx         = startIdx
    ttsTotal.value = lines.length
    ttsState.value = 'loading'
    if (!EL_KEY) {
      fallbackRunLoop()
      return
    }
    try {
      await elResolveVoices()
      elRunLoop()
    } catch (e) {
      elError.value = 'ElevenLabs unavailable — using browser voice.'
      fallbackRunLoop()
    }
  }

  function ttsTogglePause() {
    if (ttsState.value === 'playing') {
      if (currentAudio) currentAudio.pause()
      else if (usingFallback) window.speechSynthesis.pause()
      ttsState.value = 'paused'
    } else if (ttsState.value === 'paused') {
      if (currentAudio) currentAudio.play()
      else if (usingFallback) window.speechSynthesis.resume()
      ttsState.value = 'playing'
      if (pauseResolve) { pauseResolve(); pauseResolve = null }
    }
  }

  function ttsStop() {
    if (fetchAbort)   { fetchAbort.abort();   fetchAbort   = null }
    if (currentAudio) { currentAudio.pause(); currentAudio = null }
    if (usingFallback && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    if (pauseResolve) { pauseResolve(); pauseResolve = null }
    if (playResolve)  { playResolve();  playResolve  = null }
    usingFallback    = false
    ttsState.value   = 'idle'; ttsSpeaker.value = null; ttsText.value = ''
  }

  return { ttsReady, ttsState, ttsSpeaker, ttsText, ttsLineIdx, ttsTotal, elError, listenFrom, ttsTogglePause, ttsStop }
}