import { NextRequest, NextResponse } from 'next/server'
import { paykeeper } from '@/lib/paykeeper'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Получаем бронирование из БД
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
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
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Создаём ссылку на оплату через PayKeeper
    const paymentResponse = await paykeeper.createPayment({
      orderId: booking.id,
      amount: Number(booking.totalAmount),
      clientEmail: booking.user.email,
      clientPhone: booking.user.phone,
      clientName: booking.customerName,
      serviceName: `Экскурсия на ферму альпак - ${new Date(booking.slot.date).toLocaleDateString('ru-RU')} в ${booking.slot.time}`,
    })

    // Сохраняем invoice_id в бронировании (можно добавить поле в модель)
    // await prisma.booking.update({
    //   where: { id: bookingId },
    //   data: { invoiceId: paymentResponse.invoiceId },
    // })

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResponse.url,
      invoiceId: paymentResponse.invoiceId,
    })
  } catch (error: any) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    )
  }
}
