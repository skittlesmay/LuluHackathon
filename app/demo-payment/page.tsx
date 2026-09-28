'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Check, X } from 'lucide-react'

function DemoPaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)

  const orderId = searchParams.get('order_id') || ''
  const amount = parseFloat(searchParams.get('amount') || '0')
  const email = searchParams.get('email') || ''
  const service = searchParams.get('service') || 'Услуга'

  const handlePayment = async (success: boolean) => {
    setIsProcessing(true)

    // Симулируем задержку оплаты
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (success) {
      // Отправляем webhook на наш сервер
      const formData = new FormData()
      formData.append('orderid', orderId)
      formData.append('status', 'success')
      formData.append('sum', amount.toString())
      formData.append('id', `demo_payment_${Date.now()}`)

      try {
        await fetch('/api/payments/webhook', {
          method: 'POST',
          body: formData,
        })

        // Редирект на страницу благодарности
        router.push(`/thank-you?bookingId=${orderId}`)
      } catch (error) {
        console.error('Webhook error:', error)
        alert('Ошибка при обработке оплаты')
        setIsProcessing(false)
      }
    } else {
      alert('Оплата отменена')
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* DEMO баннер */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-6 text-center">
            <p className="font-semibold text-yellow-900">
              PayKeeper
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Оплата заказа
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Информация о платеже */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Номер заказа:</span>
                  <span className="font-medium">{orderId.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Услуга:</span>
                  <span className="font-medium">{service}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{email}</span>
                </div>
                <div className="pt-3 border-t flex justify-between items-center">
                  <span className="font-semibold">Сумма</span>
                  <span className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: 'RUB',
                      minimumFractionDigits: 0,
                    }).format(amount)}
                  </span>
                </div>
              </div>

              {/* DEMO информация */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-semibold mb-2">
                  💡 Тестовый режим
                </p>
                <p className="text-sm text-blue-800">
                  Выберите результат оплаты для тестирования:
                </p>
              </div>

              {/* Кнопки действий */}
              {isProcessing ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">⏳</div>
                  <p className="text-lg text-muted-foreground">Обработка платежа...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handlePayment(true)}
                    size="lg"
                    className="w-full"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Успешная оплата
                  </Button>
                  <Button
                    onClick={() => handlePayment(false)}
                    variant="destructive"
                    size="lg"
                    className="w-full"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Отменить оплату
                  </Button>
                </div>
              )}

              {/* Информация о методах оплаты */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center mb-3">
                  В реальном режиме доступны:
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded">💳 Карты</span>
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded">📱 СБП</span>
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded">🏦 Интернет-банкинг</span>
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded">📲 Электронные кошельки</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default function DemoPaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-lg text-muted-foreground">Загрузка...</p>
          </div>
        </main>
      }
    >
      <DemoPaymentContent />
    </Suspense>
  )
}
