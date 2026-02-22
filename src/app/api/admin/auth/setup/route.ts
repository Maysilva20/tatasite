import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Verificar se já existe algum usuário
    const existingUser = await db.adminUser.findFirst()
    
    if (existingUser) {
      return NextResponse.json({ error: 'Já existe um usuário administrador' }, { status: 400 })
    }
    
    const { username, password, name } = await request.json()
    
    if (!username || !password || !name) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 })
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres' }, { status: 400 })
    }
    
    // Hash da senha
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
    
    // Criar usuário admin
    const user = await db.adminUser.create({
      data: {
        username,
        password: hashedPassword,
        name
      }
    })
    
    return NextResponse.json({ 
      success: true,
      user: { id: user.id, username: user.username, name: user.name }
    })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const count = await db.adminUser.count()
    return NextResponse.json({ hasAdmin: count > 0 })
  } catch (error) {
    console.error('Erro ao verificar admin:', error)
    return NextResponse.json({ error: 'Erro ao verificar' }, { status: 500 })
  }
}
