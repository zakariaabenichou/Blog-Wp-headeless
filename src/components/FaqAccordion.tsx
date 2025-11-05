// src/components/FaqAccordion.tsx
'use client'; // This component is interactive, so it must be a Client Component.

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// A type for better code quality
type Faq = {
  question: string;
  answer: string;
};

export default function FaqAccordion({ faqString }: { faqString: string }) {
  
  // 1. State to track which accordion item is currently open (MOVED TO TOP)
  // FIX: Hooks must be called before any early returns.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // 2. Parse the raw text from ACF into a structured array of Q&A objects
  const faqs: Faq[] = faqString
    .split('\n')
    .filter(line => line.includes('|'))
    .map(line => {
      const [question, answer] = line.split('|');
      // Trim 'Q:' and 'A:' prefixes for clean display
      return {
        question: question.replace(/^Q:\s*/, '').trim(),
        answer: answer.replace(/^A:\s*/, '').trim(),
      };
    });

  // 3. If there are no valid FAQs, don't render anything (Early return is safe now)
  if (faqs.length === 0) {
    return null;
  }

  const toggleAccordion = (index: number) => {
    // If the clicked item is already open, close it. Otherwise, open the new one.
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    // 4. Render the section with a title and the list of accordions
    <section className="mt-12 border-t pt-8">
      <h2 className="text-3xl font-serif font-bold text-text-main mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-md overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center text-left p-4 font-semibold text-text-main hover:bg-light-gray transition-colors"
            >
              <span>{faq.question}</span>
              <motion.div animate={{ rotate: activeIndex === index ? 180 : 0 }}>
                <FiChevronDown />
              </motion.div>
            </button>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-rose-200"
                >
                  <div className="p-4 border-t prose" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}