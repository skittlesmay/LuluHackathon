import { NextRequest } from 'next/server'
import { amocrmLogger } from '@/lib/amocrm-logger'

// GET /api/amocrm/logs - получить логи AmoCRM операций
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')

    const logs = amocrmLogger.getLogs(limit)

    return Response.json({
      logs,
      total: logs.length,
      lastLog: amocrmLogger.getLastLog(),
    })
  } catch (error) {
    console.error('Error fetching AmoCRM logs:', error)
    return Response.json(
      { error: 'Ошибка при получении логов' },
      { status: 500 }
    )
  }
}

// DELETE /api/amocrm/logs - очистить логи
export async function DELETE() {
  try {
    amocrmLogger.clear()
    return Response.json({ message: 'Логи очищены' })
  } catch (error) {
    console.error('Error clearing logs:', error)
    return Response.json(
      { error: 'Ошибка при очистке логов' },
      { status: 500 }
    )
  }
}
