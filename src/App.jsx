import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const Motion = lazy(() => import('./Motion'))

const projects = [
  { index: '01', title: 'Cozinha', type: 'Projeto sob medida', image: '/images/hero.webp', position: 'center 45%' },
  { index: '02', title: 'Dormitório', type: 'Suíte residencial', image: '/images/suite.webp', position: 'center 54%' },
  { index: '03', title: 'Closet', type: 'Organização integrada', image: '/images/suite.webp', position: '78% center' },
  { index: '04', title: 'Sala', type: 'Marcenaria integrada', image: '/images/hero.webp', position: '78% center' },
  { index: '05', title: 'Home office', type: 'Funcionalidade essencial', image: '/images/office.webp', position: 'center' },
  { index: '06', title: 'Espaço gourmet', type: 'Receber com elegância', image: '/images/gourmet.webp', position: 'center' },
]

const details = [
  { number: '01', title: 'Madeira', text: 'Veios, tons e texturas escolhidos para criar uma atmosfera única.', image: '/images/detail.webp', position: '18% center' },
  { number: '02', title: 'Iluminação', text: 'Luz integrada à marcenaria para revelar volumes e criar conforto.', image: '/images/detail.webp', position: '75% center' },
  { number: '03', title: 'Ferragens', text: 'Tecnologia silenciosa e precisa em cada gesto de abrir e fechar.', image: '/images/suite.webp', position: '87% center' },
  { number: '04', title: 'Acabamentos', text: 'Superfícies que convidam ao toque e atravessam o tempo.', image: '/images/experience.webp', position: '75% center' },
  { number: '05', title: 'Organização', text: 'O interior desenhado com o mesmo cuidado que o exterior.', image: '/images/office.webp', position: '75% center' },
  { number: '06', title: 'Integração', text: 'Ambientes conectados por uma linguagem visual coerente.', image: '/images/gourmet.webp', position: 'center' },
]

const process = [
  { number: '01', title: 'Conversa', text: 'Entendemos seu espaço, sua rotina e o que precisa fazer sentido todos os dias.' },
  { number: '02', title: 'Projeto', text: 'Criamos soluções personalizadas para cada ambiente, proporção e necessidade.' },
  { number: '03', title: 'Produção', text: 'Materiais, acabamentos e execução conduzidos com precisão em cada etapa.' },
  { number: '04', title: 'Instalação', text: 'Seu projeto ganha forma dentro do seu espaço, com cuidado até o último ajuste.' },
]

const differentials = [
  'Projeto totalmente personalizado',
  'Aproveitamento inteligente do espaço',
  'Materiais selecionados',
  'Acabamentos premium',
  'Design contemporâneo',
  'Acompanhamento do projeto',
  'Instalação especializada',
]

const testimonials = [
  { quote: 'A Corá entendeu como a nossa família vive. O resultado é bonito, mas, principalmente, funciona de verdade todos os dias.', name: 'Marina & Eduardo', project: 'Cozinha e living — Residência Vila Nova' },
  { quote: 'Do primeiro desenho à instalação, percebemos cuidado em decisões que nem sabíamos que fariam tanta diferença.', name: 'Lívia S.', project: 'Suíte e closet — Apartamento Jardins' },
  { quote: 'A marcenaria organizou o espaço e trouxe unidade para toda a casa. Ficou leve, silenciosa e absolutamente nossa.', name: 'Renato A.', project: 'Projeto completo — Residência Alto da Serra' },
]

function InteriorImage({ src, alt = '', loading, fetchPriority, style, sizes = '100vw' }) {
  const base = src.replace(/\.webp$/, '')
  const fullWidth = src.includes('hero') ? 1672 : 1536
  const height = src.includes('hero') ? 941 : 1024

  return (
    <picture>
      <source type="image/avif" srcSet={`${base}-960.avif 960w, ${base}.avif ${fullWidth}w`} sizes={sizes} />
      <source type="image/webp" srcSet={`${base}-960.webp 960w, ${src} ${fullWidth}w`} sizes={sizes} />
      <img src={src} alt={alt} loading={loading} decoding={loading === 'lazy' ? 'async' : 'auto'} fetchPriority={fetchPriority} width={fullWidth} height={height} style={style} />
    </picture>
  )
}

function Arrow({ diagonal = false }) {
  return (
    <svg className="arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={diagonal ? 'M5 19 19 5M8 5h11v11' : 'M4 12h16M15 7l5 5-5 5'} />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L.2 24l6.5-1.7c1.7.9 3.5 1.4 5.4 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4Zm-8.4 18.2c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.8 1 1-3.7-.2-.4a9.7 9.7 0 1 1 8.3 4.6Zm5.3-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.6l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.1.2 2.5 3.8 6 5.3.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.7-.7 1.9-1.3.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z" />
    </svg>
  )
}

