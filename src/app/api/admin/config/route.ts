import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Buscar configurações
export async function GET() {
  try {
    let config = await db.siteConfig.findFirst()
    
    // Se não existir, criar configuração padrão
    if (!config) {
      config = await db.siteConfig.create({
        data: {
          whatsappNumber: '5511999999999',
          profileName: 'Talitha Reis',
          profileTagline: 'Seu portal exclusivo para os melhores jogos de slots online 💎✨',
          aboutText: 'Olá, sou a Talitha Reis! 💕 Há mais de 3 anos, venho compartilhando dicas, estratégias e indicações das melhores plataformas de slots online.',
          instagramUrl: '',
          tiktokUrl: '',
          youtubeUrl: '',
          twitterUrl: '',
          coverImage: null,
          profileImage: null,
          statYears: '3+',
          statFollowers: '5K+',
          statStudents: '500+',
          statYearsLabel: 'Anos de experiência',
          statFollowersLabel: 'Seguidores',
          statStudentsLabel: 'Alunos satisfeitos'
        }
      })
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 })
  }
}

// PUT - Atualizar configurações
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    let config = await db.siteConfig.findFirst()
    
    if (!config) {
      config = await db.siteConfig.create({
        data: {
          whatsappNumber: data.whatsappNumber || '',
          profileName: data.profileName || 'Talitha Reis',
          profileTagline: data.profileTagline || '',
          aboutText: data.aboutText || null,
          instagramUrl: data.instagramUrl || null,
          tiktokUrl: data.tiktokUrl || null,
          youtubeUrl: data.youtubeUrl || null,
          twitterUrl: data.twitterUrl || null,
          coverImage: data.coverImage || null,
          profileImage: data.profileImage || null,
          statYears: data.statYears || '3+',
          statFollowers: data.statFollowers || '5K+',
          statStudents: data.statStudents || '500+',
          statYearsLabel: data.statYearsLabel || 'Anos de experiência',
          statFollowersLabel: data.statFollowersLabel || 'Seguidores',
          statStudentsLabel: data.statStudentsLabel || 'Alunos satisfeitos'
        }
      })
    } else {
      config = await db.siteConfig.update({
        where: { id: config.id },
        data: {
          whatsappNumber: data.whatsappNumber,
          profileName: data.profileName,
          profileTagline: data.profileTagline,
          aboutText: data.aboutText,
          instagramUrl: data.instagramUrl,
          tiktokUrl: data.tiktokUrl,
          youtubeUrl: data.youtubeUrl,
          twitterUrl: data.twitterUrl,
          coverImage: data.coverImage,
          profileImage: data.profileImage,
          statYears: data.statYears,
          statFollowers: data.statFollowers,
          statStudents: data.statStudents,
          statYearsLabel: data.statYearsLabel,
          statFollowersLabel: data.statFollowersLabel,
          statStudentsLabel: data.statStudentsLabel
        }
      })
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    return NextResponse.json({ error: 'Erro ao atualizar configurações' }, { status: 500 })
  }
}
