import { cookies } from 'next/headers'

interface AdminCredentials {
  username: string
  password: string
}

export class Auth {
  private static COOKIE_NAME = 'admin_session'
  private static COOKIE_MAX_AGE = 60 * 60 * 24 

  static async verifyCredentials(credentials: AdminCredentials): Promise<boolean> {
    const validUsername = process.env.ADMIN_USERNAME || 'admin'
    const validPassword = process.env.ADMIN_PASSWORD || 'hackathon2024'

    return (
      credentials.username === validUsername &&
      credentials.password === validPassword
    )
  }

  static async createSession(): Promise<void> {
    const cookieStore = cookies()
    cookieStore.set(this.COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: this.COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
    })
  }

  
  static async verifySession(): Promise<boolean> {
    const cookieStore = cookies()
    const session = cookieStore.get(this.COOKIE_NAME)
    return !!session && session.value === 'authenticated'
  }

  
  static async destroySession(): Promise<void> {
    const cookieStore = cookies()
    cookieStore.delete(this.COOKIE_NAME)
  }
}