function Header({ onOpen }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const close = () => setMenuOpen(false)
  return (
    <header className={`site-header ${menuOpen ? 'menu-active' : ''}`} data-header>
      <a className="brand" href="#inicio" aria-label="CORÁ AMBIENTES — início" onClick={close}><span>CORÁ</span><small>AMBIENTES</small></a>
      <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="main-menu" onClick={() => setMenuOpen((value) => !value)}>
        <span>{menuOpen ? 'Fechar' : 'Menu'}</span>
        <i /><i />
      </button>
      <nav id="main-menu" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
        <a href="#projetos" onClick={close}>Projetos</a>
        <a href="#ambientes" onClick={close}>Ambientes</a>
        <a href="#sobre" onClick={close}>Sobre</a>
        <a href="#processo" onClick={close}>Processo</a>
        <button onClick={() => { close(); onOpen() }}>Contato</button>
      </nav>
    </header>
  )
}

function QuoteModal({ open, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    document.body.classList.add('modal-open')
    dialogRef.current?.querySelector('input')?.focus()
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKey)
      previous?.focus()
    }
  }, [open, onClose])

  const submit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const message = `Olá, CORÁ AMBIENTES! Meu nome é ${data.get('name')}. Gostaria de conversar sobre um projeto de ${data.get('environment')} em ${data.get('city')}.`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    onClose()
  }

  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="quote-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="quote-title">
        <button className="modal-close" onClick={onClose} aria-label="Fechar formulário">Fechar <span>×</span></button>
        <p className="eyebrow">Seu projeto</p>
        <h2 id="quote-title">Vamos imaginar<br />seu novo espaço.</h2>
        <p className="modal-intro">Conte o essencial. Nossa equipe continua a conversa pelo WhatsApp.</p>
        <form onSubmit={submit}>
          <label>Como podemos chamar você?<input name="name" autoComplete="name" required placeholder="Seu nome" /></label>
          <label>Qual ambiente deseja transformar?<select name="environment" defaultValue="cozinha"><option value="cozinha">Cozinha</option><option value="dormitório ou closet">Dormitório ou closet</option><option value="sala">Sala</option><option value="home office">Home office</option><option value="espaço gourmet">Espaço gourmet</option><option value="projeto completo">Projeto completo</option></select></label>
          <label>Em qual cidade?<input name="city" required placeholder="Sua cidade" /></label>
          <button className="button button-dark form-submit" type="submit"><span>Continuar no WhatsApp</span><Arrow diagonal /></button>
        </form>
        <small>Ao continuar, você será direcionado ao WhatsApp.</small>
      </div>
    </div>
  )
}

