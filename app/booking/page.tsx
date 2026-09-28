'use client'

import { useRouter } from 'next/navigation'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { Card, CardContent } from '@/components/ui/card'
import { Info, Clock, Camera, Heart, Users, Sparkles } from 'lucide-react'
import { Footer } from '@/components/Footer'
import type { Slot } from '@/lib/api-client'

export default function BookingPage() {
  const router = useRouter()

  const handleSlotSelect = (slot: Slot) => {
    router.push(`/booking/${slot.id}`)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-7xl">🦙</span>
          </div>
          <h1 className="text-6xl font-bold mb-4">
            Бронирование экскурсии
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Выберите удобную дату и время для посещения нашей фермы
          </p>
        </div>

        {/* Calendar */}
        <div className="animate-fade-in-delay-1">
          <BookingCalendar onSlotSelect={handleSlotSelect} />
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-5xl mx-auto animate-fade-in-delay-2">
          <Card className="glass-strong">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl glass glow-emerald">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Полезная информация</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Длительность экскурсии</div>
                    <div className="text-sm text-secondary">Около 1.5 часа</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Общение с альпаками</div>
                    <div className="text-sm text-secondary">Можно покормить и погладить</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Camera className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Фотосессия</div>
                    <div className="text-sm text-secondary">Включена в стоимость</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Дети до 3 лет</div>
                    <div className="text-sm text-secondary">Проходят бесплатно</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Групповые скидки</div>
                    <div className="text-sm text-secondary">При бронировании более 5 мест</div>
                  </div>
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
