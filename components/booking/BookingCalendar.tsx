'use client'

import { useState, useEffect } from 'react'
import { DateSelector } from './DateSelector'
import { SlotList } from './SlotList'
import { fetchSlots, type Slot } from '@/lib/api-client'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, AlertCircle } from 'lucide-react'

interface BookingCalendarProps {
  onSlotSelect: (slot: Slot) => void
}

export function BookingCalendar({ onSlotSelect }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [slots, setSlots] = useState<Slot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSlots = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const dateStr = selectedDate.toISOString().split('T')[0]
        console.log('Loading slots for date:', dateStr)
        const allSlots = await fetchSlots(dateStr, dateStr)
        console.log('Received slots:', allSlots.length)
        setSlots(allSlots)
      } catch (err) {
        console.error('Error loading slots:', err)
        setError('Ошибка при загрузке слотов')
      } finally {
        setIsLoading(false)
      }
    }

    loadSlots()
  }, [selectedDate])

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* Date Selection */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl glass glow-emerald">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Выберите дату</h2>
        </div>
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* Slots List */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl glass glow-emerald">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">
            {formatDate(selectedDate)}
          </h2>
        </div>

        {error ? (
          <Card className="glass-strong border-destructive/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <SlotList
            slots={slots}
            onSlotSelect={onSlotSelect}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}
