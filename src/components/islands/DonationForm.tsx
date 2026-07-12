import React from 'react';
import { useState, useCallback } from 'react';
import { DONATION_TYPES, PAYMENT_METHODS } from '../../lib/constants';

const PRESET_AMOUNTS = [25000, 50000, 100000, 300000, 500000, 1000000];

const formatRupiah = (amount: number) => {
  if (amount <= 0) return '';
  return 'Rp' + amount.toLocaleString('id-ID');
};

export function useDonationForm(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  return { isOpen, open, close, toggle };
}

interface DonationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationForm({ isOpen, onClose }: DonationFormProps) {
  const [step, setStep] = useState(1);
  const [donationType, setDonationType] = useState('');
  const [nominal, setNominal] = useState<number | null>(null);
  const [customNominal, setCustomNominal] = useState('');
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const numericCustom = customNominal ? parseInt(customNominal.replace(/\D/g, '')) || 0 : 0;
  const selectedAmount = nominal || numericCustom;

  const resetFormState = useCallback(() => {
    setStep(1);
    setDonationType('');
    setNominal(null);
    setCustomNominal('');
    setFrequency('once');
    setPaymentMethod('');
    setName('');
    setEmail('');
    setPhone('');
    setErrors({});
    setSubmitted(false);
  }, []);

  const handleClose = useCallback(() => {
    resetFormState();
    onClose();
  }, [resetFormState, onClose]);

  const handleCustomNominalChange = useCallback((value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    setCustomNominal(cleaned);
    setNominal(null);
    setErrors({});
  }, []);

  const selectNominal = useCallback((amount: number) => {
    setNominal(amount);
    setCustomNominal('');
    setErrors({});
  }, []);

