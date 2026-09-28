import { NextRequest } from 'next/server'
import { Auth } from '@/lib/auth'

// POST /api/admin/login - вход в админку
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return Response.json(
        { error: 'Заполните все поля' },
        { status: 400 }
      )
    }

    const isValid = await Auth.verifyCredentials({ username, password })

    if (!isValid) {
      return Response.json(
        { error: 'Неверный логин или пароль' },
        { status: 401 }
      )
    }

    await Auth.createSession()

    return Response.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return Response.json(
      { error: 'Ошибка при входе' },
      { status: 500 }
    )
  }
}
