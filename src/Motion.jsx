import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function Motion({ root }) {
  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktopViewport = window.matchMedia('(min-width: 821px)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const lenis = desktopViewport && !reduceMotion
      ? new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 })
      : null

    const lenisTick = (time) => lenis?.raf(time * 1000)
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(lenisTick)
      gsap.ticker.lagSmoothing(0)
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      const onClick = (event) => {
        const target = document.querySelector(anchor.getAttribute('href'))
        if (!target) return
        event.preventDefault()
        if (lenis) lenis.scrollTo(target, { offset: -24 })
        else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
      }
      anchor.addEventListener('click', onClick)
      anchor._motionClick = onClick
    })

    const mm = gsap.matchMedia()
    mm.add({ desktop: '(min-width: 821px)', reduce: '(prefers-reduced-motion: reduce)' }, (context) => {
      const { desktop, reduce } = context.conditions
      if (reduce) {
        gsap.set('.reveal, .concept-line-inner, .project-frame, .process-step', { clearProps: 'all' })
        return
      }

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.site-header', { autoAlpha: 0, duration: 0.7 })
        .from('.hero-kicker', { y: 18, autoAlpha: 0, duration: 0.6 }, 0.1)
        .from('.hero-title .line-inner', { yPercent: 110, duration: 0.95, stagger: 0.08 }, 0.1)
        .from('.hero-bottom > *', { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.38)
        .from('.hero-scroll', { autoAlpha: 0, duration: 0.5 }, 0.7)

      gsap.timeline({
        scrollTrigger: { trigger: '.hero', start: 'top top', end: desktop ? '+=110%' : 'bottom top', scrub: 1, pin: desktop },
      })
        .to('.hero-media', { clipPath: desktop ? 'inset(7% 8% 7% 8%)' : 'inset(3% 4% 3% 4%)', ease: 'none' }, 0)
        .to('.hero-media img', { scale: 1, ease: 'none' }, 0)
        .to('.hero-copy', { yPercent: desktop ? -18 : -8, autoAlpha: 0.2, ease: 'none' }, 0)
        .to('.hero-scroll', { y: 24, autoAlpha: 0, ease: 'none' }, 0)

      ScrollTrigger.create({
        trigger: '#sobre', start: 'top 12%', end: 'max',
        toggleClass: { targets: '[data-header]', className: 'header-light' },
      })

      gsap.from('.concept-line-inner', {
        yPercent: 110, stagger: 0.13, ease: 'power3.out',
        scrollTrigger: { trigger: '.concept-title', start: 'top 78%', end: 'bottom 48%', scrub: 0.7 },
      })

      gsap.utils.toArray('.project-panel').forEach((panel) => {
        const frame = panel.querySelector('.project-frame')
        const image = panel.querySelector('img')
        const meta = panel.querySelector('.project-meta')
        gsap.fromTo(frame, { clipPath: 'inset(12% 5% 12% 5%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
          scrollTrigger: { trigger: panel, start: 'top 86%', end: 'top 24%', scrub: 0.7 },
        })
        gsap.fromTo(image, { scale: 1.08 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 1 },
        })
        gsap.from(meta, { y: 30, autoAlpha: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: panel, start: 'top 58%', once: true } })
      })

      if (desktop) {
        const track = document.querySelector('.details-track')
        const horizontal = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth), ease: 'none',
          scrollTrigger: {
            trigger: '.details-section', start: 'top top', end: () => `+=${track.scrollWidth - window.innerWidth}`,
            scrub: 0.8, pin: true, invalidateOnRefresh: true,
          },
        })
        gsap.utils.toArray('.detail-card').forEach((card) => {
          gsap.from(card.querySelector('.detail-content'), {
            y: 36, autoAlpha: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: card, containerAnimation: horizontal, start: 'left 82%', toggleActions: 'play none none reverse' },
          })
        })
      }

      gsap.fromTo('.process-line-fill', { scaleY: 0 }, {
        scaleY: 1, ease: 'none', transformOrigin: 'top',
        scrollTrigger: { trigger: '.process-list', start: 'top 70%', end: 'bottom 65%', scrub: 0.6 },
      })
      gsap.utils.toArray('.process-step').forEach((step) => {
        gsap.from(step, { y: 38, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: step, start: 'top 78%', once: true } })
      })
      gsap.utils.toArray('.reveal').forEach((item) => {
        gsap.from(item, { y: 38, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 84%', once: true } })
      })
      gsap.fromTo('.experience-media img', { scale: 1.1 }, {
        scale: 1, ease: 'none', scrollTrigger: { trigger: '.experience', start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    })

    let moveCursor
    let enterProject
    let leaveProject
    if (finePointer) {
      const cursor = document.querySelector('.custom-cursor')
      const cursorText = cursor.querySelector('span')
      const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' })
      const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' })
      moveCursor = (event) => { xTo(event.clientX); yTo(event.clientY) }
      enterProject = () => { cursor.classList.add('is-project'); cursorText.textContent = 'VER PROJETO' }
      leaveProject = () => { cursor.classList.remove('is-project'); cursorText.textContent = '' }
      window.addEventListener('pointermove', moveCursor, { passive: true })
      document.querySelectorAll('[data-cursor-project]').forEach((item) => {
        item.addEventListener('pointerenter', enterProject)
        item.addEventListener('pointerleave', leaveProject)
      })
    }

    let active = true
    const refresh = () => active && ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh, { once: true })

    return () => {
      active = false
      lenis?.destroy()
      if (lenis) gsap.ticker.remove(lenisTick)
      mm.revert()
      window.removeEventListener('load', refresh)
      if (moveCursor) window.removeEventListener('pointermove', moveCursor)
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => anchor.removeEventListener('click', anchor._motionClick))
      if (finePointer) {
        document.querySelectorAll('[data-cursor-project]').forEach((item) => {
          item.removeEventListener('pointerenter', enterProject)
          item.removeEventListener('pointerleave', leaveProject)
        })
      }
    }
  }, { scope: root })

  return null
}

export default Motion
