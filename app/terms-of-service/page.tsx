import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/" className="text-sm text-primary hover:underline mb-4 inline-block">
        Go back to home
      </Link>
      <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
      <p className="text-sm mb-4">Last updated: 9/20/2024</p>
      <div className="text-sm space-y-4">
        <p>
          Hello Monetag!!! Welcome to qrsu.io (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our URL shortening and QR code generation service (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Service.
        </p>

        <h2 className="text-lg font-semibold mt-4 mb-2">1. Use of the Service</h2>
        <p>1.1. You may use our Service to create shortened URLs and generate QR codes for legitimate purposes only.</p>
        <p>1.2. You agree not to use our Service for any unlawful or prohibited activities, including but not limited to:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Distributing malware, viruses, or other malicious code</li>
          <li>Phishing or engaging in fraudulent activities</li>
          <li>Spamming or sending unsolicited bulk messages</li>
          <li>Violating any applicable laws or regulations</li>
          <li>Infringing on the intellectual property rights of others</li>
        </ul>
        <p>1.3. We reserve the right to disable any shortened URL or QR code that we believe, in our sole discretion, violates these Terms or is otherwise harmful or inappropriate.</p>

        <h2 className="text-lg font-semibold mt-4 mb-2">2. Content Responsibility</h2>
        <p>2.1. You are solely responsible for the content of the websites or resources that you link to using our Service.</p>
        <p>2.2. We do not endorse, support, represent, or guarantee the completeness, truthfulness, accuracy, or reliability of any content linked through our Service.</p>

        <h2 className="text-lg font-semibold mt-4 mb-2">3. Intellectual Property</h2>
        <p>3.1. Our Service, including its original content, features, and functionality, is owned by [Your Company Name] and is protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>

        <h2 className="text-lg font-semibold mt-4 mb-2">4. Disclaimer of Warranties</h2>
        <p>4.1. Your use of our Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis, without warranties of any kind, either express or implied.</p>
        <p>4.2. We do not guarantee that our Service will be uninterrupted, timely, secure, or error-free.</p>

        <h2 className="text-lg font-semibold mt-4 mb-2">5. Limitation of Liability</h2>
        <p>5.1. To the fullest extent permitted by applicable law, [Your Company Name] shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use or inability to use the Service.</p>

        <h2 className="text-lg font-semibold mt-4 mb-2">6. Changes to the Service and Terms</h2>
        <p>6.1. We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</p>
        <p>6.2. We may revise these Terms from time to time. The most current version will always be posted on our website. By continuing to use our Service after those revisions become effective, you agree to be bound by the revised Terms.</p>

        <h2 className="text-lg font-semibold mt-4 mb-2">7. Governing Law</h2>
        <p>7.1. These Terms shall be governed and construed in accordance with the laws of Florida, without regard to its conflict of law provisions.</p>

        <h2 className="text-lg font-semibold mt-4 mb-2">8. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us on Twitter @qrsu_io.
        </p>

        <p className="mt-4">
          By using our Service, you acknowledge that you have read and understood these Terms and agree to be bound by them.
        </p>
      </div>
    </div>
  );
}
