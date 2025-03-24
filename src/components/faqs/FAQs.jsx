import React, { useState } from 'react'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import './FAQs.css'

function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null)

  const faqs = [
    {
      question: "How do I get started with a gym membership?",
      answer: "You can start by visiting our front desk or signing up online. Our staff will guide you through membership options and give you a tour of our facilities."
    },
    {
      question: "What are your operating hours?",
      answer: "We are open Monday through Friday from 5:00 AM to 10:00 PM, and weekends from 7:00 AM to 8:00 PM."
    },
    {
      question: "Do you offer personal training?",
      answer: "Yes, we have certified personal trainers available. You can book one-on-one sessions or join small group training classes."
    },
    {
      question: "What should I bring to the gym?",
      answer: "We recommend bringing a water bottle, towel, and comfortable workout clothes. Lockers are available for storing personal items."
    }
  ]

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="faqs__container">
      <h2>Frequently Asked Questions</h2>
      <div className="faqs__wrapper">
        {faqs.map((faq, index) => (
          <article 
            key={index} 
            className={`faq ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq__question">
              <h4>{faq.question}</h4>
              <button className="faq__icon">
                {activeIndex === index ? <AiOutlineMinus /> : <AiOutlinePlus />}
              </button>
            </div>
            <div className="faq__answer">
              <p>{faq.answer}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FAQs