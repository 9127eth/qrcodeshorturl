import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Link, Zap, Shield, Share2 } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQs: FAQItem[] = [
  {
    question: "What is a QR Code?",
    answer: "A QR Code (Quick Response Code) is a two-dimensional barcode that can store a variety of information, including URLs. When scanned with a smartphone camera or a QR code scanner, it takes users directly to the encoded URL without needing to type anything manually."
  },
  {
    question: "How Does a QR Code Work?",
    answer: "QR codes contain information encoded in the form of black and white squares. When scanned, this pattern is decoded by a scanner (usually the camera on your phone) and redirects the user to the encoded URL or data. It's a fast, easy way to access information by simply scanning the code."
  },
  {
    question: "What is a Short URL?",
    answer: "A Short URL is a condensed version of a longer website address. Instead of sharing a long and complicated URL, a short URL makes it more manageable and easier to share, especially on platforms with character limits or in printed materials."
  },
  {
    question: "How Does a Short URL Work?",
    answer: "When you click on or share a short URL, it redirects users to the original, full-length URL. The short URL is just a 'shortcut' to the destination, making it easier to use and share. Behind the scenes, a server recognizes the short URL and automatically forwards the user to the original address."
  },
  {
    question: "Is My URL Safe?",
    answer: "Yes! We use Google's Risk API to run a safety check on every URL you submit. This ensures that the URLs we shorten or turn into QR codes are safe and free from malware or phishing threats. If an unsafe URL is detected, we'll notify you so you can avoid using it."
  }
];

const InfoSection: React.FC = () => {
  const [openFAQs, setOpenFAQs] = useState<Set<number>>(new Set());

  const toggleFAQ = (index: number) => {
    setOpenFAQs((prevOpenFAQs) => {
      const newOpenFAQs = new Set(prevOpenFAQs);
      if (newOpenFAQs.has(index)) {
        newOpenFAQs.delete(index);
      } else {
        newOpenFAQs.add(index);
      }
      return newOpenFAQs;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
      <section className="space-y-12">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg transform hover:scale-105 transition-transform duration-300 group">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 p-3 rounded-full mr-4 group-hover:rotate-360 transition-transform duration-300">
                <Link className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">1. Input a URL</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Enter the URL you want to shorten or generate a QR code for into the input field.</p>
          </div>
          <div className="p-6 rounded-lg transform hover:scale-105 transition-transform duration-300 group">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-500 p-3 rounded-full mr-4 group-hover:rotate-360 transition-transform duration-300">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">2. Safety Check</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">We run your link through a Google risk assessment to ensure it's safe and legitimate.</p>
          </div>
          <div className="p-6 rounded-lg transform hover:scale-105 transition-transform duration-300 group">
            <div className="flex items-center mb-4">
              <div className="bg-green-500 p-3 rounded-full mr-4 group-hover:rotate-360 transition-transform duration-300">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">3. Generate</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">We instantly create a Short URL and a QR Code for your link.</p>
          </div>
          <div className="p-6 rounded-lg transform hover:scale-105 transition-transform duration-300 group">
            <div className="flex items-center mb-4">
              <div className="bg-red-500 p-3 rounded-full mr-4 group-hover:rotate-360 transition-transform duration-300">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">4. Share</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Copy the short URL or download the QR code and share it however you like.</p>
          </div>
        </div>
      </section>

      <section className="space-y-8"> {/* Increased space-y from 6 to 8 */}
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2> {/* Increased mb from 8 to 12 */}
        <div className="space-y-6"> {/* Increased space-y from 4 to 6 */}
          {FAQs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6"> {/* Increased pb from 4 to 6 */}
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-semibold">{faq.question}</span>
                {openFAQs.has(index) ? <ChevronUp /> : <ChevronDown />}
              </button>
              <div
                className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
                  openFAQs.has(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InfoSection;