function App() {
  const root = useRef(null)
  const [modalOpen, setModalOpen] = useState(false)


  return (
    <div ref={root}>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header onOpen={() => setModalOpen(true)} />
      <main id="conteudo">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-media"><InteriorImage src="/images/hero.webp" alt="Cozinha e living planejados com madeira natural e pedra escura" fetchPriority="high" /></div>
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="hero-kicker">Móveis planejados · Interiores</p>
            <h1 className="hero-title" id="hero-title">
              <span className="line"><span className="line-inner">Espaços pensados</span></span>
              <span className="line"><span className="line-inner"><em>para viver melhor.</em></span></span>
            </h1>
            <div className="hero-bottom">
              <p>Móveis planejados que transformam arquitetura, funcionalidade e personalidade em um único projeto.</p>
              <div className="hero-actions">
                <button className="button button-light" onClick={() => setModalOpen(true)}><span>Solicitar meu projeto</span><Arrow diagonal /></button>
                <a className="text-link text-link-light" href="#projetos">Ver projetos <Arrow /></a>
              </div>
            </div>
          </div>
          <a className="hero-scroll" href="#sobre"><span>Role para descobrir</span><i /></a>
        </section>

        <section className="concept section-shell" id="sobre" aria-labelledby="concept-title">
          <div className="section-index"><span>01</span><span>Manifesto</span></div>
          <div className="concept-grid">
            <h2 className="concept-title" id="concept-title">
              <span className="concept-line"><span className="concept-line-inner">Não criamos apenas móveis.</span></span>
              <span className="concept-line"><span className="concept-line-inner"><em>Criamos espaços</em> que fazem</span></span>
              <span className="concept-line"><span className="concept-line-inner">sentido para você.</span></span>
            </h2>
            <div className="concept-copy reveal">
              <p className="lead">Cada projeto Corá nasce do equilíbrio entre estética, funcionalidade e personalidade.</p>
              <p>Criamos ambientes planejados para aproveitar cada centímetro, respeitando sua rotina, arquitetura e estilo.</p>
            </div>
          </div>
        </section>

        <section className="projects" id="projetos" aria-labelledby="projects-title">
          <div className="projects-heading section-shell">
            <div className="section-index reveal"><span>02</span><span>Projetos selecionados</span></div>
            <h2 className="display-title reveal" id="projects-title">Projetos que<br /><em>transformam espaços.</em></h2>
          </div>
          <div className="project-stack" id="ambientes">
            {projects.map((project) => (
              <article className="project-panel" key={project.index} data-cursor-project>
                <div className="project-frame">
                  <InteriorImage src={project.image} alt={`Projeto Corá — ${project.title}`} loading="lazy" style={{ objectPosition: project.position }} />
                  <div className="project-overlay" />
                  <div className="project-meta">
                    <span className="project-number">{project.index}</span>
                    <div><h3>{project.title}</h3><p>{project.type}</p></div>
                    <span className="project-open"><Arrow diagonal /></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="details-section" aria-labelledby="details-title">
          <div className="details-fixed">
            <p className="eyebrow">Matéria & precisão</p>
            <h2 id="details-title">Cada detalhe<br /><em>importa.</em></h2>
            <div className="details-progress"><span /></div>
          </div>
          <div className="details-track">
            <div className="details-spacer" aria-hidden="true" />
            {details.map((detail) => (
              <article className="detail-card" key={detail.number}>
                <div className="detail-image"><InteriorImage src={detail.image} alt="" loading="lazy" sizes="(min-width: 821px) 40vw, 100vw" style={{ objectPosition: detail.position }} /></div>
                <div className="detail-content"><span>{detail.number}</span><h3>{detail.title}</h3><p>{detail.text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="process section-shell" id="processo" aria-labelledby="process-title">
          <div className="section-index reveal"><span>03</span><span>Nosso processo</span></div>
          <div className="process-grid">
            <div className="process-heading reveal">
              <h2 className="display-title" id="process-title">Do primeiro desenho<br />ao <em>último detalhe.</em></h2>
              <p>Um processo próximo, claro e cuidadoso — da primeira conversa à entrega do ambiente.</p>
            </div>
            <div className="process-list">
              <div className="process-line"><span className="process-line-fill" /></div>
              {process.map((step) => (
                <article className="process-step" key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="differentials section-shell" aria-labelledby="differentials-title">
          <div className="differentials-grid">
            <div className="differentials-heading reveal">
              <p className="eyebrow">Essência Corá</p>
              <h2 className="display-title" id="differentials-title">Planejado para durar.<br /><em>Criado para você.</em></h2>
            </div>
            <ol className="differentials-list">
              {differentials.map((item, index) => <li className="reveal" key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p><i /></li>)}
            </ol>
          </div>
        </section>

        <section className="experience" aria-labelledby="experience-title">
          <div className="experience-media"><InteriorImage src="/images/experience.webp" alt="Cozinha Corá em madeira escura com iluminação acolhedora ao entardecer" loading="lazy" /></div>
          <div className="experience-overlay" />
          <div className="experience-copy reveal">
            <p className="eyebrow">Uma casa que reflete você</p>
            <h2 id="experience-title">Seu espaço.<br />Seu estilo.<br /><em>Seu projeto.</em></h2>
            <p>Cada ambiente é desenvolvido para refletir quem vive nele.</p>
          </div>
        </section>

        <section className="testimonials section-shell" aria-labelledby="testimonials-title">
          <div className="section-index reveal"><span>04</span><span>Histórias reais</span></div>
          <h2 className="display-title reveal" id="testimonials-title">Projetos que viram parte<br />da <em>história de cada casa.</em></h2>
          <div className="testimonial-grid">
            {testimonials.map((item, index) => (
              <figure className="testimonial reveal" key={item.name}>
                <span>“</span><blockquote>{item.quote}</blockquote>
                <figcaption><strong>{item.name}</strong><small>{item.project}</small></figcaption>
                <i>{String(index + 1).padStart(2, '0')}</i>
              </figure>
            ))}
          </div>
        </section>

        <section className="final-cta" id="contato" aria-labelledby="cta-title">
          <div className="cta-grain" />
          <p className="eyebrow reveal">Comece uma conversa</p>
          <h2 className="reveal" id="cta-title">Seu próximo ambiente<br /><em>começa aqui.</em></h2>
          <p className="cta-text reveal">Conte para nós como você imagina seu espaço.</p>
          <div className="cta-actions reveal">
            <button className="button button-light button-large" onClick={() => setModalOpen(true)}><span>Solicitar orçamento</span><Arrow diagonal /></button>
            <a className="whatsapp-link" href="https://wa.me/?text=Ol%C3%A1%2C%20COR%C3%81%20AMBIENTES!%20Gostaria%20de%20conversar%20sobre%20um%20projeto." target="_blank" rel="noreferrer"><WhatsAppIcon /> Conversar no WhatsApp</a>
          </div>
        </section>
      </main>

      <footer className="footer section-shell">
        <div className="footer-top"><div><a className="footer-brand" href="#inicio"><span>CORÁ</span><small>AMBIENTES</small></a><p>Móveis Planejados</p></div><p className="footer-statement">Móveis sob medida.<br />Espaços com significado.</p></div>
        <div className="footer-bottom">
          <nav aria-label="Navegação do rodapé"><a href="#projetos">Projetos</a><a href="#ambientes">Ambientes</a><a href="#sobre">Sobre</a><button onClick={() => setModalOpen(true)}>Contato</button><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram <Arrow diagonal /></a></nav>
          <div><span>© {new Date().getFullYear()} CORÁ AMBIENTES</span><span>Móveis planejados sob medida.</span></div>
        </div>
      </footer>

      <div className="custom-cursor" aria-hidden="true"><span /></div>
      <QuoteModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Suspense fallback={null}><Motion root={root} /></Suspense>
    </div>
  )
}

export default App
