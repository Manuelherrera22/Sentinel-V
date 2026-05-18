-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles
CREATE TYPE user_role AS ENUM ('guard', 'admin');

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role DEFAULT 'guard'::user_role NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_guard() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'guard');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Inmates (Internos)
CREATE TABLE public.inmates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inmate_number VARCHAR(50) UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  security_level VARCHAR(20) DEFAULT 'medium',
  block_location TEXT,
  cell_number TEXT,
  crimes TEXT[],
  detention_date DATE,
  release_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  date_of_birth DATE,
  gender VARCHAR(20) DEFAULT 'male',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visitors (Familiares)
CREATE TABLE public.visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identity_document VARCHAR(50) UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number VARCHAR(20),
  document_image_url TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approved visitors per inmate (Lista Blanca)
CREATE TABLE public.inmate_visitors (
  inmate_id UUID REFERENCES public.inmates(id) ON DELETE CASCADE,
  visitor_id UUID REFERENCES public.visitors(id) ON DELETE CASCADE,
  relationship TEXT,
  PRIMARY KEY (inmate_id, visitor_id)
);

-- Visits Schedule
CREATE TYPE visit_status AS ENUM ('pending', 'approved', 'rejected', 'in_progress', 'completed', 'no_show');

CREATE TABLE public.visits_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inmate_id UUID REFERENCES public.inmates(id) ON DELETE CASCADE,
  visitor_id UUID REFERENCES public.visitors(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMPTZ NOT NULL,
  status visit_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- QR Tokens (Evita re-uso de tokens)
CREATE TABLE public.qr_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jti VARCHAR(255) UNIQUE NOT NULL, -- JWT ID
  visit_id UUID REFERENCES public.visits_schedule(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ, -- Si es null, no ha sido usado
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES --
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inmates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inmate_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_tokens ENABLE ROW LEVEL SECURITY;

-- Admins: CRUD en todas las tablas
CREATE POLICY "Admins full profiles" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full inmates" ON public.inmates FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full visitors" ON public.visitors FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full inmate_visitors" ON public.inmate_visitors FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full visits" ON public.visits_schedule FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full tokens" ON public.qr_tokens FOR ALL USING (public.is_admin());

-- Guards: Solo Lectura, excepto actualizaciones en estado de visita y token
CREATE POLICY "Guards read inmates" ON public.inmates FOR SELECT USING (public.is_guard());
CREATE POLICY "Guards read visitors" ON public.visitors FOR SELECT USING (public.is_guard());
CREATE POLICY "Guards read inmate_visitors" ON public.inmate_visitors FOR SELECT USING (public.is_guard());
CREATE POLICY "Guards read visits" ON public.visits_schedule FOR SELECT USING (public.is_guard());
CREATE POLICY "Guards update visits" ON public.visits_schedule FOR UPDATE USING (public.is_guard());
CREATE POLICY "Guards read tokens" ON public.qr_tokens FOR SELECT USING (public.is_guard());
CREATE POLICY "Guards update tokens" ON public.qr_tokens FOR UPDATE USING (public.is_guard());