  const handleNext = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (step === 1 && !donationType) {
      newErrors.step = 'Pilih tujuan donasi terlebih dahulu';
    } else if (step === 2 && !nominal && !numericCustom) {
      newErrors.step = 'Pilih nominal donasi';
    } else if (step === 4 && !paymentMethod) {
      newErrors.step = 'Pilih metode pembayaran';
    } else if (step === 5) {
      if (!name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
      if (!phone.trim()) newErrors.phone = 'No. WhatsApp wajib diisi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (step === 5) {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
      }, 1500);
    } else {
      setStep((s) => s + 1);
    }
  }, [step, donationType, nominal, numericCustom, paymentMethod, name, phone]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep((s) => s - 1);
    setErrors({});
  }, [step]);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-6">
      {[1, 2, 3, 4, 5].map((s, i) => (
        <div key={s} className="flex items-center">
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200
              ${s === step ? 'bg-primary-900 text-white ring-2 ring-secondary-500 ring-offset-2' : ''}
              ${s < step ? 'bg-primary-900/80 text-white' : ''}
              ${s > step ? 'bg-neutral-200 text-neutral-400' : ''}
            `}
          >
            {s}
          </div>
          {i < 4 && (
            <div
              className={`
                w-6 sm:w-10 h-0.5 mx-1 transition-colors duration-200
                ${s < step ? 'bg-primary-900/60' : 'bg-neutral-200'}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-heading font-semibold text-primary-900 mb-4">
              Pilih Tujuan Donasi
            </h3>
            {DONATION_TYPES.map((t) => (
              <label
                key={t.id}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${
                    donationType === t.id
                      ? 'border-secondary-500 bg-secondary-50/50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                    ${donationType === t.id ? 'border-secondary-500' : 'border-neutral-300'}
                  `}
                >
                  {donationType === t.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary-500" />
                  )}
                </div>
                <span className="text-neutral-800 font-medium">{t.label}</span>
                <input
                  type="radio"
                  name="donationType"
                  value={t.id}
                  checked={donationType === t.id}
                  onChange={() => setDonationType(t.id)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold text-primary-900 mb-4">
              Pilih Nominal Donasi
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => selectNominal(amt)}
                  className={`
                    py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-all duration-200
                    ${
                      nominal === amt
                        ? 'bg-primary-900 text-white border-primary-900'
                        : 'border-neutral-200 text-neutral-700 hover:border-primary-500 hover:text-primary-700'
                    }
                  `}
                >
                  {formatRupiah(amt)}
                </button>
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-sm text-neutral-500">atau</span>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-semibold">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={customNominal}
                onChange={(e) => handleCustomNominalChange(e.target.value)}
                placeholder="Masukkan nominal lain"
                className={`
                  w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all duration-200
                  ${!nominal && numericCustom > 0 ? 'border-secondary-500 bg-secondary-50/50' : 'border-neutral-200'}
                `}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold text-primary-900 mb-4">
              Frekuensi Donasi
            </h3>
            <div className="flex bg-neutral-100 rounded-lg p-1">
              {(['once', 'monthly'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFrequency(opt)}
                  className={`
                    flex-1 py-3 px-6 rounded-md text-sm font-semibold transition-all duration-200
                    ${
                      frequency === opt
                        ? 'bg-white text-primary-900 shadow-soft'
                        : 'text-neutral-600 hover:text-neutral-800'
                    }
                  `}
                >
                  {opt === 'once' ? 'Sekali' : 'Bulanan'}
                </button>
              ))}
            </div>
            {frequency === 'monthly' && (
              <p className="text-sm text-neutral-500 bg-primary-50/50 p-3 rounded-lg">
                Donasi bulanan akan otomatis diproses setiap tanggal yang sama.
              </p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-heading font-semibold text-primary-900 mb-4">
              Metode Pembayaran
            </h3>
            {PAYMENT_METHODS.map((m) => (
              <label
                key={m.id}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${
                    paymentMethod === m.id
                      ? 'border-secondary-500 bg-secondary-50/50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                    ${paymentMethod === m.id ? 'border-secondary-500' : 'border-neutral-300'}
                  `}
                >
                  {paymentMethod === m.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary-500" />
                  )}
                </div>
                <span className="text-neutral-800 font-medium">{m.label}</span>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={m.id}
                  checked={paymentMethod === m.id}
                  onChange={() => setPaymentMethod(m.id)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold text-primary-900 mb-4">Data Diri</h3>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className={`
                  w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all duration-200
                  ${errors.name ? 'border-red-400 bg-red-50' : 'border-neutral-200'}
                `}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                No. WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className={`
                  w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all duration-200
                  ${errors.phone ? 'border-red-400 bg-red-50' : 'border-neutral-200'}
                `}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg space-y-1 text-sm">
              <p className="text-neutral-700">
                <span className="font-medium">Tujuan:</span>{' '}
                {DONATION_TYPES.find((t) => t.id === donationType)?.label}
              </p>
              <p className="text-neutral-700">
                <span className="font-medium">Nominal:</span>{' '}
                {selectedAmount > 0 ? formatRupiah(selectedAmount) : '-'}
              </p>
              <p className="text-neutral-700">
                <span className="font-medium">Frekuensi:</span>{' '}
                {frequency === 'once' ? 'Sekali' : 'Bulanan'}
              </p>
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal card */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-strong animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 transition-colors z-10"
          aria-label="Tutup"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Glass header */}
        <div className="glass rounded-t-lg px-6 pt-6 pb-4">
          <h2 className="text-xl font-heading font-bold text-primary-900">Form Donasi</h2>
          <div className="w-16 h-1 bg-secondary-500 rounded-full mt-2" />
        </div>

        {/* Step indicator */}
        {!submitted && <div className="px-6 pt-5">{renderStepIndicator()}</div>}

        {/* Body */}
        <div className="px-6 pb-6 pt-4">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              {/* Success icon */}
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold text-primary-900">
                Donasi Berhasil!
              </h3>
              <p className="text-neutral-600 text-sm">
                Terima kasih atas donasi Anda. Semoga menjadi amal jariyah.
              </p>

              {/* Summary */}
              <div className="bg-neutral-50 rounded-lg p-4 text-sm text-left space-y-1">
                <p>
                  <span className="text-neutral-500">Tujuan:</span>{' '}
                  <span className="font-medium text-neutral-800">
                    {DONATION_TYPES.find((t) => t.id === donationType)?.label}
                  </span>
                </p>
                <p>
                  <span className="text-neutral-500">Nominal:</span>{' '}
                  <span className="font-medium text-neutral-800">
                    {selectedAmount > 0 ? formatRupiah(selectedAmount) : '-'}
                  </span>
                </p>
                <p>
                  <span className="text-neutral-500">Frekuensi:</span>{' '}
                  <span className="font-medium text-neutral-800">
                    {frequency === 'once' ? 'Sekali' : 'Bulanan'}
                  </span>
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 px-8 rounded-lg bg-primary-900 hover:bg-primary-800 text-white font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          ) : (
            <>
              {renderStepContent()}

              {/* Step-level error */}
              {errors.step && (
                <p className="text-red-500 text-sm mt-3 text-center">{errors.step}</p>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-neutral-100">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3 px-6 rounded-lg border-2 border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 transition-all duration-200"
                  >
                    Kembali
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className={`
                    py-3 px-6 rounded-lg font-semibold transition-all duration-200
                    ${step > 1 ? 'flex-1' : 'w-full'}
                    ${
                      submitting
                        ? 'bg-coral-300 cursor-not-allowed text-white'
                        : 'bg-coral-500 hover:bg-coral-600 text-white'
                    }
                  `}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Memproses...
                    </span>
                  ) : step === 5 ? (
                    'Donasi Sekarang'
                  ) : (
                    'Lanjutkan'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
