# Mochi Kagu — Storytelling Dashboard 🍡

> **Mochi Kagu Storytelling Dashboard** เป็น Frontend-Only Web Application ที่ออกแบบขึ้นเพื่อเล่าเรื่องราวเชิงธุรกิจ (Data Storytelling) ของแบรนด์เฟอร์นิเจอร์สั่งทำพิเศษ **Mochi Kagu** โดยผสานข้อมูลสาธารณะจากองค์กรระดับโลก (World Bank, IKEA Benchmark) ข้อมูลส่งออก และข้อมูลจำลอง (Simulated Mock-up) เพื่อวิเคราะห์ความเป็นไปได้ทางการตลาด โครงสร้างราคา และการบริหารความเสี่ยงจากต้นทุนไม้

---

## 🖼️ 1. ภาพรวมโปรเจกต์ (Project Overview)

### ที่มาและบริบททางวิชาการ
โครงงานนี้เป็นส่วนหนึ่งของรายวิชา **89033267 Data Warehousing Concepts and Design** โดยพัฒนาต่อยอดจากแนวคิดโมเดลธุรกิจในวิชา **89035064 Business Model Creation** 

### เกี่ยวกับ Mochi Kagu (もち家具)
* **ความหมายของแบรนด์:** *Mochi (餅)* หมายถึง ขนมโมจิที่มีความนุ่ม ยืดหยุ่น ปรับเปลี่ยนรูปทรงได้ง่าย ผสานกับ *Kagu (家具)* แปลว่า เฟอร์นิเจอร์ เพื่อสะท้อนถึงจุดยืนด้าน **"ความยืดหยุ่นในการออกแบบให้ลงตัวกับพื้นที่อยู่อาศัยของทุกคน"**
* **คุณค่าหลักที่ส่งมอบ (Value Propositions):**
  1. **ออกแบบเองได้ คุมงบได้จริง:** เห็นราคาสินค้าอัปเดตแบบเรียลไทม์ตามขนาดมิติและวัสดุที่เลือก
  2. **AI Co-Design:** ช่วยร่างแบบ 3D และแปลงความต้องการของลูกค้าออกมาเป็นสเปกพร้อมผลิต
  3. **เห็นภาพชัดเจนก่อนจ่าย:** จำลอง 3D หมุน 360° และจำลองการจัดวางในห้องจริงผ่าน AR
  4. **ครบวงจรในที่เดียว:** ออกแบบ → สั่งผลิตผ่านพันธมิตรช่างไม้ท้องถิ่น → จัดส่ง → ช่างติดตั้งถึงบ้าน

### คำถามหลักของ Dashboard (Core Storytelling Question)
> **"ถ้าลูกค้าอยากได้เฟอร์นิเจอร์ที่พอดีกับห้องเล็ก ราคาควรเป็นเท่าไร และต้นทุนไม้ที่ผันผวนจะกระทบราคานั้นแค่ไหน"**

---

## ✨ 2. ฟีเจอร์หลัก (Key Features)

1. **Scrollytelling 6 บท (หน้า `/`):**
   * **บทที่ 0 (Hero):** คำถามหลัก และ KPI อ้างอิงจากข้อมูลจริง 3 ด้าน
   * **บทที่ 1 (โอกาสในตลาด):** วิเคราะห์มูลค่าส่งออกเฟอร์นิเจอร์ไทย และข้อมูลที่อยู่อาศัย REIC
   * **บทที่ 2 (ความสัมพันธ์ขนาดกับราคา):** กราฟกระจายตัว Footprint (m²) vs ราคา พร้อมสไลเดอร์กรองขนาดห้อง
   * **บทที่ 3 (ความเสี่ยงต้นทุนไม้):** กราฟเส้นราคาไม้แปรรูปและไม้ท่อนจาก World Bank ย้อนหลังถึง ก.ย. 2026 พร้อมแยกแกนไม้อัด (Plywood)
   * **บทที่ 4 (ราคาที่โปร่งใส):** เครื่องมือจำลองราคา Mini Price Lab คำนวณราคาแบบเรียลไทม์ตามขนาดและต้นทุนไม้
   * **บทที่ 5 (หลังบ้านต้องไหว):** แดชบอร์ดจำลองติดตามการจัดส่ง ค่าบริการประกอบ และความพึงพอใจลูกค้า *(ติดป้ายข้อมูลจำลองเด่นชัด)*
   * **บทที่ 6 (บทสรุปเชิงกลยุทธ์):** 3 ข้อเสนอแนะเชิงคุณค่า โครงสร้างต้นทุน และพันธมิตร พร้อมระบุ 5 ข้อจำกัดของแดชบอร์ด
