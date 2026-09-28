import { prisma } from './prisma'

// Типы для API
export interface TicketsInput {
  adult: number
  child: number
  infant: number
}

export interface BookingInput {
  slotId: string
  user: {
    name: string
    phone: string
    email: string
  }
  tickets: TicketsInput
  agreements: {
    offer: boolean
    personalData: boolean
  }
}

// Расчет общего количества билетов
export function calculateTotalTickets(tickets: TicketsInput): number {
  return tickets.adult + tickets.child + tickets.infant
}

// Расчет стоимости бронирования
export function calculateBookingTotal(
  tariff: { adultPrice: any; childPrice: any; infantPrice: any },
  tickets: TicketsInput
): number {
  const adultPrice = Number(tariff.adultPrice)
  const childPrice = Number(tariff.childPrice)
  const infantPrice = Number(tariff.infantPrice)

  return (
    adultPrice * tickets.adult +
    childPrice * tickets.child +
    infantPrice * tickets.infant
  )
}

// Проверка доступности слота
export async function checkSlotAvailability(
  slotId: string,
  ticketsCount: number
): Promise<{ available: boolean; slot?: any; error?: string }> {
  const slot = await prisma.slot.findUnique({
    where: { id: slotId },
    include: { tariff: true },
  })

  if (!slot) {
    return { available: false, error: 'Слот не найден' }
  }

  if (slot.status !== 'ACTIVE') {
    return { available: false, error: 'Слот недоступен для бронирования' }
  }

  if (slot.availableCapacity < ticketsCount) {
    return {
      available: false,
      error: `Недостаточно мест. Доступно: ${slot.availableCapacity}`,
    }
  }

  return { available: true, slot }
}

// Получение тарифа по дате (учитывая расписание)
export async function getTariffForDate(date: Date): Promise<any> {
  const dayOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][
    date.getDay()
  ]

  // Ищем тариф по расписанию для данного дня недели
  const schedule = await prisma.tariffSchedule.findFirst({
    where: {
      OR: [
        { dayOfWeek: dayOfWeek },
        {
          specificDate: {
            gte: new Date(date.setHours(0, 0, 0, 0)),
            lt: new Date(date.setHours(23, 59, 59, 999)),
          },
        },
      ],
    },
    include: {
      tariff: true,
    },
    orderBy: {
      priority: 'desc',
    },
  })

  if (schedule) {
    return schedule.tariff
  }

  // Если не нашли в расписании, возвращаем первый активный тариф
  return await prisma.tariff.findFirst({
    where: { isActive: true },
  })
}

// Форматирование ответа API с ошибкой
export function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status })
}

// Форматирование успешного ответа API
export function successResponse(data: any, status = 200) {
  return Response.json(data, { status })
}
