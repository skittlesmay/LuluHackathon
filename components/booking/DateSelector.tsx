'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Получаем массив дат на текущий месяц
  const getDatesInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const dates: Date[] = []

    // Добавляем даты начиная с сегодня
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      if (d >= today) {
        dates.push(new Date(d))
      }
    }

    return dates
  }

  const dates = getDatesInMonth(currentMonth)

  const nextMonth = () => {
    const next = new Date(currentMonth)
    next.setMonth(next.getMonth() + 1)
    setCurrentMonth(next)
  }

  const prevMonth = () => {
    const prev = new Date(currentMonth)
    prev.setMonth(prev.getMonth() - 1)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (prev >= today || prev.getMonth() === today.getMonth()) {
      setCurrentMonth(prev)
    }
  }

  const formatMonthYear = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  const formatWeekday = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      weekday: 'short',
    }).format(date)
  }

  const formatDay = (date: Date) => {
    return date.getDate()
  }

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="glass-strong rounded-3xl p-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMonth}
          disabled={currentMonth.getMonth() === today.getMonth()}
          className="hover:glass"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-xl font-bold capitalize">
          {formatMonthYear(currentMonth)}
        </h3>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:glass">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Date Grid */}
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date, index) => (
          <button
            key={index}
            onClick={() => onDateChange(date)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-2xl transition-smooth hover-lift
              ${
                isSelected(date)
                  ? 'bg-primary text-primary-foreground font-bold glow-emerald'
                  : 'glass hover:glass-strong'
              }
            `}
          >
            <span className={`text-xs mb-1 ${isSelected(date) ? 'opacity-90' : 'text-secondary'}`}>
              {formatWeekday(date)}
            </span>
            <span className="text-lg font-semibold">{formatDay(date)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
