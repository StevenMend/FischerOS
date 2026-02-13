-- ============================================
-- 030: DEMO SEED DATA
-- ============================================
-- Generic demo data for testing the full flow.
-- NOT tied to any specific hotel.
-- Run after all table + RLS migrations.
--
-- IMPORTANT: This seed creates auth.users entries.
-- In a real Supabase project, you'd create users via
-- the Auth API or Dashboard. These INSERTs work when
-- running locally with `supabase db reset`.
-- ============================================

-- ============================================
-- 1. PROPERTY
-- ============================================
INSERT INTO public.properties (id, name, code, description, address, phone, email, website, timezone, currency)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Beach Resort',
  'demo-resort',
  'A beautiful beachfront resort for platform demos and testing',
  '123 Ocean Drive, Playa Demo, Costa Rica',
  '+506 2222-0000',
  'info@demo-resort.com',
  'https://demo-resort.com',
  'America/Costa_Rica',
  'USD'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. DEPARTMENTS
-- ============================================
INSERT INTO public.departments (id, property_id, name, code) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Housekeeping', 'HK'),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Maintenance', 'MT'),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Concierge', 'CO'),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000001', 'Front Desk', 'FD'),
  ('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000001', 'Spa & Wellness', 'SP'),
  ('00000000-0000-0000-0001-000000000006', '00000000-0000-0000-0000-000000000001', 'Tours & Activities', 'TO'),
  ('00000000-0000-0000-0001-000000000007', '00000000-0000-0000-0000-000000000001', 'Food & Beverage', 'FB'),
  ('00000000-0000-0000-0001-000000000008', '00000000-0000-0000-0000-000000000001', 'Transportation', 'TR'),
  ('00000000-0000-0000-0001-000000000009', '00000000-0000-0000-0000-000000000001', 'General Services', 'GR')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. AUTH USERS (for local dev with supabase db reset)
-- ============================================
-- Guest user: guest-101@hotel.local / DEMO01
-- Staff HK:   staff-hk@demo-resort.com / staff123
-- Staff CO:   staff-co@demo-resort.com / staff123
-- Staff FB:   staff-fb@demo-resort.com / staff123

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES
  -- Guest
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000000',
   'guest-101@hotel.local',
   crypt('DEMO01', gen_salt('bf')),
   now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  -- Staff: Housekeeping
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-000000000000',
   'staff-hk@demo-resort.com',
   crypt('staff123', gen_salt('bf')),
   now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  -- Staff: Concierge
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-000000000000',
   'staff-co@demo-resort.com',
   crypt('staff123', gen_salt('bf')),
   now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  -- Staff: Food & Beverage
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0000-000000000000',
   'staff-fb@demo-resort.com',
   crypt('staff123', gen_salt('bf')),
   now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Also create identities (required for Supabase Auth to work)
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0002-000000000001',
   '{"sub":"00000000-0000-0000-0002-000000000001","email":"guest-101@hotel.local"}',
   'email', '00000000-0000-0000-0002-000000000001', now(), now(), now()),
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0003-000000000001',
   '{"sub":"00000000-0000-0000-0003-000000000001","email":"staff-hk@demo-resort.com"}',
   'email', '00000000-0000-0000-0003-000000000001', now(), now(), now()),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0003-000000000002',
   '{"sub":"00000000-0000-0000-0003-000000000002","email":"staff-co@demo-resort.com"}',
   'email', '00000000-0000-0000-0003-000000000002', now(), now(), now()),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0003-000000000003',
   '{"sub":"00000000-0000-0000-0003-000000000003","email":"staff-fb@demo-resort.com"}',
   'email', '00000000-0000-0000-0003-000000000003', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. GUEST
