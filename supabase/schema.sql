-- ============================================================================
-- iKamm Home Decor — Supabase PostgreSQL Schema (SQL Editor Ready)
-- ============================================================================

-- 1. Articles Table
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

-- 2. Customer Leads / Site Measurement & Quote Inquiries Table
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

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read articles" ON public.articles;
CREATE POLICY "Public read articles"
  ON public.articles
  FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Allow Public Insert Articles" ON public.articles;
CREATE POLICY "Allow Public Insert Articles"
  ON public.articles
  FOR INSERT
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow Public Update Articles" ON public.articles;
CREATE POLICY "Allow Public Update Articles"
  ON public.articles
  FOR UPDATE
  USING (TRUE)
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow Public Delete Articles" ON public.articles;
CREATE POLICY "Allow Public Delete Articles"
  ON public.articles
  FOR DELETE
  USING (TRUE);

DROP POLICY IF EXISTS "Public insert leads" ON public.leads;
CREATE POLICY "Public insert leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (TRUE);
