-- Adds the ศุภาลัย เวลลิงตัน project and two more ฉากกั้นห้อง photos.
--
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- The site writes as the logged-in admin, so RLS blocks these inserts from
-- anywhere else; the SQL Editor runs as the database owner and is the one
-- place this can be done without an admin session.
--
-- The image files themselves are already committed under public/images and
-- deployed, so the paths below resolve the moment these rows land.
--
-- service_slugs is copied off an existing curtain project rather than written
-- out as a literal, so this works whether the column is text[] or jsonb.

begin;

with new_project as (
  insert into projects (slug, title, description, video_url, service_slugs, sort_order)
  values (
    'supalai-wellington',
    'คอนโด ศุภาลัย เวลลิงตัน',
    'ม่านจีบคู่ผ้าโปร่งและผ้าทึบเต็มผนังกระจก โทนครีม-เบจ เข้ากับงานไม้สีอ่อนและบิลท์อินสีเข้มของห้อง เปิดรับแสงและวิวได้เต็มที่ ปิดแล้วเป็นส่วนตัวและกันแสงได้จริง',
    '',
    (select service_slugs from projects where slug = 'baan-khun-packy'),
    9
  )
  returning id
)
insert into project_images (project_id, image_url, sort_order)
select new_project.id, img.url, img.ord
from new_project,
  (values
    ('/images/proj-supalai-wellington-1.jpg', 1),
    ('/images/proj-supalai-wellington-2.jpg', 2),
    ('/images/proj-supalai-wellington-3.jpg', 3),
    ('/images/proj-supalai-wellington-4.jpg', 4),
    ('/images/proj-supalai-wellington-5.jpg', 5),
    ('/images/proj-supalai-wellington-6.jpg', 6),
    ('/images/proj-supalai-wellington-7.jpg', 7)
  ) as img(url, ord);

insert into project_images (project_id, image_url, sort_order)
select p.id, img.url, img.ord
from projects p,
  (values
    ('/images/proj-folding-door-4.jpg', 4),
    ('/images/proj-folding-door-5.jpg', 5)
  ) as img(url, ord)
where p.slug = 'folding-door-partition';

commit;


-- Rollback, if this needs undoing:
--
-- begin;
-- delete from project_images
--  where image_url in ('/images/proj-folding-door-4.jpg',
--                      '/images/proj-folding-door-5.jpg');
-- delete from project_images
--  where project_id = (select id from projects where slug = 'supalai-wellington');
-- delete from projects where slug = 'supalai-wellington';
-- commit;
