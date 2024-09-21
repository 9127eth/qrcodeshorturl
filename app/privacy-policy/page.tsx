import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/" className="text-sm text-primary hover:underline mb-4 inline-block">
        Go back to home
      </Link>
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm mb-4">Last updated: 9/20/2024</p>
      <div className="text-sm space-y-4">
        <p>
          This Privacy Policy describes how qrsu.io ("we," "our," or "us") collects, uses, and shares information in connection with your use of our URL shortening and QR code generation service (the "Service").
        </p>

        <h2 className="text-lg font-semibold mt-4 mb-2">1. Information We Collect</h2>
        <p>1.1. When you use our Service, we collect the following information:</p>
        <ul className="list-disc list-inside ml-4">
          <li>The original URL you provide for shortening or QR code generation</li>
          <li>The shortened URL we generate for you</li>
        </ul>
        <p>1.2. We do not currently require users to create accounts or provide personal information to use our Service.</p>
        <p>1.3. We may automatically collect certain information about your device, including IP address, browser type, operating system, and referring URLs. This information is used for analytical purposes and to improve our Service.</p>

        <h2 className="text-lg font-semibold mt-4 mb-2">2. How We Use Your Information</h2>
        <p>2.1. We use the information we collect to:</p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li>Provide and maintain our Service</li>
          <li>Generate shortened URLs and QR codes</li>
          <li>Analyze usage patterns and improve our Service</li>
          <li>Detect and prevent fraud, abuse, or security incidents</li>
        </ul>

        <h2 className="text-lg font-semibold mt-4 mb-2">3. Information Sharing and Disclosure</h2>
        <p>3.1. We do not sell, trade, or otherwise transfer your information to third parties.</p>
        <p>3.2. We may share your information in the following circumstances:</p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li>To comply with legal obligations</li>
          <li>To protect and defend our rights and property</li>
          <li>With service providers who help us operate our Service, subject to confidentiality agreements</li>
        </ul>

        <h2 className="text-lg font-semibold mt-4 mb-2">4. Data Retention</h2>
        <p>4.1. We retain the original URLs and shortened URLs for as long as necessary to provide our Service and comply with legal obligations.</p>

        <h2 className="text-lg font-semibold mt-4 mb-2">5. Security</h2>
        <p>5.1. We implement reasonable security measures to protect the information we collect. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

        <h2 className="text-lg font-semibold mt-4 mb-2">6. Your Rights</h2>
        <p>6.1. You may request the deletion of a shortened URL or QR code you've created by contacting us on Twitter @qrsu_io.</p>

        <h2 className="text-lg font-semibold mt-4 mb-2">7. Children's Privacy</h2>
        <p>7.1. Our Service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13.</p>

        <h2 className="text-lg font-semibold mt-4 mb-2">8. Changes to This Privacy Policy</h2>
        <p>8.1. We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>

        <h2 className="text-lg font-semibold mt-4 mb-2">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us on Twitter @qrsu_io.
        </p>

        <p className="mt-4">
          By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy.
        </p>
      </div>
    </div>
  );
}
