'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AvailabilityBadge } from './AvailabilityBadge'
import { formatPrice } from '@/lib/utils'
import { Clock, Tag, Users, Baby } from 'lucide-react'
import type { Slot } from '@/lib/api-client'

interface SlotCardProps {
  slot: Slot
  onSelect: (slot: Slot) => void
}

export function SlotCard({ slot, onSelect }: SlotCardProps) {
  const isAvailable = slot.availableCapacity > 0 && slot.status === 'ACTIVE'

  return (
    <Card className={`group ${!isAvailable ? 'opacity-50' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl glass glow-emerald">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight">{slot.time}</div>
              <div className="text-sm text-secondary mt-1 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {slot.tariff.name}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-secondary mb-1">От</div>
            <div className="text-2xl font-bold text-primary">{formatPrice(slot.tariff.adultPrice)}</div>
          </div>
        </div>

        <div className="mb-4">
          <AvailabilityBadge
            available={slot.availableCapacity}
            total={slot.totalCapacity}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5 p-4 glass rounded-2xl">
          <div className="text-center">
            <Users className="h-4 w-4 text-primary mx-auto mb-1" />
            <div className="text-xs text-secondary mb-1">Взрослый</div>
            <div className="font-bold text-sm">{formatPrice(slot.tariff.adultPrice)}</div>
          </div>
          <div className="text-center">
            <Users className="h-4 w-4 text-primary mx-auto mb-1" />
            <div className="text-xs text-secondary mb-1">Детский</div>
            <div className="font-bold text-sm">{formatPrice(slot.tariff.childPrice)}</div>
          </div>
          <div className="text-center">
            <Baby className="h-4 w-4 text-primary mx-auto mb-1" />
            <div className="text-xs text-secondary mb-1">До 3 лет</div>
            <div className="font-bold text-sm text-primary">Free</div>
          </div>
        </div>

        <Button
          onClick={() => onSelect(slot)}
          disabled={!isAvailable}
          className="w-full"
          size="lg"
        >
          {isAvailable ? 'Забронировать' : 'Нет мест'}
        </Button>
      </CardContent>
    </Card>
  )
}
