'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://ekszxvqqgyemywbbrjlj.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const storagePublicUrl = (bucket: string, folder: string, file: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`

async function listStorageFiles(bucket: string, folder: string): Promise<string[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${bucket}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ prefix: `${folder}/`, limit: 100, sortBy: { column: 'name', order: 'asc' } }),
    })
    if (!res.ok) return []
    const data: { name: string }[] = await res.json()
    return data.map((f) => f.name).filter(Boolean)
  } catch {
    return []
  }
}

const IMAGE_EXTS = ['webp', 'jpg', 'jpeg', 'png', 'gif', 'avif']
const isImage = (name: string) => IMAGE_EXTS.includes(name.split('.').pop()?.toLowerCase() ?? '')
const isPDF = (name: string) => name.toLowerCase().endsWith('.pdf')

// ─── ICONS ───────────────────────────────────────────────────────────────────

const IconPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-[#C9A84C] flex-shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const IconChevron = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
  </svg>
)

const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
  </svg>
)

const IconChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
  </svg>
)

const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-[#C9A84C]">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 19v1a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-[#C9A84C]">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const IconInstagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#C9A84C]">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const IconWA = ({ cls = 'w-5 h-5' }: { cls?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cls}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-[#C9A84C]">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
  </svg>
)

const IconDownload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

// ─── DATA ────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: 1,
    name: 'The Rings',
    folder: 'PMR PROPERTY _The Rings_',
    developer: 'PMR PROPERTY',
    location: 'Jumeirah, Dubai',
    price_aed: '85 000 000',
    price_czk: '484 000 000',
    description: 'Ikonický projekt na pobřeží Jumeirah. Rezidence světové třídy s přímým přístupem k moři a panoramatickými výhledy na Dubai Marina.',
  },
  {
    id: 2,
    name: 'Amali Residences',
    folder: 'Amali Residences',
    developer: 'AMALI PROPERTIES',
    location: 'Safa Park, Dubai',
    price_aed: '15 000 000',
    price_czk: 'od 86 000 000',
    description: 'Nový launch v srdci nejluxusnější rezidenční zóny Dubaje. Jednotky od 268 m² do 1 948 m² Sky Mansion. Vedle Safa Parku — destinace s limitovanou nabídkou a fantastickou dostupností.',
  },
  {
    id: 3,
    name: 'Armani Beach Residences',
    folder: 'Armani Beach Residences',
    developer: "RAK PROPERTIES & SOTHEBY'S",
    location: 'Ras Al Khaimah',
    price_aed: '27 000 000',
    price_czk: '152 000 000',
    description: 'Vily nesoucí podpis Armani v klidné části RAK. Výjimečná příležitost kombinující luxusní lifestyle s blízkostí nově budovaného kasína.',
  },
  {
    id: 4,
    name: 'Passo',
    folder: 'BEYOND BY OMNIYAT _Passo_',
    developer: 'BEYOND BY OMNIYAT',
    location: 'Palm Jumeirah, Dubai',
    price_aed: '10 000 000',
    price_czk: '57 000 000',
    description: 'Luxusní projekt na Palm Jumeirah s bezkonkurenčními výhledy. Omniyat je synonymem pro nejvyšší standard v Dubaji.',
  },
  {
    id: 5,
    name: 'Siniya Island Villas',
    folder: 'SOBHA _Siniya Island Villas',
    developer: 'SOBHA',
    location: 'Siniya Island, Umm Al Quwain',
    price_aed: '10 800 000',
    price_czk: '62 000 000',
    description: 'Vily na jediném přírodním ostrově v okolí Dubaje. Neopakovatelné prostředí kombinující přírodu s luxusem.',
  },
  {
    id: 6,
    name: 'Four Seasons Private Residences',
    folder: 'ALAIN _Four Seasons Private Residences',
    developer: 'ALAIN',
    location: 'Saadiyat Island, Abu Dhabi',
    price_aed: '70 000 000',
    price_czk: '399 000 000',
    description: 'Prestižní rezidence Four Seasons na Saadiyat Island v Abu Dhabi. Kulturní destinace světového formátu.',
  },
  {
    id: 7,
    name: 'Elwood Estates',
    folder: 'SOBHA _Elwood Estates',
    developer: 'SOBHA',
    location: 'Dubai',
    price_aed: '11 000 000',
    price_czk: '63 000 000',
    description: 'Exkluzivní vilový komplex od Sobha — developera s pověstí za nulové kompromisy v kvalitě výstavby.',
  },
  {
    id: 8,
    name: 'DaVinci Tower by Pagani',
    folder: 'DARGLOBAL _DaVinci Tower by Pagani_',
    developer: 'DARGLOBAL',
    location: 'Business Bay, Dubai',
    price_aed: '7 500 000',
    price_czk: '43 000 000',
    description: 'Jedinečný architektonický skvost v centru Dubaje. Hotový projekt přímo od developera — vzácná příležitost k okamžitému vstupu.',
  },
  {
    id: 9,
    name: 'Six Senses Residences',
    folder: 'SELECT GROUP _Six Senses Residences_',
    developer: 'SELECT GROUP',
    location: 'Dubai Marina',
    price_aed: '10 260 000',
    price_czk: '58 400 000',
    description: 'Dubai Marina v nejvyšším standardu. Six Senses přináší wellness lifestyle do soukromé rezidence.',
  },
]

