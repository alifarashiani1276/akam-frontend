import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bot, MessageCircle, Plus, Send, Square, X } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../../config/languages'
import { ChatError, sendMessage } from './chatApi'
import Loader from '../../components/ui/Loader'
import useDelayedFlag from '../../lib/useDelayedFlag'

const SESSION_KEY = 'akam_chat_session_v1'
const makeSessionId = () => globalThis.crypto?.randomUUID?.() ?? `akam-${Date.now()}-${Math.random().toString(36).slice(2)}`

function getSessionId() {
  try {
    const saved = window.localStorage.getItem(SESSION_KEY)
    if (saved) return saved
    const created = makeSessionId()
    window.localStorage.setItem(SESSION_KEY, created)
    return created
  } catch {
    return makeSessionId()
  }
}

function InlineMarkdown({ text, lang }) {
  const parts = String(text).split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).filter(Boolean)
  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const [, label, href] = link
      if (href.startsWith('/') && !href.startsWith('//')) return <Link key={index} to={href} className="text-primary underline underline-offset-2">{label}</Link>
      if (/^https?:\/\//i.test(href) || /^(mailto:|tel:)/i.test(href)) {
        return <a key={index} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-primary underline underline-offset-2">{label}</a>
      }
      return label
    }
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>
    return <span key={index} lang={lang}>{part}</span>
  })
}

function MessageContent({ text, lang }) {
  const lines = String(text || '').split('\n')
  const blocks = []
  let list = []
  const flushList = () => {
    if (list.length) {
      blocks.push(<ul key={`list-${blocks.length}`} className="my-2 list-inside list-disc space-y-1">{list.map((item, index) => <li key={index}><InlineMarkdown text={item} lang={lang} /></li>)}</ul>)
      list = []
    }
  }
  lines.forEach((line, index) => {
    const item = line.match(/^\s*[-*]\s+(.+)$/)
    if (item) list.push(item[1])
    else {
      flushList()
      if (line.trim()) blocks.push(<p key={`p-${index}`} className="my-1.5"><InlineMarkdown text={line} lang={lang} /></p>)
    }
  })
  flushList()
  return <div className="break-words text-sm leading-6">{blocks}</div>
}

