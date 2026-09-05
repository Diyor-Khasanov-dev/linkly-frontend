import { ref } from 'vue'
import QRCode from 'qrcode'

export interface SocialLink {
  platform: 'linkedin' | 'github' | 'twitter' | 'instagram' | 'youtube' | 'whatsapp' | 'facebook' | 'tiktok' | 'website' | 'email' | 'phone'
  url: string
  label?: string
  enabled: boolean
}

export interface CustomLink {
  id: string
  title: string
  url: string
  icon?: string
  enabled: boolean
  description?: string
}

export interface BusinessCardTheme {
  id: string
  name: string
  bgClass: string
  cardBgClass: string
  textPrimaryClass: string
  textSecondaryClass: string
  accentClass: string
  buttonClass: string
  borderClass: string
}

export interface BusinessCard {
  slug: string
  name: string
  title: string
  company: string
  bio: string
  avatarUrl: string
  email: string
  phone: string
  location: string
  website: string
  theme: string
  socials: SocialLink[]
  customLinks: CustomLink[]
  updatedAt: string
}

const STORAGE_KEY = 'linkly_business_cards'

export const THEMES: Record<string, BusinessCardTheme> = {
  modernDark: {
    id: 'modernDark',
    name: 'Modern Dark',
    bgClass: 'bg-zinc-950',
    cardBgClass: 'bg-zinc-900/90 border-zinc-800',
    textPrimaryClass: 'text-zinc-100',
    textSecondaryClass: 'text-zinc-400',
    accentClass: 'bg-blue-600 hover:bg-blue-500 text-white',
    buttonClass: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700',
    borderClass: 'border-zinc-800'
  },
  oceanBlue: {
    id: 'oceanBlue',
    name: 'Ocean Blue',
    bgClass: 'bg-slate-950',
    cardBgClass: 'bg-slate-900/90 border-cyan-800/50',
    textPrimaryClass: 'text-slate-100',
    textSecondaryClass: 'text-slate-400',
    accentClass: 'bg-cyan-600 hover:bg-cyan-500 text-white',
    buttonClass: 'bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-700',
    borderClass: 'border-cyan-900/40'
  },
  sunsetViolet: {
    id: 'sunsetViolet',
    name: 'Sunset Violet',
    bgClass: 'bg-purple-950',
    cardBgClass: 'bg-purple-900/60 border-fuchsia-800/40',
    textPrimaryClass: 'text-purple-100',
    textSecondaryClass: 'text-purple-300/80',
    accentClass: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white',
    buttonClass: 'bg-purple-900/80 hover:bg-purple-800 text-purple-100 border border-purple-700/50',
    borderClass: 'border-fuchsia-900/30'
  },
  emeraldGrowth: {
    id: 'emeraldGrowth',
    name: 'Emerald Minimal',
    bgClass: 'bg-emerald-950',
    cardBgClass: 'bg-emerald-900/60 border-emerald-800/40',
    textPrimaryClass: 'text-emerald-50',
    textSecondaryClass: 'text-emerald-300/80',
    accentClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    buttonClass: 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/50',
    borderClass: 'border-emerald-900/40'
  },
  minimalLight: {
    id: 'minimalLight',
    name: 'Minimal Light',
    bgClass: 'bg-zinc-100',
    cardBgClass: 'bg-white border-zinc-200 shadow-xl',
    textPrimaryClass: 'text-zinc-900',
    textSecondaryClass: 'text-zinc-600',
    accentClass: 'bg-zinc-900 hover:bg-zinc-800 text-white',
    buttonClass: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300',
    borderClass: 'border-zinc-200'
  }
}

export const DEFAULT_CARD: BusinessCard = {
  slug: 'alex-morgan',
  name: 'Alex Morgan',
  title: 'Senior Full-Stack Engineer',
  company: 'Linkly Inc.',
  bio: 'Passionate about building scalable web applications, beautiful UI/UX, and cloud architecture. Let’s connect!',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 019-2834',
  location: 'San Francisco, CA',
  website: 'https://alexmorgan.dev',
  theme: 'modernDark',
  socials: [
    { platform: 'linkedin', url: 'https://linkedin.com', enabled: true },
    { platform: 'github', url: 'https://github.com', enabled: true },
    { platform: 'twitter', url: 'https://x.com', enabled: true },
    { platform: 'instagram', url: 'https://instagram.com', enabled: false },
    { platform: 'youtube', url: 'https://youtube.com', enabled: false },
    { platform: 'whatsapp', url: 'https://wa.me/15550192834', enabled: true }
  ],
  customLinks: [
    {
      id: '1',
      title: 'Portfolio Website',
      url: 'https://alexmorgan.dev',
      description: 'Check out my latest projects and articles',
      enabled: true
    },
    {
      id: '2',
      title: 'Schedule a 1-on-1 Call',
      url: 'https://cal.com',
      description: 'Book 30 mins meeting on my calendar',
      enabled: true
    },
    {
      id: '3',
      title: 'Download Resume (PDF)',
      url: 'https://example.com/resume.pdf',
      description: 'View updated work experience and skills',
      enabled: true
    }
  ],
  updatedAt: new Date().toISOString()
}

export function useBusinessCard() {
  const isSaving = ref(false)

  const getAllCards = (): Record<string, BusinessCard> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to parse cards from localStorage', e)
    }
    return { [DEFAULT_CARD.slug]: DEFAULT_CARD }
  }

  const getCardBySlug = (slug: string): BusinessCard => {
    const cards = getAllCards()
    if (cards[slug]) {
      return cards[slug]
    }
    // Fallback to default card with requested slug
    return {
      ...DEFAULT_CARD,
      slug
    }
  }

  const saveCard = (card: BusinessCard): boolean => {
    isSaving.value = true
    try {
      const cards = getAllCards()
      cards[card.slug] = {
        ...card,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
      return true
    } catch (e) {
      console.error('Failed to save business card to localStorage', e)
      return false
    } finally {
      isSaving.value = false
    }
  }

  const generateCardQrCode = async (url: string, darkColor = '#000000', lightColor = '#ffffff'): Promise<string> => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor
        }
      })
      return qrDataUrl
    } catch (err) {
      console.error('Failed to generate QR code', err)
      return ''
    }
  }

  const downloadVCard = (card: BusinessCard) => {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.name}`,
      `N:${card.name.split(' ').reverse().join(';')};;;`,
      card.company ? `ORG:${card.company}` : '',
      card.title ? `TITLE:${card.title}` : '',
      card.email ? `EMAIL;TYPE=INTERNET,WORK:${card.email}` : '',
      card.phone ? `TEL;TYPE=CELL:${card.phone}` : '',
      card.location ? `ADR;TYPE=WORK:;;${card.location};;;;` : '',
      card.website ? `URL:${card.website}` : '',
      card.bio ? `NOTE:${card.bio}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n')

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${card.name.toLowerCase().replace(/\s+/g, '_')}_vcard.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getPublicCardUrl = (slug: string): string => {
    const origin = window.location.origin
    return `${origin}/card/${slug}`
  }

  return {
    isSaving,
    getCardBySlug,
    saveCard,
    generateCardQrCode,
    downloadVCard,
    getPublicCardUrl,
    getAllCards
  }
}
