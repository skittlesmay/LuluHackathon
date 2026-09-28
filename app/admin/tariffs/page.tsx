import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

async function getTariffs() {
  return await prisma.tariff.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { slots: true },
      },
      schedules: true,
    },
  })
}

export default async function TariffsPage() {
  const tariffs = await getTariffs()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Тарифы</h1>
        <p className="text-muted-foreground">Управление тарифами и ценами</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tariffs.map((tariff) => (
          <Card key={tariff.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{tariff.name}</CardTitle>
                {tariff.isActive ? (
                  <Badge variant="success">Активен</Badge>
                ) : (
                  <Badge variant="secondary">Неактивен</Badge>
                )}
              </div>
              {tariff.description && (
                <p className="text-sm text-muted-foreground">{tariff.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Цены */}
              <div className="space-y-2">
                <h4 className="font-medium">Цены</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Взрослый</p>
                    <p className="font-bold">
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                        minimumFractionDigits: 0,
                      }).format(Number(tariff.adultPrice))}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Детский</p>
                    <p className="font-bold">
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                        minimumFractionDigits: 0,
                      }).format(Number(tariff.childPrice))}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">До 3 лет</p>
                    <p className="font-bold">
                      {Number(tariff.infantPrice) === 0
                        ? 'Бесплатно'
                        : new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'RUB',
                            minimumFractionDigits: 0,
                          }).format(Number(tariff.infantPrice))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Расписание */}
              {tariff.schedules.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Расписание</h4>
                  <div className="space-y-1 text-sm">
                    {tariff.schedules.map((schedule) => (
                      <div key={schedule.id} className="text-muted-foreground">
                        {schedule.dayOfWeek && (
                          <span>
                            {schedule.dayOfWeek === 'MONDAY' && 'Понедельник'}
                            {schedule.dayOfWeek === 'TUESDAY' && 'Вторник'}
                            {schedule.dayOfWeek === 'WEDNESDAY' && 'Среда'}
                            {schedule.dayOfWeek === 'THURSDAY' && 'Четверг'}
                            {schedule.dayOfWeek === 'FRIDAY' && 'Пятница'}
                            {schedule.dayOfWeek === 'SATURDAY' && 'Суббота'}
                            {schedule.dayOfWeek === 'SUNDAY' && 'Воскресенье'}
                          </span>
                        )}
                        {schedule.specificDate && (
                          <span>
                            {new Date(schedule.specificDate).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Статистика */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Используется в <span className="font-medium">{tariff._count.slots}</span>{' '}
                  слотах
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
