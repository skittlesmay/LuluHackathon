import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-utils'

// GET /api/bookings/:id - получить детали бронирования
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        slot: {
          include: {
            tariff: true,
          },
        },
      },
    })

    if (!booking) {
      return errorResponse('Бронирование не найдено', 404)
    }

    // Форматируем данные
    const formattedBooking = {
      id: booking.id,
      status: booking.status,
      totalAmount: Number(booking.totalAmount),
      adultTickets: booking.adultTickets,
      childTickets: booking.childTickets,
      infantTickets: booking.infantTickets,
      customerName: booking.customerName,
      paymentLink: booking.paymentLink,
      createdAt: booking.createdAt.toISOString(),
      paidAt: booking.paidAt?.toISOString() || null,
      slot: {
        date: booking.slot.date.toISOString().split('T')[0],
        time: booking.slot.time,
        tariff: booking.slot.tariff.name,
      },
      user: {
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone,
      },
    }

    return successResponse(formattedBooking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return errorResponse('Ошибка при получении бронирования', 500)
  }
}
