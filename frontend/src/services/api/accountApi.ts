const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '')

export type AccountType = 'candidate' | 'professional' | 'freelancer' | 'entrepreneur' | 'organization'
export type AccountProfile = {
  id?: number; catalog_images?: {id:number;url:string;caption?:string|null;is_public?:boolean}[]; avatar_url?: string | null; review_status?: 'draft' | 'pending' | 'approved' | 'rejected'; review_note?: string | null; public_name?: string | null; phone?: string | null; country_id?: number | null
  city?: string | null; region?: string | null; nationality?: string | null; professional_title?: string | null
  professional_category_id?: number | null; country?: ReferenceItem | null; bio?: string | null; education_level?: string | null
  years_experience?: number | null; available_for_work?: boolean; is_public?: boolean
}
export type ReferenceItem = { id: number; name: string; code?: string; iso2?: string; slug?: string }

function readToken() { return localStorage.getItem('ocd_access_token') }
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = readToken()
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'Une erreur est survenue. Réessayez.')
  return payload as T
}

export const accountApi = {
  async register(data: { name: string; email: string; password: string; password_confirmation: string; account_type: AccountType; email_notifications?: boolean; opportunity_alerts?: boolean }) {
    const result = await request<{ token: string; user: { id: number; name: string; email: string; account_type?: string }; profile: AccountProfile }>('/auth/register', { method: 'POST', body: JSON.stringify(data) })
    localStorage.setItem('ocd_access_token', result.token); return result
  },
  async login(data: { email: string; password: string }) {
    const result = await request<{ token: string; user: { id: number; name: string; email: string; account_type?: string }; profile: AccountProfile }>('/auth/login', { method: 'POST', body: JSON.stringify(data) })
    localStorage.setItem('ocd_access_token', result.token); return result
  },
  me: () => request<{ user: { id: number; name: string; email: string; account_type?: string }; profile: AccountProfile }>('/auth/me'),
  updateProfile: (data: AccountProfile) => request<{ data: AccountProfile }>('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  submitProfileReview: () => request<{ message: string; data: AccountProfile }>('/profile/submit-review', { method: 'POST', body: JSON.stringify({}) }),
  uploadCatalog: async (files: File[]) => { const form = new FormData(); files.forEach(file => form.append('images[]', file)); const token = readToken(); const response = await fetch(`${API_BASE}/profile/catalog`, { method: 'POST', headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: form }); const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload.message || 'Envoi du catalogue impossible.'); return payload as { message: string; data: { id:number; url:string; caption?:string|null; is_public:boolean }[] } },
  deleteCatalogImage: (id:number) => request<{message:string}>(`/profile/catalog/${id}`, { method:'DELETE' }),
  uploadAvatar: async (file: File) => { const form = new FormData(); form.append('avatar', file); const token = readToken(); const response = await fetch(`${API_BASE}/profile/avatar`, { method: 'POST', headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: form }); const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload.message || 'Envoi de la photo impossible.'); return payload as { message: string; avatar_url: string } },
  logout: async () => { try { await request('/auth/logout', { method: 'POST' }) } finally { localStorage.removeItem('ocd_access_token') } },
  countries: async () => (await request<{ data: ReferenceItem[] }>('/references/countries')).data,
  categories: async () => (await request<{ data: ReferenceItem[] }>('/references/professional-categories')).data,
}
