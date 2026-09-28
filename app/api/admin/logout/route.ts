import { NextRequest } from 'next/server'
import { Auth } from '@/lib/auth'

// POST /api/admin/logout - выход из админки
export async function POST(request: NextRequest) {
  try {
    await Auth.destroySession()
    return Response.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return Response.json(
      { error: 'Ошибка при выходе' },
      { status: 500 }
    )
  }
}
