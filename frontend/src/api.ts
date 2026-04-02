const BASE = import.meta.env.VITE_API_URL || '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

function getAuthHeader(): HeadersInit {
  const creds = localStorage.getItem('adminAuth')
  if (!creds) return {}
  return { 'Authorization': `Basic ${creds}` }
}

export const api = {
  getWorkshops: () => request<Workshop[]>('/v1/workshops'),
  getWorkshop: (id: string) => request<Workshop>(`/v1/workshops/${id}`),
  getMyWorkshop: () => request<Workshop>('/v1/workshops/subnautica'),
  calculatePrices: (services: { serviceName: string; quantity: number }[], urgency: string) =>
    request<PriceResult[]>('/v1/pricing/calculate', { method: 'POST', body: JSON.stringify({ services, urgency }) }),
  createBooking: (data: CreateBookingRequest) => request<{ orderId: string }>('/v1/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: () => request<OrderResponse[]>('/v1/orders'),
  getOrder: (id: string) => request<OrderResponse>(`/v1/orders/${id}`),
  getOrderEvents: (id: string) => request<OrderEventResponse[]>(`/v1/orders/${id}/events`),
  updateOrderStatus: (id: string, status: string, message: string) =>
    request<void>(`/v1/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, message }) }),
  adminGetServices: () =>
    request<ServiceItemResponse[]>('/v1/admin/services', { headers: getAuthHeader() }),
  adminUpdatePrice: (id: string, price: number) =>
    request<{ status: string }>(`/v1/admin/services/${id}/price`, {
      method: 'PATCH',
      body: JSON.stringify({ price }),
      headers: getAuthHeader(),
    }),
  adminCreateService: (data: { category: string; name: string; nameSv: string; basePrice: number; notes: string }) =>
    request<{ id: string }>('/v1/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: getAuthHeader(),
    }),
  adminDeleteService: (id: string) =>
    request<{ status: string }>(`/v1/admin/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    }),
  submitDiagnosis: (orderId: string, findings: string, recommendedItems: string, updatedPrice: number) =>
    request<any>(`/v1/orders/${orderId}/diagnosis`, {
      method: 'POST',
      body: JSON.stringify({ findings, recommendedItems, updatedPrice }),
    }),
  approveDiagnosis: (orderId: string) =>
    request<any>(`/v1/orders/${orderId}/approve`, { method: 'POST' }),
  adminLogin: (username: string, password: string) => {
    const creds = btoa(`${username}:${password}`)
    localStorage.setItem('adminAuth', creds)
    return request<ServiceItemResponse[]>('/v1/admin/services', {
      headers: { 'Authorization': `Basic ${creds}` },
    })
  },
  adminLogout: () => { localStorage.removeItem('adminAuth') },
  isAdminLoggedIn: () => !!localStorage.getItem('adminAuth'),
};

export interface ServiceItemResponse {
  id: string;
  category: string;
  name: string;
  nameSv: string;
  basePrice: number;
  notes: string;
}

export interface Workshop {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  prioritySurchargePct: number;
  emergencySurchargePct: number;
  warrantyYears: number;
  acceptsWetSuits: boolean;
  acceptsVikingHd: boolean;
  hasMailIn: boolean;
  services: ServiceItemResponse[];
}

export interface LineItem {
  serviceId: string;
  nameSv: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PriceResult {
  workshopId: string;
  workshopName: string;
  city: string;
  warrantyYears: number;
  items: LineItem[];
  subtotal: number;
  urgencySurcharge: number;
  total: number;
}

export interface CreateBookingRequest {
  workshopId: string;
  bookingType: string;
  suitType: string;
  suitBrand: string;
  items: string;
  urgency: string;
  estimatedPrice: number;
  notes: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  postalCode: string;
  city: string;
  isBusiness: boolean;
  company: string;
  orgNr: string;
}

export interface OrderResponse {
  id: string;
  workshopId: string;
  bookingType: string;
  status: string;
  suitType: string;
  suitBrand: string;
  items: string;
  urgency: string;
  estimatedPrice: number;
  finalPrice: number | null;
  notes: string;
  paymentStatus: string;
  createdAt: string;
  diagnosisFindings: string | null;
  diagnosisItems: string | null;
  diagnosisPrice: number | null;
  diagnosisApproved: boolean;
}

export interface OrderEventResponse {
  status: string;
  message: string;
  createdBy: string;
  createdAt: string;
}
