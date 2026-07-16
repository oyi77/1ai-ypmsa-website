import React, { useState, useEffect, useCallback, useRef } from 'react';

const WA_NUMBER = '6285655713100';
const WA_MESSAGE = encodeURIComponent(
  'Assalamu\'alaikum, saya ingin tahu lebih lanjut tentang program donasi YPSM Jombang.'
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

const STORAGE_KEY = 'ypsma-doa-modal-seen';

const SLIDES = [
  // Slide 0 — Hadist + Aamiin
  {
    hadith: (
      <>
        <span className="font-arabic text-2xl leading-relaxed">
          &quot;
        </span>
        <em className="not-italic">
          Tidaklah seorang hamba muslim yang berdoa untuk saudaranya yang tidak ada di hadapannya,
          melainkan malaikat berkata,
          &quot;Dan untukmu seperti doamu.&quot;
        </em>
      </>
    ),
    source: 'HR. Muslim • no. 7231',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-secondary-500">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    cta: { label: '🤲 Aamiin', action: 'aamiin' as const },
  },
  // Slide 1 — After Aamiin → WhatsApp
  {
    hadith: (
      <>
        <span className="font-arabic text-2xl leading-relaxed">
          &quot;
        </span>
        <em className="not-italic">
          Barangsiapa yang menunjukkan kepada kebaikan, maka baginya pahala seperti orang yang melakukannya.
        </em>
      </>
    ),
    source: 'HR. Muslim • no. 1893',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-500">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    cta: { label: '💬 Chat Pengurus YPSM', action: 'whatsapp' as const },
    subtitle: 'Ada yang bisa kami bantu? Konsultasi donasi langsung via WhatsApp',
  },
  // Slide 2 — Simpan nomor / reminder
  {
    hadith: (
      <>
        <span className="font-arabic text-2xl leading-relaxed">
          &quot;
        </span>
        <em className="not-italic">
          Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.
        </em>
      </>
    ),
    source: 'HR. Ahmad • no. 9056',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-coral-500">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    cta: { label: '📞 Simpan Nomor YPSM', action: 'save' as const },
    subtitle: 'Simpan kontak kami untuk update program dan laporan donasi terbaru',
  },
];

export default function DoaModal() {
  const [visible, setVisible] = useState(false);
  const [slide, setSlide] = useState(0);
  const [count, setCount] = useState(128);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const closeAttemptRef = useRef(0);

  // Check sessionStorage on mount
  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') {
        return; // already seen this session
      }
    } catch { /* storage unavailable — show anyway */ }

    // IntersectionObserver on sentinel at 50% page height
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mark seen when modal shown
  useEffect(() => {
    if (visible) {
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* noop */ }
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleCta = useCallback((action: string) => {
    if (action === 'aamiin') {
      if (window.fbq) window.fbq('track', 'CompleteRegistration', { content_name: 'Doa Aamiin', content_category: 'doa-modal' });
      setCount((c) => c + 1);
      setSlide(1);
    } else if (action === 'whatsapp') {
      if (window.fbq) window.fbq('track', 'Contact', { content_name: 'Doa WA Chat', content_category: 'doa-modal' });
      window.open(WA_URL, '_blank', 'noopener');
      setSlide(2);
    } else if (action === 'save') {
      if (window.fbq) window.fbq('track', 'Contact', { content_name: 'Doa Simpan Nomor', content_category: 'doa-modal' });
      navigator.clipboard.writeText('+62 856-5571-3100').catch(() => {});
      window.open(WA_URL, '_blank', 'noopener');
      setTimeout(() => setVisible(false), 800);
    }
  }, []);

  const handleOverlayClick = useCallback(() => {
    closeAttemptRef.current += 1;
    if (closeAttemptRef.current >= 2) {
      // Second tap on overlay = dismiss
      handleClose();
    } else {
      // First tap = show reminder (don't close)
      if (slide === 0) {
        // subtle hint — stay on slide, no change
      }
    }
  }, [slide, handleClose]);

  if (!visible) {
    return (
      <>
        {/* Sentinel — invisible, triggers modal at 50% scroll */}
        <div ref={sentinelRef} className="absolute left-0 w-px h-px opacity-0 pointer-events-none" style={{ top: '50vh' }} />
      </>
    );
  }

  const s = SLIDES[slide];

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-strong animate-slide-in-bottom overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Tutup"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Top icon */}
        <div className="flex justify-center -mt-6 mb-2">
          <div className={`
            w-14 h-14 rounded-full flex items-center justify-center shadow-lg
            ${slide === 0 ? 'bg-primary-500' : slide === 1 ? 'bg-primary-500' : 'bg-coral-500'}
          `}>
            {slide === 0 && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            )}
            {slide === 1 && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            )}
            {slide === 2 && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="px-6 pb-6 pt-3 text-center">
          {/* Badge */}
          <span className={`
            inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-3
            ${slide === 0 ? 'bg-primary-50 text-primary-700' : slide === 1 ? 'bg-primary-50 text-primary-700' : 'bg-coral-50 text-coral-700'}
          `}>
            {slide === 0 ? 'Keutamaan Mendoakan' : slide === 1 ? 'Terhubung dengan Kami' : 'Tetap Terhubung'}
          </span>

          {/* Hadith text */}
          <div className="text-sm text-gray-700 leading-relaxed mb-2">
            {s.hadith}
          </div>

          {/* Source */}
          <p className="text-[11px] text-gray-400 mb-3">{s.source}</p>

          {/* Separator icon */}
          <div className="flex justify-center mb-4">
            {s.icon}
          </div>

          {/* Heading */}
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {slide === 0 ? 'Aamiin-kan doa mereka' : slide === 1 ? 'Chat Pengurus YPSM' : 'Simpan Kontak Kami'}
          </h3>

          {/* Subtitle */}
          {s.subtitle && (
            <p className="text-xs text-gray-500 mb-4">{s.subtitle}</p>
          )}

          {/* Sample doa card (slide 0 only) */}
          {slide === 0 && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 mb-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  T
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800">Teman Sedekah</p>
                  <p className="text-[10px] text-gray-400">Baru saja</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2 italic">
                &quot;Bismillah, semoga Allah membalas kebaikan para donatur.&quot;
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-500">
                  🤲 {count}
                </span>
                <span className="text-[10px] text-gray-400">orang telah mendoakan</span>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => handleCta(s.cta.action)}
            className={`
              w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98]
              ${slide === 0 ? 'bg-primary-500 hover:bg-primary-600 shadow-md' : ''}
              ${slide === 1 ? 'bg-primary-500 hover:bg-primary-600 shadow-md' : ''}
              ${slide === 2 ? 'bg-coral-500 hover:bg-coral-600 shadow-md' : ''}
            `}
          >
            {s.cta.label}
          </button>

          {/* Skip / close hint */}
          {slide === 0 && (
            <p className="text-[10px] text-gray-400 mt-3">
              Klik <strong>&quot;Aamiin&quot;</strong> untuk ikut mendoakan, atau tekan <strong>X</strong> untuk tutup
            </p>
          )}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center items-center gap-1.5 pb-4">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`
                rounded-full transition-all duration-300
                ${i === slide
                  ? (i === 2 ? 'bg-coral-500 w-6 h-2' : 'bg-primary-500 w-6 h-2')
                  : 'bg-gray-300 w-2 h-2'
                }
              `}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