2. **สำรวจข้อมูลเชิงลึก (Data Explorer — `/explorer`):**
   * ค้นหาและกรองสินค้า IKEA กว่า 3,694 ชิ้นตามหมวดหมู่ ขนาด ราคา และนักออกแบบ
   * กรองเฉพาะเฟอร์นิเจอร์หลัก (Main Furniture)
   * ดาวน์โหลดข้อมูลผลการกรองเป็นไฟล์ CSV
3. **ห้องทดลองราคาแบบเต็มรูปแบบ (Price Lab — `/price-lab`):**
   * จำลองราคาปรับตามขนาดห้อง กว้าง × ลึก × สูง
   * เลือกประเภทวัสดุ (ไม้เนื้อแข็ง Solid Hardwood / ไม้อัด Premium Plywood)
   * ปรับสไลเดอร์ความผันผวนของราคาไม้ (-40% ถึง +40%) และสัดส่วนต้นทุนไม้ (Wood Cost Share)
   * แสดงช่วงราคาความไม่แน่นอนตามระดับความประณีต (p25 – p75 IQR)
4. **ความโปร่งใสและพจนานุกรมข้อมูล (Data Quality & Dictionary — `/data`):**
   * ตารางแหล่งข้อมูลระบุแหล่งที่มา วันที่เข้าถึง และสถานะ (จริง / จำลอง / ทุติยภูมิ)
   * รายงานการตรวจนับค่าว่าง (Missing Values Audit) และกฎการคัดกรองเฟอร์นิเจอร์หลัก
   * Data Dictionary อธิบายฟิลด์ที่ผ่านการประมวลผลทุกตัว
5. **ระบบสลับสกุลเงิน (Currency Toggle):**
   * สลับการแสดงผลระหว่าง **บาท (THB)** และ **ริยาลซาอุฯ (SAR)** ได้ทุกจุดของเว็บ

---

## 🛠️ 3. Tech Stack

| เทคโนโลยี | เวอร์ชันติดตั้งจริง | วัตถุประสงค์ในการใช้งาน |
|---|---|---|
| **React** | `^18.3.1` | ไลบรารีหลักสำหรับสร้าง User Interface เชิงคอมโพเนนต์ |
| **TypeScript** | `^5.7.2` | กำหนด Type ป้องกัน Type Error และเพิ่มความน่าเชื่อถือของโค้ด |
| **Vite** | `^5.4.11` | Build Tool และ Local Development Server ประสิทธิภาพสูง |
| **Tailwind CSS** | `^3.4.17` | Utility-First CSS Framework กำหนด Design Tokens และสไตล์ Japandi |
| **React Router** | `^6.28.0` | การจัดการเส้นทางหน้าเว็บแบบ Single Page Application (HashRouter) |
| **Recharts** | `^2.15.0` | ไลบรารีพล็อตกราฟแบบ Responsive (Bar, Line, Scatter, Pie) |
| **Lucide React** | `^0.469.0` | ชุดไอคอน UI สะอาดตา สไตล์โมเดิร์น |
| **XLSX (SheetJS)** | `^0.18.5` | อ่านและประมวลผลไฟล์ World Bank Pink Sheet Excel ใน Data Pipeline |
| **PapaParse** | `^5.4.1` | อ่านและแปลงไฟล์ CSV ขนาดใหญ่ (IKEA, Retailer) |

---

## ✅ 4. สิ่งที่ต้องติดตั้งก่อน (Prerequisites)

* **Node.js:** เวอร์ชัน 18.0.0 หรือใหม่กว่า (แนะนำ Node.js 20+ หรือ 22)
* **npm:** เวอร์ชัน 9.0.0 หรือใหม่กว่า
* **เว็บเบราว์เซอร์:** Google Chrome, Microsoft Edge, Firefox, Safari (รองรับ ES2020+)
* *ไม่ต้องติดตั้ง Database หรือระบบ Backend ใดๆ (Frontend-Only Architecture)*

