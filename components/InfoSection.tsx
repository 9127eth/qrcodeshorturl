"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQs: FAQItem[] = [
  {
    question: "What can the app do with an NFC tag?",
    answer:
      "It can read a tag, write to a tag, and erase a tag. That is the full NFC toolset listed for qrsu.io on the App Store.",
  },
  {
    question: "How do I put a website on a tag?",
    answer:
      "Write a URL from the app. If you leave off http:// or https://, the app adds https:// when it writes the tag.",
  },
  {
    question: "Which devices are supported?",
    answer:
      "The app is free on the App Store for iPhone and iPad and requires iOS 17.6 or later. Reading, writing, and erasing NFC tags requires an iPhone.",
  },
  {
    question: "Can I create a short link on this website?",
    answer:
      "No. New short links are created in the qrsu.io app. You can still make a QR code on this page. Short links that were already created still open.",
  },
  {
    question: "What else is in the app?",
    answer:
      "Along with NFC, the app creates QR codes for links, contact info, and more, and it includes a URL shortener.",
  },
];

const InfoSection: React.FC = () => {
  const [openFAQs, setOpenFAQs] = useState<Set<number>>(new Set());

  const toggleFAQ = (index: number) => {
    setOpenFAQs((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <section className="mx-auto max-w-3xl py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Questions</h2>
      <div className="space-y-2">
        {FAQs.map((faq, index) => {
          const isOpen = openFAQs.has(index);
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;

          return (
            <div key={faq.question} className="border-b">
              <button
                id={buttonId}
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-semibold">{faq.question}</span>
                {isOpen ? <ChevronUp className="shrink-0" /> : <ChevronDown className="shrink-0" />}
              </button>
              {isOpen && (
                <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-4">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default InfoSection;
