"use client";
import { useEffect, useRef } from 'react';

export function AdTop() {
  const ad1Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject Ad 1
    if (ad1Ref.current && !ad1Ref.current.hasChildNodes()) {
      const script1 = document.createElement('script');
      script1.type = 'text/javascript';
      script1.innerHTML = `
        atOptions = {
          'key' : 'd61f09a758392b74a8459e5fb2fd8e65',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      ad1Ref.current.appendChild(script1);

      const script2 = document.createElement('script');
      script2.type = 'text/javascript';
      script2.src = 'https://www.highperformanceformat.com/d61f09a758392b74a8459e5fb2fd8e65/invoke.js';
      ad1Ref.current.appendChild(script2);
    }
  }, []);

  return (
    <div className="flex justify-center items-center w-full overflow-hidden mb-4">
      <div ref={ad1Ref} className="min-h-[90px] w-full flex justify-center items-center bg-slate-50 rounded-lg"></div>
    </div>
  );
}

export function AdBottom() {
  const ad2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject Ad 2
    if (ad2Ref.current && !document.getElementById('ad2-script')) {
      const script3 = document.createElement('script');
      script3.id = 'ad2-script';
      script3.type = 'text/javascript';
      script3.async = true;
      script3.setAttribute('data-cfasync', 'false');
      script3.src = 'https://pl29289519.profitablecpmratenetwork.com/bf8ac9bf6a8ff2717356b5ef03b669f4/invoke.js';
      document.body.appendChild(script3); 
    }
  }, []);

  return (
    <div className="flex justify-center items-center w-full overflow-hidden mt-6 mb-2">
      <div ref={ad2Ref} id="container-bf8ac9bf6a8ff2717356b5ef03b669f4" className="w-full flex justify-center items-center"></div>
    </div>
  );
}
