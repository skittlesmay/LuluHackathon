import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, DollarSign, CheckCircle, TrendingUp, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getStats() {
  const [totalBookings, paidBookings, totalSlots, activeSlots] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PAID' } }),
    prisma.slot.count(),
    prisma.slot.count({ where: { status: 'ACTIVE' } }),
  ])

  const totalRevenue = await prisma.booking.aggregate({
    where: { status: 'PAID' },
    _sum: { totalAmount: true },
  })

  return {
    totalBookings,
    paidBookings,
    totalSlots,
    activeSlots,
    totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
  }
}

async function getRecentBookings() {
  return await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      slot: {
        include: {
          tariff: true,
        },
      },
    },
  })
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const recentBookings = await getRecentBookings()

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="text-5xl font-bold mb-3">Дашборд</h1>
        <p className="text-xl text-secondary">Обзор системы бронирования</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-strong hover:glass transition-smooth group">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-secondary">Всего бронирований</CardTitle>
            <div className="p-2 rounded-xl glass group-hover:glow-emerald transition-smooth">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-1">{stats.totalBookings}</div>
            <div className="flex items-center gap-1 text-xs text-secondary">
              <TrendingUp className="h-3 w-3" />
              <span>Всех времен</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong hover:glass transition-smooth group">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-secondary">Оплаченные</CardTitle>
            <div className="p-2 rounded-xl glass group-hover:glow-emerald transition-smooth">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary mb-1">{stats.paidBookings}</div>
            <div className="flex items-center gap-1 text-xs text-secondary">
              <span>Успешных заказов</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong hover:glass transition-smooth group">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-secondary">Активных слотов</CardTitle>
            <div className="p-2 rounded-xl glass group-hover:glow-emerald transition-smooth">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-1">{stats.activeSlots}</div>
            <p className="text-xs text-secondary">из {stats.totalSlots} всего</p>
          </CardContent>
        </Card>

        <Card className="glass-strong hover:glass transition-smooth group border-primary/30 glow-emerald">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-secondary">Выручка</CardTitle>
            <div className="p-2 rounded-xl glass group-hover:glow-emerald-strong transition-smooth">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0,
              }).format(stats.totalRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="glass-strong">
        <CardHeader>
          <CardTitle className="text-2xl">Последние бронирования</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <div className="text-center py-12 text-secondary">
                Бронирований пока нет
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-5 glass rounded-2xl hover:glass-strong transition-smooth"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl glass">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{booking.customerName}</p>
                      <div className="flex items-center gap-2 text-sm text-secondary mt-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(booking.slot.date).toLocaleDateString('ru-RU')} в {booking.slot.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl mb-2">
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                        minimumFractionDigits: 0,
                      }).format(Number(booking.totalAmount))}
                    </p>
                    <Badge
                      variant={
                        booking.status === 'PAID'
                          ? 'success'
                          : booking.status === 'PENDING'
                          ? 'warning'
                          : 'secondary'
                      }
                    >
                      {booking.status === 'PAID' ? 'Оплачено' : booking.status === 'PENDING' ? 'Ожидает оплаты' : booking.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
