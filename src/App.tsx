import {useEffect, useRef, useState} from 'react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import WhitePage from './WhitePage'
import DetailsPage from './DetailsPage'
import EntouragePage from './EntouragePage'
import './App.css'
import DressPage from './DressPage'
import FaqPage from './FaqPage'
import RsvpPage from './RsvpPage'
import Footer from './Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const introWrapRef = useRef<HTMLDivElement | null>(null)
  const introVideoRef = useRef<HTMLVideoElement | null>(null)
  const pagesRef = useRef<HTMLElement | null>(null)

  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [introEnded, setIntroEnded] = useState(false)
  const [showPages, setShowPages] = useState(false)

  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(max-width: 767px)').matches

  const introVideoSrc = isMobile ? '/rymob.mp4' : '/ryecrop.mp4'
  const introPosterSrc = isMobile ? '/intropostermob.png' : '/introposter.png'

  useEffect(() => {
    if (showPages) return

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [showPages])

  // ensure the browser reloads the correct video when switching mobile/desktop
  useEffect(() => {
    const v = introVideoRef.current
    if (!v) return
    v.load()
  }, [introVideoSrc])

  // ✅ when pages mount, hard-land at the very top (WhitePage)
  useEffect(() => {
    if (!showPages) return

    const jumpTop = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    jumpTop()
    requestAnimationFrame(() => {
      jumpTop()
      pagesRef.current?.scrollIntoView({block: 'start'})
      requestAnimationFrame(() => {
        jumpTop()
        ScrollTrigger.refresh()
      })
    })
  }, [showPages])

  useEffect(() => {
    if (!introEnded) return

    const introWrap = introWrapRef.current
    if (!introWrap) return

    let switched = false

    const forceTopNow = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    const switchToPages = () => {
      if (switched) return
      switched = true

      // ✅ kill any stored scroll position BEFORE rendering pages
      forceTopNow()

      // keep scroll locked during the transition; the showPages effect will unlock after mount
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'

      setShowPages(true)

      gsap.to(introWrap, {
        autoAlpha: 0,
        duration: 0.35,
        ease: 'power1.out',
        onComplete: () => {
          gsap.set(introWrap, {display: 'none'})
          introWrap.classList.add('isNonInteractive')

          // ✅ beat wheel/touch momentum: snap top again after DOM updates
          requestAnimationFrame(() => {
            forceTopNow()
            requestAnimationFrame(() => {
              forceTopNow()
              ScrollTrigger.refresh()
            })
          })
        },
      })

      cleanup()
    }

    // ✅ prevent the "big scroll" from applying to the page
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      switchToPages()
    }

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      switchToPages()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'End') {
        e.preventDefault()
        switchToPages()
      }
    }

    const cleanup = () => {
      window.removeEventListener('wheel', onWheel as any, {capture: true} as any)
      window.removeEventListener('touchmove', onTouchMove as any, {capture: true} as any)
      window.removeEventListener('keydown', onKeyDown)
    }

    // ✅ must be passive:false so preventDefault works
    window.addEventListener('wheel', onWheel, {passive: false, capture: true})
    window.addEventListener('touchmove', onTouchMove, {passive: false, capture: true})
    window.addEventListener('keydown', onKeyDown)

    return () => cleanup()
  }, [introEnded])

  const tryPlayIntro = async () => {
    const v = introVideoRef.current
    if (!v) return

    try {
      await v.play()
      setIsVideoPlaying(true)
      setIntroEnded(false)
      setShowPages(false)

      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    } catch {
      setIsVideoPlaying(false)
    }
  }

  return (
    <div className='page'>
      <div
        ref={introWrapRef}
        className='bgVideo'
        onClick={tryPlayIntro}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            tryPlayIntro()
          }
        }}
        aria-label='Play intro video'
      >
        <video
          key={introVideoSrc}
          ref={introVideoRef}
          className='bgVideo__video'
          preload='metadata'
          playsInline
          muted
          poster={introPosterSrc}
          onCanPlay={() => {
            if (introVideoRef.current) introVideoRef.current.playbackRate = 1.4
          }}
          onPlay={() => {
            setIsVideoPlaying(true)
            setIntroEnded(false)
            if (introVideoRef.current) introVideoRef.current.playbackRate = 1.4
          }}
          onEnded={() => {
            setIsVideoPlaying(false)
            setIntroEnded(true)
          }}
        >
          <source src={introVideoSrc} type='video/mp4' />
        </video>

        {!isVideoPlaying && !introEnded && (
          <div className='bgVideo__tip'>
            click to open
          </div>
        )}

        {introEnded && (
          <div className='scrollPrompt'>
            <span>scroll down</span>
            <svg className='scrollPrompt__arrow' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <path
                d='M12 5v12m0 0l-6-6m6 6l6-6'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
        )}
      </div>

      {showPages && (
        <main ref={pagesRef} className='pages'>
          <WhitePage />
          <DetailsPage />
          <EntouragePage />
          <DressPage />
          <FaqPage />
          <RsvpPage />
          <Footer />
        </main>
      )}
    </div>
  )
}
