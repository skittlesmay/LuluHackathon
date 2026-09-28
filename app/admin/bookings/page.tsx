import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, Clock, Mail, Phone, Ticket, DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getBookings() {
  return await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      slot: {
        include: {
          tariff: true,
        },
      },
    },
    take: 50,
  })
}

export default async function BookingsPage() {
  const bookings = await getBookings()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="success">Оплачено</Badge>
      case 'PENDING':
        return <Badge variant="warning">Ожидает оплаты</Badge>
      case 'CANCELLED':
        return <Badge variant="danger">Отменено</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-5xl font-bold mb-3">Бронирования</h1>
        <p className="text-xl text-secondary">Управление бронированиями</p>
      </div>

      <Card className="glass-strong">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Все бронирования</CardTitle>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {bookings.length} записей
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-2xl glass">
                  <Users className="h-16 w-16 text-primary/50" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Бронирований пока нет</h3>
              <p className="text-secondary">Ожидаем первых клиентов</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-6 glass rounded-2xl hover:glass-strong transition-smooth"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Client Info */}
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-xl glass">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-bold text-lg">{booking.customerName}</p>
                            <span className="text-xs font-mono text-secondary">
                              #{booking.id.slice(0, 8)}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-secondary">
                              <Mail className="h-3 w-3" />
                              <span>{booking.user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-secondary">
                              <Phone className="h-3 w-3" />
                              <span>{booking.user.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tour Details */}
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-xl glass">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg mb-2">
                            {new Date(booking.slot.date).toLocaleDateString('ru-RU', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-secondary">
                              <Clock className="h-3 w-3" />
                              <span>{booking.slot.time}</span>
                            </div>
                            <div className="text-secondary">
                              {booking.slot.tariff.name}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tickets & Amount */}
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-xl glass">
                          <Ticket className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="space-y-1 text-sm mb-2">
                            {booking.adultTickets > 0 && (
                              <div className="text-secondary">
                                Взрослых: <span className="font-semibold text-foreground">{booking.adultTickets}</span>
                              </div>
                            )}
                            {booking.childTickets > 0 && (
                              <div className="text-secondary">
                                Детских: <span className="font-semibold text-foreground">{booking.childTickets}</span>
                              </div>
                            )}
                            {booking.infantTickets > 0 && (
                              <div className="text-secondary">
                                До 3 лет: <span className="font-semibold text-foreground">{booking.infantTickets}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="text-xl font-bold text-primary">
                              {new Intl.NumberFormat('ru-RU', {
                                style: 'currency',
                                currency: 'RUB',
                                minimumFractionDigits: 0,
                              }).format(Number(booking.totalAmount))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status & Date */}
                    <div className="text-right">
                      <div className="mb-3">
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-xs text-secondary">
                        {new Date(booking.createdAt).toLocaleString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
