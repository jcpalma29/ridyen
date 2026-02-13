// DetailsPage.tsx
import {useEffect, useRef} from 'react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import './DetailsPage.css'

gsap.registerPlugin(ScrollTrigger)

export default function DetailsPage() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const churchRef = useRef<HTMLImageElement | null>(null)
  const cardsRef = useRef<HTMLDivElement | null>(null)
  const timelineRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const church = churchRef.current
    const cards = cardsRef.current
    const timeline = timelineRef.current

    if (!section || !church || !cards || !timeline) return

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(timeline)
      const timelineLine = q('.details-page__timelineLine')[0] as HTMLElement | undefined
      const timelineItems = gsap.utils.toArray<HTMLElement>('.timeline-item', timeline)

      gsap.set(church, {autoAlpha: 0, y: -24})
      gsap.set(cards, {autoAlpha: 0, y: 18})
      gsap.set(timeline, {autoAlpha: 1}) // keep container "present"
      gsap.set(timelineItems, {autoAlpha: 0, y: 14})

      if (timelineLine) {
        gsap.set(timelineLine, {autoAlpha: 0, scaleX: 0, transformOrigin: 'left center'})
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none none',
          once: true,
        },
      })

      // church first
      tl.to(church, {autoAlpha: 1, y: 0, duration: 1.2, ease: 'power2.out'}, 0)

      // cards AFTER church finishes (no overlap)
      tl.to(cards, {autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out'}, '>')

      // line draws in first (so timeline feels connected)
      if (timelineLine) {
        tl.to(
          timelineLine,
          {autoAlpha: 1, scaleX: 1, duration: 0.7, ease: 'power2.out'},
          '>'
        )
      }

      // timeline items fade in
      tl.to(
        timelineItems,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: 'power2.out',
          stagger: 0.12,
        },
        timelineLine ? '<0.08' : '>'
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="details-page">
      <div className="details-page__churchbg-wrap" aria-hidden="true">
        <div className="details-page__churchbg-inner">
          <img className="details-page__ivy" src="/ivy1.png" alt="" draggable={false} aria-hidden="true" />
          <img ref={churchRef} className="details-page__churchbg" src="/churchbg.png" alt="" />
        </div>
      </div>

      {/* wp image between churchbg and cards (above them) */}
      <div className="details-page__wp-wrap" aria-hidden="true">
        <img className="details-page__wp" src="/wp.png" alt="" draggable={false} />
      </div>

      <div ref={cardsRef} className="details-page__cards">
        <div className="details-card">
          <div className="details-card__label">CEREMONY - 2:00PM</div>
          <div className="details-card__title">
            <strong>San Antonio De Padua Parish Church</strong>
          </div>
          <div className="details-card__text details-card__text--sans">Kaylaway, Nasugbu, Batangas</div>

          <a
            className="details-card__btn"
            href="https://www.google.com/maps/search/?api=1&query=San%20Antonio%20De%20Padua%20Parish%20Church%2C%20Kaylaway%2C%20Nasugbu%2C%20Batangas"
            target="_blank"
            rel="noreferrer"
          >
            DIRECTIONS
          </a>
        </div>

        <div className="details-card">
          <div className="details-card__label">RECEPTION - 5:30PM</div>
          <div className="details-card__title">
            <strong>Club Ananda</strong>
          </div>
          <div className="details-card__text details-card__text--sans">Sandari, Batulao, Batangas</div>

          <a
            className="details-card__btn"
            href="https://www.google.com/maps/search/?api=1&query=Club%20Ananda%2C%20Sandari%2C%20Batulao%2C%20Batangas"
            target="_blank"
            rel="noreferrer"
          >
            DIRECTIONS
          </a>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="details-page__timelineWrap">
        <div
          ref={timelineRef}
          className="details-page__timeline"
          role="list"
          aria-label="Wedding program timeline"
        >
          {/* NEW: animatable faint line */}
          <div className="details-page__timelineLine" aria-hidden="true" />

          <div className="timeline-item" role="listitem">
            <div className="timeline-item__time">2:00 PM</div>
            <div className="timeline-item__dot" aria-hidden="true">
              <span className="timeline-item__icon" aria-hidden="true">⛪︎</span>
            </div>
            <div className="timeline-item__title">Ceremony</div>
          </div>

          <div className="timeline-item" role="listitem">
            <div className="timeline-item__time">3:00 PM</div>
            <div className="timeline-item__dot" aria-hidden="true">
              <span className="timeline-item__icon" aria-hidden="true">⌁</span>
            </div>
            <div className="timeline-item__title">Post Ceremony Pictorial</div>
          </div>

          <div className="timeline-item" role="listitem">
            <div className="timeline-item__time">4:00 PM</div>
            <div className="timeline-item__dot" aria-hidden="true">
              <span className="timeline-item__icon" aria-hidden="true">🥂︎</span>
            </div>
            <div className="timeline-item__title">Social Hour</div>
          </div>

          <div className="timeline-item" role="listitem">
            <div className="timeline-item__time">5:30 PM</div>
            <div className="timeline-item__dot" aria-hidden="true">
              <span className="timeline-item__icon" aria-hidden="true">✧</span>
            </div>
            <div className="timeline-item__title">Newly Wed Grand Entrance</div>
          </div>

          <div className="timeline-item" role="listitem">
            <div className="timeline-item__time">6:00 PM</div>
            <div className="timeline-item__dot" aria-hidden="true">
              <span className="timeline-item__icon" aria-hidden="true">❦</span>
            </div>
            <div className="timeline-item__title">First Dance</div>
          </div>

          <div className="timeline-item" role="listitem">
            <div className="timeline-item__time">6:30 PM</div>
            <div className="timeline-item__dot" aria-hidden="true">
              <span className="timeline-item__icon" aria-hidden="true">☽</span>
            </div>
            <div className="timeline-item__title">Cake Cutting</div>
          </div>

          <div className="timeline-item" role="listitem">
            <div className="timeline-item__time">7:00 PM</div>
            <div className="timeline-item__dot" aria-hidden="true">
              <span className="timeline-item__icon" aria-hidden="true">☾</span>
            </div>
            <div className="timeline-item__title">Dinner</div>
          </div>

          <div className="timeline-item" role="listitem">
            <div className="timeline-item__time">7:30 PM</div>
            <div className="timeline-item__dot" aria-hidden="true">
              <span className="timeline-item__icon" aria-hidden="true">✦</span>
            </div>
            <div className="timeline-item__title">Fireworks</div>
          </div>
        </div>
      </div>
    </section>
  )
}
