import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-utils'

// GET /api/slots/:id - получить детали слота
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slot = await prisma.slot.findUnique({
      where: { id: params.id },
      include: {
        tariff: true,
        bookings: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'PAID'],
            },
          },
          select: {
            id: true,
            adultTickets: true,
            childTickets: true,
            infantTickets: true,
          },
        },
      },
    })

    if (!slot) {
      return errorResponse('Слот не найден', 404)
    }

    // Форматируем данные
    const formattedSlot = {
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
        description: slot.tariff.description,
      },
      bookingsCount: slot.bookings.length,
    }

    return successResponse(formattedSlot)
  } catch (error) {
    console.error('Error fetching slot:', error)
    return errorResponse('Ошибка при получении слота', 500)
  }
}
