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

  useEffect(() => {
    if (!introEnded) return

    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''

    const introWrap = introWrapRef.current
    if (!introWrap) return

    let switched = false

    const switchToPages = () => {
      if (switched) return
      switched = true

      setShowPages(true)

      gsap.to(introWrap, {
        autoAlpha: 0,
        duration: 0.35,
        ease: 'power1.out',
        onComplete: () => {
          gsap.set(introWrap, {display: 'none'})
          introWrap.classList.add('isNonInteractive')
          requestAnimationFrame(() => ScrollTrigger.refresh())
        },
      })

      cleanup()
    }

    const onWheel = () => switchToPages()
    const onTouchMove = () => switchToPages()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'End') {
        e.preventDefault()
        switchToPages()
      }
    }

    const cleanup = () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
    }

    window.addEventListener('wheel', onWheel, {passive: true})
    window.addEventListener('touchmove', onTouchMove, {passive: true})
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
        <main className='pages'>
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
