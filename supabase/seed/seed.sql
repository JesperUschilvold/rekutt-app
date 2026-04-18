-- =========================================================
-- Rekutt — Seed-data for utvikling
-- Hardkodede UUIDer for å gjøre dataene lette å referere til
-- under utvikling og testing.
-- =========================================================

-- =========================================================
-- Tenants
-- =========================================================
insert into tenants (id, slug, name, org_nummer, billing_email, plan)
values
  ('11111111-1111-1111-1111-111111111101', 'sollihogda',  'Sollihøgda Eldrehjem',   '912345678', 'leder@sollihogda.no',   'trial'),
  ('11111111-1111-1111-1111-111111111102', 'vestrestrand','Vestre Strand Omsorg',  '923456789', 'leder@vestrestrand.no', 'trial');

-- =========================================================
-- Users
-- 4 admin (2 per tenant) + 6 ansatte (3 per tenant)
-- auth_user_id er NULL inntil leveranse 04 kobler dem til auth.users
-- =========================================================
insert into users (id, tenant_id, email, name, role, department, status)
values
  -- Sollihøgda – admins
  ('44444444-4444-4444-4444-444444444101', '11111111-1111-1111-1111-111111111101', 'henrik.mo@sollihogda.no',     'Henrik Mo',     'admin',  'Ledelse', 'active'),
  ('44444444-4444-4444-4444-444444444102', '11111111-1111-1111-1111-111111111101', 'ingrid.solli@sollihogda.no',  'Ingrid Solli',  'admin',  'Ledelse', 'active'),
  -- Sollihøgda – ansatte
  ('44444444-4444-4444-4444-444444444103', '11111111-1111-1111-1111-111111111101', 'kari.hansen@sollihogda.no',   'Kari Hansen',   'ansatt', 'Pleie',   'invited'),
  ('44444444-4444-4444-4444-444444444104', '11111111-1111-1111-1111-111111111101', 'ola.nordmann@sollihogda.no',  'Ola Nordmann',  'ansatt', 'Pleie',   'invited'),
  ('44444444-4444-4444-4444-444444444105', '11111111-1111-1111-1111-111111111101', 'lisa.berg@sollihogda.no',     'Lisa Berg',     'ansatt', 'Kjøkken', 'invited'),

  -- Vestre Strand – admins
  ('44444444-4444-4444-4444-444444444201', '11111111-1111-1111-1111-111111111102', 'marte.lien@vestrestrand.no',  'Marte Lien',    'admin',  'Ledelse', 'active'),
  ('44444444-4444-4444-4444-444444444202', '11111111-1111-1111-1111-111111111102', 'anders.vik@vestrestrand.no',  'Anders Vik',    'admin',  'Ledelse', 'active'),
  -- Vestre Strand – ansatte
  ('44444444-4444-4444-4444-444444444203', '11111111-1111-1111-1111-111111111102', 'per.holm@vestrestrand.no',    'Per Holm',      'ansatt', 'Pleie',   'invited'),
  ('44444444-4444-4444-4444-444444444204', '11111111-1111-1111-1111-111111111102', 'ase.dahl@vestrestrand.no',    'Åse Dahl',      'ansatt', 'Pleie',   'invited'),
  ('44444444-4444-4444-4444-444444444205', '11111111-1111-1111-1111-111111111102', 'jens.olsen@vestrestrand.no',  'Jens Olsen',    'ansatt', 'Kjøkken', 'invited');

-- =========================================================
-- Modules (delt innhold på tvers av tenants)
-- =========================================================
insert into modules (id, slug, title, goal, phase, order_index, duration_min, published)
values
  ('22222222-2222-2222-2222-222222222201', 'velkommen',           'Velkommen til arbeidsplassen', 'Få overblikk over rutiner, arbeidsmiljø og forventninger.', 'for_forste_vakt', 1, 15, true),
  ('22222222-2222-2222-2222-222222222202', 'medikamenthandtering','Medikamenthåndtering',         'Vite hva du skal og ikke skal gjøre med medisiner.',        'forste_uke',     2, 25, true),
  ('22222222-2222-2222-2222-222222222203', 'brann-og-sikkerhet',  'Brann og sikkerhet',           'Kjenne rømningsveier, slukkeutstyr og nødprosedyrer.',      'forste_uke',     3, 20, true);

