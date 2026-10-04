import React from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../config/fx';
import { Heart, Github, GraduationCap, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-mochi-lavender/40 bg-white/70 backdrop-blur-sm py-12 text-sm text-mochi-brown/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍡</span>
              <span className="font-display font-bold text-lg text-mochi-brown-dark">
                {CONFIG.BRAND_NAME}
              </span>
            </div>
            <p className="text-xs text-mochi-brown/70 leading-relaxed">
              โครงงานออกแบบ Dashboard เชิงเล่าเรื่อง (Storytelling Dashboard) เพื่อวิเคราะห์โอกาสทางธุรกิจและการจัดการความเสี่ยงต้นทุนสำหรับธุรกิจเฟอร์นิเจอร์สั่งทำ (Custom Furniture)
            </p>
            <div className="flex items-center gap-1.5 text-xs text-mochi-wood-dark font-medium pt-1">
              <GraduationCap className="w-4 h-4" />
              <span>{CONFIG.COURSE_NAME}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="font-display font-semibold text-mochi-brown-dark mb-3">
              ส่วนของเว็บไซต์
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-mochi-pink-deep transition-colors">
                  เรื่องเล่าหลัก 6 บท (Storytelling Dashboard)
                </Link>
              </li>
              <li>
                <Link to="/explorer" className="hover:text-mochi-pink-deep transition-colors">
                  สำรวจข้อมูลสินค้าและหมวดหมู่ (Data Explorer)
                </Link>
              </li>
              <li>
                <Link to="/price-lab" className="hover:text-mochi-pink-deep transition-colors">
                  ห้องทดลองจำลองราคาตามขนาดและไม้ (Price Lab)
                </Link>
              </li>
              <li>
                <Link to="/data" className="hover:text-mochi-pink-deep transition-colors">
                  แหล่งข้อมูล Data Dictionary และการตรวจสอบคุณภาพ
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-mochi-pink-deep transition-colors">
                  เกี่ยวกับ Mochi Kagu และทีมผู้จัดทำ
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Context & Developer */}
          <div className="space-y-3">
            <div className="font-display font-semibold text-mochi-brown-dark mb-1">
              ผู้จัดทำโครงงาน
            </div>
            <div className="p-3.5 rounded-mochi bg-mochi-lavender-light/70 border border-mochi-lavender/50 text-xs space-y-1">
              <div className="font-medium text-mochi-brown-dark">
                {CONFIG.DEVELOPER_NAME}
              </div>
              <div className="text-mochi-brown/70">
                รหัสนักศึกษา: {CONFIG.STUDENT_ID}
              </div>
              <div className="text-[11px] text-mochi-wood-dark pt-1">
                พัฒนาต่อยอดจากโมเดลธุรกิจในวิชา {CONFIG.PARENT_COURSE}
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://github.com/67160244-jpg/Mochi_Kagu"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-mochi-brown-dark font-medium hover:text-mochi-pink-deep transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository: 67160244-jpg/Mochi_Kagu</span>
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="pt-6 border-t border-mochi-lavender/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mochi-brown/60">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>หมายเหตุทางวิชาการ:</strong> เว็บไซต์นี้เป็น Frontend-only prototype เพื่อการศึกษา ข้อมูลประกอบด้วยชุดข้อมูลสาธารณะและข้อมูลจำลอง (Simulated)
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-mochi-pink-dark fill-mochi-pink" />
            <span>Soft Japandi Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
