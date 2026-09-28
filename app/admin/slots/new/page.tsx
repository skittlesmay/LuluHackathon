'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface Tariff {
  id: string
  name: string
  adultPrice: number
}

export default function NewSlotPage() {
  const router = useRouter()
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    time: '10:00',
    totalCapacity: 15,
    tariffId: '',
  })

  useEffect(() => {
    // Загружаем тарифы
    fetch('/api/tariffs?active_only=true')
      .then((res) => res.json())
      .then((data) => {
        setTariffs(data.tariffs)
        if (data.tariffs.length > 0) {
          setFormData((prev) => ({ ...prev, tariffId: data.tariffs[0].id }))
        }
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/slots')
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при создании слота')
      }
    } catch (error) {
      alert('Ошибка при создании слота')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Создать слот</h1>
        <p className="text-muted-foreground">Добавление нового слота бронирования</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Данные слота</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Дата</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                min={new Date().toISOString().split('T')[0]}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="time">Время</Label>
              <select
                id="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                required
              >
                <option value="10:00">10:00</option>
                <option value="12:00">12:00</option>
                <option value="14:00">14:00</option>
                <option value="16:00">16:00</option>
                <option value="18:00">18:00</option>
              </select>
            </div>

            <div>
              <Label htmlFor="tariff">Тариф</Label>
              <select
                id="tariff"
                value={formData.tariffId}
                onChange={(e) => setFormData({ ...formData, tariffId: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                required
              >
                {tariffs.map((tariff) => (
                  <option key={tariff.id} value={tariff.id}>
                    {tariff.name} ({tariff.adultPrice}₽)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="capacity">Вместимость</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.totalCapacity}
                onChange={(e) =>
                  setFormData({ ...formData, totalCapacity: parseInt(e.target.value) })
                }
                min={1}
                max={50}
                required
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Максимальное количество мест для этого слота
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/slots')}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Создание...' : 'Создать слот'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
