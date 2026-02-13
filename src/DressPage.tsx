import {useEffect, useRef} from 'react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import './DressPage.css'

gsap.registerPlugin(ScrollTrigger)

export default function DressPage() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const wagRef = useRef<HTMLImageElement | null>(null)
  const dressRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const wag = wagRef.current
    const dress = dressRef.current
    if (!section || !wag || !dress) return

    const ctx = gsap.context(() => {
      gsap.set([wag, dress], {autoAlpha: 0, y: 16})

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })
        .to(wag, {autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out'})
        .to(dress, {autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out'}, '-=0.45')
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="dress-page" ref={sectionRef}>
      <div className="dress-page__inner">
        <img
          ref={wagRef}
          className="dress-page__wag"
          src="/wag.png"
          alt="Wedding Attire Guide"
          loading="eager"
          draggable={false}
        />

        <img
          ref={dressRef}
          className="dress-page__dress"
          src="/dress.png"
          alt="Dress"
          loading="lazy"
          draggable={false}
        />
      </div>
    </section>
  )
}
