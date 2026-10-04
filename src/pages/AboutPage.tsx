import React from 'react';
import { CONFIG } from '../config/fx';
import {
  Sparkles,
  Compass,
  GraduationCap,
  Users,
  ShieldAlert,
  Github,
  CheckCircle,
  TreePine,
  Cpu,
  Truck,
  Palette,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mochi-pink text-mochi-brown-dark text-xs font-semibold mb-2">
          <span>🍡</span>
          <span>โมเดลธุรกิจและทีมงาน</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-mochi-brown-dark tracking-tight">
          เกี่ยวกับ Mochi Kagu (โมจิ คากุ)
        </h1>
        <p className="mt-2 text-sm sm:text-base text-mochi-brown/80 max-w-2xl leading-relaxed">
          โครงงานออกแบบแดชบอร์ดเชิงเล่าเรื่อง (Storytelling Dashboard) เพื่อนำเสนอความยั่งยืนทางการเงินและความเป็นไปได้ของธุรกิจเฟอร์นิเจอร์สั่งทำพิเศษ
        </p>
      </div>

      {/* Brand Concept & Value Propositions */}
      <section className="space-y-6">
        <div className="mochi-card bg-gradient-to-br from-white via-mochi-cream to-mochi-lavender-light/50 border-mochi-lavender">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-3xl">🍡</span>
            <div>
              <h2 className="text-xl font-display font-bold text-mochi-brown-dark">
                ที่มาของชื่อแบรนด์: Mochi Kagu (もち家具)
              </h2>
              <span className="text-xs text-mochi-wood-dark">
                Mochi (ขนมโมจิที่นุ่ม ยืดหยุ่น ปรับรูปทรงได้) + Kagu (家具 = เฟอร์นิเจอร์)
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-mochi-brown/85 leading-relaxed">
            Mochi Kagu สื่อถึง <strong>"ความยืดหยุ่นในการออกแบบ"</strong> ที่ตอบโจทย์การอยู่อาศัยในพื้นที่จำกัด (Small-space Living) ของคนเมือง โดยผสานเทคโนโลยี AI Co-Design ช่วยออกแบบร่วมกับลูกค้า และเรนเดอร์แบบจำลอง 3D/AR ให้เห็นภาพชัดเจนและทราบราคาเรียลไทม์ก่อนตัดสินใจผลิต
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-mochi bg-white border border-mochi-lavender/50 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 text-mochi-pink-deep font-display font-semibold text-sm">
              <Palette className="w-4 h-4" />
              <span>1. ออกแบบเองได้ คุมงบได้จริง</span>
            </div>
            <p className="text-xs text-mochi-brown/70 leading-relaxed">
              เห็นราคาขยับแบบเรียลไทม์ตามขนาดและชนิดวัสดุที่เลือก ไม่ต้องกังวลปัญหางบบานปลาย
            </p>
          </div>

          <div className="p-4 rounded-mochi bg-white border border-mochi-lavender/50 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 text-mochi-wood-dark font-display font-semibold text-sm">
              <Cpu className="w-4 h-4" />
              <span>2. AI Co-Design อัจฉริยะ</span>
            </div>
            <p className="text-xs text-mochi-brown/70 leading-relaxed">
              พิมพ์โจทย์หรืออัปโหลดรูปห้อง AI จะช่วยเจนแบบ 3D ที่เข้ากับสัดส่วนห้องพร้อมสเปกการผลิต
            </p>
          </div>

          <div className="p-4 rounded-mochi bg-white border border-mochi-lavender/50 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 text-mochi-lavender-deep font-display font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>3. เห็นภาพชัดก่อนจ่าย (3D & AR)</span>
            </div>
            <p className="text-xs text-mochi-brown/70 leading-relaxed">
              จำลอง 3D หมุนได้ 360 องศา และทดลองวางผ่านกล้อง AR ในพื้นที่จริงเพื่อความมั่นใจ 100%
            </p>
          </div>

          <div className="p-4 rounded-mochi bg-white border border-mochi-lavender/50 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-800 font-display font-semibold text-sm">
              <Truck className="w-4 h-4" />
              <span>4. ครบจบในที่เดียว (End-to-End)</span>
            </div>
            <p className="text-xs text-mochi-brown/70 leading-relaxed">
              ส่งสเปกตรงสู่เครือข่ายโรงงาน OEM/ช่างไม้ จัดส่ง และมีช่างติดตั้งให้บริการถึงบ้าน
            </p>
          </div>
        </div>
      </section>

      {/* Business Model Canvas Summary */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-display font-semibold text-lg text-mochi-brown-dark">
          <Compass className="w-5 h-5 text-mochi-wood-dark" />
          <span>สรุป Business Model Canvas (BMC) & การวิเคราะห์ SWOT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="mochi-card bg-white border-mochi-lavender space-y-2">
            <h4 className="font-display font-semibold text-sm text-mochi-brown-dark">
              กลุ่มลูกค้าเป้าหมาย (Customer Segments)
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-mochi-brown/80">
              <li>เจ้าของบ้าน/คอนโดใหม่ที่มีพื้นที่จำกัด (Small-space Living)</li>
              <li>ผู้ที่ต้องการเฟอร์นิเจอร์สั่งทำแบบ Custom แต่ต้องการคุมงบประมาณ</li>
              <li>มัณฑนากรและนักออกแบบอิสระ (Freelance Interior Designers)</li>
              <li>เจ้าของธุรกิจขนาดย่อม (SME) คาเฟ่ ร้านอาหาร และ Co-working Space</li>
            </ul>
          </div>

          <div className="mochi-card bg-white border-mochi-lavender space-y-2">
            <h4 className="font-display font-semibold text-sm text-mochi-brown-dark">
              พันธมิตรหลัก (Key Partners)
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-mochi-brown/80">
              <li>โรงงานผลิต OEM และกลุ่มช่างไม้ฝีมือท้องถิ่นในประเทศ</li>
              <li>ซัพพลายเออร์วัตถุดิบ (ไม้แปรรูป ไม้อัด หินอ่อน ผ้า และอุปกรณ์ฟิตติ้ง)</li>
              <li>ผู้ให้บริการขนส่งและทีมช่างติดตั้งเฟอร์นิเจอร์มืออาชีพ</li>
              <li>ผู้ให้บริการ Cloud และระบบประมวลผล AI Compute</li>
            </ul>
          </div>

          <div className="mochi-card bg-white border-mochi-lavender space-y-2">
            <h4 className="font-display font-semibold text-sm text-mochi-brown-dark">
              โครงสร้างต้นทุน (Cost Structure)
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-mochi-brown/80">
              <li>ต้นทุนวัตถุดิบไม้และอุปกรณ์ฟิตติ้ง (ผันผวนตามตลาดโลก)</li>
              <li>ค่าจ้างผลิต OEM และค่าแรงช่างไม้ประกอบ</li>
              <li>ค่าขนส่งและบริการติดตั้งถึงบ้าน</li>
              <li>ค่าประมวลผลเซิร์ฟเวอร์ Cloud และ AI โมเดล</li>
            </ul>
          </div>

          <div className="mochi-card bg-white border-mochi-lavender space-y-2">
            <h4 className="font-display font-semibold text-sm text-mochi-brown-dark">
              ความเสี่ยงและโอกาส (Threats & Opportunities)
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-mochi-brown/80">
              <li><strong>Threat:</strong> ราคาไม้ผันผวนกระทบต่อ Margin, คู่แข่งรายใหญ่ เช่น IKEA</li>
              <li><strong>Threat:</strong> ความเชื่อมั่นของลูกค้าต่อแบบ 3D/AR และความล่าช้าของ Supply Chain</li>
              <li><strong>Opportunity:</strong> ตลาดคอนโดเมืองมีพื้นที่เล็กลง และดีมานด์ Custom furniture เติบโต</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Developer Information Card */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-display font-semibold text-lg text-mochi-brown-dark">
          <Users className="w-5 h-5 text-mochi-pink-deep" />
          <span>ข้อมูลผู้จัดทำและบริบทรายวิชา</span>
        </div>

        <div className="mochi-card bg-gradient-to-r from-mochi-lavender-light/70 via-white to-mochi-pink-light/40 border-mochi-lavender p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-mochi-wood-dark uppercase tracking-wider">
                ผู้พัฒนาโครงงาน (Developer)
              </div>
              <div className="text-xl font-display font-bold text-mochi-brown-dark">
                {CONFIG.DEVELOPER_NAME}
              </div>
              <div className="text-sm text-mochi-brown/80">
                รหัสนักศึกษา: <span className="font-mono font-semibold">{CONFIG.STUDENT_ID}</span>
              </div>
            </div>

            <div className="p-4 rounded-mochi bg-white/90 border border-mochi-lavender text-xs space-y-1.5 shrink-0 max-w-xs">
              <div className="flex items-center gap-1.5 font-semibold text-mochi-brown-dark">
                <GraduationCap className="w-4 h-4 text-mochi-wood-dark" />
                <span>รายวิชาที่ส่งงาน</span>
              </div>
              <div className="text-mochi-brown/80">{CONFIG.COURSE_NAME}</div>
              <div className="text-mochi-brown/60 text-[11px] pt-1 border-t border-mochi-lavender/40">
                พัฒนาต่อยอดจาก {CONFIG.PARENT_COURSE}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
