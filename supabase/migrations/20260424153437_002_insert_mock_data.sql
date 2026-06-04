/*
  # Insert Mock Data for LMS Platform

  1. Mock Schools
    - Lubiri Secondary School (active)
    
  2. Mock Users by Role
    - 1 Super Admin
    - 1 School Admin
    - 1 Teacher
    - 1 Student
    - 1 Guardian
    
  3. Mock Classes, Students, Teachers
    - 3 Classes with students and teacher assignments
    
  4. Mock Courses and Assessments
    - Sample learning materials
    - Sample assignments
*/

-- Disable RLS temporarily for data insertion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE teachers DISABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_class_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE assessments DISABLE ROW LEVEL SECURITY;

-- Insert mock school
INSERT INTO schools (id, school_id, school_name, school_reg_number, license_tier, status, location, district)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'LUB-2026',
  'Lubiri Secondary School',
  'MOES/PSS/1234',
  'Institutional',
  'active',
  'Kampala',
  'Kampala'
) ON CONFLICT DO NOTHING;

-- Insert Super Admin (email: superadmin@example.com, password: password123)
INSERT INTO users (
  id,
  email,
  phone_number,
  full_name,
  role,
  password_hash,
  is_active,
  must_change_password
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'superadmin@example.com',
  '+256700000001',
  'Super Admin',
  'super_admin',
  '$2a$12$abc123def456ghi789jkl', -- Mock hash
  true,
  false
) ON CONFLICT DO NOTHING;

-- Insert School Admin
INSERT INTO users (
  id,
  email,
  phone_number,
  full_name,
  role,
  school_id,
  password_hash,
  is_active,
  must_change_password
) VALUES (
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'admin@example.com',
  '+256700000002',
  'School Admin',
  'school_admin',
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  '$2a$12$abc123def456ghi789jkl', -- Mock hash
  true,
  false
) ON CONFLICT DO NOTHING;

-- Update school admin in schools table
UPDATE schools SET admin_id = '550e8400-e29b-41d4-a716-446655440003'::uuid
WHERE id = '550e8400-e29b-41d4-a716-446655440001'::uuid;

-- Insert Teacher
INSERT INTO users (
  id,
  email,
  phone_number,
  full_name,
  role,
  school_id,
  password_hash,
  is_active,
  must_change_password
) VALUES (
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  'teacher@example.com',
  '+256700000003',
  'Mark Lee',
  'teacher',
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  '$2a$12$abc123def456ghi789jkl', -- Mock hash
  true,
  false
) ON CONFLICT DO NOTHING;

-- Insert Student
INSERT INTO users (
  id,
  email,
  phone_number,
  full_name,
  role,
  school_id,
  password_hash,
  is_active,
  must_change_password
) VALUES (
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  'student@example.com',
  '+256700000004',
  'Namuli Sarah',
  'student',
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  '$2a$12$abc123def456ghi789jkl', -- Mock hash
  true,
  false
) ON CONFLICT DO NOTHING;

-- Insert Guardian
INSERT INTO users (
  id,
  email,
  phone_number,
  full_name,
  role,
  school_id,
  password_hash,
  is_active,
  must_change_password
) VALUES (
  '550e8400-e29b-41d4-a716-446655440006'::uuid,
  'guardian@example.com',
  '+256700000005',
  'Guardian Parent',
  'guardian',
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  '$2a$12$abc123def456ghi789jkl', -- Mock hash
  true,
  false
) ON CONFLICT DO NOTHING;