const STEPS = [
  { n: 1, title: 'Výběr projektu', desc: 'Společně vybereme nemovitost odpovídající vašim požadavkům, rozpočtu a investičním cílům.' },
  { n: 2, title: 'Osobní konzultace', desc: 'Detailní analýza trhu, právní struktura koupě a finanční plánování přizpůsobené přímo vám.' },
  { n: 3, title: 'Návštěva Dubaje', desc: 'Osobní vyzvednutí z letiště, ubytování prémiové úrovně, večeře v nejlepších restauracích Dubaje.' },
  { n: 4, title: 'Prohlídka nemovitostí', desc: 'Návštěva ukázkových jednotek a již dokončených projektů. Přímý kontakt s developery.' },
  { n: 5, title: 'Due diligence', desc: 'Detailní průzkum developera, jeho kvality, historických projektů a spolehlivosti přímo na místě.' },
  { n: 6, title: 'Právní podpora', desc: 'Kompletní právní zajištění transakce. Váš čas je drahý — postaráme se o vše od A do Z.' },
  { n: 7, title: 'Podpis a platba', desc: 'Asistence při podpisu SPA smlouvy a nastavení platebního plánu.' },
  { n: 8, title: 'Inspekce při dokončení', desc: 'Detailní inspekce vaší jednotky při předání zdarma. Garantujeme vyřešení všech nedostatků.' },
  { n: 9, title: 'Překvapení při předání', desc: 'Osobní dárek při převzetí klíčů. Malý projev úcty za vaši důvěru.' },
  { n: 10, title: 'Golden Visa & správa', desc: 'Konzultace při zajištění Golden Visa, správa nemovitosti, pronájem — vše zajistíme.' },
]

type Project = (typeof PROJECTS)[0]

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────