-- ============================================
INSERT INTO public.guests (id, property_id, name, email, phone, room_number, confirmation_code, check_in, check_out, status)
VALUES (
  '00000000-0000-0000-0002-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Alex Demo',
  'alex@example.com',
  '+1 555-0100',
  '101',
  'DEMO01',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '5 days',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. RESTAURANTS
-- ============================================
INSERT INTO public.restaurants (id, property_id, slug, name, cuisine, description, short_description, location, hours_open, hours_close, hours_text, dress_code, atmosphere, price_range, avg_price_per_person, currency, total_tables, max_party_size, specialties, dietary_support, accepts_walkins, reservation_required, rating, is_active, is_featured) VALUES
(
  '00000000-0000-0000-0004-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'la-terraza',
  'La Terraza',
  'International',
  'Open-air restaurant with panoramic ocean views serving international cuisine with local ingredients. Our chef creates seasonal menus that blend Costa Rican flavors with global techniques.',
  'Ocean-view international dining',
  'Main Building, 2nd Floor',
  '07:00', '22:00', '7:00 AM - 10:00 PM',
  'Smart Casual',
  'Elegant open-air with ocean breeze',
  '$$$',
  45.00, 'USD', 25, 8,
  ARRAY['Seafood Paella', 'Grilled Mahi-Mahi', 'Tropical Ceviche'],
  ARRAY['vegetarian', 'vegan', 'gluten-free'],
  true, false, 4.5, true, true
),
(
  '00000000-0000-0000-0004-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'el-rancho',
  'El Rancho',
  'Steakhouse',
  'Premium cuts grilled over wood fire in a rustic ranch setting. Featuring dry-aged steaks, craft cocktails, and an extensive wine list from South American vineyards.',
  'Wood-fired steakhouse',
  'Pool Area, West Wing',
  '17:00', '23:00', '5:00 PM - 11:00 PM',
  'Smart Casual',
  'Rustic ranch with ambient lighting',
  '$$$$',
  65.00, 'USD', 18, 6,
  ARRAY['Dry-Aged Ribeye', 'Chimichurri Skirt Steak', 'Grilled Lobster Tail'],
  ARRAY['gluten-free'],
  false, true, 4.7, true, true
),
(
  '00000000-0000-0000-0004-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'beach-bar',
  'Beach Bar & Grill',
  'Casual',
  'Relaxed beachfront bar serving fresh cocktails, cold beers, and casual bites. Perfect for sunset drinks and light meals with your toes in the sand.',
  'Beachfront drinks & bites',
  'Beachfront',
  '10:00', '20:00', '10:00 AM - 8:00 PM',
  'Casual',
  'Laid-back beach vibes',
  '$$',
  20.00, 'USD', 15, 10,
  ARRAY['Fish Tacos', 'Tropical Smoothies', 'Nachos Supreme'],
  ARRAY['vegetarian', 'vegan'],
  true, false, 4.3, true, false
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. STAFF
-- ============================================
INSERT INTO public.staff (id, property_id, department_id, restaurant_id, name, email, department, role) VALUES
(
  '00000000-0000-0000-0003-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0001-000000000001', -- Housekeeping
  NULL,
  'Maria Garcia',
  'staff-hk@demo-resort.com',
  'Housekeeping',
  'supervisor'
),
(
  '00000000-0000-0000-0003-000000000002',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0001-000000000003', -- Concierge
  NULL,
  'Carlos Mora',
  'staff-co@demo-resort.com',
  'Concierge',
  'agent'
),
(
  '00000000-0000-0000-0003-000000000003',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0001-000000000007', -- Food & Beverage
  '00000000-0000-0000-0004-000000000001', -- La Terraza
  'Ana Rodriguez',
  'staff-fb@demo-resort.com',
  'Food & Beverage',
  'manager'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. SPA TREATMENTS
-- ============================================
INSERT INTO public.spa_treatments (id, property_id, name, slug, description, short_description, category, type, modality, price, duration, benefits, techniques, recommended_for, restrictions, is_featured, is_active, available_times, display_order) VALUES
(
  '00000000-0000-0000-0005-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Deep Tissue Massage',
  'deep-tissue-massage',
  'Targeted deep pressure massage to release chronic muscle tension and knots. Uses slow, firm strokes to reach deeper layers of muscle and fascia.',
  'Release deep muscle tension',
  'massage', 'massage', 'individual',
  120.00, 60,
  ARRAY['Relieves chronic pain', 'Improves mobility', 'Reduces muscle tension'],
  ARRAY['Deep pressure', 'Trigger point therapy', 'Myofascial release'],
  ARRAY['Athletes', 'Desk workers', 'Chronic pain sufferers'],
  ARRAY['Not recommended during pregnancy', 'Avoid with recent injuries'],
  true, true,
  ARRAY['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'],
  1
),
(
  '00000000-0000-0000-0005-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Couples Relaxation Ritual',
  'couples-relaxation-ritual',
  'Share a blissful experience with your partner. Includes aromatherapy massage, hot stones, and a glass of sparkling wine in our private couples suite.',
  'Romantic shared spa experience',
  'massage', 'massage', 'couple',
  250.00, 90,
  ARRAY['Deep relaxation', 'Shared bonding', 'Stress relief'],
  ARRAY['Swedish massage', 'Hot stone therapy', 'Aromatherapy'],
  ARRAY['Couples', 'Anniversaries', 'Honeymoons'],
  ARRAY['Minimum age 18'],
  true, true,
  ARRAY['10:00', '13:00', '16:00'],
  2
),
(
  '00000000-0000-0000-0005-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'Hydrating Facial',
  'hydrating-facial',
  'Deeply nourishing facial treatment using marine collagen and hyaluronic acid. Restores moisture, plumps fine lines, and leaves skin glowing.',
  'Restore skin moisture and glow',
  'facial', 'treatment', 'individual',
  95.00, 45,
  ARRAY['Deep hydration', 'Anti-aging', 'Improved skin texture'],
  ARRAY['Marine collagen mask', 'Hyaluronic serum', 'LED light therapy'],
  ARRAY['Dry skin', 'Sun-exposed skin', 'Anti-aging'],
  ARRAY['Avoid with active acne', 'Patch test for sensitive skin'],
  false, true,
  ARRAY['09:00', '11:00', '13:00', '15:00'],
  3
),
(
  '00000000-0000-0000-0005-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'Volcanic Clay Body Wrap',
  'volcanic-clay-body-wrap',
  'Detoxifying body treatment using locally-sourced volcanic clay. Draws out impurities, mineralizes the skin, and promotes deep relaxation.',
  'Detoxifying volcanic clay treatment',
  'body_treatment', 'treatment', 'individual',
  140.00, 75,
  ARRAY['Detoxification', 'Skin mineralization', 'Improved circulation'],
  ARRAY['Clay application', 'Body wrap', 'Thermal blanket'],
  ARRAY['Detox seekers', 'Skin health', 'Relaxation'],
  ARRAY['Not for claustrophobic clients', 'Avoid with open wounds'],
  false, true,
  ARRAY['10:00', '14:00', '16:00'],
  4
),
(
  '00000000-0000-0000-0005-000000000005',
  '00000000-0000-0000-0000-000000000001',
  'Tropical Wellness Journey',
  'tropical-wellness-journey',
  'A holistic 2-hour wellness experience combining meditation, gentle stretching, aromatherapy massage, and sound healing. Designed to reset mind and body.',
  'Complete mind-body reset',
  'wellness', 'therapy', 'individual',
  200.00, 120,
  ARRAY['Mental clarity', 'Physical relaxation', 'Emotional balance'],
  ARRAY['Guided meditation', 'Gentle yoga', 'Sound healing', 'Aromatherapy'],
  ARRAY['Stress management', 'Burnout recovery', 'Mindfulness seekers'],
  ARRAY['Consult if pregnant', 'Not suitable for severe mobility issues'],
  true, true,
  ARRAY['08:00', '14:00'],
  5
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. TOURS
-- ============================================
INSERT INTO public.tours (id, property_id, slug, name, description, short_description, category, difficulty, duration, duration_hours, price_adult, price_child, currency, min_participants, max_participants, rating, review_count, includes, excludes, what_to_bring, meeting_point, departure_times, is_featured, is_active) VALUES
(
  '00000000-0000-0000-0006-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'sunset-catamaran',
  'Sunset Catamaran Cruise',
  'Sail along the Pacific coast on a luxury catamaran as the sun sets over the ocean. Includes open bar with premium drinks, fresh tropical fruit, and snorkeling at a secluded bay. Watch for dolphins and sea turtles.',
  'Sail into the sunset with drinks and snorkeling',
  'Aquatic', 'easy',
  '3 hours', 3.0,
  85.00, 55.00, 'USD',
  4, 30, 4.8, 142,
  ARRAY['Open bar', 'Snorkeling gear', 'Tropical fruit', 'Sunset viewing'],
  ARRAY['Photos (available for purchase)', 'Gratuities'],
  ARRAY['Swimsuit', 'Sunscreen', 'Towel', 'Camera'],
  'Marina Dock, Gate 3',
  ARRAY['15:30', '16:00'],
  true, true
),
(
  '00000000-0000-0000-0006-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'rainforest-zip-line',
  'Rainforest Zip Line Adventure',
  'Soar through the jungle canopy on 12 zip lines spanning over 3 kilometers. Cross hanging bridges, spot monkeys and toucans, and experience an adrenaline-pumping rappel descent. Professional guides ensure your safety throughout.',
  'Fly through the jungle canopy',
  'Adventure', 'moderate',
  '4 hours', 4.0,
  95.00, 65.00, 'USD',
  2, 16, 4.9, 234,
  ARRAY['All equipment', 'Safety briefing', 'Guide', 'Water', 'Fruit snack'],
  ARRAY['Transportation', 'Lunch', 'Tips'],
  ARRAY['Closed-toe shoes', 'Comfortable clothes', 'Bug spray', 'Camera with strap'],
  'Lobby, Adventure Desk',
  ARRAY['08:00', '13:00'],
  true, true
),
(
  '00000000-0000-0000-0006-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'volcano-hot-springs',
  'Volcano & Hot Springs Day Trip',
  'Full-day excursion to a nearby volcano with guided nature hike through primary forest. Afternoon relaxation in natural thermal hot springs fed by volcanic activity. Includes lunch at a traditional restaurant.',
  'Hike a volcano then soak in hot springs',
  'Cultural', 'moderate',
  '8 hours', 8.0,
  130.00, 85.00, 'USD',
  4, 20, 4.7, 189,
  ARRAY['Round-trip transport', 'Guide', 'Park entrance', 'Hot springs entry', 'Lunch'],
  ARRAY['Dinner', 'Souvenirs', 'Tips'],
  ARRAY['Hiking shoes', 'Rain jacket', 'Swimsuit', 'Change of clothes', 'Camera'],
  'Lobby, Main Entrance',
  ARRAY['07:00'],
  false, true
),
(
  '00000000-0000-0000-0006-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'surf-lesson',
  'Beginner Surf Lesson',
  'Learn to surf on gentle beach breaks with certified instructors. Includes theory on ocean safety, on-land practice, and 1.5 hours in the water. Boards and rash guards provided. Small groups for personalized attention.',
  'Catch your first wave',
  'Aquatic', 'easy',
  '2.5 hours', 2.5,
  60.00, 45.00, 'USD',
  1, 6, 4.6, 98,
  ARRAY['Board rental', 'Rash guard', 'Instructor', 'Water'],
  ARRAY['Photos', 'Transportation'],
  ARRAY['Swimsuit', 'Sunscreen', 'Towel'],
  'Beach Hut, Surf Station',
  ARRAY['07:00', '09:30', '14:00'],
  false, true
),
(
  '00000000-0000-0000-0006-000000000005',
  '00000000-0000-0000-0000-000000000001',
  'night-wildlife-walk',
  'Nocturnal Wildlife Walk',
  'Guided night walk through protected forest trails to observe nocturnal wildlife. Spot tree frogs, sleeping birds, insects, and with luck, kinkajous and night monkeys. Professional naturalist guide with night vision equipment.',
  'Discover the jungle after dark',
  'Cultural', 'easy',
  '2 hours', 2.0,
  45.00, 30.00, 'USD',
  2, 10, 4.5, 67,
  ARRAY['Naturalist guide', 'Flashlight', 'Rubber boots'],
  ARRAY['Transportation', 'Tips', 'Snacks'],
  ARRAY['Long pants', 'Closed-toe shoes', 'Bug spray', 'Light jacket'],
  'Lobby, Nature Desk',
  ARRAY['18:30', '19:00'],
  false, true
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. SERVICE REQUESTS (3 in different states)
-- ============================================
INSERT INTO public.service_requests (id, guest_id, property_id, department_id, guest_name, room_number, type, priority, status, title, description, created_at, updated_at) VALUES
(
  '00000000-0000-0000-0007-000000000001',
  '00000000-0000-0000-0002-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0001-000000000001', -- Housekeeping
  'Alex Demo', '101',
  'housekeeping', 'medium', 'pending',
  'Extra Towels',
  'Could I get 2 extra bath towels and 1 hand towel, please?',
  now() - INTERVAL '1 hour',
  now() - INTERVAL '1 hour'
),
(
  '00000000-0000-0000-0007-000000000002',
  '00000000-0000-0000-0002-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0001-000000000002', -- Maintenance
  'Alex Demo', '101',
  'maintenance', 'high', 'in-progress',
  'AC Not Cooling',
  'The air conditioning unit is running but not cooling the room. The temperature stays at 28°C even on the lowest setting.',
  now() - INTERVAL '3 hours',
  now() - INTERVAL '1 hour'
),
(
  '00000000-0000-0000-0007-000000000003',
  '00000000-0000-0000-0002-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0001-000000000003', -- Concierge
  'Alex Demo', '101',
  'concierge', 'low', 'completed',
  'Restaurant Recommendation',
  'Looking for a good local seafood restaurant within walking distance.',
  now() - INTERVAL '1 day',
  now() - INTERVAL '20 hours'
)
ON CONFLICT (id) DO NOTHING;

-- Update the completed request with completion timestamp and rating
UPDATE public.service_requests
SET completed_at = now() - INTERVAL '20 hours',
    assigned_to = '00000000-0000-0000-0003-000000000002',
    assigned_to_name = 'Carlos Mora',
    rating = 5,
    feedback = 'Carlos gave us a great recommendation. We had an amazing dinner!'
WHERE id = '00000000-0000-0000-0007-000000000003';

-- Update the in-progress request with assignment
UPDATE public.service_requests
SET assigned_to = '00000000-0000-0000-0003-000000000001',
    assigned_to_name = 'Maria Garcia',
    started_at = now() - INTERVAL '1 hour',
    acknowledged_at = now() - INTERVAL '2 hours'
WHERE id = '00000000-0000-0000-0007-000000000002';

-- ============================================
-- 10. RESTAURANT RESERVATION (pending)
-- ============================================
INSERT INTO public.restaurant_reservations (id, restaurant_id, guest_id, property_id, guest_name, guest_email, guest_phone, room_number, reservation_date, time_slot, party_size, status, occasion, dietary_restrictions, seating_preference, special_requests)
VALUES (
  '00000000-0000-0000-0008-000000000001',
  '00000000-0000-0000-0004-000000000001', -- La Terraza
  '00000000-0000-0000-0002-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Alex Demo',
  'alex@example.com',
  '+1 555-0100',
  '101',
  CURRENT_DATE + INTERVAL '1 day',
  '19:00',
  2,
  'pending',
  'Anniversary dinner',
  ARRAY['vegetarian'],
  'window',
  'It is our anniversary — if possible a table with ocean view would be amazing.'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 11. SPA APPOINTMENT (confirmed)
-- ============================================
INSERT INTO public.spa_appointments (id, treatment_id, guest_id, property_id, guest_name, guest_email, guest_phone, room_number, treatment_name, treatment_duration, appointment_date, time_slot, guests, therapist_preference, pressure_level, status, special_requests, confirmed_at)
VALUES (
  '00000000-0000-0000-0009-000000000001',
  '00000000-0000-0000-0005-000000000001', -- Deep Tissue Massage
  '00000000-0000-0000-0002-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Alex Demo',
  'alex@example.com',
  '+1 555-0100',
  '101',
  'Deep Tissue Massage',
  60,
  CURRENT_DATE + INTERVAL '2 days',
  '10:30',
  1,
  'no_preference',
  'firm',
  'confirmed',
  'Focus on lower back and shoulders please.',
  now() - INTERVAL '2 hours'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 12. TOUR BOOKING (pending)
-- ============================================
INSERT INTO public.tour_bookings (id, tour_id, guest_id, property_id, guest_name, guest_email, guest_phone, room_number, booking_date, time_slot, adults, children, total_participants, price_per_adult, price_per_child, total_price, currency, status, special_requests)
VALUES (
  '00000000-0000-0000-000a-000000000001',
  '00000000-0000-0000-0006-000000000001', -- Sunset Catamaran
  '00000000-0000-0000-0002-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Alex Demo',
  'alex@example.com',
  '+1 555-0100',
  '101',
  CURRENT_DATE + INTERVAL '3 days',
  '15:30',
  2, 0, 2,
  85.00, 0.00, 170.00, 'USD',
  'pending',
  'We would like to sit at the front of the boat if possible.'
) ON CONFLICT (id) DO NOTHING;
