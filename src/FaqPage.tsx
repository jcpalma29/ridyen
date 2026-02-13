import {useMemo, useState} from 'react'
import './FaqPage.css'

type FaqItem = {
  q: string
  a: string
}

export default function FaqPage() {
  const faqs: FaqItem[] = useMemo(
    () => [
      {
        q: 'Mobile Free Ceremony',
        a: "We will be having an unplugged ceremony, so we kindly request that phones and cameras be kept out of sight until after the ceremony is concluded. You are welcome to take photos during the cocktail hour,reception, and after party. ",
      },
      {
        q: 'Can I bring Children?',
        a: 'While we love your little ones, our celebration will be an adults-only event, with the exception of children involved in the ceremony.',
      },
      {
        q: 'Can I bring a plus one?',
        a: 'This is an intimate wedding with limited seating. Kindly note that only named guests in the invitation are included.',
      },
      {
        q: 'Entourage members',
        a: 'Principal Sponsors and Secondary Sponsors will have the option to avail of make-up services from our designated supplier, subject to additional charges.',
      },
      {
        q: 'Guests',
        a: 'We kindly request everyone to proceed directly to the church for the ceremony. The celebration will continue at the reception venue right after.',
      },
      {
        q: 'Transportation',
        a: 'Kindly note that transportation to and from the wedding venues will be at guests’ own arrangement.',
      },
    ],
    [],
  )

  const [openIndex, setOpenIndex] = useState<number>(-1)

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx))
  }

  return (
    <section className="faq-page">
      <div className="faq-page__inner">
        <img
          className="faq-page__titleImg"
          src="/faq.png"
          alt="Preguntas frecuentes"
          draggable={false}
        />

        <div className="faq-page__list">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx

            return (
              <div key={item.q} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-item__trigger"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-item__q">{item.q}</span>

                  <span className="faq-item__chev" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="faq-item__chevIcon"
                    >
                      <path
                        d="M7 10l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <div className="faq-item__panel" style={{maxHeight: isOpen ? 220 : 0}}>
                  <div className="faq-item__a">{item.a}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