function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex)

  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95">
      <button onClick={onClose} aria-label="Zavřít"
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
        <IconClose />
      </button>

      {images.length > 1 && (
        <>
          <button onClick={prev} aria-label="Předchozí"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <IconChevronLeft />
          </button>
          <button onClick={next} aria-label="Další"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <IconChevronRight />
          </button>
        </>
      )}

      <div className="relative w-full h-full max-w-5xl max-h-[85vh] mx-auto px-16 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[idx]} alt={`Fotka ${idx + 1}`} className="max-w-full max-h-full object-contain" />
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest">
          {idx + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const nav = (id: string) => { setOpen(false); goTo(id) }
  const links = [['uvod', 'Úvod'], ['projekty', 'Projekty'], ['cesta', 'Cesta ke koupi'], ['kontakt', 'Kontakt']]

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-black/85 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex flex-col leading-tight cursor-pointer" onClick={() => goTo('hero')}>
          <span className="font-[family-name:var(--font-cormorant)] text-[22px] font-semibold tracking-[0.12em] text-white">Jan Blažek</span>
          <span className="text-[9px] text-[#C9A84C] tracking-[0.35em] uppercase font-light">Luxury Real Estate Dubai</span>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {links.map(([id, label]) => (
            <button key={id} onClick={() => nav(id)} className="text-[11px] tracking-[0.25em] uppercase text-white/65 hover:text-[#C9A84C] transition-colors duration-200">
              {label}
            </button>
          ))}
        </nav>

        <a href="https://wa.me/971585931012" target="_blank" rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-5 py-2.5 border border-[#C9A84C] text-[#C9A84C] text-[10px] tracking-[0.25em] uppercase hover:bg-[#C9A84C] hover:text-black transition-all duration-200">
          <IconWA cls="w-3.5 h-3.5" />
          WhatsApp
        </a>

        <button className="md:hidden text-white p-1" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {links.map(([id, label]) => (
            <button key={id} onClick={() => nav(id)} className="text-[11px] tracking-[0.25em] uppercase text-white/65 hover:text-[#C9A84C] text-left transition-colors">
              {label}
            </button>
          ))}
          <a href="https://wa.me/971585931012" target="_blank" rel="noopener noreferrer" className="text-[11px] tracking-[0.25em] uppercase text-[#C9A84C]">WhatsApp</a>
        </div>
      )}
    </header>
  )
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="https://ekszxvqqgyemywbbrjlj.supabase.co/storage/v1/object/public/luxusni-projekty/hero.jpg" alt="Dubai luxury skyline" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
      </div>
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
        <p className="text-[#C9A84C] text-[10px] tracking-[0.6em] uppercase mb-10 font-light">LUXUSNÍ NEMOVITOSTI V DUBAJI</p>
        <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-7xl lg:text-[90px] font-light text-white leading-[1.05] mb-8 tracking-tight">
          Kde světový kapitál<br />nachází svůj domov
        </h1>
        <p className="text-white/60 text-lg md:text-xl font-light mb-14 max-w-2xl mx-auto leading-relaxed tracking-wide">
          Výběrová portfolio ultra-prémiových rezidencí.<br className="hidden sm:block" />
          Osobní přístup. Komplexní servis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => goTo('projekty')} className="px-10 py-4 bg-[#C9A84C] text-black text-[11px] tracking-[0.3em] uppercase font-medium hover:bg-[#b8963d] transition-colors duration-200">
            Prohlédnout projekty
          </button>
          <button onClick={() => goTo('kontakt')} className="px-10 py-4 border border-[#C9A84C] text-[#C9A84C] text-[11px] tracking-[0.3em] uppercase hover:bg-[#C9A84C]/10 transition-colors duration-200">
            Kontaktovat Jana
          </button>
        </div>
      </div>
      <button onClick={() => goTo('uvod')} aria-label="Scrollovat dolů" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-[#C9A84C] animate-bounce">
        <IconChevron />
      </button>
    </section>
  )
}

// ─── INTRO ───────────────────────────────────────────────────────────────────

