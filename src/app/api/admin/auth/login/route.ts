import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// Sessões em memória (simples, para produção usar Redis)
const sessions = new Map<string, { userId: string; expires: number }>()

// Exportar para uso em outros módulos
export function getSession(token: string) {
  const session = sessions.get(token)
  if (!session || session.expires < Date.now()) {
    sessions.delete(token)
    return null
  }
  return session
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Usuário e senha são obrigatórios' }, { status: 400 })
    }
    
    // Buscar usuário
    const user = await db.adminUser.findUnique({
      where: { username }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'Usuário ou senha incorretos' }, { status: 401 })
    }
    
    // Verificar senha (hash simples com SHA256)
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
    
    if (user.password !== hashedPassword) {
      return NextResponse.json({ error: 'Usuário ou senha incorretos' }, { status: 401 })
    }
    
    // Criar sessão
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const expires = Date.now() + 24 * 60 * 60 * 1000 // 24 horas
    
    sessions.set(sessionToken, { userId: user.id, expires })
    
    // Definir cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 horas
    })
    
    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, username: user.username, name: user.name }
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ authenticated: false })
    }
    
    const session = getSession(sessionToken)
    
    if (!session) {
      return NextResponse.json({ authenticated: false })
    }
    
    const user = await db.adminUser.findUnique({
      where: { id: session.userId }
    })
    
    if (!user) {
      return NextResponse.json({ authenticated: false })
    }
    
    return NextResponse.json({ 
      authenticated: true,
      user: { id: user.id, username: user.username, name: user.name }
    })
  } catch (error) {
    console.error('Erro ao verificar sessão:', error)
    return NextResponse.json({ authenticated: false })
  }
}
