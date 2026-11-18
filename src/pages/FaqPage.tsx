import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { SAMPLE_FAQS } from '../data/sampleData';
import type { FaqItem } from '../types/realEstate';

const TOPICS: Array<'All' | FaqItem['topic']> = [
  'All',
  'Purchases',
  'Rentals',
  'Leasing',
  'Inspections',
  'Company Services',
];

export const FaqPage: React.FC = () => {
  const { navigate, setPageMeta } = useAppState();
  const [selectedTopic, setSelectedTopic] = useState<'All' | FaqItem['topic']>('All');
  const [openId, setOpenId] = useState<string>(SAMPLE_FAQS[0]?.id ?? '');

  useEffect(() => {
    setPageMeta({
      title: 'Frequently Asked Questions | Naeleseneh Properties Limited',
      description:
        'Answers covering property purchases, rentals, commercial leasing, guided inspections, and company services.',
    });
  }, [setPageMeta]);

  const visibleFaqs =
    selectedTopic === 'All'
      ? SAMPLE_FAQS
      : SAMPLE_FAQS.filter((item) => item.topic === selectedTopic);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
          FAQ · Provisional Guidance
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          Guidance on purchasing landed properties, residential rentals, commercial leasing, inspections, and working with Naeleseneh Properties Limited.
        </p>
      </div>

      {/* Topic Filter */}
      <div
        className="mt-7 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter questions by topic"
      >
        {TOPICS.map((topic) => {
          const active = selectedTopic === topic;
          return (
            <button
              key={topic}
              type="button"
              onClick={() => setSelectedTopic(topic)}
              aria-pressed={active}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-[#1E40AF] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {topic}
            </button>
          );
        })}
      </div>

      {/* Accessible Accordion */}
      <div className="mt-8 divide-y divide-slate-200 border border-slate-200 rounded-2xl bg-white overflow-hidden">
        {visibleFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          const panelId = `faq-panel-${faq.id}`;
          const btnId = `faq-btn-${faq.id}`;
          return (
            <div key={faq.id}>
              <h2>
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? '' : faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div>
                    <span className="block text-xs font-semibold text-[#1E40AF] mb-1">
                      {faq.topic}
                    </span>
                    <span className="text-base font-bold text-slate-900">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#1E40AF]' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </h2>
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                hidden={!isOpen}
                className="px-6 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed"
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 border border-slate-200 bg-slate-50/70 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Still have a question?</h2>
          <p className="mt-1 text-sm text-slate-600">
            Send your enquiry directly and a member of our team will follow up.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/contact')}
          className="px-5 py-2.5 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Contact Us
        </button>
      </div>
    </main>
  );
};
