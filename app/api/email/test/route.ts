import { NextRequest } from 'next/server'
import { emailClient } from '@/lib/email'

// POST /api/email/test - тестовая отправка email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return Response.json(
        { error: 'Email обязателен' },
        { status: 400 }
      )
    }

    // Отправляем тестовое письмо
    await emailClient.sendBookingConfirmation({
      to: email,
      bookingId: 'test-' + Date.now(),
      customerName: 'Тестовый Пользователь',
      excursionDate: '15 февраля 2024',
      excursionTime: '14:00',
      adultTickets: 2,
      childTickets: 1,
      infantTickets: 0,
      totalAmount: 3800,
      tariffName: 'Стандарт',
    })

    return Response.json({
      success: true,
      message: `Тестовое письмо отправлено на ${email}`,
      mode: process.env.EMAIL_MODE || 'demo',
    })
  } catch (error: any) {
    console.error('Test email error:', error)
    return Response.json(
      {
        error: 'Ошибка при отправке тестового письма',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
