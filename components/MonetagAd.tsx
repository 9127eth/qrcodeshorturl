import React, { useEffect } from 'react';

const MonetagAd: React.FC = () => {
  useEffect(() => {
    // Define the _awnlmau function
    (window as any)._awnlmau = function() {
      // This function can be empty or you can add any necessary logic
    };

    const script = document.createElement('script');
    script.innerHTML = `(function(d,z,s,c){s.src='//'+d+'/400/'+z;s.onerror=s.onload=E;function E(){c&&c();c=null}try{(document.body||document.documentElement).appendChild(s)}catch(e){E()}})('vooculok.com',8229198,document.createElement('script'),_awnlmau)`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      delete (window as any)._awnlmau;
    };
  }, []);

  return null;
};

export default MonetagAd;