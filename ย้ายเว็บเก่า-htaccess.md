# ย้ายเว็บเก่ามาเว็บใหม่ (301 redirect)

เว็บเก่า `www.buitincurtains.com` ยังออนไลน์อยู่ ตอนนี้มันแย่งอันดับใน Google
กับเว็บใหม่ด้วยธุรกิจเดียวกัน

**อย่าปิดเว็บเก่าทิ้ง** — ถ้าปิดเฉยๆ คะแนนที่ Google สะสมกับโดเมนนั้นมาหลายปี
จะหายไปทั้งหมด ให้ทำ 301 redirect แทน คะแนนจะโอนมาที่เว็บใหม่

## เว็บเก่าอยู่ที่ไหน

| | |
| --- | --- |
| โฮสต์ | **Z.com** (GMO) — nameserver `ns-a1.cloud.z.com` |
| IP | `118.27.146.15` |
| ระบบ | WordPress บน LiteSpeed + PHP 8.0 |

LiteSpeed อ่านไฟล์ `.htaccess` ได้ จึงตั้ง redirect ได้โดยไม่ต้องแตะ WordPress

## วิธีทำ

1. เข้าแผงควบคุมโฮสต์ของ Z.com → File Manager (หรือต่อ FTP)
2. เปิดโฟลเดอร์ของเว็บ (`public_html` หรือชื่อโดเมน)
3. **สำรองไฟล์ `.htaccess` เดิมไว้ก่อน** — ก๊อบปี้เก็บไว้อีกที่หนึ่ง
4. วางบล็อกข้างล่างนี้ **ไว้บนสุดของไฟล์** เหนือบรรทัด `# BEGIN WordPress`
5. เซฟ แล้วลองเปิด `www.buitincurtains.com` — ต้องเด้งมาเว็บใหม่

> วางไว้บนสุดเท่านั้น ถ้าวางใต้บล็อก WordPress กฎจะไม่ทำงาน

## โค้ดที่ต้องวาง

เปลี่ยน `curtainstoryhome.com` เป็นโดเมนจริงถ้าใช้ชื่ออื่น

```apache
# === ย้ายไปเว็บใหม่ CURTAIN STORY (301 ถาวร) ===
<IfModule mod_rewrite.c>
RewriteEngine On

# หน้าที่จับคู่ได้ตรงตัว — ส่งไปหน้าที่เนื้อหาตรงกัน ไม่โยนทิ้งหน้าแรก
RewriteRule ^aboutus/?$        https://curtainstoryhome.com/about    [R=301,L]
RewriteRule ^contactus/?$      https://curtainstoryhome.com/contact  [R=301,L]
RewriteRule ^services/?$       https://curtainstoryhome.com/services [R=301,L]
RewriteRule ^projects/?$       https://curtainstoryhome.com/portfolio [R=301,L]

# ผลงาน "สราญสิริ ประชาอุทิศ" — เว็บใหม่มีหน้านี้อยู่จริง
RewriteCond %{REQUEST_URI} ^/%E0%B8%AA%E0%B8%A3%E0%B8%B2%E0%B8%8D%E0%B8%AA%E0%B8%B4%E0%B8%A3%E0%B8%B4 [NC]
RewriteRule ^ https://curtainstoryhome.com/portfolio/saransiri-pracha-uthit-91 [R=301,L]

# ผลงานอีกสองงานที่เว็บใหม่ยังไม่มี — ส่งไปหน้ารวมผลงาน
RewriteCond %{REQUEST_URI} ^/%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%94 [NC,OR]
RewriteCond %{REQUEST_URI} ^/%E0%B9%84%E0%B8%97%E0%B8%A1%E0%B9%8C [NC]
RewriteRule ^ https://curtainstoryhome.com/portfolio [R=301,L]

# ที่เหลือทั้งหมดไปหน้าแรก
RewriteRule ^(.*)$ https://curtainstoryhome.com/ [R=301,L]
</IfModule>
# === จบส่วนย้ายเว็บ ===
```

## ตรวจว่าทำถูกไหม

เปิดทีละอันแล้วต้องเด้งไปปลายทางที่เขียนไว้:

- `www.buitincurtains.com` → หน้าแรกเว็บใหม่
- `www.buitincurtains.com/aboutus/` → หน้าเกี่ยวกับเรา
- `www.buitincurtains.com/contactus/` → หน้าติดต่อเรา
- `www.buitincurtains.com/services/` → หน้าบริการ

ถ้าเด้งถูกทุกอัน แปลว่าเสร็จ

## หลังทำเสร็จ

- **ต่ออายุโดเมนเก่าต่อไปอย่างน้อย 1–2 ปี** ปล่อยหมดอายุ = redirect ตายและเสียคะแนนทั้งหมด
- แจ้ง Google Search Console ด้วยเครื่องมือ Change of Address (ต้องยืนยันทั้งสองโดเมนก่อน)
- อย่าลบเนื้อหาเว็บเก่าทิ้งจนกว่า redirect จะทำงานเรียบร้อย
