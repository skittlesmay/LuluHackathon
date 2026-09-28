import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/slots/:id - обновление слота
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { date, time, totalCapacity, availableCapacity, tariffId, status } = body

    // Проверяем что слот существует
    const existingSlot = await prisma.slot.findUnique({
      where: { id: params.id },
    })

    if (!existingSlot) {
      return Response.json({ error: 'Слот не найден' }, { status: 404 })
    }

    // Обновляем слот
    const updateData: any = {}
    if (date) {
      const slotDate = new Date(date + 'T12:00:00')
      updateData.date = slotDate
    }
    if (time) updateData.time = time
    if (totalCapacity !== undefined) updateData.totalCapacity = totalCapacity
    if (availableCapacity !== undefined) updateData.availableCapacity = availableCapacity
    if (tariffId) updateData.tariffId = tariffId
    if (status) updateData.status = status

    const updatedSlot = await prisma.slot.update({
      where: { id: params.id },
      data: updateData,
      include: {
        tariff: true,
      },
    })

    console.log('Slot updated:', params.id)

    return Response.json({
      success: true,
      slot: {
        id: updatedSlot.id,
        date: updatedSlot.date.toISOString().split('T')[0],
        time: updatedSlot.time,
        totalCapacity: updatedSlot.totalCapacity,
        availableCapacity: updatedSlot.availableCapacity,
        status: updatedSlot.status,
        tariff: updatedSlot.tariff,
      },
    })
  } catch (error) {
    console.error('Error updating slot:', error)
    return Response.json(
      { error: 'Ошибка при обновлении слота' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/slots/:id - удаление слота
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем есть ли бронирования на этот слот
    const bookingsCount = await prisma.booking.count({
      where: {
        slotId: params.id,
        status: {
          in: ['PENDING', 'PAID'],
        },
      },
    })

    if (bookingsCount > 0) {
      return Response.json(
        {
          error: `Нельзя удалить слот с активными бронированиями (${bookingsCount})`,
        },
        { status: 400 }
      )
    }

    // Удаляем слот
    await prisma.slot.delete({
      where: { id: params.id },
    })

    console.log('Slot deleted:', params.id)

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting slot:', error)
    return Response.json(
      { error: 'Ошибка при удалении слота' },
      { status: 500 }
    )
  }
}

// GET /api/admin/slots/:id - получить слот
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slot = await prisma.slot.findUnique({
      where: { id: params.id },
      include: {
        tariff: true,
        _count: {
          select: { bookings: true },
        },
      },
    })

    if (!slot) {
      return Response.json({ error: 'Слот не найден' }, { status: 404 })
    }

    return Response.json({
      id: slot.id,
      date: slot.date.toISOString().split('T')[0],
      time: slot.time,
      totalCapacity: slot.totalCapacity,
      availableCapacity: slot.availableCapacity,
      status: slot.status,
      tariff: slot.tariff,
      bookingsCount: slot._count.bookings,
    })
  } catch (error) {
    console.error('Error fetching slot:', error)
    return Response.json(
      { error: 'Ошибка при получении слота' },
      { status: 500 }
    )
  }
}
