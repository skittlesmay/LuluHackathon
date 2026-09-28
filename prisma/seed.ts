import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Очистка существующих данных
  await prisma.booking.deleteMany()
  await prisma.slot.deleteMany()
  await prisma.tariffSchedule.deleteMany()
  await prisma.tariff.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Старые данные удалены')

  // Создание тарифов
  const tariffStandard = await prisma.tariff.create({
    data: {
      name: 'Стандарт',
      adultPrice: 1500,
      childPrice: 800,
      infantPrice: 0,
      description: 'Стандартный тариф для выходных дней',
      isActive: true,
    },
  })

  const tariffPromo = await prisma.tariff.create({
    data: {
      name: 'Промо',
      adultPrice: 1200,
      childPrice: 600,
      infantPrice: 0,
      description: 'Промо тариф для будних дней',
      isActive: true,
    },
  })

  console.log('✅ Тарифы созданы:', tariffStandard.name, tariffPromo.name)

  // Создание расписания тарифов
  // Промо тариф для будних дней (понедельник-пятница)
  const weekdays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
  for (const day of weekdays) {
    await prisma.tariffSchedule.create({
      data: {
        tariffId: tariffPromo.id,
        dayOfWeek: day,
        priority: 1,
      },
    })
  }

  // Стандартный тариф для выходных (суббота-воскресенье)
  const weekends = ['SATURDAY', 'SUNDAY']
  for (const day of weekends) {
    await prisma.tariffSchedule.create({
      data: {
        tariffId: tariffStandard.id,
        dayOfWeek: day,
        priority: 1,
      },
    })
  }

  console.log('✅ Расписание тарифов создано')

  // Создание слотов на ближайшие 14 дней
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  console.log('📅 Создаем слоты начиная с:', today.toISOString().split('T')[0])

  const timeSlots = ['10:00', '12:00', '14:00', '16:00']
  const slotsCreated = []

  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    
    // Определяем день недели (0 = воскресенье, 1 = понедельник, ...)
    const dayOfWeek = date.getDay()
    
    // Ферма работает каждый день (включая понедельник)

    // Выбираем тариф в зависимости от дня недели
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 // Воскресенье или суббота
    const tariff = isWeekend ? tariffStandard : tariffPromo

    // Создаем слоты для каждого времени
    for (const time of timeSlots) {
      const slot = await prisma.slot.create({
        data: {
          date: date,
          time: time,
          totalCapacity: 15,
          availableCapacity: 15,
          tariffId: tariff.id,
          status: 'ACTIVE',
        },
      })
      slotsCreated.push(slot)
    }
  }

  console.log(`✅ Создано ${slotsCreated.length} слотов`)

  // Создание тестовых пользователей
  const user1 = await prisma.user.create({
    data: {
      name: 'Иван Иванов',
      phone: '+79001234567',
      email: 'ivan@example.com',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Мария Петрова',
      phone: '+79009876543',
      email: 'maria@example.com',
    },
  })

  console.log('✅ Тестовые пользователи созданы')

  // Создание тестового бронирования
  const testSlot = slotsCreated[0]
  const booking = await prisma.booking.create({
    data: {
      userId: user1.id,
      slotId: testSlot.id,
      adultTickets: 2,
      childTickets: 1,
      infantTickets: 0,
      totalAmount: 3800, // 2 * 1500 + 1 * 800 (или промо цены)
      status: 'PAID',
      paidAt: new Date(),
    },
  })

  // Обновляем доступность слота
  await prisma.slot.update({
    where: { id: testSlot.id },
    data: {
      availableCapacity: testSlot.availableCapacity - 3,
    },
  })

  console.log('✅ Тестовое бронирование создано')

  console.log('\n🎉 База данных успешно заполнена!')
  console.log(`📊 Статистика:`)
  console.log(`   - Тарифов: 2`)
  console.log(`   - Слотов: ${slotsCreated.length}`)
  console.log(`   - Пользователей: 2`)
  console.log(`   - Бронирований: 1`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
