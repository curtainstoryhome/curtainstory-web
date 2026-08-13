#!/usr/bin/env sh
# Checks the 301 redirect from the old site after the .htaccess block from
# ย้ายเว็บเก่า-htaccess.md has been pasted on the Z.com host.
#
# Run: sh scripts/check-301.sh
#
# Passing means three things at once: the old URL answers 301 (not 302, which
# passes no ranking on), it lands on the www host (so there is no second hop),
# and the destination it names is a page that actually exists.

OLD="https://www.buitincurtains.com"
NEW="https://www.curtainstoryhome.com"
fail=0

check() {
  path="$1"
  want="$2"
  code=$(curl -s -o /dev/null -w '%{http_code}' "$OLD$path")
  loc=$(curl -s -o /dev/null -w '%{redirect_url}' "$OLD$path")

  if [ "$code" != "301" ]; then
    printf '  [ยังไม่ได้ตั้ง] %-16s ตอบ %s (ต้องเป็น 301)\n' "$path" "$code"
    fail=1
    return
  fi
  if [ "$loc" != "$want" ]; then
    printf '  [ปลายทางผิด]  %-16s -> %s\n                 ควรเป็น %s\n' "$path" "$loc" "$want"
    fail=1
    return
  fi
  # A redirect that points at a dead page loses the visitor anyway.
  dest=$(curl -s -o /dev/null -w '%{http_code}' "$loc")
  if [ "$dest" != "200" ]; then
    printf '  [ปลายทางเสีย] %-16s -> %s ตอบ %s\n' "$path" "$loc" "$dest"
    fail=1
    return
  fi
  printf '  [ผ่าน]        %-16s -> %s\n' "$path" "$loc"
}

echo "ตรวจ 301 จากเว็บเก่า -> เว็บใหม่"
echo ""
check "/"           "$NEW/"
check "/aboutus/"   "$NEW/about"
check "/contactus/" "$NEW/contact"
check "/services/"  "$NEW/services"

echo ""
if [ "$fail" -eq 0 ]; then
  echo "เรียบร้อย — เด้งครบทุกหน้า ครั้งเดียวถึงปลายทาง และปลายทางเปิดได้จริง"
else
  echo "ยังไม่ผ่าน — ดูวิธีวางโค้ดในไฟล์ ย้ายเว็บเก่า-htaccess.md"
  echo "(ถ้าเพิ่งวางโค้ดเสร็จ รอสัก 1-2 นาทีแล้วรันใหม่)"
fi
exit "$fail"
