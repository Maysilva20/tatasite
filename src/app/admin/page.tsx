'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Gamepad2, 
  MessageSquare, 
  Settings, 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Upload,
  X,
  Image as ImageIcon,
  Palette,
  LogOut,
  Lock
} from 'lucide-react'
import Link from 'next/link'

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

interface AdminUser {
  id: string
  username: string
  name: string
}

type TabType = 'dashboard' | 'platforms' | 'testimonials' | 'settings' | 'design'

// Options
const badgeColors = [
  { label: 'Dourado', value: 'bg-gradient-to-r from-amber-400 to-yellow-500' },
  { label: 'Roxo/Rosa', value: 'bg-gradient-to-r from-purple-400 to-pink-500' },
  { label: 'Vermelho/Laranja', value: 'bg-gradient-to-r from-red-400 to-orange-500' },
  { label: 'Verde/Teal', value: 'bg-gradient-to-r from-emerald-400 to-teal-500' },
  { label: 'Rosa', value: 'bg-gradient-to-r from-rose-400 to-pink-500' },
]

const cardColors = [
  { label: 'Âmbar', color: 'from-amber-50 to-yellow-50', border: 'border-amber-200', button: 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600' },
  { label: 'Roxo', color: 'from-purple-50 to-pink-50', border: 'border-purple-200', button: 'bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600' },
  { label: 'Vermelho', color: 'from-red-50 to-orange-50', border: 'border-red-200', button: 'bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600' },
  { label: 'Verde', color: 'from-emerald-50 to-teal-50', border: 'border-emerald-200', button: 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600' },
  { label: 'Rosa', color: 'from-rose-50 to-pink-50', border: 'border-rose-200', button: 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600' },
]

const avatarOptions = ['👩‍🦰', '👩‍🦱', '👱‍♀️', '👩', '🧕', '👸', '💁‍♀️', '🧏‍♀️']

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  
  // Form states
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth/login')
        const data = await res.json()
        
        if (!data.authenticated) {
          router.push('/admin/login')
          return
        }
        
        setUser(data.user)
        setCheckingAuth(false)
      } catch {
        router.push('/admin/login')
      }
    }
    
    checkAuth()
  }, [router])

  // Fetch data
  const fetchData = async () => {
    setLoading(true)
    try {
      const [platformsRes, testimonialsRes, configRes] = await Promise.all([
        fetch('/api/admin/platforms'),
        fetch('/api/admin/testimonials'),
        fetch('/api/admin/config')
      ])
      
      if (platformsRes.ok) setPlatforms(await platformsRes.json())
      if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json())
      if (configRes.ok) setConfig(await configRes.json())
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!checkingAuth && user) {
      fetchData()
    }
  }, [checkingAuth, user])

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Erro ao sair:', error)
    }
  }

  // Platform CRUD
  const savePlatform = async (platform: Partial<Platform>) => {
    setSaving(true)
    try {
      if (platform.id) {
        await fetch('/api/admin/platforms', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(platform)
        })
      } else {
        await fetch('/api/admin/platforms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(platform)
        })
      }
      await fetchData()
      setEditingPlatform(null)
    } catch (error) {
      console.error('Erro ao salvar plataforma:', error)
    } finally {
      setSaving(false)
    }
  }

  const deletePlatform = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta plataforma?')) return
    try {
      await fetch(`/api/admin/platforms?id=${id}`, { method: 'DELETE' })
      await fetchData()
    } catch (error) {
      console.error('Erro ao excluir plataforma:', error)
    }
  }

  const togglePlatformActive = async (platform: Platform) => {
    await savePlatform({ ...platform, active: !platform.active })
  }

  const movePlatform = async (platform: Platform, direction: 'up' | 'down') => {
    const currentIndex = platforms.findIndex(p => p.id === platform.id)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex < 0 || newIndex >= platforms.length) return
    
    const updatedPlatforms = [...platforms]
    const temp = updatedPlatforms[currentIndex].order
    updatedPlatforms[currentIndex].order = updatedPlatforms[newIndex].order
    updatedPlatforms[newIndex].order = temp
    
    await savePlatform(updatedPlatforms[currentIndex])
    await savePlatform(updatedPlatforms[newIndex])
  }

  // Testimonial CRUD
  const saveTestimonial = async (testimonial: Partial<Testimonial>) => {
    setSaving(true)
    try {
      if (testimonial.id) {
        await fetch('/api/admin/testimonials', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testimonial)
        })
      } else {
        await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testimonial)
        })
      }
      await fetchData()
      setEditingTestimonial(null)
    } catch (error) {
      console.error('Erro ao salvar depoimento:', error)
    } finally {
      setSaving(false)
    }
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este depoimento?')) return
    try {
      await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' })
      await fetchData()
    } catch (error) {
      console.error('Erro ao excluir depoimento:', error)
    }
  }

  const toggleTestimonialActive = async (testimonial: Testimonial) => {
    await saveTestimonial({ ...testimonial, active: !testimonial.active })
  }

  // Config save
  const saveConfig = async (newConfig: Partial<SiteConfig>) => {
    setSaving(true)
    try {
      await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      })
      await fetchData()
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
    } finally {
      setSaving(false)
    }
  }

  // Seed database
  const seedDatabase = async () => {
    if (!confirm('Isso vai popular o banco com dados iniciais. Continuar?')) return
    try {
      await fetch('/api/admin/seed', { method: 'POST' })
      await fetchData()
      alert('Dados iniciais criados com sucesso!')
    } catch (error) {
      console.error('Erro ao popular banco:', error)
    }
  }

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'platforms' as TabType, label: 'Plataformas', icon: Gamepad2 },
    { id: 'testimonials' as TabType, label: 'Depoimentos', icon: MessageSquare },
    { id: 'design' as TabType, label: 'Design', icon: Palette },
    { id: 'settings' as TabType, label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-500 hover:text-rose-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Voltar ao Site</span>
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800">Painel Admin</h1>
                <p className="text-xs text-gray-500">{user?.name || 'Administrador'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-sm font-medium hover:bg-rose-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm border border-rose-100 p-4 sticky top-24">
              <div className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="w-8 h-8 text-rose-400 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Dashboard */}
                  {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
                          <div className="flex items-center gap-3 mb-2">
                            <Gamepad2 className="w-6 h-6 text-amber-500" />
                            <span className="text-sm text-gray-500">Plataformas</span>
                          </div>
                          <p className="text-3xl font-bold text-gray-800">{platforms.length}</p>
                          <p className="text-sm text-gray-500">{platforms.filter(p => p.active).length} ativas</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                          <div className="flex items-center gap-3 mb-2">
                            <MessageSquare className="w-6 h-6 text-purple-500" />
                            <span className="text-sm text-gray-500">Depoimentos</span>
                          </div>
                          <p className="text-3xl font-bold text-gray-800">{testimonials.length}</p>
                          <p className="text-sm text-gray-500">{testimonials.filter(t => t.active).length} ativos</p>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                          <div className="flex items-center gap-3 mb-2">
                            <Settings className="w-6 h-6 text-emerald-500" />
                            <span className="text-sm text-gray-500">WhatsApp</span>
                          </div>
                          <p className="text-lg font-bold text-gray-800 truncate">{config?.whatsappNumber || 'Não configurado'}</p>
                        </div>
                      </div>
                      
                      <div className="bg-rose-50 rounded-xl p-6 border border-rose-200">
                        <h3 className="font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => setActiveTab('platforms')}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-rose-100 transition-colors border border-rose-200"
                          >
                            <Plus className="w-4 h-4" />
                            Nova Plataforma
                          </button>
                          <button
                            onClick={() => setActiveTab('testimonials')}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-rose-100 transition-colors border border-rose-200"
                          >
                            <Plus className="w-4 h-4" />
                            Novo Depoimento
                          </button>
                          <button
                            onClick={() => setActiveTab('design')}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-rose-100 transition-colors border border-rose-200"
                          >
                            <Palette className="w-4 h-4" />
                            Editar Design
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Design do Site */}
                  {activeTab === 'design' && config && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-800">Design do Site</h2>
                      
                      <div className="grid gap-6">
                        {/* Cover Image */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-rose-500" />
                            Imagem de Capa
                          </h3>
                          <ImageUploader
                            currentImage={config.coverImage}
                            onImageChange={(url) => setConfig({ ...config, coverImage: url })}
                            label="Capa do Site"
                          />
                        </div>

                        {/* Profile Image */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-rose-500" />
                            Foto de Perfil
                          </h3>
                          <ImageUploader
                            currentImage={config.profileImage}
                            onImageChange={(url) => setConfig({ ...config, profileImage: url })}
                            label="Foto de Perfil"
                            circular
                          />
                        </div>

                        {/* Stats */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <h3 className="font-semibold text-gray-800 mb-4">Estatísticas</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Anos</label>
                              <input
                                type="text"
                                value={config.statYears}
                                onChange={(e) => setConfig({ ...config, statYears: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none"
                              />
                              <input
                                type="text"
                                value={config.statYearsLabel}
                                onChange={(e) => setConfig({ ...config, statYearsLabel: e.target.value })}
                                className="w-full px-4 py-2 mt-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none text-sm"
                                placeholder="Label"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Seguidores</label>
                              <input
                                type="text"
                                value={config.statFollowers}
                                onChange={(e) => setConfig({ ...config, statFollowers: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none"
                              />
                              <input
                                type="text"
                                value={config.statFollowersLabel}
                                onChange={(e) => setConfig({ ...config, statFollowersLabel: e.target.value })}
                                className="w-full px-4 py-2 mt-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none text-sm"
                                placeholder="Label"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Alunos</label>
                              <input
                                type="text"
                                value={config.statStudents}
                                onChange={(e) => setConfig({ ...config, statStudents: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none"
                              />
                              <input
                                type="text"
                                value={config.statStudentsLabel}
                                onChange={(e) => setConfig({ ...config, statStudentsLabel: e.target.value })}
                                className="w-full px-4 py-2 mt-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none text-sm"
                                placeholder="Label"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => saveConfig(config)}
                          disabled={saving}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Salvar Design
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Platforms */}
                  {activeTab === 'platforms' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">Plataformas</h2>
                        <button
                          onClick={() => setEditingPlatform({} as Platform)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          Nova Plataforma
                        </button>
                      </div>

                      <div className="space-y-3">
                        {platforms.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Nenhuma plataforma cadastrada.</p>
                            <button
                              onClick={() => setEditingPlatform({} as Platform)}
                              className="mt-4 text-rose-500 hover:text-rose-600"
                            >
                              Adicionar primeira plataforma
                            </button>
                          </div>
                        ) : (
                          platforms.map((platform) => (
                            <div
                              key={platform.id}
                              className={`bg-gray-50 rounded-xl p-4 flex items-center gap-4 ${!platform.active ? 'opacity-50' : ''}`}
                            >
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => movePlatform(platform, 'up')}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => movePlatform(platform, 'down')}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                              </div>
                              
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden">
                                {platform.image ? (
                                  <img src={platform.image} alt={platform.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Gamepad2 className="w-6 h-6 text-rose-400" />
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-gray-800">{platform.name}</h4>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                                    {platform.badge}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">{platform.grupo}</p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => togglePlatformActive(platform)}
                                  className={`p-2 rounded-lg ${platform.active ? 'text-green-500 bg-green-50' : 'text-gray-400 bg-gray-100'}`}
                                  title={platform.active ? 'Desativar' : 'Ativar'}
                                >
                                  {platform.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => setEditingPlatform(platform)}
                                  className="p-2 rounded-lg text-rose-500 bg-rose-50 hover:bg-rose-100"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deletePlatform(platform.id)}
                                  className="p-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Testimonials */}
                  {activeTab === 'testimonials' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">Depoimentos</h2>
                        <button
                          onClick={() => setEditingTestimonial({} as Testimonial)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          Novo Depoimento
                        </button>
                      </div>

                      <div className="space-y-3">
                        {testimonials.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Nenhum depoimento cadastrado.</p>
                            <button
                              onClick={() => setEditingTestimonial({} as Testimonial)}
                              className="mt-4 text-rose-500 hover:text-rose-600"
                            >
                              Adicionar primeiro depoimento
                            </button>
                          </div>
                        ) : (
                          testimonials.map((testimonial) => (
                            <div
                              key={testimonial.id}
                              className={`bg-gray-50 rounded-xl p-4 flex items-center gap-4 ${!testimonial.active ? 'opacity-50' : ''}`}
                            >
                              <div className="text-3xl">{testimonial.avatar}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                                  <span className="text-xs text-gray-400">{testimonial.location}</span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-1">{testimonial.text}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleTestimonialActive(testimonial)}
                                  className={`p-2 rounded-lg ${testimonial.active ? 'text-green-500 bg-green-50' : 'text-gray-400 bg-gray-100'}`}
                                >
                                  {testimonial.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => setEditingTestimonial(testimonial)}
                                  className="p-2 rounded-lg text-rose-500 bg-rose-50 hover:bg-rose-100"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteTestimonial(testimonial.id)}
                                  className="p-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Settings */}
                  {activeTab === 'settings' && config && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-800">Configurações do Site</h2>
                      
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Número do WhatsApp</label>
                          <input
                            type="text"
                            value={config.whatsappNumber}
                            onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none"
                            placeholder="5511999999999"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Perfil</label>
                          <input
                            type="text"
                            value={config.profileName}
                            onChange={(e) => setConfig({ ...config, profileName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                          <input
                            type="text"
                            value={config.profileTagline}
                            onChange={(e) => setConfig({ ...config, profileTagline: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Texto Sobre</label>
                          <textarea
                            value={config.aboutText || ''}
                            onChange={(e) => setConfig({ ...config, aboutText: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none resize-none h-24"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                            <input
                              type="text"
                              value={config.instagramUrl || ''}
                              onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
                            <input
                              type="text"
                              value={config.tiktokUrl || ''}
                              onChange={(e) => setConfig({ ...config, tiktokUrl: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                            <input
                              type="text"
                              value={config.youtubeUrl || ''}
                              onChange={(e) => setConfig({ ...config, youtubeUrl: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                            <input
                              type="text"
                              value={config.twitterUrl || ''}
                              onChange={(e) => setConfig({ ...config, twitterUrl: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none"
                            />
                          </div>
                        </div>
                        
                        <button
                          onClick={() => saveConfig(config)}
                          disabled={saving}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Salvar Configurações
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Platform Edit Modal */}
      <AnimatePresence>
        {editingPlatform && (
          <PlatformModal
            platform={editingPlatform}
            onSave={savePlatform}
            onClose={() => setEditingPlatform(null)}
            saving={saving}
          />
        )}
      </AnimatePresence>

      {/* Testimonial Edit Modal */}
      <AnimatePresence>
        {editingTestimonial && (
          <TestimonialModal
            testimonial={editingTestimonial}
            onSave={saveTestimonial}
            onClose={() => setEditingTestimonial(null)}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Image Uploader Component
function ImageUploader({ 
  currentImage, 
  onImageChange, 
  label,
  circular = false 
}: { 
  currentImage: string | null
  onImageChange: (url: string | null) => void
  label: string
  circular?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(currentImage)
  }, [currentImage])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não permitido. Use PNG, JPG ou WebP.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        onImageChange(data.imageUrl)
      } else {
        alert(data.error || 'Erro no upload')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao fazer upload')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {preview ? (
        <div className={`relative ${circular ? 'w-32 h-32' : 'w-full max-w-sm h-40'} overflow-hidden ${circular ? 'rounded-full' : 'rounded-xl'} border-2 border-rose-200`}>
          <img 
            src={preview} 
            alt={label} 
            className={`w-full h-full object-cover`}
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className={`w-full max-w-sm ${circular ? 'w-32 h-32' : 'h-40'} rounded-xl border-2 border-dashed border-rose-300 flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50 transition-colors`}>
          <ImageIcon className="w-8 h-8 text-rose-300 mb-2" />
          <span className="text-xs text-gray-500">PNG, JPG, WebP</span>
          <span className="text-xs text-gray-400">Máx. 5MB</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}
      {uploading && (
        <p className="text-sm text-rose-500 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Enviando...
        </p>
      )}
      {!preview && !uploading && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-sm text-rose-500 hover:text-rose-600 flex items-center gap-1"
        >
          <Upload className="w-4 h-4" />
          Fazer upload
        </button>
      )}
    </div>
  )
}

// Platform Modal Component
function PlatformModal({ 
  platform, 
  onSave, 
  onClose, 
  saving 
}: { 
  platform: Platform
  onSave: (p: Partial<Platform>) => void
  onClose: () => void
  saving: boolean
}) {
  const defaultPlatform: Platform = {
    id: '',
    name: '',
    grupo: '',
    badge: 'TOP',
    badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    color: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    buttonColor: 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600',
    link: null,
    image: null,
    order: 0,
    active: true
  }
  
  const [form, setForm] = useState<Platform>(() => ({
    ...defaultPlatform,
    ...platform,
    badgeColor: platform.badgeColor || defaultPlatform.badgeColor,
    color: platform.color || defaultPlatform.color,
    borderColor: platform.borderColor || defaultPlatform.borderColor,
    buttonColor: platform.buttonColor || defaultPlatform.buttonColor,
    link: platform.link || null,
    image: platform.image || null
  }))
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(platform.image || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Atualizar form quando platform mudar
  useEffect(() => {
    setForm({
      ...defaultPlatform,
      ...platform,
      badgeColor: platform.badgeColor || defaultPlatform.badgeColor,
      color: platform.color || defaultPlatform.color,
      borderColor: platform.borderColor || defaultPlatform.borderColor,
      buttonColor: platform.buttonColor || defaultPlatform.buttonColor,
      link: platform.link || null,
      image: platform.image || null
    })
    setPreviewImage(platform.image || null)
  }, [platform])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não permitido. Use PNG, JPG ou WebP.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => setPreviewImage(e.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        setForm({ ...form, image: data.imageUrl })
      } else {
        alert(data.error || 'Erro ao fazer upload')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
    setForm({ ...form, image: null })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          {platform.id ? 'Editar Plataforma' : 'Nova Plataforma'}
        </h3>
        
        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto da Plataforma</label>
            <div className="flex flex-col items-center gap-3">
              {previewImage ? (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-rose-200">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-32 h-32 rounded-xl border-2 border-dashed border-rose-300 flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50 transition-colors">
                  <ImageIcon className="w-8 h-8 text-rose-300 mb-2" />
                  <span className="text-xs text-gray-500">PNG, JPG, WebP</span>
                  <span className="text-xs text-gray-400">Máx. 5MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
              {uploading && (
                <p className="text-sm text-rose-500 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Enviando imagem...
                </p>
              )}
              {!previewImage && !uploading && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-rose-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <Upload className="w-4 h-4" />
                  Fazer upload de imagem
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Plataforma</label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Grupo</label>
            <input
              type="text"
              value={form.grupo || ''}
              onChange={(e) => setForm({ ...form, grupo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
            <input
              type="text"
              value={form.badge || ''}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
              placeholder="TOP 1, PREMIUM, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cor do Badge</label>
            <select
              value={form.badgeColor || ''}
              onChange={(e) => setForm({ ...form, badgeColor: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
            >
              {badgeColors.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cor do Card</label>
            <select
              value={form.color || ''}
              onChange={(e) => {
                const selected = cardColors.find(c => c.color === e.target.value)
                if (selected) {
                  setForm({ ...form, color: selected.color, borderColor: selected.border, buttonColor: selected.button })
                }
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
            >
              {cardColors.map((c) => (
                <option key={c.color} value={c.color}>{c.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link (opcional)</label>
            <input
              type="text"
              value={form.link || ''}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
              placeholder="https://..."
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full font-medium hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || uploading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-medium hover:shadow-lg disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Testimonial Modal Component
function TestimonialModal({ 
  testimonial, 
  onSave, 
  onClose, 
  saving 
}: { 
  testimonial: Testimonial
  onSave: (t: Partial<Testimonial>) => void
  onClose: () => void
  saving: boolean
}) {
  const [form, setForm] = useState(testimonial)

  // Atualizar form quando testimonial mudar
  useEffect(() => {
    setForm(testimonial)
  }, [testimonial])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          {testimonial.id ? 'Editar Depoimento' : 'Novo Depoimento'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
            <div className="flex flex-wrap gap-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setForm({ ...form, avatar })}
                  className={`w-10 h-10 text-2xl rounded-lg border-2 transition-all ${
                    form.avatar === avatar ? 'border-rose-400 bg-rose-50' : 'border-gray-200'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
            <input
              type="text"
              value={form.location || ''}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avaliação</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setForm({ ...form, rating })}
                  className={`w-8 h-8 ${form.rating >= rating ? 'text-amber-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Depoimento</label>
            <textarea
              value={form.text || ''}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none resize-none h-24"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full font-medium hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-medium hover:shadow-lg disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
