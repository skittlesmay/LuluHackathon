import { NextRequest } from 'next/server'
import { emailClient } from '@/lib/email'

// GET /api/email/status - проверка статуса Email интеграции
export async function GET(request: NextRequest) {
  try {
    const isConfigured = emailClient.isConfigured()
    const mode = process.env.EMAIL_MODE || 'demo'

    return Response.json({
      status: 'active',
      configured: isConfigured,
      mode: mode,
      message: isConfigured
        ? `Email интеграция активна (${mode} режим)`
        : 'Email не настроен. Письма не будут отправляться.',
      provider: mode === 'production' ? 'SendGrid' : 'Console',
      fromEmail: process.env.EMAIL_FROM || 'noreply@lulu-alpaca.ru',
    })
  } catch (error) {
    console.error('Email status check error:', error)
    return Response.json(
      {
        status: 'error',
        configured: false,
        message: 'Ошибка при проверке Email',
      },
      { status: 500 }
    )
  }
}
