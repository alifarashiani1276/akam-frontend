// Thin wrapper over fetch for every API call (features/<feature>/<feature>Api.js use it).
// Base URL: VITE_API_URL (see .env.example).
//
// Success -> the parsed JSON (null when the body is empty, e.g. 204).
// Failure -> throws HttpError { status, message, errors }
//   status  : HTTP status, or 0 when there was no response (offline, DNS, CORS ...)
//   message : server "message" (Laravel style) or a generic fallback. For logs/developers only:
//             texts shown to visitors come from i18n (see components/ui/PageState.jsx).
//   errors  : Laravel validation errors { field: [messages] }, or null
// An aborted request (AbortController / React Query cancel) is re-thrown untouched.

const BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

export class HttpError extends Error {
  constructor({ status = 0, message = 'Request failed', errors = null } = {}) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.errors = errors
  }
}

function buildUrl(path, params) {
  const url = /^https?:\/\//.test(path) ? path : `${BASE_URL}/${path.replace(/^\/+/, '')}`
  if (!params) return url
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.append(key, value)
  }
  const query = search.toString()
  return query ? `${url}${url.includes('?') ? '&' : '?'}${query}` : url
}

async function readBody(res) {
  if (res.status === 204) return { data: null }
  const text = await res.text()
  if (!text) return { data: null }
  try {
    return { data: JSON.parse(text) }
  } catch {
    return { data: null, invalid: true }
  }
}

async function request(method, path, { params, body, headers, signal } = {}) {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData
  const init = {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && !isForm && { 'Content-Type': 'application/json' }),
      ...headers,
    },
  }
  if (body !== undefined) init.body = isForm ? body : JSON.stringify(body)

  let res
  try {
    res = await fetch(buildUrl(path, params), init)
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    throw new HttpError({ status: 0, message: 'Network error' })
  }

  const { data, invalid } = await readBody(res)
  if (!res.ok) {
    throw new HttpError({
      status: res.status,
      message: data?.message || res.statusText || 'Request failed',
      errors: data?.errors ?? null,
    })
  }
  if (invalid) throw new HttpError({ status: res.status, message: 'Invalid JSON response' })
  return data
}

// options: { params, headers, signal }. Pass React Query's `signal` so cancelled queries abort the request.
export const http = {
  get: (path, options) => request('GET', path, options),
  post: (path, body, options) => request('POST', path, { ...options, body }),
  put: (path, body, options) => request('PUT', path, { ...options, body }),
  patch: (path, body, options) => request('PATCH', path, { ...options, body }),
  delete: (path, options) => request('DELETE', path, options),
}
