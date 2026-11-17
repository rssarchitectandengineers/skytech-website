-- ==============================================================================
-- THE SKYTECH STRUCTURAL CONSULTANT - SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. Create LEADS Table (Client Inquiries & CRM)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service TEXT,
    project_details TEXT,
    status TEXT DEFAULT 'New', -- 'New', 'Contacted', 'Proposal Sent', 'Deal Closed', 'Archived'
    source_page TEXT DEFAULT 'Homepage',
    notes TEXT
);

-- Enable Row Level Security (RLS) on leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public/anon) to insert leads from the website forms
CREATE POLICY "Allow public insert on leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Allow anon/admin to select and update leads
CREATE POLICY "Allow anon read leads" 
ON public.leads 
FOR SELECT 
USING (true);

CREATE POLICY "Allow anon update leads" 
ON public.leads 
FOR UPDATE 
USING (true);

-- ------------------------------------------------------------------------------
-- 2. Create PROJECTS Table
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'commercial', 'industrial', 'residential', 'institutional', 'infrastructure'
    category_name TEXT NOT NULL,
    location TEXT,
    image_url TEXT,
    video_url TEXT,
    area TEXT,
    floors TEXT,
    system TEXT,
    steel_savings TEXT,
    scope TEXT,
    description TEXT,
    status TEXT DEFAULT 'published', -- 'published', 'draft_pending_approval'
    submitted_by TEXT DEFAULT 'Owner'
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read published projects" 
ON public.projects 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update projects" 
ON public.projects 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete projects" 
ON public.projects 
FOR DELETE 
USING (true);

-- ------------------------------------------------------------------------------
-- 3. Create BLOGS Table (SEO Articles & AI Generator)
CREATE TABLE IF NOT EXISTS public.blogs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    slug TEXT,
    category TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    read_time TEXT DEFAULT '5 min read',
    image_url TEXT,
    status TEXT DEFAULT 'published', -- 'published', 'draft_pending_approval'
    is_ai_generated BOOLEAN DEFAULT FALSE,
    submitted_by TEXT DEFAULT 'Owner',
    approved_by TEXT
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read published blogs" 
ON public.blogs 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert blogs" 
ON public.blogs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update blogs" 
ON public.blogs 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete blogs" 
ON public.blogs 
FOR DELETE 
USING (true);

-- ------------------------------------------------------------------------------
-- 4. Create STORAGE Bucket for Site Photos & Videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('skytech-media', 'skytech-media', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public media access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'skytech-media');

CREATE POLICY "Public media upload" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'skytech-media');

CREATE POLICY "Public media update" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'skytech-media');

CREATE POLICY "Public media delete" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'skytech-media');

-- ------------------------------------------------------------------------------
-- 5. Seed Initial Projects from The Skytech
INSERT INTO public.projects (id, title, category, category_name, location, image_url, area, floors, system, steel_savings, scope, description, status)
VALUES
('prj-1', 'The Rajmahal Commercial Complex', 'commercial', 'Commercial', 'Jaipur, Rajasthan', 'assets/images/project-commercial.jpg', '145,000 sq ft', 'G + 12 Floors', 'Earthquake-Resistant RCC Frame with Post-Tensioned Slabs', '14.2% Steel Optimization (₹18.4 Lakhs Saved)', 'Architectural vetting, 3D ETABS finite element modeling, GFC structural drawings, BBS schedules and periodic site quality audits.', 'A landmark commercial mixed-use retail and corporate tower engineered strictly to IS 1893:2016 seismic criteria and IS 13920 ductile detailing. Our re-engineering eliminated overdesigned rebar in raft foundations while enhancing overall lateral load safety.', 'published'),

('prj-2', 'RIICO Heavy PEB Industrial Shed', 'industrial', 'Industrial', 'Sitapura Industrial Area, Jaipur', 'assets/images/project-industrial.jpg', '85,000 sq ft', 'Clear Height: 11.5m', 'Clear-Span Pre-Engineered Steel Frame with EOT Crane Girders (15T)', '18.7% Tonnage Reduction via Built-Up Tapered Sections', 'PEB structural design, wind load simulation (IS 875 Part 3), connection detailing per IS 800:2007, anchor bolt layouts and fabricator drawing certification.', 'Custom engineered industrial manufacturing plant featuring a 36-meter clear span without intermediate columns, maximizing floor space and material movement efficiency.', 'published'),

