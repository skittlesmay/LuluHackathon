'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Suspense } from 'react'
import { Lock, User, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const from = searchParams.get('from') || '/admin'
        router.push(from)
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Неверный логин или пароль')
      }
    } catch (err) {
      setError('Ошибка при входе')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="p-4 rounded-2xl glass-strong glow-emerald">
              <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Админ-панель</h1>
          <p className="text-secondary">Ферма альпак ЛуЛу</p>
        </div>

        <Card className="glass-strong animate-fade-in-delay-1">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Вход в систему</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-base mb-2 block">Логин</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    required
                    className="pl-12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-base mb-2 block">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-12"
                  />
                </div>
              </div>

              {error && (
                <div className="glass-strong rounded-2xl p-4 border border-destructive/30">
                  <div className="flex items-center gap-3 text-destructive">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </Button>

              <div className="glass rounded-2xl p-4 text-center">
                <p className="text-sm text-secondary mb-1">По умолчанию:</p>
                <p className="font-mono text-sm font-semibold">admin / hackathon2024</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </main>
    }>
      <LoginForm />
    </Suspense>
  )
}
