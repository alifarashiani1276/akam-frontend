const API_BASE = (import.meta.env?.VITE_API_URL ?? '').replace(/\/+$/, '')
// Keep the chat preview functional until the backend is deployed.
const USE_MOCK = import.meta.env?.VITE_USE_MOCK !== 'false'

export class ChatError extends Error {
  constructor(status = 0, message = 'Chat request failed') {
    super(message)
    this.name = 'ChatError'
    this.status = status
  }
}

const MOCK_REPLIES = {
  fa: 'سلام! من دستیار هوشمند آکام ماشین هستم. می‌توانم درباره محصولات، خدمات و ثبت درخواست استعلام راهنمایی‌تان کنم. برای قیمت و مشخصات نهایی، لطفاً با واحد فروش تماس بگیرید.',
  en: 'Hello! I am AKAM Machine’s AI assistant. I can help with products, services, and submitting an inquiry. For final prices and specifications, please contact our sales team.',
  ru: 'Здравствуйте! Я ИИ-ассистент AKAM Machine. Я могу помочь с информацией о продукции, услугах и отправке запроса. Для уточнения окончательной цены и характеристик свяжитесь с отделом продаж.',
  ar: 'مرحباً! أنا المساعد الذكي لشركة آكام ماشین. يمكنني مساعدتك بشأن المنتجات والخدمات وإرسال طلب استفسار. للحصول على الأسعار والمواصفات النهائية، يرجى التواصل مع قسم المبيعات.',
}

function abortError() {
  return new DOMException('The operation was aborted', 'AbortError')
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(abortError())
    const timer = setTimeout(done, ms)
    function done() {
      signal?.removeEventListener('abort', cancel)
      resolve()
    }
    function cancel() {
      clearTimeout(timer)
      reject(abortError())
    }
    signal?.addEventListener('abort', cancel, { once: true })
  })
}

async function streamMock({ lang, onDelta, signal }) {
  const response = MOCK_REPLIES[lang] ?? MOCK_REPLIES.en
  for (const character of response) {
    if (signal?.aborted) throw abortError()
    onDelta?.(character)
    await wait(14, signal)
  }
  return { done: true }
}

function chatUrl() {
  if (!API_BASE) return '/api/v1/chat'
  return API_BASE.endsWith('/api') ? `${API_BASE}/v1/chat` : `${API_BASE}/api/v1/chat`
}

async function readError(response) {
  let message = response.statusText || 'Chat request failed'
  try {
    const payload = await response.json()
    message = payload?.message || message
  } catch {
    // Keep the HTTP status as the reliable error signal.
  }
  throw new ChatError(response.status, message)
}

function parseEvent(frame) {
  const lines = frame.split(/\r?\n/)
  let event = 'message'
  const data = []
  for (const line of lines) {
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('data:')) data.push(line.slice(5).trimStart())
  }
  if (!data.length) return null
  const raw = data.join('\n')
  let payload = raw
  try { payload = JSON.parse(raw) } catch { /* plain-text SSE data is supported */ }
  return { event, payload }
}

async function streamSse(response, onDelta, signal) {
  if (!response.body?.getReader) throw new ChatError(response.status, 'Streaming is not supported by this response')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let donePayload = null

  const handleFrame = (frame) => {
    const parsed = parseEvent(frame)
    if (!parsed) return
    const { event, payload } = parsed
    if (event === 'error') {
      const detail = typeof payload === 'string' ? payload : payload?.message
      throw new ChatError(payload?.status ?? response.status, detail || 'Chat stream error')
    }
    if (event === 'delta') {
      const delta = typeof payload === 'string' ? payload : payload?.delta ?? payload?.content ?? payload?.text ?? ''
      if (delta) onDelta?.(String(delta))
    }
    if (event === 'done') donePayload = payload
  }

  try {
    while (true) {
      if (signal?.aborted) throw abortError()
      const { value, done } = await reader.read()
      buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done })
      let boundary
      while ((boundary = buffer.search(/\r?\n\r?\n/)) !== -1) {
        const frame = buffer.slice(0, boundary)
        const separator = buffer.slice(boundary).match(/^\r?\n\r?\n/)[0]
        buffer = buffer.slice(boundary + separator.length)
        handleFrame(frame)
      }
      if (done) break
    }
    if (buffer.trim()) handleFrame(buffer)
    return donePayload ?? { done: true }
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    if (error instanceof ChatError) throw error
    throw new ChatError(0, 'Network interrupted')
  } finally {
    reader.releaseLock()
  }
}

export async function sendMessage({ sessionId, lang = 'fa', message, onDelta, signal }) {
  if (USE_MOCK) return streamMock({ lang, onDelta, signal })

  let response
  try {
    response = await fetch(chatUrl(), {
      method: 'POST',
      signal,
      headers: { Accept: 'text/event-stream', 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, lang, message }),
    })
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    throw new ChatError(0, 'Network error')
  }
  if (!response.ok) return readError(response)
  return streamSse(response, onDelta, signal)
}
