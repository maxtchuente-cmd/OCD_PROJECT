import { useEffect, useMemo, useState, type FormEvent } from 'react'
import logo from '../assets/ocd-logo.png'
import '../App.css'
import { Icon } from '../components/ui/Icon'
import { categories } from '../data/homeData'
import { type OpportunityRecord, opportunityService } from '../services/opportunityService'
import { memberToolsService } from '../services/memberToolsService'
import { ApiError, apiRequest } from '../services/api/httpClient'

type Props = { onAccount: (mode?: 'login' | 'register') => void }
type PublicTestimonial = { id:number; person_name:string; role_or_location?:string|null; quote:string; opportunity_type?:string|null; rating?:number }
type PublicOpportunity = OpportunityRecord & { org: string; place: string; type: string; tag: string; color: string; user_id?: number }
type MemberApplication = { opportunity?: { id?: number; slug?: string } }
type MemberOpportunity = { id: number; slug?: string }

function App({ onAccount }: Props) {
  const [query, setQuery] = useState('')
  const [opportunities, setOpportunities] = useState<PublicOpportunity[]>([])
  const [loadingOpportunities, setLoadingOpportunities] = useState(true)
  const [detail, setDetail] = useState<PublicOpportunity | null>(null)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [applying, setApplying] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [isOwnOpportunity, setIsOwnOpportunity] = useState(false)
  const [checkingApplication, setCheckingApplication] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [countries, setCountries] = useState<string[]>([])
  const [siteContent, setSiteContent] = useState<Record<string,string>>({})
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([])
  const [testimonialBusy, setTestimonialBusy] = useState(false)
  useEffect(() => { opportunityService.search({ per_page: 30 }).then(result => { setOpportunities(result.data.map(item => ({ ...item, org: item.organization, place: [item.city, item.country_name].filter(Boolean).join(', ') || (item.is_remote ? 'À distance' : 'International'), type: item.opportunity_type || (item.is_remote ? 'À distance' : 'Voir les détails'), tag: item.deadline_at ? `Limite : ${new Date(item.deadline_at).toLocaleDateString('fr-FR')}` : 'Publié par OCD', color: item.category === 'Bourse' ? 'blue' : item.category === 'Formation' ? 'green' : 'orange' }))); }).catch(() => setOpportunities([])).finally(() => setLoadingOpportunities(false)) }, [])
  useEffect(() => { fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '') + '/references/countries').then(r => r.json()).then(payload => setCountries((payload.data || []).map((item: { name: string }) => item.name))).catch(() => setCountries([])) }, [])
  useEffect(() => { fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '') + '/site-content').then(r => r.json()).then(payload => { setSiteContent(payload.data || {}); setTestimonials(payload.testimonials || []) }).catch(() => undefined) }, [])
  const [country, setCountry] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tout')
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const filtered = useMemo(() => opportunities.filter((item) => {
    const q = query.trim().toLocaleLowerCase()
    const matchesQuery = !q || `${item.title} ${item.org} ${item.category} ${item.place}`.toLocaleLowerCase().includes(q)
    const matchesCategory = activeCategory === 'Tout' || item.category === activeCategory
    const matchesCountry = !country || item.place.toLocaleLowerCase().includes(country.toLocaleLowerCase()) || item.place === 'En ligne' || item.place.includes('International')
    return matchesQuery && matchesCategory && matchesCountry
  }), [query, country, activeCategory])

  async function openOpportunity(item: PublicOpportunity) {
    setDetail(item); setAlreadyApplied(false); setIsOwnOpportunity(false); setApplicationMessage('')
    if (!localStorage.getItem('ocd_access_token')) return
    setCheckingApplication(true)
    try {
      const [apps, mine] = await Promise.all([
        apiRequest<{data:MemberApplication[]}>('/my/applications'),
        apiRequest<{data:MemberOpportunity[]}>('/my/opportunities'),
      ])
      setAlreadyApplied((apps.data||[]).some(a=>a.opportunity?.slug===item.slug))
      setIsOwnOpportunity((mine.data||[]).some(o=>o.slug===item.slug))
    } catch { /* L’action de candidature affichera le message d’authentification/autorisation précis. */ }
    finally { setCheckingApplication(false) }
  }

  async function submitTestimonial(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form=event.currentTarget; const f=new FormData(form); setTestimonialBusy(true); try { const base=(import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/,''); const response=await fetch(base+'/testimonials',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({person_name:f.get('person_name'),role_or_location:f.get('role_or_location'),opportunity_type:f.get('opportunity_type'),rating:Number(f.get('rating')||5),quote:f.get('quote')})}); const payload=await response.json(); if(!response.ok) throw new Error(payload.message || 'Envoi impossible.'); form.reset(); notify(payload.message || 'Témoignage envoyé pour validation.'); } catch(e) { notify(e instanceof Error?e.message:'Connexion au serveur impossible.'); } finally { setTestimonialBusy(false); } }

  async function saveOpportunity(item: PublicOpportunity) {
    if (!localStorage.getItem('ocd_access_token')) { onAccount('login'); return }
    setSavingId(item.id)
    try { await memberToolsService.save(item.id); notify('Opportunité ajoutée à vos favoris.'); }
    catch (e) { notify(e instanceof Error ? e.message : 'Impossible d’enregistrer ce favori.'); }
    finally { setSavingId(null); }
  }

  async function applyToOpportunity(item: PublicOpportunity) {
    if (!localStorage.getItem('ocd_access_token')) { setDetail(null); onAccount('login'); return }
    setApplying(true)
    try {
      const result = await opportunityService.apply(item.slug)
      notify(result.message || 'Candidature enregistrée dans votre espace membre.')
      if (item.application_url) window.location.assign(item.application_url)
      else if (item.contact_phone) window.location.assign(`tel:${item.contact_phone}`)
      else if (item.contact_email) window.location.assign(`mailto:${item.contact_email}`)
      else setDetail({ ...item })
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        setAlreadyApplied(true)
        setApplicationMessage('Vous avez déjà candidaté à cette opportunité. Votre candidature reste visible dans votre espace membre.')
        notify('Vous avez déjà candidaté à cette opportunité. Votre candidature reste visible dans votre espace membre.')
        if (item.application_url) window.location.assign(item.application_url)
        else if (item.contact_phone) window.location.assign(`tel:${item.contact_phone}`)
        else if (item.contact_email) window.location.assign(`mailto:${item.contact_email}`)
      } else if (e instanceof ApiError && e.status === 403) {
        const message=e.message || 'Action non autorisée.'
        setApplicationMessage(message)
        if (message.toLowerCase().includes('votre offre')) setIsOwnOpportunity(true)
        notify(message)
      } else {
        const message=e instanceof Error ? e.message : 'Impossible d’enregistrer la candidature. Vérifiez que votre profil est approuvé.'
        setApplicationMessage(message)
        notify(message)
      }
    } finally { setApplying(false); }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    document.getElementById('opportunites')?.scrollIntoView({ behavior: 'smooth' })
  }

  function notify(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3200)
  }

  return (
    <div className="app-shell">
      <div className="announcement"><span className="announcement-dot" /> {siteContent.announcement || 'Votre prochaine opportunité est peut-être à un clic.'} <a href="#opportunites">Explorez OCD <span>→</span></a></div>
      <header className="site-header">
        <a className="brand" href="#accueil" aria-label="OCD, accueil"><img src={logo} alt="Logo OCD" /><span className="brand-divider" /><span className="brand-name">OCD<small>OPPORTUNITÉS, C’EST DEHORS</small></span></a>
        <button className="mobile-menu" aria-label="Ouvrir le menu" onClick={() => setMenuOpen(!menuOpen)}><Icon name="menu" /></button>
        <nav className={menuOpen ? 'main-nav nav-open' : 'main-nav'} aria-label="Navigation principale"><a href="#opportunites" onClick={() => setMenuOpen(false)}>Opportunités</a><a href="#categories" onClick={() => setMenuOpen(false)}>Explorer</a><a href="#talents" onClick={() => setMenuOpen(false)}>Talents</a><a href="#apropos" onClick={() => setMenuOpen(false)}>À propos</a><a href="#temoignages" onClick={() => setMenuOpen(false)}>Témoignages</a><div className="nav-actions"><button className="btn-quiet" onClick={() => onAccount('login')}>Connexion</button><button className="btn-primary btn-small" onClick={() => onAccount('register')}>Créer un compte <span>↗</span></button></div></nav>
      </header>

      <main>
        <section className="hero" id="accueil">
          <div className="hero-glow glow-one" /><div className="hero-glow glow-two" />
          <div className="hero-content"><div className="eyebrow"><span className="eyebrow-icon"><Icon name="globe" /></span> UN MONDE D’OPPORTUNITÉS, SANS FRONTIÈRES</div>
            <h1 style={{ whiteSpace: 'pre-line' }}>{siteContent.hero_title || "Le monde regorge\nd’opportunités.\nAllez à leur rencontre."}</h1>
            <p className="hero-copy">{siteContent.hero_description || "Emplois, bourses, formations, financements et talents : trouvez les possibilités qui feront avancer vos projets, où que vous soyez."}</p>
            <form className="search-panel" onSubmit={submitSearch}><label className="search-field"><Icon name="search" /><span className="sr-only">Que recherchez-vous ?</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Un emploi, une bourse, une compétence…" /></label><span className="search-separator" /><label className="country-field"><Icon name="globe" /><span className="sr-only">Pays</span><select value={country} onChange={(e) => setCountry(e.target.value)}><option value="">Partout dans le monde</option>{countries.map(name => <option key={name} value={name}>{name}</option>)}<option value="En ligne">En ligne</option></select></label><button type="submit" className="btn-primary search-submit"><Icon name="search" /><span>Rechercher</span></button></form>
            <div className="hero-meta"><div className="avatar-stack"><span>JM</span><span>AK</span><span>FN</span><span>+</span></div><p><strong>Un réseau sans frontières</strong><br /><span>Des talents, des organisations, des possibilités.</span></p><div className="meta-divider" /><div className="meta-check"><Icon name="check" /><span>Conçu pour le monde entier</span></div></div>
          </div>
          <div className="hero-art" aria-label="Illustration de la découverte d'opportunités"><div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="art-spark spark-a">✳</div><div className="art-spark spark-b">✦</div><div className="art-spark spark-c">✧</div><div className="art-globe"><div className="globe-shine" /><div className="globe-land land-a" /><div className="globe-land land-b" /><div className="globe-line line-a" /><div className="globe-line line-b" /><div className="globe-line line-c" /></div><div className="float-card card-opportunity"><span className="float-icon orange"><Icon name="briefcase" /></span><div><small>NOUVELLE OPPORTUNITÉ</small><strong>Votre prochain chapitre</strong><span>Commence ici <b>↗</b></span></div></div><div className="float-card card-talent"><span className="talent-avatar">T</span><div><small>LE MONDE DES TALENTS</small><strong>Vos compétences comptent.</strong><span>Faites-vous découvrir <b>↗</b></span></div></div><div className="art-label"><span /> OUVERT SUR LE MONDE</div></div>
          <div className="hero-bottom"><span>01 — DÉCOUVRIR</span><div className="bottom-line" /><span>LES POSSIBILITÉS SONT PARTOUT <b>↗</b></span></div>
        </section>

        <section className="category-section section-wrap" id="categories"><div className="section-heading"><div><span className="section-kicker">VOTRE AVENIR, VOS POSSIBILITÉS</span><h2>Qu’est-ce qui vous<br className="desktop-break" /> fait avancer <span>aujourd’hui ?</span></h2></div><p>{siteContent.guidance_text || 'Un point de départ. Des milliers de chemins possibles. Explorez les opportunités qui correspondent à vos ambitions.'}</p></div><div className="category-grid">{categories.map((cat) => <button className="category-card" key={cat.title} onClick={() => { const map: Record<string,string> = { Emplois: 'Emploi', Bourses: 'Bourse', Formations: 'Formation', Financements: 'Financement', Missions: 'Mission', Concours: 'Concours', Services: 'Service' }; setActiveCategory(map[cat.title] || 'Tout'); document.getElementById('opportunites')?.scrollIntoView({ behavior: 'smooth' }) }}><span className={`category-icon ${cat.color}`}>{cat.icon}</span><span className="category-title">{cat.title}</span><span className="category-desc">{cat.desc}</span><span className="category-arrow"><Icon name="arrow" /></span></button>)}</div></section>

        <section className="opportunity-section" id="opportunites"><div className="section-wrap"><div className="section-heading opportunities-heading"><div><span className="section-kicker">À SAISIR MAINTENANT</span><h2>Des opportunités qui<br className="desktop-break" /> ouvrent <span>des portes.</span></h2></div><a className="text-link" href="#categories">Explorer les catégories <Icon name="arrow" /></a></div><div className="opportunity-toolbar"><div className="filter-tabs">{['Tout', 'Emploi', 'Bourse', 'Formation', 'Service'].map((cat) => <button key={cat} className={activeCategory === cat ? 'filter-tab active' : 'filter-tab'} onClick={() => setActiveCategory(cat)}>{cat === 'Tout' ? 'À la une' : cat}</button>)}</div><span className="result-count">{filtered.length} opportunité{filtered.length > 1 ? 's' : ''} à découvrir</span></div><div className="opportunity-grid">{filtered.map((item) => <article className="opportunity-card" key={item.id}><div className="opportunity-card-top"><span className={`opportunity-symbol ${item.color}`}>{item.category === 'Emploi' ? <Icon name="briefcase" /> : item.category === 'Bourse' ? '✦' : '▣'}</span><span className="opportunity-tag">{item.tag}</span><button className="save-button" aria-label="Enregistrer l'opportunité" disabled={savingId===item.id} onClick={() => void saveOpportunity(item)}>{savingId===item.id?'…':'♡'}</button></div><span className="opportunity-category">{item.category.toUpperCase()}</span><h3>{item.title}</h3><p className="opportunity-org">{item.org}</p><div className="opportunity-details"><span><Icon name="globe" /> {item.place}</span><span><Icon name="briefcase" /> {item.type}</span></div><button className="opportunity-link" onClick={() => void openOpportunity(item)}>Découvrir l’opportunité <Icon name="arrow" /></button></article>)}</div>{filtered.length === 0 && <div className="empty-state"><span>⌕</span><h3>Aucun résultat pour le moment</h3><p>Essayez un autre mot-clé ou une autre catégorie.</p><button className="btn-primary" onClick={() => { setQuery(''); setCountry(''); setActiveCategory('Tout') }}>Réinitialiser la recherche</button></div>}{loadingOpportunities && <p className="demo-note">Chargement des opportunités publiées…</p>}{!loadingOpportunities && opportunities.length === 0 && <p className="demo-note">Aucune opportunité publiée pour le moment. Revenez bientôt ou créez un compte pour suivre les nouvelles publications.</p>}</div></section>

        <section className="talent-banner section-wrap" id="talents"><div className="talent-banner-copy"><span className="section-kicker">VOTRE TALENT MÉRITE D’ÊTRE VU</span><h2>Ne cherchez pas seulement<br />des opportunités. <span>Devenez-en une.</span></h2><p>Présentez vos compétences, partagez vos réalisations et permettez aux entreprises et aux clients de découvrir ce que vous savez faire.</p><button className="btn-light" onClick={() => onAccount('register')}>Valoriser mon profil <Icon name="arrow" /></button></div><div className="talent-visual"><div className="talent-ring ring-one"/><div className="talent-ring ring-two"/><div className="profile-tile"><div className="profile-head"><span className="profile-avatar">O</span><span className="verified"><Icon name="check" /> PROFIL À COMPLÉTER</span></div><div className="profile-lines"><i/><i/><i/></div><div className="skill-row"><span>Créativité</span><span>Expertise</span><span>Impact</span></div><div className="profile-foot"><span>PORTFOLIO PERSONNEL</span><span>↗</span></div></div><span className="visual-star star-one">✳</span><span className="visual-star star-two">✦</span></div></section>

        <section className="ocd-about section-wrap" id="apropos"><div className="section-heading"><div><span className="section-kicker">L’IDENTITÉ D’OCD</span><h2>Les opportunités existent.<br/>Nous vous aidons à <span>les rencontrer.</span></h2></div><p>OCD — Opportunités, c’est dehors est une plateforme conçue pour rapprocher les personnes, les compétences, les projets et les possibilités.</p></div><div className="ocd-about-grid"><article className="ocd-about-story"><span className="section-kicker">LA PHILOSOPHIE</span><h3>Opportunités, c’est dehors.</h3><p>Les possibilités ne se trouvent pas uniquement dans notre cercle habituel. Elles peuvent apparaître auprès d’une personne que nous n’avons jamais rencontrée, dans une organisation inconnue, un autre secteur ou un autre pays.</p><p>OCD est une invitation à élargir son regard, à explorer, à agir, à rendre ses compétences visibles et à créer de nouvelles connexions. Chacun peut être à la fois à la recherche d’une opportunité et porteur d’une possibilité pour quelqu’un d’autre.</p><blockquote>« Une opportunité ne devrait pas seulement exister. Elle devrait pouvoir être découverte. »</blockquote></article><article className="ocd-about-founder"><span className="section-kicker">LE FONDATEUR</span><h3>Une vision portée par Bovann</h3><p>Associé à BOVANN GROUP au Togo, Bovann porte la vision d’OCD : transformer une conviction en un espace numérique où les talents, les projets et les opportunités peuvent se rencontrer.</p><p>Cette présentation sera enrichie avec son portrait professionnel, son parcours vérifié et son histoire personnelle, sans inventer d’informations biographiques.</p></article></div><div className="ocd-about-pillars"><article><span>01</span><h3>Découvrir</h3><p>Emplois, stages, formations, bourses, financements et projets.</p></article><article><span>02</span><h3>Se révéler</h3><p>Profils professionnels, compétences, expériences et portfolios.</p></article><article><span>03</span><h3>Partager</h3><p>Permettre aux membres de soumettre leurs propres opportunités.</p></article><article><span>04</span><h3>Se connecter</h3><p>Faciliter les rencontres entre candidats, recruteurs et organisations.</p></article></div><div className="ocd-about-mission-grid"><article><span className="section-kicker">NOTRE MISSION</span><h3>Rapprocher les possibilités</h3><p>Faciliter l’accès aux opportunités, améliorer la visibilité des talents et favoriser les connexions entre personnes, professionnels, entreprises et organisations.</p></article><article><span className="section-kicker">NOTRE VISION</span><h3>Une plateforme ouverte sur le monde</h3><p>Permettre de découvrir des possibilités au-delà des réseaux habituels, avec des recherches par pays, ville, domaine et catégorie et une expérience pensée pour un public international.</p></article><article><span className="section-kicker">NOS VALEURS</span><h3>Initiative, visibilité, ouverture</h3><p>Nous valorisons la responsabilité, la connexion et l’évolution continue de la plateforme à partir des besoins réels de sa communauté.</p></article><article className="ocd-about-manifesto"><span className="section-kicker">LE MANIFESTE OCD</span><h3>Le talent mérite d’être vu. L’information mérite de circuler.</h3><p>Les projets méritent de rencontrer les bonnes personnes. Chacun peut chercher une opportunité et être porteur d’une possibilité pour quelqu’un d’autre.</p></article></div><div className="ocd-about-trust"><div><h3>La confiance au cœur de notre démarche</h3><p>Les annonces sont soumises à validation et peuvent être signalées. La vérification d’un profil par OCD ne remplace pas un diplôme, une licence ou une certification officielle.</p></div><div className="ocd-about-actions"><button className="btn-primary" onClick={()=>onAccount('register')}>Rejoindre OCD <Icon name="arrow"/></button><button className="btn-quiet" onClick={()=>document.getElementById('opportunites')?.scrollIntoView({behavior:'smooth'})}>Explorer les opportunités</button><button className="btn-quiet" onClick={()=>onAccount('register')}>Proposer une opportunité</button></div></div></section>

        {testimonials.length > 0 && <section className="ocd-testimonials section-wrap" id="temoignages"><div className="section-heading"><div><span className="section-kicker">PARCOURS ET EXPÉRIENCES</span><h2>Ils avancent avec <span>OCD.</span></h2></div><p>Des témoignages publiés avec l’autorisation de leurs auteurs.</p></div><div className="ocd-testimonial-grid">{testimonials.map(t=><article key={t.id} className="ocd-testimonial-card"><div className="ocd-testimonial-rating" aria-label={`${t.rating||5} étoiles`}>{'★'.repeat(Math.max(1,Math.min(5,t.rating||5)))}<span>{'★'.repeat(5-Math.max(1,Math.min(5,t.rating||5)))}</span></div><p>{t.quote}</p><div className="ocd-testimonial-author"><span className="ocd-testimonial-avatar">{t.person_name.trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()}</span><div><strong>{t.person_name}</strong><small>{[t.role_or_location,t.opportunity_type].filter(Boolean).join(' · ')}</small></div></div></article>)}</div></section>}

        <section className="ocd-testimonials section-wrap" id="temoigner"><div className="section-heading"><div><span className="section-kicker">VOTRE EXPÉRIENCE COMPTE</span><h2>Partagez votre <span>témoignage.</span></h2></div><p>Votre témoignage sera relu par l’équipe OCD avant d’être publié sur le site.</p></div><form className="public-testimonial-form" onSubmit={submitTestimonial}><div className="admin-form-grid"><label>Nom affiché *<input name="person_name" required maxLength={140}/></label><label>Fonction ou pays<input name="role_or_location" maxLength={180} placeholder="Ex. Étudiant · Cameroun"/></label><label>Opportunité concernée<input name="opportunity_type" maxLength={80} placeholder="Ex. Bourse, emploi, formation"/></label></div><label>Votre note *<select name="rating" defaultValue="5" required><option value="5">★★★★★ — Excellent</option><option value="4">★★★★☆ — Très bien</option><option value="3">★★★☆☆ — Bien</option><option value="2">★★☆☆☆ — Moyen</option><option value="1">★☆☆☆☆ — À améliorer</option></select></label><label>Votre témoignage *<textarea name="quote" required minLength={20} maxLength={3000} rows={4} placeholder="Racontez votre expérience…"/></label><button className="btn-primary" disabled={testimonialBusy}>{testimonialBusy?'Envoi…':'Envoyer mon témoignage'}</button></form></section>

        <section className="closing-section" id="rejoindre"><div className="closing-inner"><img src={logo} alt=""/><span className="section-kicker">OPPORTUNITÉS, C’EST DEHORS</span><h2 style={{ whiteSpace: 'pre-line' }}>{siteContent.closing_title || 'Le prochain chapitre\ncommence avec vous.'}</h2><p>Un monde plus connecté. Des talents plus visibles. Des possibilités plus accessibles.</p><button className="btn-primary" onClick={() => onAccount('register')}>Rejoindre OCD <Icon name="arrow" /></button><div className="closing-orbit orbit-left"/><div className="closing-orbit orbit-right"/></div></section>
      </main>
      <footer className="site-footer"><a className="footer-brand" href="#accueil"><img src={logo} alt="OCD"/> <span>OPPORTUNITÉS, C’EST DEHORS</span></a><div className="footer-links"><a href="#opportunites">Opportunités</a><a href="#talents">Talents</a><a href="#apropos">À propos</a><button onClick={() => onAccount('login')}>Connexion</button><button onClick={() => onAccount('register')}>Créer un compte</button></div><span>© 2026 OCD. Un monde de possibilités.</span></footer>
      {detail && <div className="ocd-modal-backdrop" role="presentation" onClick={() => setDetail(null)}><section className="ocd-opportunity-modal" role="dialog" aria-modal="true" aria-label={detail.title} onKeyDown={e=>{if(e.key==='Escape')setDetail(null)}} onClick={e => e.stopPropagation()}><button className="ocd-modal-close" onClick={() => setDetail(null)} aria-label="Fermer">×</button><span className="section-kicker">OPPORTUNITÉ PUBLIÉE</span><h2>{detail.title}</h2><strong>{detail.organization}</strong><p>{detail.summary}</p><div className="ocd-modal-description">{detail.description}</div><p className="ocd-modal-application-hint">Pour enregistrer votre candidature dans OCD, connectez-vous et assurez-vous que votre profil a été approuvé. Après l’enregistrement, le lien ou le contact de l’annonce sera ouvert.</p>{(detail.contact_phone||detail.contact_email)&&<div className="ocd-modal-contact"><strong>Contact</strong>{detail.contact_phone&&<p>Téléphone : <a href={`tel:${detail.contact_phone}`}>{detail.contact_phone}</a></p>}{detail.contact_email&&<p>E-mail : <a href={`mailto:${detail.contact_email}`}>{detail.contact_email}</a></p>}</div>}<button className="btn-primary" disabled={applying||checkingApplication||alreadyApplied||isOwnOpportunity} onClick={() => void applyToOpportunity(detail)}>{checkingApplication?'Vérification…':applying?'Enregistrement…':isOwnOpportunity?'C’est votre offre':alreadyApplied?'Déjà candidaté':'Déposer ma candidature'} {!alreadyApplied&&!isOwnOpportunity&&<Icon name="arrow" />}</button>{applicationMessage&&<p className="ocd-modal-application-hint" role="status">{applicationMessage}</p>}{isOwnOpportunity&&<p className="ocd-modal-application-hint">Vous avez publié cette opportunité. Consultez les candidatures reçues dans « Mes opportunités » de votre espace membre.</p>}{alreadyApplied&&<p className="ocd-modal-application-hint">Votre candidature est déjà enregistrée dans OCD. Retrouvez son suivi dans « Mes candidatures ».</p>}</section></div>}
      {notice && <div className="toast" role="status"><span className="toast-check"><Icon name="check" /></span>{notice}<button onClick={() => setNotice('')} aria-label="Fermer la notification">×</button></div>}
    </div>
  )
}

export default App
