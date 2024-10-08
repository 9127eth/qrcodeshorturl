import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

const AdComponent: React.FC = () => {
  const adRef = useRef<HTMLModElement>(null);
  const isAdInitialized = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && !isAdInitialized.current && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdInitialized.current = true;
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    return (
      <div style={{ background: '#f0f0f0', padding: '20px', textAlign: 'center', marginTop: '20px' }}>
        Ad Placeholder
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6352583751629598"
        crossOrigin="anonymous"
        onError={(e) => {
          console.error('AdSense script failed to load', e);
        }}
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-6352583751629598"
        data-ad-slot="4377303329"
        ref={adRef}
      />
    </div>
  );
};

export default AdComponent;
