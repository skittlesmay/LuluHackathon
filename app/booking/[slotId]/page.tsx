'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookingForm } from '@/components/booking/BookingForm'
import { fetchSlot, createBooking, type Slot } from '@/lib/api-client'
import type { BookingFormData } from '@/lib/validations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { Footer } from '@/components/Footer'

export default function BookingFormPage({ params }: { params: { slotId: string } }) {
  const router = useRouter()
  const [slot, setSlot] = useState<Slot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadSlot = async () => {
      try {
        const data = await fetchSlot(params.slotId)
        setSlot(data)
      } catch (err) {
        console.error('Error loading slot:', err)
        setError('Ошибка при загрузке слота')
      } finally {
        setIsLoading(false)
      }
    }

    loadSlot()
  }, [params.slotId])

  const handleSubmit = async (data: BookingFormData) => {
    if (!slot) return

    setIsSubmitting(true)

    try {
      const result = await createBooking({
        slotId: slot.id,
        user: {
          name: data.name,
          phone: data.phone,
          email: data.email,
        },
        tickets: data.tickets,
        agreements: data.agreements,
      })

      router.push(`/payment/${result.booking.id}`)
    } catch (err: any) {
      console.error('Error creating booking:', err)
      alert(`Ошибка при создании бронирования: ${err.message}`)
      setIsSubmitting(false)
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

  if (error || !slot) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <Card className="glass-strong max-w-2xl mx-auto">
            <CardContent className="py-16 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl glass-strong">
                  <AlertCircle className="h-16 w-16 text-destructive" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">Ошибка</h3>
              <p className="text-secondary mb-8">{error || 'Слот не найден'}</p>
              <Button
                onClick={() => router.push('/booking')}
                variant="outline"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Вернуться к выбору слотов
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">Оформление бронирования</h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full glow-emerald"></div>
        </div>
        
        {isSubmitting ? (
          <div className="text-center py-16">
            <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-6" />
            <p className="text-xl text-secondary">Создаем бронирование...</p>
          </div>
        ) : (
          <div className="animate-fade-in-delay-1">
            <BookingForm
              slot={slot}
              onBack={() => router.push('/booking')}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