---

## 🚀 5. วิธีติดตั้งและรันโปรเจกต์ (Installation & Running)

ทำตามขั้นตอนดังต่อไปนี้ใน Terminal / PowerShell:

### ขั้นตอนที่ 1: Clone Repository
```bash
git clone https://github.com/67160244-jpg/Mochi_Kagu.git
cd Mochi_Kagu
```

### ขั้นตอนที่ 2: ติดตั้ง Dependencies
```bash
npm install
```

### ขั้นตอนที่ 3: ประมวลผลข้อมูลดิบ (Data Pipeline)
สคริปต์นี้จะอ่านไฟล์จาก `data/raw/` แล้วสร้างไฟล์ JSON ที่ทำความสะอาดแล้วไว้ที่ `data/processed/` และ `public/data/` พร้อมตรวจสอบความถูกต้องของค่าอ้างอิง:
```bash
npm run build:data
```

### ขั้นตอนที่ 4: เริ่มรัน Local Development Server
```bash
npm run dev
```

### ขั้นตอนที่ 5: เปิดเข้าชมเว็บไซต์
เปิดเบราว์เซอร์แล้วเข้าไปที่:
```
http://localhost:5173/Mochi_Kagu/
```
*(หรือ URL ที่แสดงขึ้นบนหน้าจอ Terminal เช่น `http://localhost:5173/`)*

### การหยุดเซิร์ฟเวอร์
กดปุ่ม `Ctrl + C` ใน Terminal เพื่อหยุดการทำงานของ Vite Dev Server

---

## 🌐 6. วิธี Deploy บน GitHub Pages

โปรเจกต์นี้ตั้งค่า GitHub Actions Workflow ไว้ที่ `.github/workflows/deploy.yml` รองรับการ Deploy อัตโนมัติ:

1. Push โค้ดทั้งหมดขึ้น Branch `main` บน GitHub:
   ```bash
   git add .
   git commit -m "feat: complete storytelling dashboard and documentation"
   git push origin main
   ```
2. บนหน้า GitHub Repository ไปที่เมนู **Settings** → **Pages**
3. ในหัวข้อ **Build and deployment** → **Source** ให้เลือกเป็น **GitHub Actions**
4. ระบบจะทำการรัน Workflow `Deploy to GitHub Pages` โดยอัตโนมัติ
5. เว็บไซต์จะออนไลน์ที่ URL:
   **`https://67160244-jpg.github.io/Mochi_Kagu/`**

---

## 📄 7. หน้าเว็บทั้งหมด (Page Directory)

| URL Route | ชื่อหน้า | คำอธิบายและเนื้อหาสำคัญ |
|---|---|---|
| `#/` | หน้าแรก (Storytelling Dashboard) | เล่าเรื่องราว 6 บทตามลำดับ Scrollytelling, กราฟ Recharts, กล่อง "So What? สำหรับ Mochi Kagu" และ Mini Price Lab |
| `#/explorer` | สำรวจข้อมูล (Data Explorer) | ตารางค้นหา กรอง และเปรียบเทียบเฟอร์นิเจอร์ Benchmark 3,694 ชิ้น พร้อมปุ่มส่งออก CSV |
| `#/price-lab` | ห้องทดลองราคา (Price Lab) | เครื่องมือคำนวณราคาจำลองแบบเรียลไทม์ตามขนาดห้อง ชนิดไม้ และความผันผวนของต้นทุนไม้ |
| `#/data` | แหล่งข้อมูล & คุณภาพ (Data Sources) | คลังข้อมูล ตารางแหล่งที่มา Data Dictionary การตรวจนับค่าว่าง กฎการกรองข้อมูล และข้อจำกัด |
| `#/about` | เกี่ยวกับโปรเจกต์ (About) | แนวคิดแบรนด์ Mochi Kagu, สรุป BMC / SWOT, ข้อมูลผู้จัดทำ และบริบทของรายวิชา |

---

## 📁 8. โครงสร้างโฟลเดอร์ (Project Structure)

