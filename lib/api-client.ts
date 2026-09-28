// API клиент для фронтенда

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export interface Slot {
  id: string
  date: string
  time: string
  totalCapacity: number
  availableCapacity: number
  status: string
  tariff: {
    id: string
    name: string
    adultPrice: number
    childPrice: number
    infantPrice: number
  }
  bookingsCount: number
}

export interface Tariff {
  id: string
  name: string
  adultPrice: number
  childPrice: number
  infantPrice: number
  description: string | null
  isActive: boolean
}

export interface BookingInput {
  slotId: string
  user: {
    name: string
    phone: string
    email: string
  }
  tickets: {
    adult: number
    child: number
    infant: number
  }
  agreements: {
    offer: boolean
    personalData: boolean
  }
}

export interface Booking {
  id: string
  status: string
  totalAmount: number
  adultTickets: number
  childTickets: number
  infantTickets: number
  paymentLink: string
  slot: {
    date: string
    time: string
  }
  user: {
    name: string
    email: string
    phone: string
  }
}

// Получить список слотов
export async function fetchSlots(dateFrom?: string, dateTo?: string): Promise<Slot[]> {
  const params = new URLSearchParams()
  if (dateFrom) params.append('date_from', dateFrom)
  if (dateTo) params.append('date_to', dateTo)

  const url = `${API_BASE_URL}/api/slots${params.toString() ? `?${params}` : ''}`
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Ошибка при загрузке слотов')
  }
  
  const data = await response.json()
  return data.slots
}

// Получить конкретный слот
export async function fetchSlot(id: string): Promise<Slot> {
  const response = await fetch(`${API_BASE_URL}/api/slots/${id}`)
  
  if (!response.ok) {
    throw new Error('Ошибка при загрузке слота')
  }
  
  return await response.json()
}

// Получить список тарифов
export async function fetchTariffs(activeOnly = true): Promise<Tariff[]> {
  const params = new URLSearchParams()
  if (activeOnly) params.append('active_only', 'true')

  const response = await fetch(`${API_BASE_URL}/api/tariffs?${params}`)
  
  if (!response.ok) {
    throw new Error('Ошибка при загрузке тарифов')
  }
  
  const data = await response.json()
  return data.tariffs
}

// Создать бронирование
export async function createBooking(input: BookingInput): Promise<{ booking: Booking }> {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Ошибка при создании бронирования')
  }
  
  return await response.json()
}
