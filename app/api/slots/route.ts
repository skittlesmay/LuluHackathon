import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-utils'

// GET /api/slots - получить список слотов с фильтрацией по датам
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')

    // Формируем фильтр по датам
    const where: any = {
      status: 'ACTIVE',
    }

    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) {
        // Парсим дату правильно (без часового пояса)
        const fromDate = new Date(dateFrom + 'T00:00:00')
        where.date.gte = fromDate
      }
      if (dateTo) {
        // Для конечной даты добавляем 23:59:59
        const toDate = new Date(dateTo + 'T23:59:59')
        where.date.lte = toDate
      }
    } else {
      // По умолчанию показываем слоты на ближайшие 30 дней
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const in30Days = new Date(today)
      in30Days.setDate(in30Days.getDate() + 30)

      where.date = {
        gte: today,
        lte: in30Days,
      }
    }

    // Получаем слоты с тарифами
    const slots = await prisma.slot.findMany({
      where,
      include: {
        tariff: true,
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    })

    // Форматируем данные для клиента
    const formattedSlots = slots.map((slot) => ({
      id: slot.id,
      date: slot.date.toISOString().split('T')[0],
      time: slot.time,
      totalCapacity: slot.totalCapacity,
      availableCapacity: slot.availableCapacity,
      status: slot.status,
      tariff: {
        id: slot.tariff.id,
        name: slot.tariff.name,
        adultPrice: Number(slot.tariff.adultPrice),
        childPrice: Number(slot.tariff.childPrice),
        infantPrice: Number(slot.tariff.infantPrice),
      },
      bookingsCount: slot._count.bookings,
    }))

    return successResponse({ slots: formattedSlots })
  } catch (error) {
    console.error('Error fetching slots:', error)
    return errorResponse('Ошибка при получении слотов', 500)
  }
}
