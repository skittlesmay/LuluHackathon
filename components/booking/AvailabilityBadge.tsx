'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

interface AvailabilityBadgeProps {
  available: number
  total: number
}

export function AvailabilityBadge({ available, total }: AvailabilityBadgeProps) {
  const percentage = (available / total) * 100

  let variant: 'success' | 'warning' | 'danger' = 'success'
  let text = 'Много мест'
  let Icon = CheckCircle2

  if (percentage === 0) {
    variant = 'danger'
    text = 'Нет мест'
    Icon = XCircle
  } else if (percentage < 20) {
    variant = 'danger'
    text = 'Осталось мало'
    Icon = AlertCircle
  } else if (percentage < 50) {
    variant = 'warning'
    text = 'Места заканчиваются'
    Icon = AlertCircle
  }

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl glass">
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {text}
      </Badge>
      <span className="text-sm text-secondary font-medium">
        {available} / {total} мест
      </span>
    </div>
  )
}
