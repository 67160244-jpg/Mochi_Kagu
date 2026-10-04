import React from 'react';
import { DataBadge, DataType } from './DataBadge';
import { Sparkles, Compass } from 'lucide-react';

interface ChapterSectionProps {
  id: string;
  chapterNumber: number | string;
  title: string;
  subtitle: string;
  dataType: DataType;
  dataLabel?: string;
  soWhatTitle?: string;
  soWhatContent: React.ReactNode;
  bmcReference?: string;
  children: React.ReactNode;
}

export const ChapterSection: React.FC<ChapterSectionProps> = ({
  id,
  chapterNumber,
  title,
  subtitle,
  dataType,
  dataLabel,
  soWhatTitle = 'So what? สำหรับ Mochi Kagu',
  soWhatContent,
  bmcReference,
  children,
}) => {
  return (
    <section id={id} className="scroll-mt-24 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Chapter Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-mochi-pink text-mochi-brown-dark font-display text-sm font-semibold shadow-xs">
              บทที่ {chapterNumber}
            </span>
            <DataBadge type={dataType} label={dataLabel} />
            {bmcReference && (
              <span className="text-xs font-medium text-mochi-wood-dark bg-mochi-wood-light/60 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                BMC: {bmcReference}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-mochi-brown-dark tracking-tight leading-snug">
            {title}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-mochi-brown/80 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Content (Charts, Cards, Interactivity) */}
        <div className="space-y-6">
          {children}
        </div>

        {/* So What? Mochi Kagu Box */}
        <div className="mt-8 rounded-mochi p-6 bg-gradient-to-r from-mochi-lavender-light/90 via-white to-mochi-pink-light/60 border border-mochi-lavender/60 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-mochi-pink/80 flex items-center justify-center text-mochi-brown">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-display font-semibold text-lg text-mochi-brown-dark">
              {soWhatTitle}
            </h3>
          </div>
          <div className="text-sm sm:text-base text-mochi-brown/90 leading-relaxed pl-10 space-y-2">
            {soWhatContent}
          </div>
        </div>
      </div>
    </section>
  );
};
