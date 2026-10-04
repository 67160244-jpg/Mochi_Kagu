import React from 'react';
import { DataBadge, DataType } from './DataBadge';
import { Info } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  unit?: string;
  source: string;
  dataType?: DataType;
  dataLabel?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  unit,
  source,
  dataType = 'real',
  dataLabel,
  headerAction,
  children,
  className = '',
}) => {
  return (
    <div className={`mochi-card flex flex-col justify-between ${className}`}>
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-display font-semibold text-lg text-mochi-brown-dark">
              {title}
            </h4>
            <DataBadge type={dataType} label={dataLabel} size="sm" />
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-mochi-brown/70 leading-relaxed">
              {subtitle}
            </p>
          )}
          {unit && (
            <div className="text-xs font-medium text-mochi-wood-dark mt-1">
              หน่วย: {unit}
            </div>
          )}
        </div>
        {headerAction && (
          <div className="flex items-center gap-2 shrink-0">
            {headerAction}
          </div>
        )}
      </div>

      {/* Chart Body with Horizontal Scroll Wrapper for Responsive Phones */}
      <div className="w-full overflow-x-auto py-2">
        <div className="min-w-[320px] w-full">
          {children}
        </div>
      </div>

      {/* Chart Footer with Source Attribution */}
      <div className="mt-4 pt-3 border-t border-mochi-lavender/30 flex items-center gap-1.5 text-xs text-mochi-brown/60">
        <Info className="w-3.5 h-3.5 shrink-0 text-mochi-brown/50" />
        <span className="truncate">
          ที่มา: {source}
        </span>
      </div>
    </div>
  );
};
