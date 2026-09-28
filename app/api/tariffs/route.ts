import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-utils'

// GET /api/tariffs - получить список тарифов
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active_only') === 'true'

    const where: any = {}
    if (activeOnly) {
      where.isActive = true
    }

    const tariffs = await prisma.tariff.findMany({
      where,
      include: {
        schedules: true,
        _count: {
          select: { slots: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    // Форматируем данные
    const formattedTariffs = tariffs.map((tariff) => ({
      id: tariff.id,
      name: tariff.name,
      adultPrice: Number(tariff.adultPrice),
      childPrice: Number(tariff.childPrice),
      infantPrice: Number(tariff.infantPrice),
      description: tariff.description,
      isActive: tariff.isActive,
      slotsCount: tariff._count.slots,
      schedules: tariff.schedules.map((schedule) => ({
        id: schedule.id,
        dayOfWeek: schedule.dayOfWeek,
        specificDate: schedule.specificDate
          ? schedule.specificDate.toISOString().split('T')[0]
          : null,
        timeFrom: schedule.timeFrom,
        timeTo: schedule.timeTo,
        priority: schedule.priority,
      })),
    }))

    return successResponse({ tariffs: formattedTariffs })
  } catch (error) {
    console.error('Error fetching tariffs:', error)
    return errorResponse('Ошибка при получении тарифов', 500)
  }
}
