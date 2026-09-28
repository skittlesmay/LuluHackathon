import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Auth } from '@/lib/auth'
import { LogOut, Calendar, DollarSign, Users, LayoutDashboard, ShieldCheck } from 'lucide-react'

async function AdminNav() {
  const handleLogout = async () => {
    'use server'
    await Auth.destroySession()
    redirect('/admin/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-ultra-thin backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl glass glow-emerald group-hover:glow-emerald-strong transition-smooth">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl">Админка ЛуЛу</span>
            </Link>
            <div className="flex gap-2">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass hover:glass-strong transition-smooth"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="font-medium">Дашборд</span>
              </Link>
              <Link
                href="/admin/slots"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass hover:glass-strong transition-smooth"
              >
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Слоты</span>
              </Link>
              <Link
                href="/admin/bookings"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass hover:glass-strong transition-smooth"
              >
                <Users className="h-4 w-4" />
                <span className="font-medium">Бронирования</span>
              </Link>
              <Link
                href="/admin/tariffs"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass hover:glass-strong transition-smooth"
              >
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">Тарифы</span>
              </Link>
            </div>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass hover:glass-strong transition-smooth text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Выход</span>
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || ''
  const isLoginPage = pathname.includes('/admin/login')

  return (
    <div className="min-h-screen bg-background">
      {!isLoginPage && <AdminNav />}
      <main className={isLoginPage ? '' : 'container mx-auto px-6 pt-28 pb-12'}>
        {children}
      </main>
    </div>
  )
}
