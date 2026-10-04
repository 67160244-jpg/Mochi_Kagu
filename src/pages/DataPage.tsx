import React, { useState, useEffect } from 'react';
import { loadIkeaFilterRules, loadRetailerSummary } from '../data/dataLoader';
import { DataBadge } from '../components/DataBadge';
import { CONFIG } from '../config/fx';
import {
  Database,
  Table as TableIcon,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ExternalLink,
  BookOpen,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const DataPage: React.FC = () => {
  const [filterRules, setFilterRules] = useState<any>(null);
  const [retailerSummary, setRetailerSummary] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const [rules, ret] = await Promise.all([
          loadIkeaFilterRules(),
          loadRetailerSummary(),
        ]);
        setFilterRules(rules);
        setRetailerSummary(ret);
      } catch (err) {
        console.error('Error loading data page info:', err);
      }
    }
    load();
  }, []);

  const sourcesList = [
    {
      name: 'IKEA Furniture (Saudi Arabia)',
      publisher: 'TidyTuesday / Data.World',
      url: 'https://github.com/rfordatascience/tidytuesday/tree/master/data/2020/2020-11-03',
      accessedDate: '05/10/2026',
      type: 'real' as const,
      purpose: 'ใช้เป็น Benchmark โครงสร้างราคาเฟอร์นิเจอร์ ขนาดมิติ พื้นที่จัดวาง (Footprint) และปริมาตร 17 หมวดหมู่',
      note: 'ราคาเป็นสกุลเงินริยาลซาอุฯ (SAR) แปลงเป็นบาทไทยด้วยอัตราสมมติฐาน 9.25 บาท/SAR'
    },
    {
      name: 'World Bank Commodity Price Data (The Pink Sheet)',
      publisher: 'World Bank (ธนาคารโลก)',
      url: 'https://www.worldbank.org/commodities',
      accessedDate: '05/10/2026',
      type: 'real' as const,
      purpose: 'วิเคราะห์ความผันผวนของราคาไม้ (Sawnwood, Logs, Plywood) ย้อนหลังตั้งแต่ปี 1960 ถึง ก.ย. 2026',
      note: 'ใช้ซีรีส์ Sawnwood Malaysian และ Logs Malaysian ในการติดตามราคาไม้แปรรูปในภูมิภาคเอเชีย'
    },
    {
      name: 'รายงานการส่งออกเฟอร์นิเจอร์ไทย (ต.ค. 2567)',
      publisher: 'Bangkok Bank Research (ข้อมูลต้นทาง: กระทรวงพาณิชย์)',
      url: 'data/raw/TH_IR_Manu_Ex_Furniture_1024.pdf',
      accessedDate: '05/10/2026',
      type: 'secondary' as const,
      purpose: 'สะท้อนบริบทศักยภาพฐานการผลิตและมูลค่าการส่งออกเฟอร์นิเจอร์ของประเทศไทย',
      note: 'คีย์ตัวเลขเฉพาะที่ปรากฏเป็นข้อความในรายงาน (ปี พ.ศ. 2567 = ค.ศ. 2024)'
    },
    {
      name: 'รายงานภาวะตลาดที่อยู่อาศัย กทม.-ปริมณฑล',
      publisher: 'ศูนย์ข้อมูลอสังหาริมทรัพย์ ธอส. (REIC) ผ่านรายงานข่าว',
      url: 'https://www.matichon.co.th/?p=210677',
      accessedDate: '05/10/2026',
      type: 'secondary' as const,
      purpose: 'วิเคราะห์แนวโน้มหน่วยเปิดขายใหม่และมูลค่าที่อยู่อาศัยในเขตเมือง (Small-space living trend)',
      note: 'เป็นข้อมูลทุติยภูมิที่อ้างอิงจากสำนักข่าว แนะนำให้ตรวจสอบกับเว็บไซต์ทางการ https://www.reic.or.th'
    },
    {
      name: 'Online Furniture Orders & Delivery (Synthetic)',
      publisher: 'Kaggle (Pratyush Puri)',
      url: 'https://www.kaggle.com/datasets/pratyushpuri/online-furniture-orders-delivery-and-assembly-2025',
      accessedDate: '05/10/2026',
      type: 'simulated' as const,
      purpose: 'สาธิตหน้าจอควบคุมแดชบอร์ดหลังบ้าน (ระยะเวลาจัดส่ง ค่าขนส่ง สัดส่วนช่างติดตั้ง เรตติ้ง)',
      note: 'เป็นชุดข้อมูลสังเคราะห์ (Synthetic) ตัวเลขสถานะจัดส่งมีการแจกแจงแบบสม่ำเสมอ ห้ามนำไปอ้างอิงเป็นข้อเท็จจริง'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <DataBadge type="real" label="ความโปร่งใสของข้อมูล (Data Transparency)" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-mochi-brown-dark tracking-tight">
          แหล่งข้อมูลและคุณภาพข้อมูล (Data Sources & Quality)
        </h1>
        <p className="mt-2 text-sm sm:text-base text-mochi-brown/80 max-w-3xl leading-relaxed">
          รายละเอียดชุดข้อมูลทุกชุดที่ใช้ในโครงงาน Data Dictionary ระเบียบวิธีคำนวณ การคัดกรองข้อมูล และข้อจำกัดในการวิเคราะห์
        </p>
      </div>

      {/* 1. Data Sources Table */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-display font-semibold text-lg text-mochi-brown-dark">
          <Database className="w-5 h-5 text-mochi-wood-dark" />
          <span>1. แหล่งข้อมูลทั้งหมด (Data Sources Inventory)</span>
        </div>

        <div className="mochi-card p-0 overflow-hidden bg-white border-mochi-lavender">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-mochi-lavender-light/70 text-mochi-brown-dark font-display font-semibold border-b border-mochi-lavender">
                <tr>
                  <th className="py-3 px-4">ชุดข้อมูล</th>
                  <th className="py-3 px-4">ผู้จัดทำ / องค์กร</th>
                  <th className="py-3 px-4">สถานะข้อมูล</th>
                  <th className="py-3 px-4">วันที่เข้าถึง</th>
                  <th className="py-3 px-4">บทบาทใน Dashboard</th>
                  <th className="py-3 px-4 text-center">ลิงก์</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mochi-lavender/30">
                {sourcesList.map(src => (
                  <tr key={src.name} className="hover:bg-mochi-cream/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-mochi-brown-dark max-w-[200px]">
                      <div>{src.name}</div>
                      <div className="text-[11px] text-mochi-brown/60 font-normal mt-0.5">{src.note}</div>
                    </td>
                    <td className="py-3.5 px-4 text-mochi-brown/80">{src.publisher}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <DataBadge type={src.type} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-mochi-brown/70">{src.accessedDate}</td>
                    <td className="py-3.5 px-4 text-mochi-brown/80 max-w-xs">{src.purpose}</td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {src.url.startsWith('http') ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-mochi-wood-dark hover:text-mochi-pink-deep p-1 rounded"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-mochi-brown/50 text-[11px]">ไฟล์ใน repo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Data Quality & Missing Value Audit */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-display font-semibold text-lg text-mochi-brown-dark">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <span>2. การตรวจสอบคุณภาพและค่าว่าง (Data Quality Audit)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* IKEA Quality */}
          <div className="mochi-card bg-white border-mochi-lavender">
            <h4 className="font-display font-semibold text-sm text-mochi-brown-dark mb-2">
              ชุดข้อมูล IKEA (3,694 แถว)
            </h4>
            <ul className="text-xs space-y-1.5 text-mochi-brown/80">
              <li>• depth ว่าง: <strong>1,463 แถว</strong></li>
              <li>• height ว่าง: <strong>988 แถว</strong></li>
              <li>• width ว่าง: <strong>589 แถว</strong></li>
              <li>• มีมิติครบ 3 ด้าน: <strong>1,899 แถว</strong></li>
              <li>• ผ่านเกณฑ์เฟอร์นิเจอร์หลัก: <strong>1,734 แถว</strong></li>
              <li className="text-[11px] text-emerald-800 pt-1">
                ✓ ไม่มีเดาค่ามิติที่ขาด (No silent imputation)
              </li>
            </ul>
          </div>

          {/* World Bank Quality */}
          <div className="mochi-card bg-white border-mochi-lavender">
            <h4 className="font-display font-semibold text-sm text-mochi-brown-dark mb-2">
              World Bank Pink Sheet (1960–2026)
            </h4>
            <ul className="text-xs space-y-1.5 text-mochi-brown/80">
              <li>• อักขระ <code>…</code> และ <code>..</code> แปลงเป็น null</li>
              <li>• ตรวจสอบค่าอ้างอิง Sawnwood ก.ย. 2026: <strong>731.3 $/m³ (ตรง 100%)</strong></li>
              <li>• Logs Malaysian ก.ย. 2026: <strong>190.3 $/m³ (ตรง 100%)</strong></li>
              <li>• Plywood ก.ย. 2026: <strong>349.1 ¢/sheet (ตรง 100%)</strong></li>
              <li>• Sawnwood ม.ค. 2020: <strong>712.6 $/m³ (ตรง 100%)</strong></li>
            </ul>
          </div>

          {/* Retailer Synthetic Quality */}
          <div className="mochi-card bg-amber-50/50 border-amber-300">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-display font-semibold text-sm text-amber-950">
                ชุดข้อมูลจำลอง Retailer (1,938 แถว)
              </h4>
              <DataBadge type="simulated" size="sm" />
            </div>
            <ul className="text-xs space-y-1.5 text-amber-900/90">
              <li>• brand ว่าง: <strong>96 แถว</strong></li>
              <li>• shipping_cost ว่าง: <strong>58 แถว</strong></li>
              <li>• assembly_cost ว่าง: <strong>38 แถว</strong></li>
              <li>• customer_rating ว่าง: <strong>280 แถว (คงค่า null)</strong></li>
              <li>• สัดส่วนขอติดตั้ง: <strong>50.62% (981 แถว)</strong></li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Filter Rules for Main Furniture */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-display font-semibold text-lg text-mochi-brown-dark">
          <BookOpen className="w-5 h-5 text-mochi-pink-deep" />
          <span>3. กฎการคัดกรองเฟอร์นิเจอร์หลัก (Main Furniture Filter Rules)</span>
        </div>

        <div className="mochi-card bg-white border-mochi-lavender text-xs space-y-4">
          <p className="text-mochi-brown/80 leading-relaxed">
            ในชุดข้อมูล IKEA มีชิ้นส่วนย่อย เช่น ขาเตียง ลูกบิด ขาตู้ และอุปกรณ์เสริมปะปนอยู่ สคริปต์ <code>scripts/build-data.mjs</code> จึงได้กำหนดกฎเกณฑ์คัดกรอง 3 ขั้นตอน เพื่อให้การคำนวณ Benchmark ราคาต่อลูกบาศก์เมตรมีความน่าเชื่อถือ:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-mochi-sm bg-mochi-lavender-light/60 border border-mochi-lavender/40">
              <span className="font-semibold text-mochi-brown-dark block mb-1">
                กฎข้อที่ 1: มิติครบ 3 ด้าน
              </span>
              <p className="text-mochi-brown/70 leading-relaxed">
                ต้องมีค่า <code>depth &gt; 0</code>, <code>height &gt; 0</code> และ <code>width &gt; 0</code> (ผ่าน 1,899 จาก 3,694 แถว)
              </p>
            </div>

            <div className="p-3.5 rounded-mochi-sm bg-mochi-lavender-light/60 border border-mochi-lavender/40">
              <span className="font-semibold text-mochi-brown-dark block mb-1">
                กฎข้อที่ 2: ราคา ≥ 50 SAR
              </span>
              <p className="text-mochi-brown/70 leading-relaxed">
                ตัดสินค้าราคาต่ำกว่า 50 SAR (ประมาณ 462 บาท) เพื่อคัดแยกอุปกรณ์ชิ้นเล็กและอะไหล่เสริมออกจากการวิเคราะห์
              </p>
            </div>

            <div className="p-3.5 rounded-mochi-sm bg-mochi-lavender-light/60 border border-mochi-lavender/40">
              <span className="font-semibold text-mochi-brown-dark block mb-1">
                กฎข้อที่ 3: Accessory Exclusion
              </span>
              <p className="text-mochi-brown/70 leading-relaxed">
                ตรวจจับคำศัพท์อุปกรณ์เสริม เช่น <em>leg, knob, handle, castor, bracket, basket, hook, connector</em> ในชื่อและคำอธิบาย
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Data Dictionary */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-display font-semibold text-lg text-mochi-brown-dark">
          <TableIcon className="w-5 h-5 text-mochi-wood-dark" />
          <span>4. พจนานุกรมข้อมูล (Data Dictionary: data/processed/)</span>
        </div>

        <div className="mochi-card p-0 overflow-hidden bg-white border-mochi-lavender">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-mochi-lavender-light/70 text-mochi-brown-dark font-display font-semibold border-b border-mochi-lavender">
                <tr>
                  <th className="py-3 px-4">ชื่อฟิลด์</th>
                  <th className="py-3 px-4">ไฟล์ต้นทาง</th>
                  <th className="py-3 px-4">ความหมาย</th>
                  <th className="py-3 px-4">หน่วย</th>
                  <th className="py-3 px-4">ตัวอย่างค่า</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mochi-lavender/30">
                <tr>
                  <td className="py-2.5 px-4 font-mono font-semibold text-mochi-brown-dark">footprint_m2</td>
                  <td className="py-2.5 px-4">ikea_clean.json</td>
                  <td className="py-2.5 px-4">พื้นที่จัดวางบนพื้นห้อง (width × depth / 10,000)</td>
                  <td className="py-2.5 px-4">ตร.ม. (m²)</td>
                  <td className="py-2.5 px-4 font-mono">0.72</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono font-semibold text-mochi-brown-dark">volume_m3</td>
                  <td className="py-2.5 px-4">ikea_clean.json</td>
                  <td className="py-2.5 px-4">ปริมาตรทรงสี่เหลี่ยม (width × depth × height / 1,000,000)</td>
                  <td className="py-2.5 px-4">ลบ.ม. (m³)</td>
                  <td className="py-2.5 px-4 font-mono">0.54</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono font-semibold text-mochi-brown-dark">price_per_m3</td>
                  <td className="py-2.5 px-4">ikea_clean.json</td>
                  <td className="py-2.5 px-4">ราคาต่อปริมาตรลูกบาศก์เมตร (price / volume_m3)</td>
                  <td className="py-2.5 px-4">SAR / m³</td>
                  <td className="py-2.5 px-4 font-mono">1,009.25</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono font-semibold text-mochi-brown-dark">is_main_furniture</td>
                  <td className="py-2.5 px-4">ikea_clean.json</td>
                  <td className="py-2.5 px-4">ธงระบุว่าเป็นเฟอร์นิเจอร์หลักที่ผ่านเกณฑ์กรอง</td>
                  <td className="py-2.5 px-4">boolean</td>
                  <td className="py-2.5 px-4 font-mono">true</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono font-semibold text-mochi-brown-dark">sawnwood_malaysian</td>
                  <td className="py-2.5 px-4">timber_monthly.json</td>
                  <td className="py-2.5 px-4">ราคาไม้แปรรูปเอเชียตะวันออกเฉียงใต้ (Meranti C&F)</td>
                  <td className="py-2.5 px-4">USD / m³</td>
                  <td className="py-2.5 px-4 font-mono">731.3</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono font-semibold text-mochi-brown-dark">plywood_cents_sheet</td>
                  <td className="py-2.5 px-4">timber_monthly.json</td>
                  <td className="py-2.5 px-4">ราคาไม้อัดตลาดโลก (แยกแกน ไม่ผสมกับ $/m³)</td>
                  <td className="py-2.5 px-4">cents / sheet</td>
                  <td className="py-2.5 px-4 font-mono">349.1</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono font-semibold text-mochi-brown-dark">wood_cost_share</td>
                  <td className="py-2.5 px-4">pricing_model.json</td>
                  <td className="py-2.5 px-4">สัดส่วนต้นทุนไม้ในราคาขาย (สมมติฐาน)</td>
                  <td className="py-2.5 px-4">อัตราส่วน (0.0-1.0)</td>
                  <td className="py-2.5 px-4 font-mono">0.25 (25%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
