import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Listar todos os depoimentos
export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Erro ao buscar depoimentos:', error)
    return NextResponse.json({ error: 'Erro ao buscar depoimentos' }, { status: 500 })
  }
}

// POST - Criar novo depoimento
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const count = await db.testimonial.count()
    
    const testimonial = await db.testimonial.create({
      data: {
        name: data.name,
        location: data.location,
        avatar: data.avatar,
        rating: data.rating ?? 5,
        text: data.text,
        order: count,
        active: data.active ?? true
      }
    })
    
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Erro ao criar depoimento:', error)
    return NextResponse.json({ error: 'Erro ao criar depoimento' }, { status: 500 })
  }
}

// PUT - Atualizar depoimento
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    const testimonial = await db.testimonial.update({
      where: { id: data.id },
      data: {
        name: data.name,
        location: data.location,
        avatar: data.avatar,
        rating: data.rating,
        text: data.text,
        order: data.order,
        active: data.active
      }
    })
    
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Erro ao atualizar depoimento:', error)
    return NextResponse.json({ error: 'Erro ao atualizar depoimento' }, { status: 500 })
  }
}

// DELETE - Deletar depoimento
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }
    
    await db.testimonial.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar depoimento:', error)
    return NextResponse.json({ error: 'Erro ao deletar depoimento' }, { status: 500 })
  }
}
