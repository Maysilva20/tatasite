import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Valores padrão para cores
const defaultColors = {
  color: 'from-rose-50 to-pink-50',
  borderColor: 'border-rose-200',
  buttonColor: 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600',
  badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-500'
}

// GET - Listar todas as plataformas
export async function GET() {
  try {
    const platforms = await db.platform.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(platforms)
  } catch (error) {
    console.error('Erro ao buscar plataformas:', error)
    return NextResponse.json({ error: 'Erro ao buscar plataformas' }, { status: 500 })
  }
}

// POST - Criar nova plataforma
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const count = await db.platform.count()
    
    const platform = await db.platform.create({
      data: {
        name: data.name || 'Nova Plataforma',
        grupo: data.grupo || 'Grupo',
        badge: data.badge || 'TOP',
        badgeColor: data.badgeColor || defaultColors.badgeColor,
        color: data.color || defaultColors.color,
        borderColor: data.borderColor || defaultColors.borderColor,
        buttonColor: data.buttonColor || defaultColors.buttonColor,
        link: data.link || null,
        image: data.image || null,
        order: count,
        active: data.active ?? true
      }
    })
    
    return NextResponse.json(platform)
  } catch (error) {
    console.error('Erro ao criar plataforma:', error)
    return NextResponse.json({ error: 'Erro ao criar plataforma' }, { status: 500 })
  }
}

// PUT - Atualizar plataforma
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }
    
    const platform = await db.platform.update({
      where: { id: data.id },
      data: {
        name: data.name,
        grupo: data.grupo,
        badge: data.badge,
        badgeColor: data.badgeColor || defaultColors.badgeColor,
        color: data.color || defaultColors.color,
        borderColor: data.borderColor || defaultColors.borderColor,
        buttonColor: data.buttonColor || defaultColors.buttonColor,
        link: data.link || null,
        image: data.image || null,
        order: data.order,
        active: data.active
      }
    })
    
    return NextResponse.json(platform)
  } catch (error) {
    console.error('Erro ao atualizar plataforma:', error)
    return NextResponse.json({ error: 'Erro ao atualizar plataforma' }, { status: 500 })
  }
}

// DELETE - Deletar plataforma
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }
    
    await db.platform.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar plataforma:', error)
    return NextResponse.json({ error: 'Erro ao deletar plataforma' }, { status: 500 })
  }
}
