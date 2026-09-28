import { NextRequest, NextResponse } from 'next/server'
import { paykeeper } from '@/lib/paykeeper'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invoiceId, bookingId } = body

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      )
    }

    // Проверяем статус оплаты через PayKeeper
    const paymentStatus = await paykeeper.checkPaymentStatus(invoiceId)
    const isPaid = paymentStatus.status === 'paid'

    // Если оплата успешна и передан bookingId, обновляем бронирование
    if (isPaid && bookingId) {
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

      if (booking && booking.status !== 'PAID') {
        // Обновляем статус бронирования
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'PAID',
            paymentId: invoiceId,
            paidAt: new Date(),
          },
        })

        console.log('✅ Booking paid successfully:', bookingId)

        // Обновляем статус в AmoCRM
        const { amocrm } = await import('@/lib/amocrm')
        if (booking.amocrmDealId && amocrm.isConfigured()) {
          try {
            await amocrm.updateDealStatus(booking.amocrmDealId)
            console.log('✅ AmoCRM: статус сделки обновлен')
          } catch (error) {
            console.error('❌ AmoCRM update error:', error)
          }
        }

        // Отправляем email подтверждение
        const { emailClient } = await import('@/lib/email')
        if (emailClient.isConfigured()) {
          try {
            await emailClient.sendBookingConfirmation({
              to: booking.user.email,
              bookingId: booking.id,
              customerName: booking.customerName,
              excursionDate: new Date(booking.slot.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
              excursionTime: booking.slot.time,
              adultTickets: booking.adultTickets,
              childTickets: booking.childTickets,
              infantTickets: booking.infantTickets,
              totalAmount: Number(booking.totalAmount),
              tariffName: booking.slot.tariff.name,
            })
            console.log('✅ Email: подтверждение отправлено')
          } catch (error) {
            console.error('❌ Email error:', error)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      status: paymentStatus.status,
      invoiceId: paymentStatus.invoiceId,
      isPaid: isPaid,
    })
  } catch (error: any) {
    console.error('Error checking payment status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check payment status' },
      { status: 500 }
    )
  }
}
