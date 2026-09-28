import { z } from 'zod'

export const bookingSchema = z.object({
  
  name: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное'),
  
  phone: z
    .string()
    .regex(/^\+7\d{10}$/, 'Неверный формат телефона. Используйте +7XXXXXXXXXX'),
  
  email: z
    .string()
    .email('Неверный формат email')
    .min(1, 'Email обязателен'),

  
  tickets: z.object({
    adult: z.number().min(0).max(10),
    child: z.number().min(0).max(10),
    infant: z.number().min(0).max(10),
  }).refine(
    (data) => data.adult + data.child + data.infant > 0,
    {
      message: 'Выберите хотя бы один билет',
      path: ['adult'],
    }
  ).refine(
    (data) => data.adult + data.child + data.infant <= 10,
    {
      message: 'Максимум 10 билетов за одно бронирование',
      path: ['adult'],
    }
  ),

  // Согласия
  agreements: z.object({
    offer: z.literal(true, {
      errorMap: () => ({ message: 'Необходимо согласие с договором оферты' }),
    }),
    personalData: z.literal(true, {
      errorMap: () => ({ message: 'Необходимо согласие на обработку персональных данных' }),
    }),
  }),
})

export type BookingFormData = z.infer<typeof bookingSchema>
