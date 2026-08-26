-- ==============================================================================
-- AGRI-PROCURE: PREDICTIVE & TRUSTED PROCUREMENT PLATFORM
-- COMPLETE SUPABASE POSTGRESQL SCHEMA WITH RLS, REALTIME & STORAGE BUCKETS
-- ==============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CREATE DATABASE TABLES
-- ==============================================================================

-- Table 1: Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id TEXT UNIQUE,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    aadhaar TEXT,
    village TEXT,
    district TEXT,
    state TEXT,
    role TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'worker', 'officer')),
    face_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table 2: Farmer Crops
CREATE TABLE IF NOT EXISTS public.farmer_crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    acres NUMERIC NOT NULL DEFAULT 1.0,
    expected_yield NUMERIC NOT NULL DEFAULT 10.0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 3: Procurement Centres
CREATE TABLE IF NOT EXISTS public.procurement_centres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centre_code TEXT UNIQUE NOT NULL, -- e.g. P, Q, D, F, K, L, N
    centre_name TEXT NOT NULL,
    village TEXT,
    district TEXT,
    daily_capacity INTEGER NOT NULL DEFAULT 200,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 4: Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT UNIQUE NOT NULL, -- e.g. BK-2026-000001
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES public.farmer_crops(id) ON DELETE SET NULL,
    centre_id UUID NOT NULL REFERENCES public.procurement_centres(id) ON DELETE RESTRICT,
    slot_date DATE NOT NULL,
    slot_time TEXT NOT NULL,
    expected_quantity NUMERIC NOT NULL DEFAULT 10.0,
    estimated_processing_time INTEGER NOT NULL DEFAULT 30, -- minutes
    status TEXT NOT NULL DEFAULT 'BOOKED' CHECK (status IN ('BOOKED', 'ARRIVED', 'WEIGHING', 'QUALITY_CHECK', 'PROCUREMENT', 'PAYMENT', 'COMPLETED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 5: Tokens
CREATE TABLE IF NOT EXISTS public.tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    centre_code TEXT NOT NULL,
    token_number TEXT NOT NULL, -- e.g. P001, P002
    queue_position INTEGER NOT NULL DEFAULT 1,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 6: Workflow
CREATE TABLE IF NOT EXISTS public.workflow (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    stage TEXT NOT NULL CHECK (stage IN ('ARRIVED', 'WEIGHING', 'QUALITY_CHECK', 'PROCUREMENT', 'PAYMENT', 'COMPLETED')),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    worker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    remarks TEXT,
    proof_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table 7: Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL DEFAULT 0.0,
    receipt_url TEXT,
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'DISBURSED', 'FAILED')),
    payment_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 8: Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 9: Fraud Alerts
CREATE TABLE IF NOT EXISTS public.fraud_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    alert_type TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status TEXT NOT NULL DEFAULT 'Needs Review' CHECK (status IN ('Needs Review', 'Dismissed', 'Confirmed Fraud')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 10: Audit Logs (SHA-256 Chain)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    event_name TEXT NOT NULL,
    hash TEXT NOT NULL,
    previous_hash TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 3. INDEXES FOR FAST PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_farmer_id ON public.profiles(farmer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON public.bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_profile_id ON public.bookings(profile_id);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_date ON public.bookings(slot_date);
CREATE INDEX IF NOT EXISTS idx_tokens_token_number ON public.tokens(token_number);
CREATE INDEX IF NOT EXISTS idx_tokens_centre_code ON public.tokens(centre_code);
CREATE INDEX IF NOT EXISTS idx_tokens_date ON public.tokens(date);
CREATE INDEX IF NOT EXISTS idx_workflow_booking_id ON public.workflow(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_profile_id ON public.notifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_booking_id ON public.audit_logs(booking_id);

-- ==============================================================================
-- 4. STORAGE BUCKETS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('farmer-faces', 'farmer-faces', true),
    ('workflow-proofs', 'workflow-proofs', true),
    ('payment-receipts', 'payment-receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Public Access
CREATE POLICY "Public Read Farmer Faces" ON storage.objects FOR SELECT USING (bucket_id = 'farmer-faces');
CREATE POLICY "Public Upload Farmer Faces" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'farmer-faces');

CREATE POLICY "Public Read Workflow Proofs" ON storage.objects FOR SELECT USING (bucket_id = 'workflow-proofs');
CREATE POLICY "Public Upload Workflow Proofs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'workflow-proofs');

CREATE POLICY "Public Read Payment Receipts" ON storage.objects FOR SELECT USING (bucket_id = 'payment-receipts');
CREATE POLICY "Public Upload Payment Receipts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-receipts');

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow read/write for all authenticated and anon roles during prototype operation
CREATE POLICY "Allow All Access Profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access Farmer Crops" ON public.farmer_crops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access Procurement Centres" ON public.procurement_centres FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access Bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access Tokens" ON public.tokens FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access Workflow" ON public.workflow FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access Payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access Notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access Fraud Alerts" ON public.fraud_alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access Audit Logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 6. ENABLE REALTIME SUBSCRIPTIONS
-- ==============================================================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.bookings, 
    public.tokens, 
    public.workflow, 
    public.notifications;
COMMIT;

-- ==============================================================================
-- 7. SEED DATA (INITIAL CENTRES & SAMPLES)
-- ==============================================================================
INSERT INTO public.procurement_centres (centre_code, centre_name, village, district, daily_capacity)
VALUES
    ('P', 'Karnal Central Grain Mandi (HR)', 'Taraori', 'Karnal', 200),
    ('Q', 'Ludhiana Main Grain Market (PB)', 'Samana', 'Ludhiana', 250),
    ('D', 'Nalgonda Paddy Procurement Hub (TS)', 'Miryalaguda', 'Nalgonda', 150),
    ('F', 'Kota Agricultural Mandi (RJ)', 'Borkheda', 'Kota', 180)
ON CONFLICT (centre_code) DO NOTHING;