```
Mochi_Kagu/
├── .github/
│   └── workflows/
│       └── deploy.yml                   # GitHub Actions workflow สำหรับ deploy ขึ้น GitHub Pages
├── data/
│   ├── raw/                             # ข้อมูลต้นฉบับ ห้ามแก้ไข
│   │   ├── CMO-Historical-Data-Annual.xlsx
│   │   ├── CMO-Historical-Data-Monthly.xlsx
│   │   ├── CMO-Pink-Sheet-October-2026.pdf
│   │   ├── ikea.csv
│   │   ├── online_furniture_retailer.csv
│   │   └── TH_IR_Manu_Ex_Furniture_1024.pdf
│   └── processed/                       # ไฟล์ JSON ผลลัพธ์จากสคริปต์ทำความสะอาดข้อมูล
│       ├── ikea_clean.json
│       ├── ikea_category_summary.json
│       ├── ikea_filter_rules.json
│       ├── pricing_model.json
│       ├── reic_housing_manual.json
│       ├── retailer_clean.json
│       ├── thai_furniture_export_manual.json
│       ├── timber_annual.json
│       └── timber_monthly.json
├── docs/
│   ├── Mochi_Kagu_Business_Idea.pdf     # เอกสาร BMC / Brand Idea (ถ้ามี)
│   └── screenshots/                     # โฟลเดอร์สำหรับวางภาพถ่ายหน้าจอ Dashboard
├── public/
│   ├── 404.html                         # SPA routing fallback สำหรับ GitHub Pages
│   ├── brand/
│   │   └── logo.svg                     # โลโก้แบรนด์จำลอง Mochi Kagu
│   ├── fonts/                           # สำหรับวางไฟล์ฟอนต์ Biski (ถ้ามี)
│   └── data/                            # สำเนาไฟล์ processed JSON สำหรับให้เว็บโหลดแบบ Static
├── scripts/
│   └── build-data.mjs                   # สคริปต์ Node.js ทำความสะอาดและตรวจสอบข้อมูล (Idempotent)
├── src/
│   ├── components/
│   │   ├── ChapterSection.tsx           # คอมโพเนนต์บทเล่าเรื่อง พร้อมกล่อง So What?
│   │   ├── ChartCard.tsx                # การ์ดกราฟ Responsive มี Scroll ในตัว และระบุที่มา
│   │   ├── CuteDoodles.tsx              # รูปทรงตกแต่ง SVG สไตล์ Japandi
│   │   ├── DataBadge.tsx                # ป้ายจำแนกประเภทข้อมูล (จริง / จำลอง / ทุติยภูมิ)
│   │   ├── Footer.tsx                   # ส่วนท้ายเว็บไซต์ พร้อมเครดิตและคำเตือนทางวิชาการ
│   │   ├── FxToggle.tsx                 # สวิตช์สลับสกุลเงิน THB / SAR
│   │   ├── KpiCard.tsx                  # การ์ดแสดงผลตัวเลขสถิติสำคัญ
│   │   └── Navbar.tsx                   # เมนูนำทางด้านบนแบบ Responsive
│   ├── config/
│   │   └── fx.ts                        # รวมค่าคงที่อัตราแลกเปลี่ยนและสมมติฐานการเงิน
│   ├── data/
│   │   ├── dataLoader.ts                # ฟังก์ชันโหลดไฟล์ JSON พร้อมแคชและรองรับ Base URL
│   │   └── types.ts                     # TypeScript Interfaces ของชุดข้อมูลทั้งหมด
│   ├── pages/
│   │   ├── AboutPage.tsx                # หน้าข้อมูลธุรกิจและทีมผู้จัดทำ
│   │   ├── DataPage.tsx                 # หน้าแหล่งข้อมูล Data Dictionary และการตรวจสอบคุณภาพ
│   │   ├── ExplorerPage.tsx             # หน้าค้นหาและกรองข้อมูล Benchmark
│   │   ├── PriceLabPage.tsx             # หน้าห้องทดลองจำลองราคา
│   │   └── StoryPage.tsx                # หน้าเล่าเรื่องหลัก 6 บท (Scrollytelling)
│   ├── App.tsx                          # Router หลักและการจัดการ State สกุลเงิน
│   ├── index.css                        # Tailwind CSS และการตั้งค่า Japandi Design System
│   ├── main.tsx                         # จุดเริ่มต้นของ React App
│   └── vite-env.d.ts                    # Vite client types declaration
├── index.html                           # หน้าเว็บหลัก กำหนด Google Fonts (Prompt, Mitr)
├── package.json                         # กำหนด Dependencies และ Scripts
├── postcss.config.js                    # การตั้งค่า PostCSS
├── tailwind.config.js                   # การตั้งค่า Custom Tokens สีและฟอนต์
├── tsconfig.json                        # การตั้งค่า TypeScript Compiler
└── vite.config.ts                       # การตั้งค่า Vite (base: '/Mochi_Kagu/')
```