-- Insert Classes
INSERT INTO classes (id, school_id, class_name, class_level, stream)
VALUES
  ('550e8400-e29b-41d4-a716-446655440010'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Senior 4 Blue', 'Senior 4', 'Blue'),
  ('550e8400-e29b-41d4-a716-446655440011'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Senior 4 Red', 'Senior 4', 'Red'),
  ('550e8400-e29b-41d4-a716-446655440012'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Senior 3 Green', 'Senior 3', 'Green')
ON CONFLICT DO NOTHING;

-- Insert Teacher record
INSERT INTO teachers (id, user_id, school_id, staff_id, assigned_subjects)
VALUES (
  '550e8400-e29b-41d4-a716-446655440020'::uuid,
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'LUB-TEA-042',
  ARRAY['Biology', 'Chemistry']
) ON CONFLICT DO NOTHING;

-- Insert Teacher-Class Assignments
INSERT INTO teacher_class_assignments (id, teacher_id, class_id, subject)
VALUES
  ('550e8400-e29b-41d4-a716-446655440030'::uuid, '550e8400-e29b-41d4-a716-446655440020'::uuid, '550e8400-e29b-41d4-a716-446655440010'::uuid, 'Biology'),
  ('550e8400-e29b-41d4-a716-446655440031'::uuid, '550e8400-e29b-41d4-a716-446655440020'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, 'Biology'),
  ('550e8400-e29b-41d4-a716-446655440032'::uuid, '550e8400-e29b-41d4-a716-446655440020'::uuid, '550e8400-e29b-41d4-a716-446655440012'::uuid, 'Biology')
ON CONFLICT DO NOTHING;

-- Insert Student record
INSERT INTO students (id, user_id, school_id, student_id, class_id)
VALUES (
  '550e8400-e29b-41d4-a716-446655440040'::uuid,
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'STU/2026/001',
  '550e8400-e29b-41d4-a716-446655440010'::uuid
) ON CONFLICT DO NOTHING;

-- Insert Sample Courses
INSERT INTO courses (
  id,
  material_id,
  school_id,
  teacher_id,
  title,
  subject,
  class_level,
  topic,
  description,
  is_premium,
  is_global,
  verification_status,
  allow_download
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440050'::uuid,
    'MAT-001',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440020'::uuid,
    'Operating System Fundamentals',
    'Biology',
    'Senior 4',
    'Cell Biology',
    'Learn the basic operating system abstractions, mechanisms, and their implementations.',
    false,
    true,
    'approved',
    true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440051'::uuid,
    'MAT-002',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440020'::uuid,
    'Artificial Intelligence Basics',
    'Biology',
    'Senior 4',
    'Genetics',
    'Intelligence demonstrated by machines, unlike the natural intelligence displayed by humans and animals.',
    false,
    true,
    'approved',
    true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440052'::uuid,
    'MAT-003',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440020'::uuid,
    'Software Engineering Principles',
    'Biology',
    'Senior 4',
    'Evolution',
    'Learn detailed engineering to the design, development and maintenance of software.',
    false,
    true,
    'approved',
    true
  )
ON CONFLICT DO NOTHING;

-- Insert Sample Assessments
INSERT INTO assessments (
  id,
  assessment_id,
  school_id,
  class_id,
  teacher_id,
  title,
  subject,
  assessment_type,
  max_points,
  weight_percentage,
  due_date,
  instructions
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440060'::uuid,
    'ASS-101',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440010'::uuid,
    '550e8400-e29b-41d4-a716-446655440020'::uuid,
    'Mid-Term Biology',
    'Biology',
    'digital_quiz',
    100,
    30,
    '2026-04-20 08:00:00+00:00',
    'Answer all questions within the time limit'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440061'::uuid,
    'ASS-102',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440010'::uuid,
    '550e8400-e29b-41d4-a716-446655440020'::uuid,
    'Genetics Problem Set',
    'Biology',
    'homework',
    50,
    20,
    '2026-04-22 18:00:00+00:00',
    'Solve 10 genetics problems and submit as PDF'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440062'::uuid,
    'ASS-103',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '550e8400-e29b-41d4-a716-446655440010'::uuid,
    '550e8400-e29b-41d4-a716-446655440020'::uuid,
    'Final Biology Exam',
    'Biology',
    'physical_test',
    100,
    50,
    '2026-05-15 09:00:00+00:00',
    'Written exam - bring your student ID'
  )
ON CONFLICT DO NOTHING;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_class_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
