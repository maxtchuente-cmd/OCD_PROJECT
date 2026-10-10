import { apiRequest } from './api/httpClient'
export type SavedOpportunity = { id: number; opportunity_id: number; opportunity: { id: number; title: string; slug: string; organization: string; category: string } }
export type OcdNotification = { id: number; type: string; title: string; message: string; read_at: string | null; created_at: string }
export const memberToolsService = {
  saved: () => apiRequest<{ data: { data: SavedOpportunity[] } }>('/my/saved-opportunities'),
  save: (id: number) => apiRequest(`/opportunities/${id}/save`, { method: 'POST' }),
  unsave: (id: number) => apiRequest(`/opportunities/${id}/save`, { method: 'DELETE' }),
  notifications: () => apiRequest<{ data: { data: OcdNotification[]; current_page?: number }; unread_count: number }>('/my/notifications'),
  markRead: (id: number) => apiRequest(`/my/notifications/${id}/read`, { method: 'POST' }),
  report: (payload: { type: 'opportunity' | 'profile'; id: number; reason: string; details?: string }) => apiRequest('/reports', { method: 'POST', body: JSON.stringify(payload) }),
}
