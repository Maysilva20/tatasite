import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST - Popular banco com dados iniciais
export async function POST() {
  try {
    // Verificar se já existem plataformas
    const existingPlatforms = await db.platform.count()
    
    if (existingPlatforms === 0) {
      // Criar plataformas padrão
      await db.platform.createMany({
        data: [
          {
            name: 'Fortune Tiger',
            grupo: 'Grupo Premium VIP',
            badge: 'TOP 1',
            badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-500',
            color: 'from-amber-50 to-yellow-50',
            borderColor: 'border-amber-200',
            buttonColor: 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600',
            order: 0,
            active: true
          },
          {
            name: 'Spaceman',
            grupo: 'Grupo Estelar',
            badge: 'PREMIUM',
            badgeColor: 'bg-gradient-to-r from-purple-400 to-pink-500',
            color: 'from-purple-50 to-pink-50',
            borderColor: 'border-purple-200',
            buttonColor: 'bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600',
            order: 1,
            active: true
          },
          {
            name: 'Dragon Fortune',
            grupo: 'Grupo Dragão Dourado',
            badge: 'RÁPIDO',
            badgeColor: 'bg-gradient-to-r from-red-400 to-orange-500',
            color: 'from-red-50 to-orange-50',
            borderColor: 'border-red-200',
            buttonColor: 'bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600',
            order: 2,
            active: true
          },
          {
            name: 'Mystic Slots',
            grupo: 'Grupo Místico',
            badge: 'CONFIÁVEL',
            badgeColor: 'bg-gradient-to-r from-emerald-400 to-teal-500',
            color: 'from-emerald-50 to-teal-50',
            borderColor: 'border-emerald-200',
            buttonColor: 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600',
            order: 3,
            active: true
          },
          {
            name: 'Golden Spin',
            grupo: 'Grupo Dourado',
            badge: 'EXCLUSIVO',
            badgeColor: 'bg-gradient-to-r from-rose-400 to-pink-500',
            color: 'from-rose-50 to-pink-50',
            borderColor: 'border-rose-200',
            buttonColor: 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600',
            order: 4,
            active: true
          }
        ]
      })
    }
    
    // Verificar se já existem depoimentos
    const existingTestimonials = await db.testimonial.count()
    
    if (existingTestimonials === 0) {
      // Criar depoimentos padrão
      await db.testimonial.createMany({
        data: [
          {
            name: 'Maria Silva',
            location: 'São Paulo, SP',
            avatar: '👩‍🦰',
            rating: 5,
            text: 'Comecei seguindo as dicas da Talitha e já consegui multiplicar meu depósito em 3x! Ela é incrível e sempre responde minhas dúvidas. Super recomendo! 💕',
            order: 0,
            active: true
          },
          {
            name: 'Ana Paula',
            location: 'Rio de Janeiro, RJ',
            avatar: '👩‍🦱',
            rating: 5,
            text: 'Estava com medo de começar, mas a Talitha me explicou tudo com paciência. Hoje jogo com responsabilidade e já tive ótimos resultados. Obrigada! 🌸',
            order: 1,
            active: true
          },
          {
            name: 'Juliana Costa',
            location: 'Belo Horizonte, MG',
            avatar: '👱‍♀️',
            rating: 5,
            text: 'A melhor influenciadora de slots que já segui! As plataformas que ela indica são realmente confiáveis. Já indiquei para todas as minhas amigas! ✨',
            order: 2,
            active: true
          }
        ]
      })
    }
    
    // Criar configuração padrão se não existir
    const existingConfig = await db.siteConfig.count()
    
    if (existingConfig === 0) {
      await db.siteConfig.create({
        data: {
          whatsappNumber: '5511999999999',
          profileName: 'Talitha Reis',
          profileTagline: 'Seu portal exclusivo para os melhores jogos de slots online 💎✨',
          aboutText: 'Olá, sou a Talitha Reis! 💕 Há mais de 3 anos, venho compartilhando dicas, estratégias e indicações das melhores plataformas de slots online.',
          instagramUrl: '',
          tiktokUrl: '',
          youtubeUrl: '',
          twitterUrl: ''
        }
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Dados iniciais criados com sucesso!',
      platforms: await db.platform.count(),
      testimonials: await db.testimonial.count(),
      config: await db.siteConfig.count()
    })
  } catch (error) {
    console.error('Erro ao popular banco:', error)
    return NextResponse.json({ error: 'Erro ao popular banco de dados' }, { status: 500 })
  }
}
