'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookingSchema, type BookingFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TicketSelector } from './TicketSelector'
import { formatPrice, formatDate, formatTime } from '@/lib/utils'
import type { Slot } from '@/lib/api-client'
import { ArrowLeft } from 'lucide-react'

interface BookingFormProps {
  slot: Slot
  onBack: () => void
  onSubmit: (data: BookingFormData) => void
}

export function BookingForm({ slot, onBack, onSubmit }: BookingFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '+7',
      email: '',
      tickets: {
        adult: 0,
        child: 0,
        infant: 0,
      },
    },
  })

  const tickets = watch('tickets')
  const name = watch('name')
  const phone = watch('phone')
  const email = watch('email')
  
  const [offerAccepted, setOfferAccepted] = useState(false)
  const [personalDataAccepted, setPersonalDataAccepted] = useState(false)

  // Расчет общей суммы
  const totalAmount =
    tickets.adult * slot.tariff.adultPrice +
    tickets.child * slot.tariff.childPrice +
    tickets.infant * slot.tariff.infantPrice

  const totalTickets = tickets.adult + tickets.child + tickets.infant

  const canProceedToStep2 = totalTickets > 0 && totalTickets <= 10
  const canProceedToStep3 =
    canProceedToStep2 && name && phone.length === 12 && email && !errors.name && !errors.phone && !errors.email

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Валидируем согласия вручную
    if (!offerAccepted || !personalDataAccepted) {
      return
    }
    
    // Собираем данные формы
    const formData: BookingFormData = {
      name,
      phone,
      email,
      tickets,
      agreements: {
        offer: true,
        personalData: true,
      },
    }
    
    onSubmit(formData)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Slot Info */}
      <Card className="mb-8 glass-strong">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-secondary mb-2">Выбранный слот</div>
              <div className="font-bold text-2xl mb-1">
                {formatDate(new Date(slot.date))} в {slot.time}
              </div>
              <div className="text-sm text-secondary">{slot.tariff.name}</div>
            </div>
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Изменить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold transition-smooth ${
              step >= 1 ? 'bg-primary text-primary-foreground glow-emerald' : 'glass'
            }`}
          >
            1
          </div>
          <div className={`w-16 h-1 rounded-full transition-smooth ${step >= 2 ? 'bg-primary glow-emerald' : 'glass'}`} />
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold transition-smooth ${
              step >= 2 ? 'bg-primary text-primary-foreground glow-emerald' : 'glass'
            }`}
          >
            2
          </div>
          <div className={`w-16 h-1 rounded-full transition-smooth ${step >= 3 ? 'bg-primary glow-emerald' : 'glass'}`} />
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold transition-smooth ${
              step >= 3 ? 'bg-primary text-primary-foreground glow-emerald' : 'glass'
            }`}
          >
            3
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit}>
        {/* Step 1: Tickets */}
        {step === 1 && (
          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="text-3xl">Выберите билеты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <TicketSelector
                label="Взрослый билет"
                price={slot.tariff.adultPrice}
                count={tickets.adult}
                onChange={(count) => setValue('tickets.adult', count)}
              />

              <TicketSelector
                label="Детский билет (3-12 лет)"
                price={slot.tariff.childPrice}
                count={tickets.child}
                onChange={(count) => setValue('tickets.child', count)}
              />

              <TicketSelector
                label="Детский билет (до 3 лет)"
                price={slot.tariff.infantPrice}
                count={tickets.infant}
                onChange={(count) => setValue('tickets.infant', count)}
              />

              {errors.tickets?.adult && (
                <p className="text-sm text-destructive mt-2">{errors.tickets.adult.message}</p>
              )}

              <div className="pt-6 mt-6">
                <div className="p-6 glass rounded-2xl mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">Итого:</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(totalAmount)}
                      </div>
                      <div className="text-sm text-secondary mt-1">
                        {totalTickets} {totalTickets === 1 ? 'билет' : totalTickets < 5 ? 'билета' : 'билетов'}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full"
                  size="lg"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                >
                  Продолжить
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Contact Info */}
        {step === 2 && (
          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="text-3xl">Контактные данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-base mb-2 block">Имя *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Иван Иванов"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-2">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-base mb-2 block">Телефон *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+79001234567"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-2">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-base mb-2 block">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="ivan@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-2">{errors.email.message}</p>
                )}
              </div>

              <div className="pt-6 mt-6 flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1" size="lg">
                  Назад
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                  className="flex-1"
                  size="lg"
                >
                  Продолжить
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="text-3xl">Подтверждение</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Booking Summary */}
              <div className="glass rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-xl">Детали бронирования:</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Дата:</span>
                    <span className="font-semibold">{formatDate(new Date(slot.date))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Время:</span>
                    <span className="font-semibold">{slot.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Тариф:</span>
                    <span className="font-semibold">{slot.tariff.name}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  {tickets.adult > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Взрослых билетов: {tickets.adult}</span>
                      <span className="font-semibold">{formatPrice(tickets.adult * slot.tariff.adultPrice)}</span>
                    </div>
                  )}
                  {tickets.child > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Детских билетов: {tickets.child}</span>
                      <span className="font-semibold">{formatPrice(tickets.child * slot.tariff.childPrice)}</span>
                    </div>
                  )}
                  {tickets.infant > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-secondary">Детских (до 3 лет): {tickets.infant}</span>
                      <span className="font-semibold text-primary">Бесплатно</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <span className="font-bold text-xl">Итого к оплате:</span>
                  <span className="font-bold text-3xl text-primary">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="glass rounded-2xl p-6 space-y-3">
                <h4 className="font-bold text-xl mb-4">Контактная информация:</h4>
                <div className="flex justify-between"><span className="text-secondary">Имя:</span><strong>{name}</strong></div>
                <div className="flex justify-between"><span className="text-secondary">Телефон:</span><strong>{phone}</strong></div>
                <div className="flex justify-between"><span className="text-secondary">Email:</span><strong>{email}</strong></div>
              </div>

              {/* Agreements */}
              <div className="glass rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="offer"
                    checked={offerAccepted}
                    onCheckedChange={(checked) => setOfferAccepted(checked === true)}
                  />
                  <label htmlFor="offer" className="text-sm leading-relaxed cursor-pointer">
                    Ознакомлен с{' '}
                    <a href="#" className="text-primary underline hover:no-underline">
                      договором оферты
                    </a>{' '}
                    *
                  </label>
                </div>
                {!offerAccepted && step === 3 && (
                  <p className="text-sm text-destructive">Необходимо согласие с договором оферты</p>
                )}

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="personalData"
                    checked={personalDataAccepted}
                    onCheckedChange={(checked) => setPersonalDataAccepted(checked === true)}
                  />
                  <label htmlFor="personalData" className="text-sm leading-relaxed cursor-pointer">
                    Даю согласие на обработку персональных данных в соответствии с{' '}
                    <a href="#" className="text-primary underline hover:no-underline">
                      политикой конфиденциальности
                    </a>{' '}
                    *
                  </label>
                </div>
                {!personalDataAccepted && step === 3 && (
                  <p className="text-sm text-destructive">
                    Необходимо согласие на обработку персональных данных
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="pt-6 mt-6 flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1" size="lg">
                  Назад
                </Button>
                <Button
                  type="submit"
                  disabled={!offerAccepted || !personalDataAccepted}
                  className="flex-1"
                  size="lg"
                >
                  Забронировать и оплатить
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
}
