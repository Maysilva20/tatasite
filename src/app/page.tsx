'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, 
  MessageCircle, 
  Heart, 
  Sparkles,
  Instagram,
  Youtube,
  Twitter,
  Play,
  RefreshCw
} from 'lucide-react'

// Types
interface Platform {
  id: string
  name: string
  grupo: string
  badge: string
  badgeColor: string
  color: string
  borderColor: string
  buttonColor: string
  link: string | null
  image: string | null
  order: number
  active: boolean
}

interface Testimonial {
  id: string
  name: string
  location: string
  avatar: string
  rating: number
  text: string
  order: number
  active: boolean
}

interface SiteConfig {
  id: string
  whatsappNumber: string
  profileName: string
  profileTagline: string
  aboutText: string | null
  instagramUrl: string | null
  tiktokUrl: string | null
  youtubeUrl: string | null
  twitterUrl: string | null
  coverImage: string | null
  profileImage: string | null
  statYears: string
  statFollowers: string
  statStudents: string
  statYearsLabel: string
  statFollowersLabel: string
  statStudentsLabel: string
}

export default function Home() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [platformsRes, testimonialsRes, configRes] = await Promise.all([
          fetch('/api/admin/platforms'),
          fetch('/api/admin/testimonials'),
          fetch('/api/admin/config')
        ])
        
        if (platformsRes.ok) {
          const data = await platformsRes.json()
          setPlatforms(data.filter((p: Platform) => p.active))
        }
        if (testimonialsRes.ok) {
          const data = await testimonialsRes.json()
          setTestimonials(data.filter((t: Testimonial) => t.active))
        }
        if (configRes.ok) {
          setConfig(await configRes.json())
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const getWhatsAppUrl = (customMessage?: string) => {
    const number = config?.whatsappNumber || '5511999999999'
    const message = customMessage || `Oi ${config?.profileName || 'Talitha'} 💖 Vim pelo site e quero começar a jogar!`
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-rose-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section with Cover Image */}
      <section className="relative overflow-hidden">
        {/* Cover Image Background */}
        <div className="absolute inset-0 h-[400px] md:h-[500px]">
          <img 
            src={config?.coverImage || "/hero-cover.png"} 
            alt="Capa" 
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/10 via-transparent to-purple-900/10" />
          {/* Bottom fade to content */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-rose-300/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-20 right-16 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating sparkles */}
        <div className="absolute top-8 left-1/4 text-white/40 text-2xl animate-bounce">✦</div>
        <div className="absolute top-16 right-1/3 text-white/30 text-xl animate-bounce" style={{ animationDelay: '0.5s' }}>✧</div>
        
        <div className="relative container mx-auto px-4 pt-20 pb-8">
          <div className="flex flex-col items-center text-center">
            {/* Banner/Capa de Fundo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mb-8"
            >
              {/* Banner Background */}
              <div className="absolute -inset-8 md:-inset-16 rounded-[3rem] overflow-hidden">
                {/* Main gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-pink-300 to-purple-300" />
                {/* Overlay pattern */}
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
                {/* Shimmer effect */}
                <div className="absolute inset-0 animate-shimmer" />
                {/* Gold accent lines */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/50 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/50 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/50 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/50 rounded-br-lg" />
                {/* Floating sparkles */}
                <div className="absolute top-6 left-1/4 text-white/60 text-xl animate-pulse">✦</div>
                <div className="absolute top-12 right-1/4 text-white/50 text-lg animate-pulse" style={{ animationDelay: '0.5s' }}>✧</div>
                <div className="absolute bottom-8 left-1/3 text-white/40 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
                <div className="absolute bottom-12 right-1/3 text-white/50 text-lg animate-pulse" style={{ animationDelay: '1.5s' }}>✧</div>
                {/* Glow effect behind profile */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-56 md:h-56 bg-white/40 rounded-full blur-2xl" />
              </div>
              
              {/* Profile Image */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative z-10"
              >
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-rose-300 via-pink-300 to-purple-300 p-1 animate-float shadow-2xl">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden">
                    {config?.profileImage ? (
                      <img 
                        src={config.profileImage} 
                        alt={config.profileName || 'Perfil'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl md:text-7xl">👩‍🦰</span>
                    )}
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                  ✨ TOP
                </div>
              </motion.div>
            </motion.div>
            
            {/* Name */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
            >
              <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                {config?.profileName?.toUpperCase() || 'TALITHA REIS'}
              </span>
            </motion.h1>
            
            {/* Tagline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 max-w-2xl mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            >
              {config?.profileTagline || 'Seu portal exclusivo para os melhores jogos de slots online 💎✨'}
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#plataformas"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Play className="w-5 h-5" />
                COMEÇAR A JOGAR
                <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
              </a>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                FALAR NO WHATSAPP AGORA
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="plataformas" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* Profile Photo in Platform Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-rose-300 via-pink-300 to-purple-300 p-1 shadow-xl">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden">
                    {config?.profileImage ? (
                      <img 
                        src={config.profileImage} 
                        alt={config.profileName || 'Perfil'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl md:text-5xl">👩‍🦰</span>
                    )}
                  </div>
                </div>
                {/* Decorative ring */}
                <div className="absolute -inset-2 rounded-full border-2 border-dashed border-rose-300/50 animate-spin" style={{ animationDuration: '20s' }} />
                {/* Small sparkle */}
                <div className="absolute -top-1 -right-1 text-amber-400 text-lg">✨</div>
              </div>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Plataformas Recomendadas</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Selecionadas cuidadosamente para garantir a melhor experiência de jogo! 🎰
            </p>
          </motion.div>

          {platforms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Em breve novas plataformas serão adicionadas!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative bg-gradient-to-br ${platform.color} rounded-3xl border ${platform.borderColor} p-6 card-hover overflow-hidden`}
                >
                  {/* Badge */}
                  <div className={`absolute top-4 right-4 ${platform.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
                    {platform.badge}
                  </div>
                  
                  {/* Profile Photo */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-300 via-pink-300 to-purple-300 p-1 shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden">
                          {platform.image ? (
                            <img 
                              src={platform.image} 
                              alt={platform.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-5xl">👩‍🦰</span>
                          )}
                        </div>
                      </div>
                      {/* Online indicator */}
                      <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="text-center">
                    {/* Platform Name */}
                    <h3 className="text-xl font-bold mb-1 text-foreground">{platform.name}</h3>
                    
                    {/* Group Name */}
                    <p className="text-sm text-muted-foreground mb-5 flex items-center justify-center gap-1">
                      <span className="w-2 h-2 bg-rose-400 rounded-full" />
                      {platform.grupo}
                    </p>
                    
                    {/* Play Button */}
                    <a
                      href={platform.link || getWhatsAppUrl(`Oi! Vim pelo site e quero jogar na ${platform.name}!`)}
                      target={platform.link ? "_blank" : undefined}
                      rel={platform.link ? "noopener noreferrer" : undefined}
                      className={`${platform.buttonColor} w-full text-white font-semibold py-3.5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md group-hover:shadow-lg group-hover:scale-[1.02] cursor-pointer`}
                    >
                      <Play className="w-5 h-5" fill="currentColor" />
                      JOGAR AGORA
                    </a>
                  </div>
                  
                  {/* Decorative corner */}
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-rose-50/50 via-background to-purple-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Decorative icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-200 to-pink-200 mb-6">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="gradient-text">Sobre {config?.profileName || 'Talitha Reis'}</span>
              </h2>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                {config?.aboutText ? (
                  <p>{config.aboutText}</p>
                ) : (
                  <>
                    <p>
                      Olá, sou a <strong className="text-foreground">Talitha Reis</strong>! 💕 Há mais de 3 anos, 
                      venho compartilhando dicas, estratégias e indicações das melhores plataformas de slots online.
                    </p>
                    <p>
                      Meu objetivo é ajudar você a ter uma <strong className="text-foreground">experiência segura e divertida</strong>, 
                      com orientações claras e suporte personalizado. Acredito que jogar com responsabilidade 
                      é a chave para aproveitar ao máximo!
                    </p>
                    <p>
                      ✨ Atendo mais de <strong className="text-foreground">5.000 seguidores</strong> nas redes sociais
                      e já ajudei centenas de pessoas a começarem do jeito certo.
                    </p>
                  </>
                )}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-rose-100">
                  <div className="text-2xl font-bold gradient-text">{config?.statYears || '3+'}</div>
                  <div className="text-sm text-muted-foreground">{config?.statYearsLabel || 'Anos de experiência'}</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-rose-100">
                  <div className="text-2xl font-bold gradient-text">{config?.statFollowers || '5K+'}</div>
                  <div className="text-sm text-muted-foreground">{config?.statFollowersLabel || 'Seguidores'}</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-rose-100">
                  <div className="text-2xl font-bold gradient-text">{config?.statStudents || '500+'}</div>
                  <div className="text-sm text-muted-foreground">{config?.statStudentsLabel || 'Alunos satisfeitos'}</div>
                </div>
              </div>
              
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                FALAR COMIGO NO WHATSAPP
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">O Que Dizem Sobre Mim</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Depoimentos reais de pessoas que já começaram essa jornada comigo 💬
            </p>
          </motion.div>

          {testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum depoimento cadastrado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100 p-6 card-hover"
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  
                  {/* Text */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-t border-rose-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Social Links */}
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Me siga nas redes sociais</h3>
              <div className="flex justify-center gap-4">
                <a
                  href={config?.instagramUrl || '#'}
                  target={config?.instagramUrl ? "_blank" : undefined}
                  rel={config?.instagramUrl ? "noopener noreferrer" : undefined}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={config?.tiktokUrl || '#'}
                  target={config?.tiktokUrl ? "_blank" : undefined}
                  rel={config?.tiktokUrl ? "noopener noreferrer" : undefined}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
                <a
                  href={config?.youtubeUrl || '#'}
                  target={config?.youtubeUrl ? "_blank" : undefined}
                  rel={config?.youtubeUrl ? "noopener noreferrer" : undefined}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href={config?.twitterUrl || '#'}
                  target={config?.twitterUrl ? "_blank" : undefined}
                  rel={config?.twitterUrl ? "noopener noreferrer" : undefined}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Legal */}
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-4">
                ⚠️ <strong>Jogue com responsabilidade.</strong> Proibido para menores de 18 anos.
              </p>
              <div className="flex justify-center gap-6 text-sm">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Termos de Uso
                </a>
                <span className="text-muted-foreground">•</span>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidade
                </a>
              </div>
            </div>
            
            {/* WhatsApp CTA */}
            <div className="text-center">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                FALAR NO WHATSAPP
              </a>
            </div>
            
            {/* Copyright */}
            <div className="text-center mt-8 pt-6 border-t border-rose-200/50">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} {config?.profileName || 'Talitha Reis'}. Todos os direitos reservados. 💖
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform animate-pulse-glow"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  )
}
