import Link from 'next/link'
import { ArrowRight, Sparkles, Calendar, Shield, Zap, Heart } from 'lucide-react'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
      
      <div className="relative">
        {/* Hero секция */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto text-center space-y-8 fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/80 mb-4 hover-lift">
              <Sparkles className="w-4 h-4" />
              <span>Премиальные экскурсии с альпаками</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 leading-[0.9]">
              ЛуЛу
              <br />
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Альпака
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Незабываемая встреча с пушистыми друзьями.
              <br />
              Мгновенное бронирование и подтверждение.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 fade-in-delay">
              <Link href="/booking">
                <button className="btn-premium group">
                  Забронировать экскурсию
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <a href="#features">
                <button className="btn-secondary">
                  Узнать больше
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Features секция */}
        <section id="features" className="py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 fade-in">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Почему выбирают нас
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Премиальный опыт от бронирования до встречи
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature Card 1 */}
              <div className="glass rounded-3xl p-8 hover-lift group">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Мгновенное бронирование</h3>
                <p className="text-white/60 leading-relaxed">
                  Забронируйте экскурсию за 2 минуты. Моментальное подтверждение на почту.
                </p>
              </div>
              
              {/* Feature Card 2 */}
              <div className="glass rounded-3xl p-8 hover-lift group">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Гибкое расписание</h3>
                <p className="text-white/60 leading-relaxed">
                  Выбирайте удобное время из доступных слотов в реальном времени.
                </p>
              </div>
              
              {/* Feature Card 3 */}
              <div className="glass rounded-3xl p-8 hover-lift group">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Безопасная оплата</h3>
                <p className="text-white/60 leading-relaxed">
                  Защищенные платежи через PayKeeper. Карты, СБП и другие способы.
                </p>
              </div>
            </div>
            
            {/* About Us Button */}
            <div className="text-center mt-16 fade-in-delay">
              <Link href="/about">
                <button className="btn-secondary text-lg">
                  Информация о ферме
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats секция */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="glass-strong rounded-[48px] p-12 md:p-16">
              <div className="grid md:grid-cols-4 gap-12">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">500+</div>
                  <div className="text-white/60">Довольных гостей</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">15</div>
                  <div className="text-white/60">Дружелюбных альпак</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">4.9</div>
                  <div className="text-white/60">Средняя оценка</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">24/7</div>
                  <div className="text-white/60">Онлайн бронирование</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA секция */}
        <section className="py-32 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-strong rounded-[48px] p-12 md:p-20 fade-in">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Готовы к незабываемым
                <br />
                впечатлениям?
              </h2>
              <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                Забронируйте экскурсию прямо сейчас и получите мгновенное подтверждение
              </p>
              <Link href="/booking">
                <button className="btn-premium group text-lg">
                  Начать бронирование
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  )
}