('prj-3', 'Aravalli Greens Luxury Residential Villas', 'residential', 'Residential', 'Mansarovar Extension, Jaipur', 'assets/images/project-residential.jpg', '42,000 sq ft (12 Villas)', 'Basement + G + 2 Floors', 'Monolithic RCC Beam-Column Frame with Flat Plates', '12.8% Cement & Rebar Efficiency', 'Soil bearing capacity review, customized raft & isolated footings, ductile column detailing and plumbing puncture coordination drawings.', 'A boutique gated villa enclave designed with cantilevered balconies, column-free internal living spaces, and optimized structural wall arrangements.', 'published'),

('prj-4', 'St. Xavier Modern Academic Campus', 'institutional', 'Institutional', 'Ajmer Road, Jaipur', 'assets/images/project-institutional.jpg', '120,000 sq ft', 'G + 4 Floors + Auditorium', 'Heavy RCC Frame with Large-Span Prestressed Auditorium Beams', '16.5% Material Savings on Framing', 'Seismic Zone II engineering, 22-meter column-free auditorium roof framing, fire safety structural vetting, and municipal stability certificate.', 'Multi-storey institutional campus accommodating 2,500 students with large-span lecture halls, laboratories, and an acoustically optimized column-free auditorium.', 'published'),

('prj-5', 'Overhead Highway RCC Foot Overbridge', 'infrastructure', 'Infrastructure', 'Tonk Road Highway Junction, Jaipur', 'assets/images/project-infrastructure.jpg', 'Span: 48 meters', 'Pedestrian Truss + Pier Cap', 'Composite Steel-Concrete Girder on Cylindrical RCC Piers', 'Zero Rework with Precision BBS', 'Complete structural design, deep pile foundation analysis, wind buffet checks, camber calculations, and pre-pour inspection schedules.', 'Municipal pedestrian infrastructure bridging a high-traffic 6-lane national highway corridor with composite steel-concrete superstructure on deep bored cast-in-situ piles.', 'published')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 6. Seed Initial Blog Articles
INSERT INTO public.blogs (title, slug, category, excerpt, content, read_time, image_url, status)
VALUES
('How Re-Engineering Approved Drawings Trims 15-25% Steel Tonnage', 'how-re-engineering-approved-drawings-trims-15-25-steel-tonnage', 'Value Engineering', 'Discover how structural optimization algorithms and IS 456/13920 re-auditing reduce unnecessary rebar congestion without compromising building safety.', 'Value engineering in civil structures is not about cutting corners—it is about rigorous mathematical optimization per IS 456:2000 and IS 13920:2016 ductile detailing standards. Often, conventional drawing offices apply conservative safety factors repeatedly across every beam, column, and foundation node. By applying 3D finite element re-analysis in ETABS, structural engineers can identify redundant rebar congestion, streamline bar diameters, and deliver genuine 15% to 25% material savings for developers while maintaining safety factors above municipal bylaws.', '6 min read', 'assets/images/about-engineers.webp', 'published'),

('Demystifying IS 1893:2016: Seismic Design Criteria for North India', 'demystifying-is-1893-2016-seismic-design-criteria-north-india', 'Structural Standards', 'A technical deep-dive into seismic coefficient method, response spectrum analysis, and foundation soil factor adjustments across Zone II to IV.', 'Rajasthan spans across Seismic Zone II and III, requiring careful response reduction factor (R) evaluation and soil-structure interaction. This technical overview highlights key parameters: zone factor (Z), importance factor (I), and spectral acceleration coefficients (Sa/g). Proper adherence ensures multi-storey RCC framed structures sustain horizontal earthquake accelerations with zero catastrophic failure risk.', '8 min read', 'assets/images/01-residential-building-3d-model.webp', 'published'),

('PEB vs Conventional Steel: Cost & Speed Comparison for Warehouses', 'peb-vs-conventional-steel-cost-speed-comparison-warehouses', 'Industrial Design', 'Compare fabrication timelines, foundation loads, crane girder provisions, and total project lifecycle costs for industrial sheds.', 'When planning an industrial shed or logistics warehouse in Sitapura or Vishwakarma industrial areas, choosing between Pre-Engineered Buildings (PEB) and conventional structural steel shapes makes a 20-30% difference in initial capex and delivery timeline. PEB frames leverage tapered built-up sections with high-strength steel (345 MPa), reducing overall dead load on foundations and speeding up erection to under 90 days.', '5 min read', 'assets/images/hero-slide-5.webp', 'published')
ON CONFLICT DO NOTHING;
