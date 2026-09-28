import { NextRequest } from 'next/server'
import { amocrm } from '@/lib/amocrm'

// GET /api/amocrm/status - проверка статуса AmoCRM интеграции
export async function GET(request: NextRequest) {
  try {
    const isConfigured = amocrm.isConfigured()
    const mode = process.env.AMOCRM_MODE || 'demo'

    return Response.json({
      status: 'active',
      configured: isConfigured,
      mode: mode,
      message: isConfigured
        ? `AmoCRM интеграция активна (${mode} режим)`
        : 'AmoCRM не настроен. Используется режим без интеграции.',
      features: {
        createContact: isConfigured,
        createDeal: isConfigured,
        updateDealStatus: isConfigured,
      },
    })
  } catch (error) {
    console.error('AmoCRM status check error:', error)
    return Response.json(
      {
        status: 'error',
        configured: false,
        message: 'Ошибка при проверке AmoCRM',
      },
      { status: 500 }
    )
  }
}
