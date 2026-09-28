'use client'

import { SlotCard } from './SlotCard'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarX2, Loader2 } from 'lucide-react'
import type { Slot } from '@/lib/api-client'

interface SlotListProps {
  slots: Slot[]
  onSlotSelect: (slot: Slot) => void
  isLoading?: boolean
}

export function SlotList({ slots, onSlotSelect, isLoading }: SlotListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-56 glass rounded-3xl animate-pulse relative overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <Card className="glass-strong">
        <CardContent className="py-16 text-center">
          <div className="flex justify-center mb-4">
            <CalendarX2 className="h-16 w-16 text-primary/50" />
          </div>
          <h3 className="text-xl font-bold mb-2">Нет доступных слотов</h3>
          <p className="text-secondary max-w-sm mx-auto">
            На выбранную дату нет свободных мест. Попробуйте выбрать другой день.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 scroll-smooth" style={{
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
    }}>
      {slots.map((slot, index) => (
        <div key={slot.id} className={`animate-fade-in-delay-${Math.min(index, 3)}`}>
          <SlotCard slot={slot} onSelect={onSlotSelect} />
        </div>
      ))}
    </div>
  )
}
