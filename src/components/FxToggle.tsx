import React from 'react';
import { CONFIG, CurrencyMode } from '../config/fx';
import { Coins } from 'lucide-react';

interface FxToggleProps {
  currentCurrency: CurrencyMode;
  onToggle: (mode: CurrencyMode) => void;
  showExplanation?: boolean;
}

export const FxToggle: React.FC<FxToggleProps> = ({
  currentCurrency,
  onToggle,
  showExplanation = false,
}) => {
  return (
    <div className="flex flex-col gap-1 items-end">
      <div className="inline-flex p-1 bg-mochi-lavender-light rounded-full border border-mochi-lavender/50 text-xs font-medium">
        <button
          type="button"
          onClick={() => onToggle('THB')}
          className={`px-3 py-1 rounded-full transition-all duration-200 flex items-center gap-1 ${
            currentCurrency === 'THB'
              ? 'bg-mochi-pink text-mochi-brown-dark font-semibold shadow-xs'
              : 'text-mochi-brown/70 hover:text-mochi-brown'
          }`}
          aria-pressed={currentCurrency === 'THB'}
          aria-label="แสดงราคาสกุลเงินบาทไทย"
        >
          <Coins className="w-3 h-3" />
          <span>บาท (THB)</span>
        </button>
        <button
          type="button"
          onClick={() => onToggle('SAR')}
          className={`px-3 py-1 rounded-full transition-all duration-200 ${
            currentCurrency === 'SAR'
              ? 'bg-mochi-wood text-white font-semibold shadow-xs'
              : 'text-mochi-brown/70 hover:text-mochi-brown'
          }`}
          aria-pressed={currentCurrency === 'SAR'}
          aria-label="แสดงราคาสกุลเงินริยาลซาอุดีอาระเบียต้นฉบับ"
        >
          <span>SAR (ต้นฉบับ)</span>
        </button>
      </div>
      {showExplanation && (
        <span className="text-[11px] text-mochi-brown/60 text-right">
          * สมมติฐาน 1 SAR = {CONFIG.SAR_TO_THB} THB (อัปเดต {CONFIG.FX_LAST_UPDATED})
        </span>
      )}
    </div>
  );
};
