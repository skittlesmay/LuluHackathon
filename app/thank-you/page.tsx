'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Mail, Info, Sparkles, Home, Calendar, Loader2 } from 'lucide-react'
import { Footer } from '@/components/Footer'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Card className="glass-strong animate-fade-in">
            <CardContent className="pt-16 pb-12 text-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 glow-emerald">
                <Check className="h-12 w-12 text-primary" />
              </div>

              <h1 className="text-5xl font-bold mb-6">Спасибо за бронирование!</h1>
              
              <p className="text-xl text-secondary mb-12 max-w-xl mx-auto">
                Ваше бронирование успешно оплачено
              </p>

              {bookingId && (
                <div className="glass rounded-2xl p-6 mb-10 max-w-md mx-auto">
                  <p className="text-sm text-secondary mb-2">
                    Номер бронирования:
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {bookingId.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              )}

              <div className="glass-strong rounded-2xl p-8 text-left mb-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-2xl glass">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">
                      Письмо отправлено на вашу почту
                    </h3>
                    <p className="text-sm text-secondary mb-4">
                      В письме вы найдете:
                    </p>
                  </div>
                </div>
                <ul className="space-y-3 text-secondary ml-16">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Подтверждение бронирования с деталями</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Чек оплаты</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Памятку для посетителей</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Схему проезда до фермы</span>
                  </li>
                </ul>
              </div>

              <div className="glass-strong rounded-2xl p-8 text-left mb-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-2xl glass">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl">
                    Полезная информация
                  </h3>
                </div>
                <ul className="space-y-3 text-secondary ml-16">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Приезжайте за 10-15 минут до начала экскурсии</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Возьмите с собой воду и удобную обувь</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Можно взять угощение для альпак (морковь, яблоки)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Адрес: Московская область, деревня Лучки</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Телефон: +7 (900) 123-45-67</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full" size="lg">
                    <Home className="h-5 w-5 mr-2" />
                    На главную
                  </Button>
                </Link>
                <Link href="/booking" className="flex-1">
                  <Button className="w-full" size="lg">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Забронировать еще
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-xl text-secondary">Загрузка...</p>
        </div>
      </main>
    }>
      <ThankYouContent />
    </Suspense>
  )
}
