import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Calendar, Clock, Users, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getSlots() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return await prisma.slot.findMany({
    where: {
      date: {
        gte: today,
      },
    },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
    include: {
      tariff: true,
      _count: {
        select: { bookings: true },
      },
    },
    take: 100,
  })
}

export default async function SlotsPage() {
  const slots = await getSlots()

  const getStatusBadge = (slot: any) => {
    if (slot.status === 'BLOCKED') {
      return <Badge variant="danger">Заблокирован</Badge>
    }
    if (slot.status === 'FULL' || slot.availableCapacity === 0) {
      return <Badge variant="warning">Заполнен</Badge>
    }
    const percentage = (slot.availableCapacity / slot.totalCapacity) * 100
    if (percentage > 50) {
      return <Badge variant="success">Доступно</Badge>
    }
    return <Badge variant="warning">Мало мест</Badge>
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold mb-3">Слоты</h1>
          <p className="text-xl text-secondary">Управление слотами бронирования</p>
        </div>
        <Link href="/admin/slots/new">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Создать слот
          </Button>
        </Link>
      </div>

      <Card className="glass-strong">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Ближайшие слоты</CardTitle>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {slots.length} слотов
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {slots.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-2xl glass">
                  <Calendar className="h-16 w-16 text-primary/50" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Слотов пока нет</h3>
              <p className="text-secondary mb-6">Создайте первый слот для начала работы</p>
              <Link href="/admin/slots/new">
                <Button size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Создать слот
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-6 glass rounded-2xl hover:glass-strong transition-smooth"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                      {/* Date & Time */}
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl glass">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">
                            {new Date(slot.date).toLocaleDateString('ru-RU', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-secondary">
                            <Clock className="h-3 w-3" />
                            <span>{slot.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tariff */}
                      <div className="px-4 py-2 glass rounded-xl">
                        <p className="font-semibold">{slot.tariff.name}</p>
                        <p className="text-sm text-secondary">
                          {new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'RUB',
                            minimumFractionDigits: 0,
                          }).format(Number(slot.tariff.adultPrice))}
                        </p>
                      </div>

                      {/* Capacity */}
                      <div className="flex-1 max-w-xs">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold">
                              {slot.availableCapacity} / {slot.totalCapacity}
                            </span>
                          </div>
                          <span className="text-xs text-secondary">
                            {Math.round((slot.availableCapacity / slot.totalCapacity) * 100)}%
                          </span>
                        </div>
                        <div className="w-full glass rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-2 rounded-full transition-smooth glow-emerald"
                            style={{
                              width: `${
                                (slot.availableCapacity / slot.totalCapacity) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Bookings Count */}
                      <div className="text-center px-4">
                        <div className="text-2xl font-bold text-primary">{slot._count.bookings}</div>
                        <div className="text-xs text-secondary">бронирований</div>
                      </div>

                      {/* Status */}
                      <div>
                        {getStatusBadge(slot)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-4">
                      <Link href={`/admin/slots/${slot.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Редактировать
                        </Button>
                      </Link>
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