export default function ChatWidget() {
  const { lang: routeLang = 'fa' } = useParams()
  const { t, i18n } = useTranslation()
  const lang = LANGUAGES[routeLang] ? routeLang : (i18n.language || 'fa').split('-')[0]
  const dir = LANGUAGES[lang]?.dir ?? 'ltr'
  const titleId = useId()
  const launcherRef = useRef(null)
  const panelRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const controllerRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [sessionId, setSessionId] = useState(getSessionId)
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState(null)
  const [lastPrompt, setLastPrompt] = useState('')

  const focusInput = useCallback(() => inputRef.current?.focus(), [])

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(focusInput)
      return () => cancelAnimationFrame(frame)
    }
    return undefined
  }, [open, focusInput])

  useEffect(() => {
    const node = listRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, streaming, error])

  const closePanel = useCallback(() => {
    if (streaming) controllerRef.current?.abort()
    setOpen(false)
    requestAnimationFrame(() => launcherRef.current?.focus())
  }, [streaming])

  useEffect(() => {
    if (!open) return undefined
    const closeOnOutsideClick = (event) => {
      if (panelRef.current?.contains(event.target) || launcherRef.current?.contains(event.target)) return
      if (streaming) controllerRef.current?.abort()
      setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [open, streaming])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closePanel()
        return
      }
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = [...panelRef.current.querySelectorAll('button:not([disabled]), textarea:not([disabled]), a[href]')]
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, closePanel])

  useEffect(() => () => controllerRef.current?.abort(), [])

  const runPrompt = useCallback(async (prompt, { appendUser = true } = {}) => {
    const clean = prompt.trim().slice(0, 1000)
    if (!clean || streaming) return
    setError(null)
    setLastPrompt(clean)
    if (appendUser) setMessages((current) => [...current, { id: makeSessionId(), role: 'user', content: clean }])
    const assistantId = makeSessionId()
    setMessages((current) => [...current, { id: assistantId, role: 'assistant', content: '' }])
    setStreaming(true)
    const controller = new AbortController()
    controllerRef.current = controller
    try {
      await sendMessage({
        sessionId,
        lang,
        message: clean,
        signal: controller.signal,
        onDelta: (delta) => setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: item.content + delta } : item)),
      })
    } catch (cause) {
      if (cause?.name !== 'AbortError') {
        const status = cause instanceof ChatError ? cause.status : 0
        setError(status === 429 ? 'rate' : status === 0 ? 'network' : 'server')
      }
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null
      setStreaming(false)
    }
  }, [lang, sessionId, streaming])

  const submit = useCallback((event) => {
    event?.preventDefault?.()
    if (!value.trim() || streaming) return
    const prompt = value.trim()
    setValue('')
    runPrompt(prompt)
  }, [runPrompt, streaming, value])

  const stop = () => controllerRef.current?.abort()

  const newConversation = () => {
    controllerRef.current?.abort()
    const nextId = makeSessionId()
    setSessionId(nextId)
    try { window.localStorage.setItem(SESSION_KEY, nextId) } catch { /* storage may be unavailable */ }
    setMessages([])
    setError(null)
    setLastPrompt('')
    setStreaming(false)
    focusInput()
  }

  const waitingForFirstToken = streaming && messages.some((message) => message.role === 'assistant' && !message.content)
  const showPreparingLoader = useDelayedFlag(waitingForFirstToken)
  const suggestions = t('chat.suggestions', { returnObjects: true })

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className="fixed bottom-4 end-4 z-[70] flex size-14 items-center justify-center rounded-full bg-primary text-primary-content shadow-xl transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
        aria-label={t('chat.title')}
        aria-expanded={open}
        aria-controls={titleId}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X size={25} aria-hidden="true" /> : <MessageCircle size={25} aria-hidden="true" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.section
            ref={panelRef}
            id={titleId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-heading`}
            dir={dir}
            lang={lang}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-2 bottom-2 top-2 z-[65] flex min-h-0 flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-2xl sm:inset-auto sm:bottom-20 sm:end-4 sm:h-[560px] sm:max-h-[calc(100dvh-6rem)] sm:w-[380px]"
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-base-300 bg-base-200 px-4 py-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-content"><Bot size={22} aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <h2 id={`${titleId}-heading`} className="font-semibold">{t('chat.title')}</h2>
                <p className="text-xs text-base-content/60">{t('chat.subtitle')}</p>
              </div>
              <button type="button" className="btn btn-ghost btn-sm btn-square" onClick={newConversation} aria-label={t('chat.newChat')} title={t('chat.newChat')}>
                <Plus size={18} aria-hidden="true" />
              </button>
              <button type="button" className="btn btn-ghost btn-sm btn-square" onClick={closePanel} aria-label={t('common.close')}>
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-live="polite" aria-relevant="additions text" aria-atomic="false">
              {messages.length === 0 && (
                <div className="flex flex-col items-start gap-3">
                  <div className="max-w-[90%] rounded-2xl rounded-es-sm bg-base-200 px-3 py-2.5">
                    <MessageContent text={t('chat.welcome')} lang={lang} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(suggestions) ? suggestions : []).map((suggestion) => (
                      <button key={suggestion} type="button" onClick={() => runPrompt(suggestion)} className="rounded-full border border-primary/50 px-3 py-2 text-start text-xs text-primary transition-colors hover:bg-primary/10">
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] rounded-2xl px-3 py-2.5 ${message.role === 'user' ? 'rounded-ee-sm bg-primary text-primary-content' : 'rounded-es-sm bg-base-200'}`}>
                      {message.content ? <MessageContent text={message.content} lang={lang} /> : showPreparingLoader && message.role === 'assistant' ? <Loader layout="inline" size="sm" delay={0} label={t('states.loaders.chatReply')} /> : null}
                    </div>
                  </div>
                ))}
              </div>
              {error && (
                <div className="mt-3 flex flex-col items-start gap-2" role="alert">
                  <p className="rounded-xl bg-error/10 px-3 py-2 text-sm text-error">{t(`chat.errors.${error}`)}</p>
                  <button type="button" className="btn btn-outline btn-xs" onClick={() => runPrompt(lastPrompt, { appendUser: false })} disabled={streaming || !lastPrompt}>
                    {t('chat.errors.retry')}
                  </button>
                </div>
              )}
            </div>

            <p className="shrink-0 border-t border-base-300 px-3 py-2 text-[11px] leading-5 text-base-content/55">{t('chat.disclaimer')}</p>
            <form onSubmit={submit} className="flex shrink-0 items-end gap-2 border-t border-base-300 bg-base-200 p-3">
              <textarea
                ref={inputRef}
                value={value}
                onChange={(event) => setValue(event.target.value.slice(0, 1000))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault()
                    submit(event)
                  }
                }}
                maxLength={1000}
                rows={2}
                placeholder={t('chat.placeholder')}
                aria-label={t('chat.placeholder')}
                className="textarea textarea-bordered min-h-12 max-h-28 min-w-0 flex-1 resize-y bg-base-100 text-sm leading-5"
              />
              {streaming ? (
                <button type="button" onClick={stop} className="btn btn-primary btn-square" aria-label={t('chat.stop')} title={t('chat.stop')}>
                  <Square size={17} fill="currentColor" aria-hidden="true" />
                </button>
              ) : (
                <button type="submit" disabled={!value.trim()} className="btn btn-primary btn-square" aria-label={t('chat.send')} title={t('chat.send')}>
                  <Send size={18} aria-hidden="true" />
                </button>
              )}
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}
