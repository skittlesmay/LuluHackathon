import Link from 'next/link'
import { ArrowLeft, Heart, Sparkles, Users, TreePine } from 'lucide-react'
import { Footer } from '@/components/Footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
      
      <div className="relative">
        {/* Hero Section */}
        <section className="min-h-[60vh] flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8 fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/80 mb-4 hover-lift">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>Место силы и единения с природой</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.9]">
              О ферме
              <br />
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Лу-Лу
              </span>
            </h1>
            
            {/* Intro text */}
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Лу-Лу — это место, где альпаки, словно мягкие облака, встречают вас с тихой нежностью и доверием. 
              Здесь, среди соснового леса, каждый вдох наполнен свежестью, а прикосновение к шерсти альпак 
              дарит ощущение тёплого спокойствия.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Story Card */}
            <div className="glass-strong rounded-[48px] p-10 md:p-16 fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white">История создания</h2>
              </div>
              
              <div className="space-y-6 text-lg text-white/70 leading-relaxed">
                <p>
                  Идея о создании эко-пространства появилась у <strong className="text-white">Лидии Мартемьяновны</strong> и <strong className="text-white">Сергея Алексеевича</strong> после 
                  поездки в Германию, где они увидели ферму с этими чудесными животными.
                </p>
                <p>
                  В августе <strong className="text-white">2023 года</strong> они решили осуществить свою мечту и пригласить детей и взрослых 
                  насладиться общением с альпаками в своем загородном доме.
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="glass-strong rounded-[48px] p-10 md:p-16 fade-in-delay">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-400" />
                </div>
                <h2 className="text-4xl font-bold text-white">Наша миссия</h2>
              </div>
              
              <div className="space-y-6 text-lg text-white/70 leading-relaxed">
                <p>
                  Мы стремимся <strong className="text-white">подарить радость и незабываемые моменты</strong> на свежем воздухе каждому, 
                  кто посетит нас. Наша миссия — создать уникальную атмосферу, где гости могут наслаждаться 
                  общением с дружелюбными альпаками и другими удивительными животными, укрепляя семейные 
                  и дружеские связи.
                </p>
              </div>
            </div>

            {/* Experience Card */}
            <div className="glass-strong rounded-[48px] p-10 md:p-16 fade-in-delay">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <TreePine className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-4xl font-bold text-white">Что вас ждёт</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">🦙 Общение с альпаками</h3>
                  <p className="text-white/60">
                    Их добрые глаза и мелодичные звуки создают связь, которая сближает с природой и друг с другом.
                  </p>
                </div>
                
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">🌲 Сосновый лес</h3>
                  <p className="text-white/60">
                    Каждый вдох наполнен свежестью и ароматом хвои, создавая атмосферу полного умиротворения.
                  </p>
                </div>
                
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">✨ Теплота и уединение</h3>
                  <p className="text-white/60">
                    Лу-Лу — место, где можно почувствовать настоящую теплоту и насладиться моментами чистого счастья.
                  </p>
                </div>
                
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-3">👨‍👩‍👧‍👦 Для всей семьи</h3>
                  <p className="text-white/60">
                    Укрепляйте семейные и дружеские связи в окружении природы и дружелюбных животных.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center py-16">
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Готовы посетить Лу-Лу?
              </h3>
              <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                Забронируйте экскурсию и окунитесь в атмосферу спокойствия и единения с природой
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/booking">
                  <button className="btn-premium">
                    Забронировать экскурсию
                  </button>
                </Link>
                <Link href="/">
                  <button className="btn-secondary">
                    <ArrowLeft className="inline-block mr-2 w-5 h-5" />
                    Вернуться на главную
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  )
}
