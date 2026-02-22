import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Testar conexão com o banco
    await db.$queryRaw`SELECT 1`
    
    // Verificar se as tabelas existem e têm dados
    let platformsCount = 0
    let testimonialsCount = 0
    let configCount = 0
    
    try {
      platformsCount = await db.platform.count()
      testimonialsCount = await db.testimonial.count()
      configCount = await db.siteConfig.count()
    } catch {
      // Tabelas ainda não existem
    }
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      data: {
        platforms: platformsCount,
        testimonials: testimonialsCount,
        config: configCount
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: 'Não foi possível conectar ao banco de dados. Verifique as variáveis de ambiente DATABASE_URL e DIRECT_URL.'
    }, { status: 500 })
  }
}