function Intro() {
  const stats = [
    { value: '62,7 %', label: 'nárůst prodejů luxusních nemovitostí v H1 2025' },
    { value: '930 USD', label: 'průměrná cena za ft² v Dubaji vs 3 860 USD v Hongkongu' },
    { value: '9 800', label: 'nových milionářů přijíždí do UAE v roce 2025' },
  ]
  return (
    <section id="uvod" className="py-28 md:py-36 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-28 items-center">
          <div className="space-y-14">
            {stats.map((s) => (
              <div key={s.value} className="border-l-2 border-[#C9A84C] pl-8">
                <div className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl text-[#C9A84C] font-light mb-2 leading-none">{s.value}</div>
                <div className="text-white/55 text-sm tracking-wide leading-relaxed">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-6 text-white/65 text-[15px] leading-[1.9]">
            <p className="text-[#C9A84C] text-[9px] tracking-[0.5em] uppercase">O trhu</p>
            <p>Dubaj přestala být destinací, kam bohatí jezdí na dovolenou. Stala se místem, kde se rozhodují usadit. Tento posun je klíčový — není to spekulativní bublina ani módní vlna. Je to strukturální změna v tom, jak globální kapitál přemýšlí o bezpečí, daních a kvalitě života.</p>
            <p>V první polovině roku 2025 bylo v Dubaji prodáno 3 731 nemovitostí za více než 10 milionů AED — nárůst o 62,7 % oproti stejnému období roku 2024. Druhý kvartál 2025 byl historicky nejsilnějším čtvrtletím — objem super-prime prodejů překročil 2,6 miliardy dolarů.</p>
            <p>Průměrná cena prémiové nemovitosti v Dubaji je přibližně 930 USD za čtvereční stopu. V Hongkongu je to 3 860 USD. Dubaj nabízí světovou úroveň za zlomek ceny srovnatelných trhů.</p>
            <p>Kombinace omezeného počtu skutečně výjimečných nemovitostí, nepřetržitého přílivu globálního bohatství a prostředí bez daní vytváří podmínky pro ochranu a zhodnocení kapitálu jen těžko překonatelné.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PROJECT CARD ────────────────────────────────────────────────────────────

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const mainImg = storagePublicUrl('luxusni-projekty', project.folder, 'Main.webp')

  return (
    <article className="group bg-[#0D0D0D] border border-white/8 hover:border-[#C9A84C]/40 transition-all duration-300 flex flex-col">
      <div className="relative h-56 overflow-hidden">
        <Image src={mainImg} alt={project.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <span className="absolute top-4 left-4 text-[9px] text-[#C9A84C] tracking-[0.35em] uppercase bg-black/60 backdrop-blur-sm px-3 py-1.5">
          {project.developer}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-white mb-2 leading-tight">{project.name}</h3>
        <div className="flex items-center gap-1.5 text-white/45 text-xs mb-5">
          <IconPin />
          {project.location}
        </div>
        <div className="mt-auto">
          <div className="text-[#C9A84C] font-[family-name:var(--font-cormorant)] text-xl leading-tight mb-0.5">od {project.price_aed} AED</div>
          <div className="text-white/35 text-xs mb-5">cca {project.price_czk} CZK</div>
          <button onClick={() => onOpen(project)}
            className="w-full py-3 border border-[#C9A84C]/40 text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase hover:bg-[#C9A84C] hover:text-black hover:border-[#C9A84C] transition-all duration-200">
            Více informací
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── MODAL ───────────────────────────────────────────────────────────────────

function Modal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [pdfs, setPdfs] = useState<{ name: string; url: string }[]>([])
  const [loadingFiles, setLoadingFiles] = useState(true)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const mainImg = storagePublicUrl('luxusni-projekty', project.folder, 'Main.webp')

  // Fetch images and PDFs when modal opens
  useEffect(() => {
    let cancelled = false
    setLoadingFiles(true)
    setGalleryImages([])
    setPdfs([])

    Promise.all([
      listStorageFiles('luxusni-projekty', project.folder),
      listStorageFiles('luxusni-brozury', project.folder),
    ]).then(([projectFiles, brochureFiles]) => {
      if (cancelled) return

      const imgs = projectFiles
        .filter(isImage)
        .filter((name) => name.toLowerCase() !== 'main.webp')
        .map((name) => storagePublicUrl('luxusni-projekty', project.folder, name))

      const pdfList = brochureFiles
        .filter(isPDF)
        .map((name) => ({
          name,
          url: storagePublicUrl('luxusni-brozury', project.folder, name),
        }))

      setGalleryImages(imgs)
      setPdfs(pdfList)
      setLoadingFiles(false)
    })

    return () => { cancelled = true }
  }, [project.folder])

  const handleInterest = useCallback(() => {
    onClose()
    setTimeout(() => {
      goTo('kontakt')
      const el = document.getElementById('msg') as HTMLTextAreaElement | null
      if (el) {
        el.value = `Zájem o projekt: ${project.name}`
        el.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }, 350)
  }, [project.name, onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && lightboxIdx === null) onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, lightboxIdx])

  // All images for lightbox (main + gallery)
  const allImages = [mainImg, ...galleryImages]

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 bg-[#111] border border-white/10 w-full max-w-2xl max-h-[92vh] overflow-y-auto">

          {/* Main image */}
          <div className="relative h-64 flex-shrink-0 cursor-zoom-in" onClick={() => setLightboxIdx(0)}>
            <Image src={mainImg} alt={project.name} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/20 to-transparent" />
            <button onClick={(e) => { e.stopPropagation(); onClose() }} aria-label="Zavřít"
              className="absolute top-4 right-4 w-9 h-9 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/90 transition-all">
              <IconClose />
            </button>
          </div>

          {/* Gallery thumbnails */}
          {!loadingFiles && galleryImages.length > 0 && (
            <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-thin bg-black/30">
              {/* Main as first thumb */}
              <button
                onClick={() => setLightboxIdx(0)}
                className="flex-shrink-0 w-16 h-16 relative border-2 border-[#C9A84C]/60 hover:border-[#C9A84C] transition-colors overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mainImg} alt="Main" className="w-full h-full object-cover" />
              </button>
              {galleryImages.map((url, i) => (
                <button
                  key={url}
                  onClick={() => setLightboxIdx(i + 1)}
                  className="flex-shrink-0 w-16 h-16 relative border border-white/15 hover:border-[#C9A84C] transition-colors overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Fotka ${i + 2}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {loadingFiles && (
            <div className="h-6 flex items-center px-4 py-3">
              <div className="w-4 h-4 border border-[#C9A84C]/40 border-t-[#C9A84C] rounded-full animate-spin" />
            </div>
          )}

          <div className="p-8 md:p-10">
            <p className="text-[#C9A84C] text-[9px] tracking-[0.45em] uppercase mb-2">{project.developer}</p>
            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl font-light text-white mb-3 leading-tight">{project.name}</h2>
            <div className="flex items-center gap-1.5 text-white/45 text-xs mb-6"><IconPin />{project.location}</div>

            <div className="text-[#C9A84C] font-[family-name:var(--font-cormorant)] text-2xl mb-0.5">od {project.price_aed} AED</div>
            <div className="text-white/35 text-sm mb-7">cca {project.price_czk} CZK</div>

            <p className="text-white/65 leading-relaxed text-[15px] mb-8">{project.description}</p>

            {/* Key info */}
            <div className="border-t border-white/8 pt-7 mb-8">
              <p className="text-[#C9A84C] text-[9px] tracking-[0.45em] uppercase mb-5">Klíčové informace</p>
              <div className="grid grid-cols-2 gap-5">
                {[['Plocha', 'dle dostupných jednotek'], ['Typ jednotek', 'apartmány / vily'], ['Předání', 'dle projektu'], ['Platební plán', 'dle developera']].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-white/35 text-[10px] tracking-[0.2em] uppercase mb-1">{k}</div>
                    <div className="text-white/70 text-sm">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PDF brochures */}
            {!loadingFiles && pdfs.length > 0 && (
              <div className="border-t border-white/8 pt-7 mb-8">
                <p className="text-[#C9A84C] text-[9px] tracking-[0.45em] uppercase mb-4">Brožury ke stažení</p>
                <div className="flex flex-col gap-2">
                  {pdfs.map(({ name, url }) => (
                    <a key={name} href={url} target="_blank" rel="noopener noreferrer" download
                      className="flex items-center gap-3 px-4 py-3 border border-white/10 text-white/60 text-sm hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-200">
                      <IconDownload />
                      <span className="truncate">{name.replace(/\.pdf$/i, '')}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!loadingFiles && pdfs.length === 0 && (
                <a href="#" onClick={(e) => e.preventDefault()}
                  className="flex-1 py-3.5 text-center border border-white/15 text-white/45 text-[10px] tracking-[0.3em] uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-200">
                  Stáhnout brožuru
                </a>
              )}
              <button onClick={handleInterest}
                className="flex-1 py-3.5 bg-[#C9A84C] text-black text-[10px] tracking-[0.3em] uppercase font-medium hover:bg-[#b8963d] transition-colors duration-200">
                Mám zájem
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox images={allImages} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </>
  )
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────

function Projects() {
  const [active, setActive] = useState<Project | null>(null)
  return (
    <section id="projekty" className="py-28 md:py-36 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.55em] uppercase mb-5">Portfolio</p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl font-light text-white mb-4">Výběrová portfolio</h2>
          <p className="text-white/40 tracking-widest text-sm">Aktuální ultra-prémiové projekty</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((p) => <ProjectCard key={p.id} project={p} onOpen={setActive} />)}
        </div>
      </div>
      {active && <Modal project={active} onClose={() => setActive(null)} />}
    </section>
  )
}

// ─── JOURNEY ─────────────────────────────────────────────────────────────────

const STEP_ICON_PATHS = [
  'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
  'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
  'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
  'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
]

function StepCard({ step, iconPath }: { step: typeof STEPS[0]; iconPath: string }) {
  return (
    <div className="bg-[#111] border border-[#C9A84C]/18 hover:border-[#C9A84C]/45 transition-colors duration-300 p-6 w-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-[#C9A84C] mb-4">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
      </svg>
      <h3 className="text-white text-sm font-medium tracking-wide mb-2">{step.title}</h3>
      <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
    </div>
  )
}

function Journey() {
  return (
    <section id="cesta" className="py-28 md:py-36 bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.55em] uppercase mb-5">Proces</p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl font-light text-white mb-4">
            Vaše cesta k luxusní nemovitosti
          </h2>
          <p className="text-white/40 tracking-widest text-sm">Komplexní servis od prvního kontaktu po předání klíčů</p>
        </div>

        {/* ── Desktop: alternating timeline ── */}
        <div className="hidden md:block relative">
          {/* Center golden line */}
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent 0%, #C9A84C55 6%, #C9A84C55 94%, transparent 100%)' }} />

          <div className="space-y-4">
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0
              return (
                <div key={step.n} className="relative flex items-center py-3 min-h-[90px]">
                  {/* Left slot */}
                  <div className="w-1/2 pr-16 flex justify-end">
                    {isLeft && <StepCard step={step} iconPath={STEP_ICON_PATHS[i]} />}
                  </div>

                  {/* Center dot with number */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-[#0D0D0D] border-2 border-[#C9A84C] flex items-center justify-center flex-shrink-0">
                    <span className="font-[family-name:var(--font-cormorant)] text-[#C9A84C] text-lg font-light leading-none">
                      {step.n}
                    </span>
                  </div>

                  {/* Right slot */}
                  <div className="w-1/2 pl-16">
                    {!isLeft && <StepCard step={step} iconPath={STEP_ICON_PATHS[i]} />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Mobile: stacked with left line ── */}
        <div className="md:hidden space-y-4">
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex gap-4 items-stretch">
              {/* Dot + connector column */}
              <div className="flex flex-col items-center flex-shrink-0 w-8">
                <div className="w-8 h-8 rounded-full bg-[#0D0D0D] border border-[#C9A84C] flex items-center justify-center flex-shrink-0 z-10">
                  <span className="font-[family-name:var(--font-cormorant)] text-[#C9A84C] text-sm leading-none">
                    {step.n}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 mt-2 bg-[#C9A84C]/25" />
                )}
              </div>
              {/* Card */}
              <div className="flex-1 pb-4">
                <StepCard step={step} iconPath={STEP_ICON_PATHS[i]} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PARTNERS ────────────────────────────────────────────────────────────────

type Partner = {
  id: number
  name: string
  description: string | null
  logo_url: string | null
  website_url: string | null
}

function PartnerInitials({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <div className="w-16 h-16 bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center flex-shrink-0">
      <span className="font-[family-name:var(--font-cormorant)] text-[#C9A84C] text-xl font-light">{initials}</span>
    </div>
  )
}

function Partners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) { setLoaded(true); return }

    fetch(`${url}/rest/v1/partners?show_on_web=eq.true&order=id.asc`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    })
      .then((r) => r.json())
      .then((data: Partner[]) => { setPartners(Array.isArray(data) ? data : []) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  if (!loaded || partners.length === 0) return null

  return (
    <section className="py-28 md:py-36 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.55em] uppercase mb-5">Spolupráce</p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl font-light text-white mb-4">
            Naši partneři
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {partners.map((p) => (
            <article key={p.id} className="bg-[#0D0D0D] border border-[#C9A84C]/18 hover:border-[#C9A84C]/45 transition-colors duration-300 p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                {p.logo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={p.logo_url} alt={p.name} className="w-16 h-16 object-contain flex-shrink-0" />
                ) : (
                  <PartnerInitials name={p.name} />
                )}
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-light text-white leading-tight">
                  {p.name}
                </h3>
              </div>

              {p.description && (
                <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1">{p.description}</p>
              )}

              {p.website_url && (
                <a
                  href={p.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors duration-200"
                >
                  Navštívit web
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true); setErr('')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setErr('Nepodařilo se odeslat formulář. Kontaktujte nás prosím přímo.')
    } finally {
      setSending(false)
    }
  }

  const contactItems = [
    { icon: <IconPhone />, href: 'tel:+971585931012', text: '+971 585 931 012', external: false },
    { icon: <IconMail />, href: 'mailto:jan@realtydmc.com', text: 'jan@realtydmc.com', external: false },
    { icon: <IconInstagram />, href: 'https://instagram.com/janblazek_realestate', text: '@janblazek_realestate', external: true },
  ]

  return (
    <section id="kontakt" className="py-28 md:py-36 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.55em] uppercase mb-5">Kontakt</p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl font-light text-white">Začněme společnou cestu</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <p className="text-white/55 text-[15px] leading-relaxed mb-12">Pro diskrétní konzultaci mě kontaktujte přímo.</p>
            <div className="space-y-6 mb-12">
              {contactItems.map(({ icon, href, text, external }) => (
                <div key={text} className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#C9A84C]/25 flex items-center justify-center flex-shrink-0">{icon}</div>
                  <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-white/65 hover:text-[#C9A84C] transition-colors text-sm">{text}</a>
                </div>
              ))}
            </div>
            <a href="https://wa.me/971585931012" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white text-[10px] tracking-[0.3em] uppercase hover:bg-[#1eb855] transition-colors duration-200">
              <IconWA />
              Napsat na WhatsApp
            </a>
          </div>

          <div>
            {sent ? (
              <div className="min-h-[360px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-6"><IconCheck /></div>
                  <p className="font-[family-name:var(--font-cormorant)] text-3xl text-white mb-3">Děkujeme.</p>
                  <p className="text-white/50 text-sm">Ozveme se vám co nejdříve.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] tracking-[0.3em] uppercase text-white/35 mb-2">Jméno *</label>
                    <input required type="text" value={form.firstName} onChange={set('firstName')}
                      className="w-full bg-white/4 border border-white/10 focus:border-[#C9A84C] text-[#1a1a1a] px-4 py-3 outline-none transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="block text-[9px] tracking-[0.3em] uppercase text-white/35 mb-2">Příjmení *</label>
                    <input required type="text" value={form.lastName} onChange={set('lastName')}
                      className="w-full bg-white/4 border border-white/10 focus:border-[#C9A84C] text-[#1a1a1a] px-4 py-3 outline-none transition-colors text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-white/35 mb-2">Telefon *</label>
                  <input required type="tel" value={form.phone} onChange={set('phone')}
                    className="w-full bg-white/4 border border-white/10 focus:border-[#C9A84C] text-[#1a1a1a] px-4 py-3 outline-none transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-white/35 mb-2">Email *</label>
                  <input required type="email" value={form.email} onChange={set('email')}
                    className="w-full bg-white/4 border border-white/10 focus:border-[#C9A84C] text-[#1a1a1a] px-4 py-3 outline-none transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-white/35 mb-2">Zpráva</label>
                  <textarea id="msg" rows={4} value={form.message} onChange={set('message')}
                    onInput={(e) => setForm((f) => ({ ...f, message: (e.target as HTMLTextAreaElement).value }))}
                    className="w-full bg-white/4 border border-white/10 focus:border-[#C9A84C] text-[#1a1a1a] px-4 py-3 outline-none transition-colors text-sm resize-none" />
                </div>
                {err && <p className="text-red-400 text-sm">{err}</p>}
                <button type="submit" disabled={sending}
                  className="w-full py-4 bg-[#C9A84C] text-black text-[10px] tracking-[0.35em] uppercase font-medium hover:bg-[#b8963d] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {sending ? 'Odesílání…' : 'Odeslat'}
                </button>
                <p className="text-white/30 text-xs leading-relaxed text-center">
                  Odesláním formuláře souhlasíte se zpracováním osobních údajů dle našich{' '}
                  <a href="/zasady-zpracovani-osobnich-udaju" className="text-[#C9A84C] hover:text-white transition-colors underline-offset-2 hover:underline">
                    zásad
                  </a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white/25 text-xs tracking-widest">
        <span>© 2025 Jan Blažek | Luxury Real Estate Dubai</span>
        <div className="flex items-center gap-6">
          <a href="/zasady-zpracovani-osobnich-udaju" className="hover:text-[#C9A84C] transition-colors">Zásady zpracování osobních údajů</a>
          <a href="https://bytyvdubaji.cz" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A84C] transition-colors">bytyvdubaji.cz</a>
        </div>
      </div>
    </footer>
  )
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Projects />
        <Journey />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
