import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/admin/slots - создание слота
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, time, totalCapacity, tariffId } = body

    if (!date || !time || !totalCapacity || !tariffId) {
      return Response.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    // Создаем слот
    const slot = await prisma.slot.create({
      data: {
        date: new Date(date),
        time,
        totalCapacity,
        availableCapacity: totalCapacity,
        tariffId,
        status: 'ACTIVE',
      },
      include: {
        tariff: true,
      },
    })

    console.log('Slot created:', slot.id)

    return Response.json({
      success: true,
      slot: {
        id: slot.id,
        date: slot.date.toISOString().split('T')[0],
        time: slot.time,
        totalCapacity: slot.totalCapacity,
        availableCapacity: slot.availableCapacity,
        tariff: slot.tariff,
      },
    })
  } catch (error) {
    console.error('Error creating slot:', error)
    return Response.json(
      { error: 'Ошибка при создании слота' },
      { status: 500 }
    )
  }
}
