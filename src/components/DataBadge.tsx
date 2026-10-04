import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, FileText } from 'lucide-react';

export type DataType = 'real' | 'simulated' | 'secondary' | 'assumption';

interface DataBadgeProps {
  type: DataType;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const DataBadge: React.FC<DataBadgeProps> = ({
  type,
  label,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-xs px-3 py-1';

  switch (type) {
    case 'real':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 ${sizeClasses} ${className}`}
          title="ข้อมูลจริงที่ผ่านการทำความสะอาดและตรวจสอบความถูกต้องจากแหล่งอ้างอิงทางการ"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          {label || 'ข้อมูลจริง (Real Data)'}
        </span>
      );

    case 'simulated':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-amber-100 text-amber-900 border border-amber-400 animate-pulse ${sizeClasses} ${className}`}
          title="ข้อมูลจำลอง (Synthetic/Simulated) เพื่อสาธิตแนวคิดการทำงานของระบบแดชบอร์ดเท่านั้น ไม่ใช่ข้อมูลธุรกรรมจริง"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
          {label || 'ข้อมูลจำลอง (Simulated)'}
        </span>
      );

    case 'secondary':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-100 text-blue-900 border border-blue-300 ${sizeClasses} ${className}`}
          title="ข้อมูลทุติยภูมิที่รวบรวมจากรายงานบทวิเคราะห์หรือข่าวสารเศรษฐกิจ"
        >
          <FileText className="w-3.5 h-3.5 text-blue-700" />
          {label || 'ข้อมูลทุติยภูมิ (Secondary)'}
        </span>
      );

    case 'assumption':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-mochi-lavender-light text-mochi-brown-dark border border-mochi-lavender-dark ${sizeClasses} ${className}`}
          title="ตัวเลขสมมติฐานที่กำหนดขึ้นสำหรับการคำนวณแบบจำลอง"
        >
          <HelpCircle className="w-3.5 h-3.5 text-mochi-lavender-deep" />
          {label || 'สมมติฐาน (Assumption)'}
        </span>
      );

    default:
      return null;
  }
};
