import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zásady zpracování osobních údajů | Jan Blažek Luxury Real Estate Dubai',
}

const sections = [
  {
    title: '1. Jaké osobní údaje zpracováváme',
    text: 'Zpracováváme pouze údaje, které nám sami poskytnete, zejména: jméno a příjmení, e-mailovou adresu, telefonní číslo, informace související s Vaší poptávkou nebo spoluprací, další údaje, které nám sdělíte v rámci komunikace. V případě obchodní spolupráce nebo realizace transakce mohou být zpracovávány také údaje nezbytné pro splnění smluvních a zákonných povinností.',
  },
  {
    title: '2. Účel zpracování osobních údajů',
    text: 'Vaše osobní údaje zpracováváme zejména za účelem: vyřízení Vaší poptávky nebo dotazu, komunikace ohledně investičních příležitostí a realitních služeb, uzavření a plnění smluv, plnění právních a regulačních povinností, marketingové komunikace, pokud jste k ní udělili souhlas. Osobní údaje nejsou zpracovávány k jiným účelům, než ke kterým byly poskytnuty.',
  },
  {
    title: '3. Právní základ zpracování',
    text: 'Osobní údaje zpracováváme na základě: plnění smlouvy nebo jednání o jejím uzavření, oprávněného zájmu správce, Vašeho souhlasu, pokud je vyžadován, plnění zákonných povinností.',
  },
  {
    title: '4. Doba uchovávání osobních údajů',
    text: 'Osobní údaje uchováváme pouze po dobu nezbytně nutnou: po dobu trvání smluvního vztahu, po dobu vyžadovanou právními předpisy, po dobu trvání oprávněného zájmu, do odvolání souhlasu, pokud je zpracování založeno na souhlasu.',
  },
  {
    title: '5. Předávání osobních údajů',
    text: 'Vaše osobní údaje mohou být předávány pouze: ověřeným obchodním partnerům, developerům nebo poskytovatelům služeb, pokud je to nutné k realizaci služeb, orgánům veřejné moci, pokud to vyžaduje zákon. Osobní údaje nejsou prodávány třetím stranám.',
  },
  {
    title: '6. Zabezpečení osobních údajů',
    text: 'Přijímáme technická a organizační opatření k ochraně osobních údajů proti neoprávněnému přístupu, ztrátě, zneužití nebo zničení. K osobním údajům mají přístup pouze osoby, které je nezbytně potřebují k výkonu své práce.',
  },
  {
    title: '7. Vaše práva',
    text: 'Máte právo: požadovat přístup ke svým osobním údajům, požadovat opravu nebo doplnění nepřesných údajů, požadovat výmaz osobních údajů, pokud to právní předpisy umožňují, omezit zpracování osobních údajů, vznést námitku proti zpracování, odvolat souhlas se zpracováním osobních údajů. V případě dotazů nebo uplatnění svých práv nás můžete kdykoliv kontaktovat.',
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase mb-14 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Zpět na hlavní stránku
        </Link>

        {/* Heading */}
        <p className="text-[#C9A84C] text-[10px] tracking-[0.55em] uppercase mb-5">Právní informace</p>
        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl font-light text-white mb-10 leading-tight">
          Zásady zpracování<br />osobních údajů
        </h1>

        {/* Intro */}
        <p className="text-white/60 text-[15px] leading-[1.9] mb-14 border-l-2 border-[#C9A84C] pl-6">
          Společnost DMC Realty LLC se sídlem v Shams Business Center, Sharjah Media City free Zone,
          Al Messaned, Sharjah, UAE (dále jen „správce") klade důraz na ochranu osobních údajů svých
          klientů, obchodních partnerů a návštěvníků webových stránek. Tyto zásady vysvětlují, jakým
          způsobem osobní údaje zpracováváme, k jakým účelům a jaká jsou Vaše práva.
        </p>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.title} className="border-t border-white/8 pt-8">
              <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#C9A84C] font-light mb-4">
                {s.title}
              </h2>
              <p className="text-white/60 text-[15px] leading-[1.9]">{s.text}</p>
            </div>
          ))}

          {/* Section 8 — contact */}
          <div className="border-t border-white/8 pt-8">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#C9A84C] font-light mb-4">
              8. Kontaktní údaje správce
            </h2>
            <div className="text-white/60 text-[15px] leading-[1.9] space-y-1">
              <p className="text-white">DMC Realty LLC</p>
              <p>Shams Business Center, Sharjah Media City free Zone, Al Messaned, Sharjah, UAE</p>
              <p>
                E-mail:{' '}
                <a href="mailto:jan@realtydmc.com" className="text-[#C9A84C] hover:text-white transition-colors">
                  jan@realtydmc.com
                </a>
              </p>
              <p>
                Telefon:{' '}
                <a href="tel:+971585931012" className="text-[#C9A84C] hover:text-white transition-colors">
                  +971 585 931 012
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