---

## 📊 9. แหล่งข้อมูลที่ใช้ (Data Sources)

| ชุดข้อมูล | ผู้จัดทำ | แหล่งที่มา / ลิงก์ | วันที่เข้าถึง | สถานะข้อมูล | วัตถุประสงค์ในการใช้งาน |
|---|---|---|---|---|---|
| **IKEA Furniture** | TidyTuesday / Data.World | [GitHub TidyTuesday](https://github.com/rfordatascience/tidytuesday/tree/master/data/2020/2020-11-03) | 05/10/2026 | **ข้อมูลจริง (Real Data)** | ข้อมูลราคา ขนาด 3 มิติ พื้นที่จัดวาง และปริมาตร 17 หมวดหมู่ สำหรับใช้เป็นเกณฑ์เปรียบเทียบตลาด (Benchmark) |
| **World Bank Pink Sheet** | World Bank | [World Bank Commodities](https://www.worldbank.org/commodities) | 05/10/2026 | **ข้อมูลจริง (Real Data)** | ราคาสินค้าโภคภัณฑ์หมวดไม้ (Sawnwood, Logs, Plywood) ย้อนหลังตั้งแต่ปี 1960 ถึง ก.ย. 2026 เพื่อวิเคราะห์ความเสี่ยงต้นทุน |
| **ส่งออกเฟอร์นิเจอร์ไทย** | กระทรวงพาณิชย์ / Bangkok Bank Research | ไฟล์บทวิเคราะห์ `data/raw/TH_IR_Manu_Ex_Furniture_1024.pdf` | 05/10/2026 | **ข้อมูลทุติยภูมิ (Secondary)** | มูลค่าการส่งออกย้อนหลังและตลาดส่งออกสำคัญ สะท้อนศักยภาพของอุตสาหกรรมช่างไม้ในประเทศ (ข้อมูลถึง ต.ค. 2567) |
| **ที่อยู่อาศัย กทม.-ปริมณฑล** | ศูนย์ข้อมูลอสังหาริมทรัพย์ (REIC) ผ่านสื่อมวลชน | [มติชนออนไลน์](https://www.matichon.co.th/?p=210677) และ [กรุงเทพธุรกิจ](https://www.bangkokbiznews.com/property/1211555) | 05/10/2026 | **ข้อมูลทุติยภูมิ (ข่าว)** | จำนวนหน่วยเปิดขายใหม่และมูลค่าที่อยู่อาศัย สะท้อนความต้องการเฟอร์นิเจอร์สำหรับพื้นที่ขนาดกะทัดรัด |
| **Online Furniture Orders** | Pratyush Puri (Kaggle) | [Kaggle Dataset](https://www.kaggle.com/datasets/pratyushpuri/online-furniture-orders-delivery-and-assembly-2025) | 05/10/2026 | **ข้อมูลจำลอง (Simulated)** | จำลองรูปแบบแดชบอร์ดหลังบ้าน (สัดส่วนสถานะการจัดส่ง ระยะเวลาขนส่ง บริการช่างติดตั้ง และเรตติ้งรีวิว) |

---

## 📚 10. พจนานุกรมข้อมูล (Data Dictionary: data/processed/)

| ชื่อคอลัมน์ / ฟิลด์ | ประเภทข้อมูล | คำอธิบายความหมาย | หน่วย | ตัวอย่างค่า |
|---|---|---|---|---|
| `item_id` | string | รหัสประจำตัวสินค้าของ IKEA | - | `"90420332"` |
| `name` | string | ชื่อรุ่นสินค้า | - | `"FREKVENS"` |
| `category` | string | หมวดหมู่เฟอร์นิเจอร์ (17 หมวด) | - | `"Tables & desks"` |
| `price` | number | ราคาขายสินค้าต้นฉบับ | SAR | `265.0` |
| `footprint_m2` | number | พื้นที่จัดวางบนพื้นห้อง คำนวณจาก `(width × depth) / 10,000` | ตารางเมตร (m²) | `0.72` |
| `volume_m3` | number | ปริมาตรทรงสี่เหลี่ยม คำนวณจาก `(width × depth × height) / 1,000,000` | ลูกบาศก์เมตร (m³) | `0.54` |
| `price_per_m3` | number | ราคาต่อลูกบาศก์เมตร คำนวณจาก `price / volume_m3` | SAR / m³ | `1,009.25` |
| `is_main_furniture` | boolean | ธงระบุว่าเป็นเฟอร์นิเจอร์หลัก (ผ่านเกณฑ์กรองทั้ง 3 ข้อ) | boolean | `true` |
| `sawnwood_malaysian` | number | ราคาไม้แปรรูปเอเชียตะวันออกเฉียงใต้ (Sawnwood S.E. Asia) | USD / m³ | `731.3` |
| `logs_malaysian` | number | ราคาไม้ท่อนเอเชียตะวันออกเฉียงใต้ (Logs S.E. Asia) | USD / m³ | `190.3` |
| `plywood_cents_sheet`| number | ราคาไม้อัดในตลาดโลก | Cents / Sheet | `349.1` |
| `sawnwood_yoy_pct` | number | อัตราการเปลี่ยนแปลงราคาไม้แปรรูปเทียบกับ 12 เดือนก่อน | % | `+1.8` |
| `wood_cost_share` | number | สัดส่วนต้นทุนไม้ในราคาขายเฟอร์นิเจอร์ (ค่าเริ่มต้นสมมติฐาน 25%) | สัดส่วน (0.0–1.0) | `0.25` |

---

## 🧮 11. ระเบียบวิธีคำนวณและสมมติฐาน (Methodology & Assumptions)

### 1. กฎการกรองเฟอร์นิเจอร์หลัก (Main Furniture Filter Rules)
เพื่อไม่ให้อุปกรณ์ชิ้นเล็ก เช่น ขาเตียง สกรู ลูกบิด และชิ้นส่วนเสริม บิดเบือนการวิเคราะห์ราคาต่อลูกบาศก์เมตร สคริปต์ได้ใช้กฎ 3 ข้อ:
1. **มิติครบ 3 ด้าน:** ค่า `depth > 0`, `height > 0` และ `width > 0` (มี 1,899 จาก 3,694 ชิ้น)
2. **ราคาขั้นต่ำ:** `price >= 50 SAR` (ตัดสินค้าชิ้นเล็กราคาต่ำ)
3. **คัดแยกอุปกรณ์เสริม (Keyword Exclusion):** ตรวจจับคำว่า *leg, legs, knob, handle, castor, bracket, basket, hook, connector, shelf support* ในชื่อและคำอธิบายสินค้า
* **ผลลัพธ์:** ได้เฟอร์นิเจอร์หลักจำนวน **1,734 ชิ้น** นำไปคำนวณ Median Benchmark

### 2. สูตรการคำนวณเชิงสถิติและมิติ
* **พื้นที่จัดวาง (Footprint):** $\text{Footprint (m}^2\text{)} = \frac{\text{Width (cm)} \times \text{Depth (cm)}}{10,000}$
* **ปริมาตร (Volume):** $\text{Volume (m}^3\text{)} = \frac{\text{Width (cm)} \times \text{Depth (cm)} \times \text{Height (cm)}}{1,000,000}$
* **ราคาต่อปริมาตร:** $\text{Price per m}^3 = \frac{\text{Price}}{\text{Volume (m}^3\text{)}}$
* **การวัดแนวโน้มเข้าสู่ส่วนกลาง:** ใช้ค่า **มัธยฐาน (Median)** และค่าควอร์ไทล์ (p25, p75) แทนค่าเฉลี่ย เนื่องจากข้อมูลราคามีลักษณะเบ้ขวา (Skewed Right) อย่างมาก (ราคาสูงสุด 9,585 SAR ขณะที่ Median อยู่ที่ 545 SAR)

### 3. การคำนวณความผันผวนของราคาไม้ (World Bank Pink Sheet)
* **การเปลี่ยนแปลงรายปี (YoY %):** $\text{YoY} = \left(\frac{P_t - P_{t-12}}{P_{t-12}}\right) \times 100$
* **ความผันผวนเคลื่อนที่ 12 เดือน (Rolling 12M Volatility):** คำนวณจากส่วนเบี่ยงเบนมาตรฐาน (Sample Standard Deviation) ของเปอร์เซ็นต์การเปลี่ยนแปลงแบบเดือนต่อเดือน (MoM) ในช่วง 12 เดือนล่าสุด
* **การแยกแกนไม้อัด (Plywood):** ซีรีส์ Plywood มีหน่วยเป็น *cents/sheet* (เซนต์ต่อแผ่น) จึงแยกกราฟไม่นำไปรวมบนแกนเดียวกับราคาไม้แปรรูปซึ่งมีหน่วยเป็น *USD/m³*

### 4. โมเดลการประมาณราคาใน Price Lab
* **ราคาฐาน (Base Price):** $\text{Base Price} = \text{Volume (m}^3\text{)} \times \text{Median(Price per m}^3\text{ ของหมวดนั้น)}$
* **การปรับตามราคาไม้:** $\text{Adjusted Price} = \text{Base Price} \times \left(1 + \text{Wood Cost Share} \times \frac{\Delta\text{Timber \%}}{100}\right)$
* **ช่วงความไม่แน่นอน:** คำนวณจากช่วงควอร์ไทล์ $\left[\text{Volume} \times \text{p25}, \text{Volume} \times \text{p75}\right]$
* **สมมติฐานการเงินที่กำหนด:**
  * อัตราแลกเปลี่ยน `SAR_TO_THB = 9.25` บาท (กำหนด ณ วันที่ 5 ตุลาคม 2569 ในไฟล์ `src/config/fx.ts`)
  * สัดส่วนต้นทุนไม้ `DEFAULT_WOOD_COST_SHARE = 0.25` (25% เป็นสมมติฐานโครงสร้างต้นทุนของผู้ผลิต)

---

## ⚠️ 12. ข้อจำกัดและข้อควรระวัง (Limitations & Disclaimers)

1. **ข้อมูล IKEA เป็นของสาขาซาอุดีอาระเบีย ปี 2020:** พฤติกรรมการตั้งราคา กำลังซื้อ และค่าเงิน SAR อาจมีความคลาดเคลื่อนจากตลาดเฟอร์นิเจอร์ในประเทศไทย
2. **ข้อมูลคำสั่งซื้อ Retailer เป็นข้อมูลสังเคราะห์ (Synthetic Dataset):** การแจกแจงสถานะจัดส่งใกล้เคียงกันทุกสถานะ จึงนำมาใช้เพื่อสาธิตแนวคิดการออกแบบ UI หลังบ้านเท่านั้น ไม่สามารถใช้เป็นข้อเท็จจริงของอุตสาหกรรมขนส่งได้
3. **ข้อมูลส่งออกเฟอร์นิเจอร์ไทยสิ้นสุด ณ เดือนตุลาคม 2567:** ยังไม่มีข้อมูลสรุปรายปีของปี 2568–2569 จึงเป็นตัวเลขสะท้อนบริบทในอดีต
4. **ข้อมูล REIC เป็นข้อมูลทุติยภูมิจากรายงานข่าว:** ไม่ใช่ไฟล์สถิติต้นทางจากระบบ REIC แนะนำให้อ้างอิงรายงานฉบับเต็มของธนาคารอาคารสงเคราะห์เพื่อความแม่นยำ
5. **ราคาจำลองใน Price Lab เป็นการประมาณการ:** เป็นเพียงการจำลองเพื่อสาธิตแนวคิด ไม่ใช่ราคาจำหน่ายจริงของแบรนด์ Mochi Kagu

---

## 🎨 13. ระบบการออกแบบ (Design System: Soft & Playful Japandi)

### แนวคิดหลัก
ผสมผสานความอบอุ่น เรียบง่ายแบบ **Japandi (Japanese + Scandinavian)** เข้ากับความน่ารัก นุ่มนวลแบบขนมโมจิ โดยเน้นรูปทรงโค้งมน ไม่ใช้มุมฉาก และเว้นพื้นที่ว่างให้สายตาได้พัก

### ตารางรหัสสี (Color Tokens)

| Token | Hex Code | ความหมายและการใช้งาน |
|---|---|---|
| `mochi-pink` | `#F3B8C9` | สีเน้นหลัก ใช้เฉพาะจุดสำคัญ เช่น ปุ่ม CTA, ไฮไลต์ข้อมูลสำคัญ |
| `mochi-wood` | `#C79B6E` | สีโทนไม้อบอุ่น ใช้สำหรับแท่งกราฟวัสดุไม้ ไอคอน และปุ่มทางเลือก |
| `mochi-lavender` | `#D9CBE8` | สีพื้นหลังการ์ด ขอบเส้น และสวิตช์ |
| `mochi-lavender-light` | `#EEE6F5` | สีพื้นหลังรอง ส่วนคั่นหน้า และแถบเลื่อน |
| `mochi-brown` | `#593432` | สีข้อความหลัก หัวข้อ และเนื้อหาทั้งหมด (ให้ Contrast ผ่านเกณฑ์ WCAG AA) |
| `mochi-cream` | `#FCF9F5` | สีพื้นหลังของทั้งเว็บไซต์ อบอุ่น นุ่มนวล สบายตา |

### ฟอนต์และตัวอักษร
* **หัวข้อ (Heading):** กำหนดฟอนต์ **Biski** โดยมี Google Fonts **Mitr** เป็น Fallback
* **เนื้อหาและตัวเลข (Body & Numbers):** ใช้ Google Fonts **Prompt** เพื่อให้อ่านภาษาไทยและตัวเลขได้ชัดเจน ไม่มีปัญหาสระลอยหรือวรรณยุกต์เพี้ยน
* **มุมโค้งมน:** ทุกคอมโพเนนต์ใช้มุมโค้งขนาด **16–20px** (`rounded-mochi` / `rounded-2xl`)

---

## 📝 14. หมายเหตุสำหรับผู้ใช้งาน (User Notes)

* **ภาพหน้าจอ (Screenshots):** โฟลเดอร์ `docs/screenshots/` ได้จัดเตรียมไว้สำหรับให้ผู้ใช้วางภาพหน้าจอผลลัพธ์หลังรันเว็บไซต์บนเครื่องของตนเอง
* **ไฟล์ฟอนต์ Biski:** หากต้องการใช้ฟอนต์ Biski ของแบรนด์ ให้นำไฟล์ฟอนต์ไปวางไว้ที่ `public/fonts/Biski.woff2` (หรือ `.woff`, `.ttf`) โดยระบบจะโหลดใช้งานทันทีผ่าน `@font-face`
* **โลโก้แบรนด์:** มีไฟล์ SVG จำลองอยู่ที่ `public/brand/logo.svg` ผู้ใช้สามารถนำไฟล์ภาพโลโก้ทางการมาวางทับที่ `public/brand/logo.png` ได้

---

## 👩‍💻 15. ผู้พัฒนา / ข้อมูลกลุ่ม (Developer)

| รหัสนักศึกษา | ชื่อ-นามสกุล | สาขาวิชา / คณะ | บทบาทหน้าที่ |
|---|---|---|---|
| **67160244** | **นางสาวเอมิกา อยู่พันธ์** | วิทยาการคอมพิวเตอร์ / เทคโนโลยีสารสนเทศ | ออกแบบ Data Pipeline, พัฒนา Front-end Application, Data Storytelling และจัดทำเอกสาร |

---

## 🙏 16. เครดิตและสัญญาอนุญาต (Credits & Licenses)

* **World Bank Group:** ข้อมูลราคาสินค้าโภคภัณฑ์ The Pink Sheet เผยแพร่ภายใต้สัญญาอนุญาตเปิดของธนาคารโลก (World Bank Open Data Terms of Use)
* **TidyTuesday / R for Data Science:** ชุดข้อมูล IKEA Furniture เผยแพร่เพื่อการศึกษา
* **Kaggle (Pratyush Puri):** ชุดข้อมูล Online Furniture Orders เผยแพร่เพื่อการเรียนรู้และวิเคราะห์ข้อมูล
* **Bangkok Bank Research:** รายงานแนวโน้มธุรกิจและอุตสาหกรรมส่งออกเฟอร์นิเจอร์ไทย
* **REIC ธอส.:** ศูนย์ข้อมูลอสังหาริมทรัพย์ ธนาคารอาคารสงเคราะห์

---
*จัดทำขึ้นสำหรับการนำเสนอผลงานวิชา 89033267 Data Warehousing Concepts and Design — ปีการศึกษา 2569*
