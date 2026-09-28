'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Clock, CreditCard, Loader2, AlertCircle, Info } from 'lucide-react'
import { Footer } from '@/components/Footer'

interface Booking {
  id: string
  status: string
  totalAmount: number
  adultTickets: number
  childTickets: number
  infantTickets: number
  customerName: string
  paymentLink: string
  slot: {
    date: string
    time: string
  }
  user: {
    name: string
    email: string
    phone: string
  }
}

export default function PaymentPage({ params }: { params: { bookingId: string } }) {
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const loadBooking = async () => {
      try {
        // Загружаем информацию о бронировании
        const response = await fetch(`/api/bookings/${params.bookingId}`)
        if (response.ok) {
          const data = await response.json()
          setBooking(data)
        }
      } catch (err) {
        console.error('Error loading booking:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadBooking()
  }, [params.bookingId])

  const handlePayment = async () => {
    if (!booking) return
    
    setIsProcessing(true)

    try {
      // Шаг 1: Создаём ссылку на оплату через PayKeeper
      const createResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id }),
      })

      if (!createResponse.ok) {
        throw new Error('Failed to create payment link')
      }

      const { paymentUrl, invoiceId } = await createResponse.json()

      // Шаг 2: Открываем popup с оплатой
      const paymentWindow = window.open(
        paymentUrl,
        'PayKeeper',
        'width=800,height=600,scrollbars=yes,resizable=yes'
      )

      if (!paymentWindow) {
        alert('Пожалуйста, разрешите всплывающие окна для оплаты')
        setIsProcessing(false)
        return
      }

      // Шаг 3: Проверяем статус оплаты каждые 3 секунды
      const checkInterval = setInterval(async () => {
        // Проверяем, закрыто ли окно оплаты
        if (paymentWindow.closed) {
          clearInterval(checkInterval)
          
          // Проверяем финальный статус оплаты
          try {
            const checkResponse = await fetch('/api/payments/check', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ invoiceId, bookingId: booking.id }),
            })

            if (checkResponse.ok) {
              const { isPaid } = await checkResponse.json()
              
              if (isPaid) {
                // Оплата успешна - редирект на thank you
                router.push(`/thank-you?bookingId=${booking.id}`)
              } else {
                setIsProcessing(false)
                alert('Оплата не завершена. Попробуйте снова.')
              }
            } else {
              setIsProcessing(false)
            }
          } catch (error) {
            console.error('Error checking payment:', error)
            setIsProcessing(false)
          }
        }
      }, 3000) // Проверка каждые 3 секунды

      // Таймаут на 10 минут
      setTimeout(() => {
        clearInterval(checkInterval)
        if (!paymentWindow.closed) {
          paymentWindow.close()
        }
        setIsProcessing(false)
      }, 600000)

    } catch (error: any) {
      console.error('Payment error:', error)
      alert(error.message || 'Ошибка при создании оплаты')
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-xl text-secondary">Загрузка...</p>
        </div>
      </main>
    )
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-strong max-w-md">
          <CardContent className="py-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl glass-strong">
                <AlertCircle className="h-16 w-16 text-destructive" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3">Бронирование не найдено</h3>
            <p className="text-secondary">Проверьте правильность ссылки</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">Оплата бронирования</h1>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full glow-emerald"></div>
          </div>

          <Card className="mb-8 glass-strong animate-fade-in-delay-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl">Бронирование создано</CardTitle>
                <Badge variant="warning" className="text-sm px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Ожидает оплаты
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="glass-strong rounded-2xl p-6 border border-primary/30 glow-emerald">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-primary/20">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">
                      Бронирование успешно создано!
                    </h3>
                    <p className="text-secondary">
                      Номер бронирования: <strong className="text-foreground">{booking.id.slice(0, 8).toUpperCase()}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-xl">Детали бронирования:</h3>
                <div className="glass rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Дата:</span>
                    <span className="font-semibold">{new Date(booking.slot.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Время:</span>
                    <span className="font-semibold">{booking.slot.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Билетов:</span>
                    <span className="font-semibold">
                      {booking.adultTickets + booking.childTickets + booking.infantTickets}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-xl">Контактная информация:</h3>
                <div className="glass rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between"><span className="text-secondary">Имя:</span><strong>{booking.customerName}</strong></div>
                  <div className="flex justify-between"><span className="text-secondary">Телефон:</span><strong>{booking.user.phone}</strong></div>
                  <div className="flex justify-between"><span className="text-secondary">Email:</span><strong>{booking.user.email}</strong></div>
                </div>
              </div>

              <div className="pt-6 mt-6">
                <div className="glass rounded-2xl p-6 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Сумма к оплате:</span>
                    <span className="text-4xl font-bold text-primary">
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                        minimumFractionDigits: 0,
                      }).format(booking.totalAmount)}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment} 
                  className="w-full" 
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Обработка оплаты...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Перейти к оплате
                    </>
                  )}
                </Button>

                <p className="text-sm text-secondary text-center mt-4">
                  После оплаты подтверждение будет отправлено на <strong className="text-foreground">{booking.user.email}</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-strong animate-fade-in-delay-2">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl glass">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg mb-3">Информация:</p>
                  <ul className="space-y-2 text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Бронирование действительно 30 минут</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>После оплаты вы получите подтверждение на email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Можно оплатить картой или через СБП</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}