-- =========================================================
-- Module sections — 3 + 5 + 4 = 12 totalt
-- =========================================================
-- Velkommen
insert into module_sections (id, module_id, order_index, title, kind, is_required) values
  ('33333333-3333-3333-3333-333333333101', '22222222-2222-2222-2222-222222222201', 1, 'Velkommen',        'intro',      true),
  ('33333333-3333-3333-3333-333333333102', '22222222-2222-2222-2222-222222222201', 2, 'Hvem gjør hva',    'content',    true),
  ('33333333-3333-3333-3333-333333333103', '22222222-2222-2222-2222-222222222201', 3, 'Refleksjon',       'reflection', false);

-- Medikamenthåndtering
insert into module_sections (id, module_id, order_index, title, kind, is_required) values
  ('33333333-3333-3333-3333-333333333201', '22222222-2222-2222-2222-222222222202', 1, 'Hvorfor dette er viktig',     'intro',      true),
  ('33333333-3333-3333-3333-333333333202', '22222222-2222-2222-2222-222222222202', 2, 'Regler og roller',            'content',    true),
  ('33333333-3333-3333-3333-333333333203', '22222222-2222-2222-2222-222222222202', 3, 'Scenario: dosett uten signatur','scenario',  true),
  ('33333333-3333-3333-3333-333333333204', '22222222-2222-2222-2222-222222222202', 4, 'Quiz',                         'quiz',       true),
  ('33333333-3333-3333-3333-333333333205', '22222222-2222-2222-2222-222222222202', 5, 'Refleksjon',                   'reflection', false);

-- Brann og sikkerhet
insert into module_sections (id, module_id, order_index, title, kind, is_required) values
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', 1, 'Innledning',           'intro',      true),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222203', 2, 'Rømningsveier og samlingsplass', 'content', true),
  ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222203', 3, 'Quiz',                 'quiz',       true),
  ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222203', 4, 'Refleksjon',           'reflection', false);

-- =========================================================
-- Onboarding tracks (én per tenant)
-- =========================================================
insert into onboarding_tracks (id, tenant_id, name, role_target) values
  ('55555555-5555-5555-5555-555555555101', '11111111-1111-1111-1111-111111111101', 'Sommervikar 2026 – Eldrehjem', 'ansatt'),
  ('55555555-5555-5555-5555-555555555102', '11111111-1111-1111-1111-111111111102', 'Sommervikar 2026 – Eldrehjem', 'ansatt');

-- =========================================================
-- Track ↔ moduler (samme tre moduler i begge spor)
-- =========================================================
insert into track_modules (track_id, module_id, order_index, is_required) values
  ('55555555-5555-5555-5555-555555555101', '22222222-2222-2222-2222-222222222201', 1, true),
  ('55555555-5555-5555-5555-555555555101', '22222222-2222-2222-2222-222222222202', 2, true),
  ('55555555-5555-5555-5555-555555555101', '22222222-2222-2222-2222-222222222203', 3, true),

  ('55555555-5555-5555-5555-555555555102', '22222222-2222-2222-2222-222222222201', 1, true),
  ('55555555-5555-5555-5555-555555555102', '22222222-2222-2222-2222-222222222202', 2, true),
  ('55555555-5555-5555-5555-555555555102', '22222222-2222-2222-2222-222222222203', 3, true);

-- =========================================================
-- Tildel track til alle ansatte (ikke admin)
-- =========================================================
insert into user_tracks (tenant_id, user_id, track_id, due_date)
values
  -- Sollihøgda
  ('11111111-1111-1111-1111-111111111101', '44444444-4444-4444-4444-444444444103', '55555555-5555-5555-5555-555555555101', '2026-06-15'),
  ('11111111-1111-1111-1111-111111111101', '44444444-4444-4444-4444-444444444104', '55555555-5555-5555-5555-555555555101', '2026-06-15'),
  ('11111111-1111-1111-1111-111111111101', '44444444-4444-4444-4444-444444444105', '55555555-5555-5555-5555-555555555101', '2026-06-15'),

  -- Vestre Strand
  ('11111111-1111-1111-1111-111111111102', '44444444-4444-4444-4444-444444444203', '55555555-5555-5555-5555-555555555102', '2026-06-15'),
  ('11111111-1111-1111-1111-111111111102', '44444444-4444-4444-4444-444444444204', '55555555-5555-5555-5555-555555555102', '2026-06-15'),
  ('11111111-1111-1111-1111-111111111102', '44444444-4444-4444-4444-444444444205', '55555555-5555-5555-5555-555555555102', '2026-06-15');

-- Section completions opprettes ikke her — fylles via appen i senere leveranser.
