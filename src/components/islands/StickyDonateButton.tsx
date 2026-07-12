import React, { useState, useEffect } from 'react';
import DonationForm, { useDonationForm } from './DonationForm';

export default function StickyDonateButton() {
  const { isOpen, toggle, close } = useDonationForm();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <DonationForm isOpen={isOpen} onClose={close} />

      <div
        className={`
          fixed bottom-6 right-6 z-50 transition-all duration-500
          ${mounted ? 'animate-fade-in-up opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <div className="relative group">
          {/* Hover tooltip */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
            <div className="bg-primary-900 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap shadow-soft">
              Donasi
            </div>
          </div>

          {/* Donate button */}
          <button
            onClick={toggle}
            className="w-16 h-16 rounded-full bg-coral-500 hover:bg-coral-600 shadow-strong flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 animate-pulse-soft"
            aria-label="Donasi Sekarang"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
