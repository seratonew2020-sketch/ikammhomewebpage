-- ============================================================================
-- iKamm Home Decor — Complete Supabase PostgreSQL Database Schema (Full DDL)
-- Covers all features: Articles, Categories, Inquiries/Leads, Material Prices,
-- Price Estimates, Material Comparisons, Site Measurements, Bookmarks, Settings
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. categories: หมวดหมู่บทความ (รองรับ 3 ภาษา: th / en / zh)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  group_type TEXT NOT NULL DEFAULT 'builtin', -- 'builtin' | 'construction' | 'facebook'
  label_th TEXT NOT NULL,
  label_en TEXT NOT NULL DEFAULT '',
  label_zh TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. articles: คลังบทความทั้งหมด (บิ้วอิน + โพสต์ Facebook + คู่มือก่อสร้าง)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category_id TEXT NOT NULL DEFAULT 'bedroom-living',
  category_name TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT,
  post_url TEXT,
  read_time TEXT DEFAULT '',
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  is_fb_highlight BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_category_id ON public.articles (category_id);
CREATE INDEX IF NOT EXISTS idx_articles_is_fb ON public.articles (is_fb_highlight);

-- ----------------------------------------------------------------------------
-- 3. inquiries: ฟอร์มติดต่อลูกค้า / ขอใบเสนอราคา 3D ฟรี / นัดวัดหน้างาน
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  line_id TEXT,
  email TEXT,
  room_type TEXT,
  budget_range TEXT,
  area_sqm NUMERIC(10, 2),
  notes TEXT,
  lang TEXT NOT NULL DEFAULT 'th',
  source_page TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new', -- 'new' | 'contacted' | 'quoted' | 'closed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Keep `leads` table compatible if already created earlier
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  line_id TEXT,
  room_type TEXT,
  budget_range TEXT,
  area_sqm NUMERIC(10, 2),
  notes TEXT,
  lang TEXT NOT NULL DEFAULT 'th',
  source_page TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. material_prices: ราคากลางวัสดุก่อสร้างและงานบิ้วอิน
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.material_prices (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL, -- 'structure' | 'wall' | 'roof' | 'cement' | 'rebar' | 'builtin'
  name_th TEXT NOT NULL,
  name_en TEXT NOT NULL DEFAULT '',
  name_zh TEXT NOT NULL DEFAULT '',
  unit_th TEXT NOT NULL DEFAULT 'ชิ้น',
  unit_en TEXT NOT NULL DEFAULT 'unit',
  unit_zh TEXT NOT NULL DEFAULT '件',
  min_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  max_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  avg_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'THB',
  spec_note TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_material_prices_cat ON public.material_prices (category_id);

-- ----------------------------------------------------------------------------
-- 5. price_estimates: ใบประเมินราคาวัสดุที่ผู้ใช้คำนวณจากหน้าเว็บ
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.price_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  customer_name TEXT,
  phone TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ material_id, name, qty, unit_price, subtotal }]
  total_min NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_max NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_avg NUMERIC(12, 2) NOT NULL DEFAULT 0,
  lang TEXT NOT NULL DEFAULT 'th',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. material_comparisons: ข้อมูลเปรียบเทียบสเปกวัสดุ (อิฐ, หลังคา, ปูน, ฟิตติ้ง)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.material_comparisons (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL, -- 'bricks' | 'roofing' | 'cement' | 'fittings'
  name_th TEXT NOT NULL,
  name_en TEXT NOT NULL DEFAULT '',
  name_zh TEXT NOT NULL DEFAULT '',
  pros JSONB NOT NULL DEFAULT '[]'::jsonb,
  cons JSONB NOT NULL DEFAULT '[]'::jsonb,
  best_for TEXT DEFAULT '',
  scores JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g. {"strength": 9, "insulation": 7, "cost": 8}
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. site_measurements: บันทึกการวัดพื้นที่หน้างาน (Zone Shapes, ปริมาตรคอนกรีต)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  project_name TEXT DEFAULT '',
  zones JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ name, shape, dimA, dimB, dimC, dimD, area, perimeter, volume }]
  total_area_sqm NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_perimeter_m NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_volume_cum NUMERIC(12, 2) NOT NULL DEFAULT 0,
  land_rai NUMERIC(10, 2) DEFAULT 0,
  land_ngan NUMERIC(10, 2) DEFAULT 0,
  land_wah NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. user_bookmarks: บทความที่ผู้ใช้บันทึกไว้
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  article_id TEXT NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, article_id)
);

-- ----------------------------------------------------------------------------
-- 9. company_settings: ข้อมูลบริษัทและช่องทางติดต่อ iKamm Home Decor
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.company_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  brand_name TEXT NOT NULL DEFAULT 'iKamm Home Decor',
  company_name_th TEXT NOT NULL DEFAULT 'บริษัท อิคัม โฮม เดคคอร์ จำกัด',
  company_name_en TEXT NOT NULL DEFAULT 'iKamm Home Decor Co., Ltd.',
  phone_th TEXT NOT NULL DEFAULT '+66 99 086 9712',
  phone_intl TEXT NOT NULL DEFAULT '+63 90 855 78763',
  line_id TEXT NOT NULL DEFAULT '099 104 2639',
  email TEXT NOT NULL DEFAULT 'Service@ikammhomedecor.com',
  website TEXT NOT NULL DEFAULT 'https://www.ikammhomedecor.com',
  facebook_url TEXT NOT NULL DEFAULT 'https://www.facebook.com/profile.php?id=100093160863461',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.company_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Public Read-Only Catalog & Reference Tables
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Allow Public Read Articles" ON public.articles;
CREATE POLICY "Allow Public Read Articles" ON public.articles FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read material_prices" ON public.material_prices;
CREATE POLICY "Public read material_prices" ON public.material_prices FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read material_comparisons" ON public.material_comparisons;
CREATE POLICY "Public read material_comparisons" ON public.material_comparisons FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read company_settings" ON public.company_settings;
CREATE POLICY "Public read company_settings" ON public.company_settings FOR SELECT USING (TRUE);

-- Public Insert-Only Lead & Inquiry Capture Tables
DROP POLICY IF EXISTS "Public insert inquiries" ON public.inquiries;
CREATE POLICY "Public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public insert leads" ON public.leads;
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (TRUE);

-- Session-based Visitor Calculation & Bookmark Tables
DROP POLICY IF EXISTS "Public insert price_estimates" ON public.price_estimates;
CREATE POLICY "Public insert price_estimates" ON public.price_estimates FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public read price_estimates" ON public.price_estimates;
CREATE POLICY "Public read price_estimates" ON public.price_estimates FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public insert site_measurements" ON public.site_measurements;
CREATE POLICY "Public insert site_measurements" ON public.site_measurements FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public read site_measurements" ON public.site_measurements;
CREATE POLICY "Public read site_measurements" ON public.site_measurements FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public manage user_bookmarks" ON public.user_bookmarks;
CREATE POLICY "Public manage user_bookmarks" ON public.user_bookmarks FOR ALL USING (TRUE) WITH CHECK (TRUE);
