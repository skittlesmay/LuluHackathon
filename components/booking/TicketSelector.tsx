'use client'

import { Minus, Plus, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface TicketSelectorProps {
  label: string
  price: number
  count: number
  onChange: (count: number) => void
  max?: number
}

export function TicketSelector({
  label,
  price,
  count,
  onChange,
  max = 10,
}: TicketSelectorProps) {
  const increment = () => {
    if (count < max) {
      onChange(count + 1)
    }
  }

  const decrement = () => {
    if (count > 0) {
      onChange(count - 1)
    }
  }

  return (
    <div className="flex items-center justify-between p-5 glass rounded-2xl transition-smooth hover:glass-strong">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl glass">
          <Ticket className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-semibold">{label}</div>
          <div className="text-sm text-secondary">
            {price === 0 ? <span className="text-primary font-medium">Бесплатно</span> : formatPrice(price)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={decrement}
          disabled={count === 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-xl font-bold w-10 text-center">{count}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={increment}
          disabled={count >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
