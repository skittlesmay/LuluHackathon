'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'

interface Tariff {
  id: string
  name: string
  adultPrice: number
}

interface Slot {
  id: string
  date: string
  time: string
  totalCapacity: number
  availableCapacity: number
  status: string
  tariff: Tariff
  bookingsCount: number
}

export default function EditSlotPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [slot, setSlot] = useState<Slot | null>(null)
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    time: '10:00',
    totalCapacity: 15,
    availableCapacity: 15,
    tariffId: '',
    status: 'ACTIVE',
  })

  useEffect(() => {
    // Загружаем слот
    fetch(`/api/admin/slots/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setSlot(data)
        setFormData({
          date: data.date,
          time: data.time,
          totalCapacity: data.totalCapacity,
          availableCapacity: data.availableCapacity,
          tariffId: data.tariff.id,
          status: data.status,
        })
      })

    // Загружаем тарифы
    fetch('/api/tariffs?active_only=true')
      .then((res) => res.json())
      .then((data) => setTariffs(data.tariffs))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/slots/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/slots')
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при обновлении слота')
      }
    } catch (error) {
      alert('Ошибка при обновлении слота')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Вы уверены что хотите удалить этот слот?')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/slots/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/slots')
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при удалении слота')
      }
    } catch (error) {
      alert('Ошибка при удалении слота')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!slot) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Редактировать слот</h1>
          <p className="text-muted-foreground">ID: {slot.id.slice(0, 8)}</p>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting || slot.bookingsCount > 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </Button>
      </div>

      {slot.bookingsCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ На этот слот есть {slot.bookingsCount} бронирований. Удаление недоступно.
          </p>
        </div>
      )}

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalCapacity">Общая вместимость</Label>
                <Input
                  id="totalCapacity"
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
              </div>

              <div>
                <Label htmlFor="availableCapacity">Доступно мест</Label>
                <Input
                  id="availableCapacity"
                  type="number"
                  value={formData.availableCapacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availableCapacity: parseInt(e.target.value),
                    })
                  }
                  min={0}
                  max={formData.totalCapacity}
                  required
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Можно изменить вручную
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Статус</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                required
              >
                <option value="ACTIVE">Активный</option>
                <option value="BLOCKED">Заблокирован</option>
                <option value="FULL">Заполнен</option>
              </select>
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
                {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
