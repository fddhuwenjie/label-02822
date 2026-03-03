const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`
  try {
    const res = await fetch(fullUrl, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || data.error || `HTTP ${res.status}`)
    return data
  } catch (e) {
    throw e
  }
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (url) => request(url, { method: 'DELETE' })
}
