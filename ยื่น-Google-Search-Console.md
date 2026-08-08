# ยื่นเว็บเข้า Google Search Console

เอกสารนี้คือขั้นตอนสุดท้ายของ SEO — ทำครั้งเดียว ใช้เวลาประมาณ 10 นาที
ทำให้ Google รู้จักโดเมนใหม่ `curtainstoryhome.com` เร็วขึ้น แทนที่จะรอ Google
มาเจอเว็บเองซึ่งอาจช้าเป็นสัปดาห์

ต้องมี: **บัญชี Google ของร้าน** (ใช้บัญชีเดียวกับที่จะทำ Google Business Profile
ในอนาคตได้เลย จะได้จัดการรวมที่เดียว)

---

## ขั้นที่ 1 — เพิ่มเว็บเข้า Search Console

1. เข้า https://search.google.com/search-console แล้วล็อกอินด้วยบัญชี Google ของร้าน
2. เลือกประเภท **"Domain"** (ไม่ใช่ "URL prefix") แล้วพิมพ์ `curtainstoryhome.com`
3. Google จะให้ค่า **TXT record** มาหนึ่งบรรทัด สำหรับใส่ใน DNS ที่ Hostinger

> ถ้าเลือก Domain แล้วยืนยันด้วย DNS ยาก จะเลือก **"URL prefix"** แทนก็ได้
> โดยใช้ `https://www.curtainstoryhome.com` แล้วยืนยันด้วยวิธี **HTML tag** ในขั้นถัดไป
> (ไม่ต้องแตะ DNS เลย — แนะนำวิธีนี้เพราะง่ายกว่า)

---

## ขั้นที่ 2 (แนะนำ) — ยืนยันด้วย HTML tag แทน DNS

1. ในหน้ายืนยัน เลือกแท็บ **"HTML tag"**
2. จะได้โค้ดหน้าตาประมาณนี้ — ก็อบเฉพาะค่าในเครื่องหมายคำพูดของ `content`:
   ```
   <meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXXX" />
   ```
3. ส่งค่า `XXXXXXXXXXXXXXXXXXXXX` นี้ให้ผู้ทำเว็บ (ทางแชทได้ ค่านี้ไม่ใช่รหัสผ่าน
   เป็นแค่โค้ดยืนยันความเป็นเจ้าของ ใครเห็นก็ทำอะไรกับเว็บไม่ได้)
4. ผู้ทำเว็บจะใส่ค่านี้ในตัวแปร `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` ที่
   Vercel ของร้าน แล้ว deploy ใหม่
5. กลับมาที่ Search Console กด **Verify**

---

## ขั้นที่ 3 — ส่ง sitemap ให้ Google เก็บข้อมูล

หลังยืนยันสำเร็จ:

1. เมนูซ้าย **Sitemaps**
2. ช่อง "Add a new sitemap" พิมพ์ `sitemap.xml`
3. กด **Submit**

Google จะทยอยเก็บข้อมูลทั้ง 20 หน้าใน sitemap ภายในไม่กี่วันถึง 2 สัปดาห์

---

## ขั้นที่ 4 — ขอให้ Google รีบมาดูหน้าแรกก่อน (ไม่บังคับ แต่ช่วยได้)

1. เมนูซ้าย **URL Inspection**
2. พิมพ์ `https://www.curtainstoryhome.com`
3. กด **Request Indexing**

ทำแบบนี้ซ้ำกับหน้าสำคัญอีก 2-3 หน้าได้ เช่นหน้าบริการ หรือหน้าผลงานเด่นๆ
(จำกัดจำนวนครั้งต่อวัน อย่าทำรัวๆ)

---

## เช็คว่าสำเร็จ

- หน้า Search Console ไม่มี error สีแดง
- เมนู **Coverage / Pages** เริ่มขึ้นจำนวนหน้าที่ Google เก็บแล้ว (รอ 2-3 วัน)
- ค้นหา `site:curtainstoryhome.com` ใน Google แล้วเริ่มเห็นผลลัพธ์ (รอได้ถึง 1-2 สัปดาห์)

---

## ข้อควรระวัง

- **ห้ามส่งรหัสผ่านบัญชี Google ทางแชท** ส่วนโค้ด `google-site-verification`
  ส่งได้ปกติ ไม่ใช่ข้อมูลอ่อนไหว
- อย่ายืนยันด้วยวิธี **Google Analytics** หรือ **Tag Manager** ถ้ายังไม่มีติดตั้งไว้
  ให้ใช้ HTML tag ตามขั้นที่ 2 เท่านั้น
