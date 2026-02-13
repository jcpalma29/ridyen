import {useEffect, useRef} from "react"
import gsap from "gsap"
import {ScrollTrigger} from "gsap/ScrollTrigger"
import "./EntouragePage.css"

gsap.registerPlugin(ScrollTrigger)

export default function EntouragePage() {
  const ivyLeftRef = useRef<HTMLImageElement | null>(null)
  const ivyRightRef = useRef<HTMLImageElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const left = ivyLeftRef.current
    const right = ivyRightRef.current
    const content = contentRef.current
    if (!left || !right || !content) return

    const ctx = gsap.context(() => {
      gsap.killTweensOf([left, right])

      // -----------------------
      // IVY ANIMATION (yours)
      // -----------------------
      gsap.set([left, right], {clearProps: "transform,filter,opacity"})

      gsap.set(left, {
        x: -18,
        y: -18,
        opacity: 0,
        filter: "blur(1px)",
        force3D: true,
      })

      gsap.set(right, {
        x: 18,
        y: -18,
        opacity: 0,
        filter: "blur(1px)",
        force3D: true,
      })

      const intro = gsap.timeline({delay: 0.15})

      intro
        .to([left, right], {
          opacity: 1,
          duration: 0.55,
          filter: "blur(0px)",
          ease: "power2.out",
        })
        .to(
          [left, right],
          {
            x: 0,
            y: 0,
            duration: 1.8,
            ease: "power3.out",
          },
          0
        )

      const floatLeft = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: {ease: "sine.inOut"},
        delay: 2.0,
      })

      floatLeft
        .to(left, {y: -12, x: 2, duration: 3.4, force3D: true})
        .to(left, {y: -6, x: -4, duration: 3.0, force3D: true})

      const floatRight = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: {ease: "sine.inOut"},
        delay: 2.15,
      })

      floatRight
        .to(right, {y: -12, x: -4, duration: 3.8, force3D: true})
        .to(right, {y: -7, x: 5, duration: 3.2, force3D: true})

      // -----------------------
      // TEXT: MORE OBVIOUS + FULL OPACITY AT BOTTOM
      // -----------------------
      const items = Array.from(
        content.querySelectorAll<HTMLElement>(
          ".entourage-page__header, .entourage-page__parents, .entourage-section, .entourage-triple"
        )
      )

      // stronger hidden state (more obvious)
      gsap.set(items, {
        opacity: 0,
        y: 70,
        filter: "blur(4px)",
        force3D: true,
      })

      gsap.timeline({
        scrollTrigger: {
          trigger: content,
          start: "top 85%",
          end: "bottom bottom", // ensures at the bottom: progress === 1
          scrub: 0.6,
          invalidateOnRefresh: true,
          // markers: true,
        },
        defaults: {ease: "power2.out"},
      }).to(items, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.16, // top -> bottom, more pronounced
        overwrite: "auto",
      })
    }, contentRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="entourage-page" aria-label="Entourage">
      <div className="entourage-page__frame">
        <img
          ref={ivyLeftRef}
          className="entourage-page__ivy entourage-page__ivy--left"
          src="/ivyr.png"
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        <img
          ref={ivyRightRef}
          className="entourage-page__ivy entourage-page__ivy--right"
          src="/ivy2.png"
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        <div ref={contentRef} className="entourage-page__inner">
          <header className="entourage-page__header">
            <img
              className="entourage-page__titleImage"
              src="/bdet.png"
              alt="Bridal Entourage"
              loading="eager"
              draggable={false}
            />

          </header>

          <div className="entourage-page__parents">
            <div className="entourage-block">
              <div className="entourage-block__title">PARENTS OF THE BRIDE</div>
              <div className="entourage-block__sub">
                LAURA ISABEL TRIGO &amp; PEDRO TRIGO
              </div>
            </div>

            <div className="entourage-block">
              <div className="entourage-block__title">PARENTS OF THE GROOM</div>
              <div className="entourage-block__sub">
                MELBA RAMOS &amp; RIGOR RAMOS
              </div>
            </div>
          </div>

          <section className="entourage-section" aria-label="Principal sponsors">
            <div className="entourage-section__title">PRINCIPAL SPONSORS</div>

            <div className="entourage-cols">
              <ul className="entourage-list" aria-label="Principal sponsors left">
                <li>TERESITA DEPAZ</li>
                <li>ROSELYN DEPAZ</li>
                <li>REMEDIOS CELESTE</li>
                <li>AUNTIE FE</li>
                <li>TITA EDNA</li>
                <li>ANNALYN TRAPANI</li>
                <li>MYRNA GAPUD</li>
                <li>LIRIO SOLERO</li>
                <li>WILMA BOLAONG</li>
                <li>NOEMIE AUSTERO</li>
                <li>TES ILAYA</li>
                <li>EMMA GRUMEZ</li>
                <li>RUTH LICUANAN</li>
                <li>MARILYN PAITIM</li>
              </ul>

              <ul className="entourage-list" aria-label="Principal sponsors right">
                <li>DANILO</li>
                <li>LAUREL DEPAZ</li>
                <li>RAMIR CELESTE</li>
                <li>RIZALINO ARREZA</li>
                <li>JUNIOR TRIGO</li>
                <li>ABIGAIL MADRIDANO</li>
                <li>VAL GAPUD</li>
                <li>REYNALDO SOLERO</li>
                <li>EDGARDO BULAONG</li>
                <li>JUPITER ALAS</li>
                <li>DANTE ILAYA</li>
                <li>JOSEPH SOLEJON</li>
                <li>SANTIOGO ARREZA</li>
                <li>JULIAN PAITIM</li>
              </ul>
            </div>
          </section>

          <section className="entourage-section" aria-label="Secondary sponsors">
            <div className="entourage-section__title">SECONDARY SPONSORS</div>
          </section>

          <section className="entourage-section entourage-section--pair" aria-label="Honor attendants">
            <div className="entourage-pair">
              <div className="entourage-block entourage-block--center">
                <div className="entourage-block__title">MAID OF HONOR</div>
                <div className="entourage-block__sub">SHAIRA MAE TRIGO</div>
              </div>

              <div className="entourage-block entourage-block--center">
                <div className="entourage-block__title">BEST MAN</div>
                <div className="entourage-block__sub">RALPH DANIEL RAMOS</div>
              </div>
            </div>
          </section>

          <section className="entourage-section" aria-label="Bridesmaids and groomsmen">
            <div className="entourage-cols entourage-cols--wide">
              <div>
                <div className="entourage-section__title">BRIDESMAIDS</div>
                <ul className="entourage-list" aria-label="Bridesmaids">
                  <li>JOANNA MICHELLE GAPUD</li>
                  <li>ASHLEY FAITH JORGE</li>
                  <li>ANAK MOMI TESS</li>
                  <li>JOANE CAMILLE PALMA</li>
                  <li>ANNABELLE CANEGA</li>
                  <li>MARIBELL ESCOBAR</li>
                  <li>RINA ALIMPUYO</li>
                  <li>REYSHEL JOY BUENVIAJE</li>
                  <li>ANGELA MARIE MANALASTAS</li>
                  <li>MARIA MILAGROS FIESTA</li>
                </ul>
              </div>

              <div>
                <div className="entourage-section__title">GROOMSMEN</div>
                <ul className="entourage-list" aria-label="Groomsmen">
                  <li>POCHOL IAN TRIGO</li>
                  <li>ARK</li>
                  <li>ROI</li>
                  <li>LESTER</li>
                  <li>PAOLO FEROS</li>
                  <li>EHRIZE GUEVERRA</li>
                  <li>ROBIN RESPLANDOR</li>
                  <li>KAROL</li>
                  <li>DARYL</li>
                  <li>GIE</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="entourage-triple">
            <div className="entourage-mini">
              <div className="entourage-mini__label">Candle</div>
              <ul className="entourage-list entourage-list--tight" aria-label="Candle sponsors">
                <li>MRS HAZEL CRUZ</li>
                <li>MR MICHAEL CRUZ</li>
              </ul>
            </div>

            <div className="entourage-mini">
              <div className="entourage-mini__label">Veil</div>
              <ul className="entourage-list entourage-list--tight" aria-label="Veil sponsors">
                <li>MR KENT MARANON</li>
                <li>MRS MARIE JOYCE HULLANA</li>
              </ul>
            </div>

            <div className="entourage-mini">
              <div className="entourage-mini__label">Cord</div>
              <ul className="entourage-list entourage-list--tight" aria-label="Cord sponsors">
                <li>MS HANZEL PONTINO</li>
                <li>MR BABYLOU BALASA JR.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
