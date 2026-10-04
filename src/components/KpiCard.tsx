import React from 'react';
import { DataBadge, DataType } from './DataBadge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  dataType?: DataType;
  dataLabel?: string;
  changePct?: number | null;
  changeText?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  dataType = 'real',
  dataLabel,
  changePct,
  changeText,
  icon,
  highlight = false,
}) => {
  return (
    <div
      className={`mochi-card flex flex-col justify-between relative overflow-hidden ${
        highlight
          ? 'bg-gradient-to-br from-white via-mochi-pink-light/30 to-mochi-lavender-light/40 border-mochi-pink'
          : 'bg-white'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-sm font-medium text-mochi-brown/70 leading-snug">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-mochi-sm bg-mochi-lavender-light text-mochi-brown">
            {icon}
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="my-1">
        <div className="text-3xl font-display font-semibold text-mochi-brown-dark tracking-tight">
          {value}
        </div>

        {/* Change Indicator if available */}
        {(changePct !== undefined && changePct !== null) || changeText ? (
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium">
            {changePct !== undefined && changePct !== null && (
              <>
                {changePct > 0 ? (
                  <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                    +{changePct}%
                  </span>
                ) : changePct < 0 ? (
                  <span className="inline-flex items-center text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                    {changePct}%
                  </span>
                ) : (
                  <span className="inline-flex items-center text-mochi-brown/60 bg-gray-100 px-2 py-0.5 rounded-full">
                    <Minus className="w-3.5 h-3.5 mr-0.5" />
                    0%
                  </span>
                )}
              </>
            )}
            {changeText && (
              <span className="text-mochi-brown/70">{changeText}</span>
            )}
          </div>
        ) : null}
      </div>

      {/* Bottom Subtext & Badge */}
      <div className="mt-4 pt-3 border-t border-mochi-lavender/30 flex items-center justify-between text-xs text-mochi-brown/70">
        <span className="truncate pr-2">{subtext}</span>
        <DataBadge type={dataType} label={dataLabel} size="sm" />
      </div>
    </div>
  );
};
