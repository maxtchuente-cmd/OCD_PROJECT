import { apiRequest } from './api/httpClient'

export type OpportunitySearch = { q?: string; category?: string; country?: string; page?: number; per_page?: number }
export type OpportunityRecord = { id: number; title: string; slug: string; category: string; organization: string; country_name?: string; city?: string; deadline_at?: string; summary?: string; description?: string; opportunity_type?: string; is_remote?: boolean; application_url?: string; contact_email?: string; contact_phone?: string; status?: string }
export type Paginated<T> = { data: T[]; current_page: number; last_page: number; total: number }

/** Recherche des opportunités publiées par OCD. */
export const opportunityService = {
  search(params: OpportunitySearch = {}) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== '') query.set(key, String(value)) })
    return apiRequest<Paginated<OpportunityRecord>>(`/opportunities${query.size ? `?${query.toString()}` : ''}`)
  },
  getBySlug(slug: string) {
    return apiRequest<{ data: OpportunityRecord }>(`/opportunities/${encodeURIComponent(slug)}`)
  },
  apply(slug: string, cover_message = '') {
    return apiRequest<{ message: string }>(`/opportunities/${encodeURIComponent(slug)}/apply`, { method: 'POST', body: JSON.stringify({ cover_message }) })
  },
}
