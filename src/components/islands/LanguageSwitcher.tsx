import React, { useState, useEffect } from 'react';
import { getInitialLang, setLangCookie, t, type Lang } from '../../lib/i18n';

export default function LanguageSwitcher() {
  const [lang, setLangState] = useState<Lang>(() => getInitialLang());

  useEffect(() => {
    document.documentElement.lang = lang;
    setLangCookie(lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key, lang);
    });
  }, [lang]);
  const toggle = () => {
    const next: Lang = lang === 'id' ? 'en' : 'id';
    setLangState(next);
  };

  return (
    <button
      onClick={toggle}
      class="px-3 py-1.5 text-sm font-medium rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
      aria-label={`Switch to ${lang === 'id' ? 'English' : 'Indonesian'}`}
    >
      {lang === 'id' ? 'EN' : 'ID'}
    </button>
  );
}
