-- ============================================
-- 006: EXPANDED DEMO SEED DATA
-- ============================================
-- Adds realistic volume: 8 more guests, 5 more staff,
-- 20+ service requests, multiple bookings, notifications.
-- Makes the demo feel like a real operating hotel.
-- ============================================

-- ============================================
-- 1. UPDATE ALEX DEMO WITH PREFERENCES
-- ============================================
UPDATE public.guests
SET preferences = '{"dietary": ["vegetarian"], "language": "en", "interests": ["beach", "snorkeling", "local cuisine"], "accessibility": []}'::jsonb
WHERE id = '00000000-0000-0000-0002-000000000001';

-- ============================================
-- 2. ADDITIONAL AUTH USERS (8 guests + 5 staff)
-- ============================================
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES
  -- Guests
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000000',
   'guest-102@hotel.local', crypt('DEMO02', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000000',
   'guest-103@hotel.local', crypt('DEMO03', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000000',
   'guest-104@hotel.local', crypt('DEMO04', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000000',
   'guest-105@hotel.local', crypt('DEMO05', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000000',
   'guest-106@hotel.local', crypt('DEMO06', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0000-000000000000',
   'guest-107@hotel.local', crypt('DEMO07', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0000-000000000000',
   'guest-108@hotel.local', crypt('DEMO08', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0000-000000000000',
   'guest-109@hotel.local', crypt('DEMO09', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  -- Staff: Spa
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0000-000000000000',
   'staff-sp@demo-resort.com', crypt('staff123', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  -- Staff: Tours
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0000-000000000000',
   'staff-to@demo-resort.com', crypt('staff123', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  -- Staff: Maintenance
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0000-000000000000',
   'staff-mt@demo-resort.com', crypt('staff123', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  -- Staff: Transportation
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0000-000000000000',
   'staff-tr@demo-resort.com', crypt('staff123', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  -- Staff: Front Desk
  ('00000000-0000-0000-0003-000000000008', '00000000-0000-0000-0000-000000000000',
   'staff-fd@demo-resort.com', crypt('staff123', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Auth identities for new users
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0002-000000000002',
   '{"sub":"00000000-0000-0000-0002-000000000002","email":"guest-102@hotel.local"}',
   'email', '00000000-0000-0000-0002-000000000002', now(), now(), now()),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0002-000000000003',
   '{"sub":"00000000-0000-0000-0002-000000000003","email":"guest-103@hotel.local"}',
   'email', '00000000-0000-0000-0002-000000000003', now(), now(), now()),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0002-000000000004',
   '{"sub":"00000000-0000-0000-0002-000000000004","email":"guest-104@hotel.local"}',
   'email', '00000000-0000-0000-0002-000000000004', now(), now(), now()),
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0002-000000000005',
   '{"sub":"00000000-0000-0000-0002-000000000005","email":"guest-105@hotel.local"}',
   'email', '00000000-0000-0000-0002-000000000005', now(), now(), now()),
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0002-000000000006',
   '{"sub":"00000000-0000-0000-0002-000000000006","email":"guest-106@hotel.local"}',
   'email', '00000000-0000-0000-0002-000000000006', now(), now(), now()),
  ('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0002-000000000007',
   '{"sub":"00000000-0000-0000-0002-000000000007","email":"guest-107@hotel.local"}',
   'email', '00000000-0000-0000-0002-000000000007', now(), now(), now()),
  ('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0002-000000000008',
   '{"sub":"00000000-0000-0000-0002-000000000008","email":"guest-108@hotel.local"}',
   'email', '00000000-0000-0000-0002-000000000008', now(), now(), now()),
  ('00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0002-000000000009',
   '{"sub":"00000000-0000-0000-0002-000000000009","email":"guest-109@hotel.local"}',
   'email', '00000000-0000-0000-0002-000000000009', now(), now(), now()),
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0003-000000000004',
   '{"sub":"00000000-0000-0000-0003-000000000004","email":"staff-sp@demo-resort.com"}',
   'email', '00000000-0000-0000-0003-000000000004', now(), now(), now()),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0003-000000000005',
   '{"sub":"00000000-0000-0000-0003-000000000005","email":"staff-to@demo-resort.com"}',
   'email', '00000000-0000-0000-0003-000000000005', now(), now(), now()),
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0003-000000000006',
   '{"sub":"00000000-0000-0000-0003-000000000006","email":"staff-mt@demo-resort.com"}',
   'email', '00000000-0000-0000-0003-000000000006', now(), now(), now()),
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0003-000000000007',
   '{"sub":"00000000-0000-0000-0003-000000000007","email":"staff-tr@demo-resort.com"}',
   'email', '00000000-0000-0000-0003-000000000007', now(), now(), now()),
  ('00000000-0000-0000-0003-000000000008', '00000000-0000-0000-0003-000000000008',
   '{"sub":"00000000-0000-0000-0003-000000000008","email":"staff-fd@demo-resort.com"}',
   'email', '00000000-0000-0000-0003-000000000008', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. GUEST RECORDS
-- ============================================
INSERT INTO public.guests (id, property_id, name, email, phone, room_number, confirmation_code, check_in, check_out, status, preferences) VALUES
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001',
   'Sarah Johnson', 'sarah.j@email.com', '+1 555-0102', '102', 'DEMO02',
   CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '3 days', 'active',
   '{"dietary": ["gluten-free"], "language": "en", "interests": ["spa", "yoga", "fine dining"]}'::jsonb),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001',
   'Marco Rossi', 'marco.r@email.com', '+39 555-0103', '103', 'DEMO03',
   CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '4 days', 'active',
   '{"dietary": [], "language": "it", "interests": ["adventure", "surfing", "nightlife"]}'::jsonb),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001',
   'Emma & David Chen', 'emma.chen@email.com', '+1 555-0104', '104', 'DEMO04',
   CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 'active',
   '{"dietary": ["vegan"], "language": "en", "interests": ["snorkeling", "wildlife", "photography"]}'::jsonb),
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000001',
   'Klaus Weber', 'klaus.w@email.com', '+49 555-0105', '205', 'DEMO05',
   CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '1 day', 'active',
   '{"dietary": [], "language": "de", "interests": ["golf", "wine", "fishing"]}'::jsonb),
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000001',
   'Sofia Martinez', 'sofia.m@email.com', '+506 555-0106', '206', 'DEMO06',
   CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE, 'active',
   '{"dietary": ["vegetarian", "lactose-free"], "language": "es", "interests": ["culture", "cooking class"]}'::jsonb),
  ('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0000-000000000001',
   'James & Lisa Park', 'james.park@email.com', '+1 555-0107', '301', 'DEMO07',
   CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '6 days', 'active',
   '{"dietary": [], "language": "en", "interests": ["beach", "kids activities", "family tours"]}'::jsonb),
  ('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0000-000000000001',
   'Pierre Dupont', 'pierre.d@email.com', '+33 555-0108', '302', 'DEMO08',
   CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '1 day', 'checked_out',
   '{"dietary": [], "language": "fr", "interests": ["wine tasting", "hiking"]}'::jsonb),
  ('00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0000-000000000001',
   'Yuki Tanaka', 'yuki.t@email.com', '+81 555-0109', '303', 'DEMO09',
   CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '5 days', 'active',
   '{"dietary": ["pescatarian"], "language": "ja", "interests": ["onsen", "nature", "meditation"]}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. ADDITIONAL STAFF
-- ============================================
INSERT INTO public.staff (id, property_id, department_id, name, email, department, role) VALUES
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000005', 'Laura Herrera', 'staff-sp@demo-resort.com', 'Spa & Wellness', 'agent'),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000006', 'Diego Ramirez', 'staff-to@demo-resort.com', 'Tours & Activities', 'agent'),
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000002', 'Roberto Jimenez', 'staff-mt@demo-resort.com', 'Maintenance', 'supervisor'),
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000008', 'Fernando Vargas', 'staff-tr@demo-resort.com', 'Transportation', 'agent'),
  ('00000000-0000-0000-0003-000000000008', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000004', 'Patricia Solis', 'staff-fd@demo-resort.com', 'Front Desk', 'supervisor')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. SERVICE REQUESTS (20+ across all departments)
-- ============================================
INSERT INTO public.service_requests (id, guest_id, property_id, department_id, guest_name, room_number, type, priority, status, title, description, created_at, updated_at, assigned_to, assigned_to_name, started_at, completed_at, rating, feedback) VALUES
  -- Housekeeping requests
  ('00000000-0000-0000-0007-000000000010', '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000001', 'Sarah Johnson', '102', 'housekeeping', 'medium', 'completed',
   'Room Deep Clean', 'Please do a thorough deep clean of the bathroom. Also, we need fresh linens.',
   now() - INTERVAL '2 days', now() - INTERVAL '1 day 20 hours',
   '00000000-0000-0000-0003-000000000001', 'Maria Garcia', now() - INTERVAL '1 day 23 hours', now() - INTERVAL '1 day 20 hours',
   5, 'Maria did an excellent job. The room was spotless!'),
  ('00000000-0000-0000-0007-000000000011', '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000001', 'Marco Rossi', '103', 'housekeeping', 'low', 'completed',
   'Extra Pillows', 'Could I get 2 extra firm pillows?',
   now() - INTERVAL '1 day 5 hours', now() - INTERVAL '1 day 4 hours',
   '00000000-0000-0000-0003-000000000001', 'Maria Garcia', now() - INTERVAL '1 day 4 hours 30 minutes', now() - INTERVAL '1 day 4 hours',
   4, 'Quick service, thank you!'),
  ('00000000-0000-0000-0007-000000000012', '00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000001', 'Emma & David Chen', '104', 'housekeeping', 'medium', 'pending',
   'Crib Setup', 'We need a baby crib set up in the room please.',
   now() - INTERVAL '20 minutes', now() - INTERVAL '20 minutes',
   NULL, NULL, NULL, NULL, NULL, NULL),

  -- Maintenance requests
  ('00000000-0000-0000-0007-000000000013', '00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000002', 'Klaus Weber', '205', 'maintenance', 'high', 'in-progress',
   'Shower Leak', 'The shower head is dripping constantly even when turned off.',
   now() - INTERVAL '4 hours', now() - INTERVAL '2 hours',
   '00000000-0000-0000-0003-000000000006', 'Roberto Jimenez', now() - INTERVAL '2 hours', NULL, NULL, NULL),
  ('00000000-0000-0000-0007-000000000014', '00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000002', 'Sofia Martinez', '206', 'maintenance', 'medium', 'completed',
   'Light Bulb Replacement', 'The reading light above the bed is burned out.',
   now() - INTERVAL '3 days', now() - INTERVAL '2 days 22 hours',
   '00000000-0000-0000-0003-000000000006', 'Roberto Jimenez', now() - INTERVAL '2 days 23 hours', now() - INTERVAL '2 days 22 hours',
   5, 'Fixed in no time!'),
  ('00000000-0000-0000-0007-000000000015', '00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000002', 'Yuki Tanaka', '303', 'maintenance', 'urgent', 'pending',
   'No Hot Water', 'There is no hot water in the bathroom. Cold water only.',
   now() - INTERVAL '15 minutes', now() - INTERVAL '15 minutes',
   NULL, NULL, NULL, NULL, NULL, NULL),

  -- Concierge requests
  ('00000000-0000-0000-0007-000000000016', '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000003', 'Marco Rossi', '103', 'concierge', 'low', 'completed',
   'Surfboard Rental', 'Where can I rent a surfboard nearby? Looking for a half-day rental.',
   now() - INTERVAL '1 day', now() - INTERVAL '20 hours',
   '00000000-0000-0000-0003-000000000002', 'Carlos Mora', now() - INTERVAL '23 hours', now() - INTERVAL '20 hours',
   5, 'Carlos arranged everything. Great service!'),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000003', 'Emma & David Chen', '104', 'concierge', 'medium', 'assigned',
   'Birthday Surprise', 'Tomorrow is my husband birthday. Can you arrange a cake and flower decoration for the room?',
   now() - INTERVAL '2 hours', now() - INTERVAL '1 hour',
   '00000000-0000-0000-0003-000000000002', 'Carlos Mora', NULL, NULL, NULL, NULL),

  -- Front Desk requests
  ('00000000-0000-0000-0007-000000000018', '00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000004', 'Klaus Weber', '205', 'front_desk', 'medium', 'completed',
   'Late Checkout', 'Is it possible to get a late checkout at 2pm tomorrow?',
   now() - INTERVAL '6 hours', now() - INTERVAL '5 hours',
   '00000000-0000-0000-0003-000000000008', 'Patricia Solis', now() - INTERVAL '5 hours 30 minutes', now() - INTERVAL '5 hours',
   4, 'Request approved! Thank you.'),
  ('00000000-0000-0000-0007-000000000019', '00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000004', 'Yuki Tanaka', '303', 'front_desk', 'low', 'pending',
   'Safe Box Help', 'I cannot open the room safe. Need assistance please.',
   now() - INTERVAL '45 minutes', now() - INTERVAL '45 minutes',
   NULL, NULL, NULL, NULL, NULL, NULL),

  -- Spa requests
  ('00000000-0000-0000-0007-000000000020', '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000005', 'Sarah Johnson', '102', 'spa', 'low', 'completed',
   'Spa Product Inquiry', 'What brand of essential oils do you use? I d love to buy some.',
   now() - INTERVAL '1 day 8 hours', now() - INTERVAL '1 day 6 hours',
   '00000000-0000-0000-0003-000000000004', 'Laura Herrera', now() - INTERVAL '1 day 7 hours', now() - INTERVAL '1 day 6 hours',
   5, 'Laura was so helpful and gave me samples!'),

  -- Tours requests
  ('00000000-0000-0000-0007-000000000021', '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000006', 'Marco Rossi', '103', 'tours', 'medium', 'completed',
   'Private Tour Inquiry', 'Can I book a private sunset tour just for my group of 4?',
   now() - INTERVAL '2 days', now() - INTERVAL '1 day 20 hours',
   '00000000-0000-0000-0003-000000000005', 'Diego Ramirez', now() - INTERVAL '1 day 22 hours', now() - INTERVAL '1 day 20 hours',
   4, 'Diego set up a great private tour for us.'),

  -- Transportation requests
  ('00000000-0000-0000-0007-000000000022', '00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000008', 'Klaus Weber', '205', 'transportation', 'medium', 'in-progress',
   'Airport Transfer', 'Need airport transfer tomorrow at 10am to LIR airport.',
   now() - INTERVAL '5 hours', now() - INTERVAL '3 hours',
   '00000000-0000-0000-0003-000000000007', 'Fernando Vargas', now() - INTERVAL '3 hours', NULL, NULL, NULL),
  ('00000000-0000-0000-0007-000000000023', '00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000008', 'Sofia Martinez', '206', 'transportation', 'low', 'completed',
   'Taxi to Town', 'Need a taxi to Tamarindo town center around 6pm.',
   now() - INTERVAL '1 day', now() - INTERVAL '22 hours',
   '00000000-0000-0000-0003-000000000007', 'Fernando Vargas', now() - INTERVAL '23 hours', now() - INTERVAL '22 hours',
   5, 'Driver was on time and very friendly.'),

  -- Food & Beverage requests
  ('00000000-0000-0000-0007-000000000024', '00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000007', 'Emma & David Chen', '104', 'dining', 'medium', 'completed',
   'Room Service Breakfast', 'Could we get breakfast in our room tomorrow at 8am? 2x continental breakfast.',
   now() - INTERVAL '1 day 12 hours', now() - INTERVAL '1 day 3 hours',
   '00000000-0000-0000-0003-000000000003', 'Ana Rodriguez', now() - INTERVAL '1 day 4 hours', now() - INTERVAL '1 day 3 hours',
   5, 'Perfect breakfast, delivered right on time!'),
  ('00000000-0000-0000-0007-000000000025', '00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000007', 'Yuki Tanaka', '303', 'dining', 'low', 'assigned',
   'Vegan Menu Options', 'What vegan options are available at La Terraza for dinner tonight?',
   now() - INTERVAL '3 hours', now() - INTERVAL '2 hours',
   '00000000-0000-0000-0003-000000000003', 'Ana Rodriguez', NULL, NULL, NULL, NULL),

  -- General requests
  ('00000000-0000-0000-0007-000000000026', '00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000009', 'James & Lisa Park', '301', 'general', 'low', 'completed',
   'WiFi Password', 'What is the WiFi password for the resort network?',
   now() - INTERVAL '8 hours', now() - INTERVAL '7 hours 30 minutes',
   '00000000-0000-0000-0003-000000000008', 'Patricia Solis', now() - INTERVAL '7 hours 45 minutes', now() - INTERVAL '7 hours 30 minutes',
   3, 'Got the info, thanks.'),
  ('00000000-0000-0000-0007-000000000027', '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0001-000000000009', 'Sarah Johnson', '102', 'general', 'medium', 'pending',
   'Pool Towels', 'Are pool towels available at the pool or do we bring our own?',
   now() - INTERVAL '30 minutes', now() - INTERVAL '30 minutes',
   NULL, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. RESTAURANT RESERVATIONS (6 total: 1 existing + 5 new)
-- ============================================
INSERT INTO public.restaurant_reservations (id, restaurant_id, guest_id, property_id, guest_name, guest_email, guest_phone, room_number, reservation_date, time_slot, party_size, status, occasion, dietary_restrictions, seating_preference, special_requests, rating, feedback) VALUES
  ('00000000-0000-0000-0008-000000000002', '00000000-0000-0000-0004-000000000002', -- El Rancho
   '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001',
   'Sarah Johnson', 'sarah.j@email.com', '+1 555-0102', '102',
   CURRENT_DATE, '20:00', 1, 'confirmed', NULL, ARRAY['gluten-free'], 'bar', NULL, NULL, NULL),
  ('00000000-0000-0000-0008-000000000003', '00000000-0000-0000-0004-000000000001', -- La Terraza
   '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001',
   'Marco Rossi', 'marco.r@email.com', '+39 555-0103', '103',
   CURRENT_DATE, '19:30', 3, 'seated', NULL, NULL, 'outdoor', 'Group of friends visiting from Italy',
   NULL, NULL),
  ('00000000-0000-0000-0008-000000000004', '00000000-0000-0000-0004-000000000003', -- Beach Bar
   '00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001',
   'Emma & David Chen', 'emma.chen@email.com', '+1 555-0104', '104',
   CURRENT_DATE + INTERVAL '1 day', '12:30', 2, 'pending', NULL, ARRAY['vegan'], 'any', NULL,
   NULL, NULL),
  ('00000000-0000-0000-0008-000000000005', '00000000-0000-0000-0004-000000000001', -- La Terraza
   '00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000001',
   'Klaus Weber', 'klaus.w@email.com', '+49 555-0105', '205',
   CURRENT_DATE - INTERVAL '1 day', '20:00', 2, 'completed', 'Last dinner', NULL, 'window',
   'Farewell dinner before checkout.',
   5, 'Outstanding experience. The steak was perfectly cooked.'),
  ('00000000-0000-0000-0008-000000000006', '00000000-0000-0000-0004-000000000002', -- El Rancho
   '00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000001',
   'Sofia Martinez', 'sofia.m@email.com', '+506 555-0106', '206',
   CURRENT_DATE - INTERVAL '2 days', '19:00', 4, 'completed', 'Birthday', ARRAY['vegetarian', 'lactose-free'],
   'outdoor', 'Birthday celebration with friends.',
   4, 'Great food and ambiance. The birthday dessert was a lovely surprise!')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. SPA APPOINTMENTS (5 total: 1 existing + 4 new)
-- ============================================
INSERT INTO public.spa_appointments (id, treatment_id, guest_id, property_id, guest_name, guest_email, guest_phone, room_number, treatment_name, treatment_duration, appointment_date, time_slot, guests, therapist_preference, pressure_level, status, special_requests, confirmed_at, rating, feedback) VALUES
  ('00000000-0000-0000-0009-000000000002', '00000000-0000-0000-0005-000000000002', -- Couples Relaxation
   '00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001',
   'Emma & David Chen', 'emma.chen@email.com', '+1 555-0104', '104',
   'Couples Relaxation Ritual', 90,
   CURRENT_DATE + INTERVAL '2 days', '10:00', 2, 'no_preference', 'medium',
   'confirmed', 'It is our honeymoon! Any special touches would be appreciated.',
   now() - INTERVAL '1 hour', NULL, NULL),
  ('00000000-0000-0000-0009-000000000003', '00000000-0000-0000-0005-000000000003', -- Hydrating Facial
   '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001',
   'Sarah Johnson', 'sarah.j@email.com', '+1 555-0102', '102',
   'Hydrating Facial', 45,
   CURRENT_DATE + INTERVAL '1 day', '15:00', 1, 'no_preference', 'light',
   'pending', 'First time getting a facial, any tips?',
   NULL, NULL, NULL),
  ('00000000-0000-0000-0009-000000000004', '00000000-0000-0000-0005-000000000005', -- Tropical Wellness
   '00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0000-000000000001',
   'Yuki Tanaka', 'yuki.t@email.com', '+81 555-0109', '303',
   'Tropical Wellness Journey', 120,
   CURRENT_DATE, '08:00', 1, 'no_preference', 'light',
   'confirmed', 'Very interested in the sound healing component.',
   now() - INTERVAL '1 day', NULL, NULL),
  ('00000000-0000-0000-0009-000000000005', '00000000-0000-0000-0005-000000000001', -- Deep Tissue
   '00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000001',
   'Sofia Martinez', 'sofia.m@email.com', '+506 555-0106', '206',
   'Deep Tissue Massage', 60,
   CURRENT_DATE - INTERVAL '2 days', '14:00', 1, 'female', 'firm',
   'completed', 'Focus on neck and shoulders.',
   now() - INTERVAL '3 days',
   5, 'Best massage I have ever had. Laura is amazing!')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. TOUR BOOKINGS (5 total: 1 existing + 4 new)
-- ============================================
INSERT INTO public.tour_bookings (id, tour_id, guest_id, property_id, guest_name, guest_email, guest_phone, room_number, booking_date, time_slot, adults, children, total_participants, price_per_adult, price_per_child, total_price, currency, status, special_requests, rating, feedback) VALUES
  ('00000000-0000-0000-000a-000000000002', '00000000-0000-0000-0006-000000000002', -- Zip Line
   '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001',
   'Marco Rossi', 'marco.r@email.com', '+39 555-0103', '103',
   CURRENT_DATE + INTERVAL '1 day', '08:00',
   3, 0, 3, 95.00, 0.00, 285.00, 'USD', 'confirmed',
   'Group of 3 friends. We are all experienced with zip lines.',
   NULL, NULL),
  ('00000000-0000-0000-000a-000000000003', '00000000-0000-0000-0006-000000000003', -- Volcano
   '00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001',
   'Emma & David Chen', 'emma.chen@email.com', '+1 555-0104', '104',
   CURRENT_DATE + INTERVAL '3 days', '07:00',
   2, 0, 2, 130.00, 0.00, 260.00, 'USD', 'pending',
   'We are photographers — will there be time to stop for photos?',
   NULL, NULL),
  ('00000000-0000-0000-000a-000000000004', '00000000-0000-0000-0006-000000000004', -- Surf Lesson
   '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001',
   'Marco Rossi', 'marco.r@email.com', '+39 555-0103', '103',
   CURRENT_DATE - INTERVAL '1 day', '09:30',
   1, 0, 1, 60.00, 0.00, 60.00, 'USD', 'completed',
   'Complete beginner!',
   5, 'Caught my first wave! The instructor was super patient and fun.'),
  ('00000000-0000-0000-000a-000000000005', '00000000-0000-0000-0006-000000000001', -- Catamaran
   '00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000001',
   'Klaus Weber', 'klaus.w@email.com', '+49 555-0105', '205',
   CURRENT_DATE - INTERVAL '2 days', '15:30',
   2, 0, 2, 85.00, 0.00, 170.00, 'USD', 'completed',
   NULL,
   4, 'Beautiful sunset, but the boat was quite crowded.')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. NOTIFICATIONS FOR ALEX DEMO
-- ============================================
INSERT INTO public.notifications (id, property_id, user_id, user_type, title, body, type, category, is_read, action_url, related_id, related_type, created_at) VALUES
  ('00000000-0000-0000-000b-000000000001', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0002-000000000001', 'guest',
   'Welcome to Demo Beach Resort!', 'Enjoy your stay. Explore our restaurants, spa, and tours.',
   'info', 'system', true, NULL, NULL, NULL, now() - INTERVAL '5 days'),
  ('00000000-0000-0000-000b-000000000002', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0002-000000000001', 'guest',
   'Restaurant Recommendation Complete', 'Carlos Mora has responded to your request.',
   'success', 'service_request', true, NULL, '00000000-0000-0000-0007-000000000003', 'service_request', now() - INTERVAL '20 hours'),
  ('00000000-0000-0000-000b-000000000003', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0002-000000000001', 'guest',
   'Reservation Pending', 'Your reservation at La Terraza for tomorrow at 7pm is being reviewed.',
   'info', 'reservation', true, NULL, '00000000-0000-0000-0008-000000000001', 'reservation', now() - INTERVAL '3 hours'),
  ('00000000-0000-0000-000b-000000000004', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0002-000000000001', 'guest',
   'Spa Appointment Confirmed', 'Your Deep Tissue Massage on ' || to_char(CURRENT_DATE + INTERVAL '2 days', 'Mon DD') || ' at 10:30 is confirmed.',
   'success', 'appointment', true, NULL, '00000000-0000-0000-0009-000000000001', 'appointment', now() - INTERVAL '2 hours'),
  ('00000000-0000-0000-000b-000000000005', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0002-000000000001', 'guest',
   'Tour Booking Received', 'Your Sunset Catamaran Cruise booking is being processed.',
   'info', 'booking', false, NULL, '00000000-0000-0000-000a-000000000001', 'booking', now() - INTERVAL '1 hour'),
  ('00000000-0000-0000-000b-000000000006', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0002-000000000001', 'guest',
   'Extra Towels Request Received', 'Your housekeeping request has been received and will be handled shortly.',
   'info', 'service_request', false, NULL, '00000000-0000-0000-0007-000000000001', 'service_request', now() - INTERVAL '1 hour'),
  ('00000000-0000-0000-000b-000000000007', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0002-000000000001', 'guest',
   'AC Repair In Progress', 'A technician has been assigned to fix your AC unit.',
   'action', 'service_request', false, NULL, '00000000-0000-0000-0007-000000000002', 'service_request', now() - INTERVAL '1 hour'),
  ('00000000-0000-0000-000b-000000000008', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0002-000000000001', 'guest',
   'Rate Your Experience', 'How was your restaurant recommendation from Carlos?',
   'action', 'service_request', false, NULL, '00000000-0000-0000-0007-000000000003', 'service_request', now() - INTERVAL '18 hours'),
  -- Staff notifications
  ('00000000-0000-0000-000b-000000000009', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0003-000000000001', 'staff',
   'New Housekeeping Request', 'Room 104: Crib Setup requested by Emma & David Chen.',
   'action', 'service_request', false, NULL, '00000000-0000-0000-0007-000000000012', 'service_request', now() - INTERVAL '20 minutes'),
  ('00000000-0000-0000-000b-000000000010', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0003-000000000006', 'staff',
   'Urgent: No Hot Water', 'Room 303: Yuki Tanaka reports no hot water. Priority: urgent.',
   'warning', 'service_request', false, NULL, '00000000-0000-0000-0007-000000000015', 'service_request', now() - INTERVAL '15 minutes'),
  ('00000000-0000-0000-000b-000000000011', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0003-000000000002', 'staff',
   'Birthday Arrangement Request', 'Room 104: Birthday cake and flower decoration needed for tomorrow.',
   'action', 'service_request', false, NULL, '00000000-0000-0000-0002-000000000004', 'service_request', now() - INTERVAL '2 hours'),
  ('00000000-0000-0000-000b-000000000012', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0003-000000000001', 'staff',
   'Guest Rating Received', 'Sarah Johnson rated your service 5 stars: "Maria did an excellent job!"',
   'success', 'service_request', true, NULL, '00000000-0000-0000-0007-000000000010', 'service_request', now() - INTERVAL '1 day 20 hours')
ON CONFLICT (id) DO NOTHING;
