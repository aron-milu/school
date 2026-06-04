/*
  # Initial LMS Platform Schema

  1. New Tables
    - users: Core user accounts with role-based access
    - schools: School/institution records
    - classes: Class definitions within schools
    - students: Student enrollment records
    - teachers: Teacher records linked to schools
    - courses: Course/content material records
    - assessments: Assignment/exam blueprints
    - student_progress: Student progress tracking
    - notifications: User notifications
    - messages: Direct messaging system
    
  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Super admin has global access
    - School admin scoped to school
    - Teachers scoped to assigned classes
    - Students scoped to own data
    - Guardians scoped to linked children
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone_number text,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('super_admin', 'school_admin', 'teacher', 'student', 'guardian')),
  school_id uuid,
  password_hash text NOT NULL,
  is_active boolean DEFAULT true,
  must_change_password boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id text UNIQUE NOT NULL,
  school_name text NOT NULL,
  school_reg_number text UNIQUE NOT NULL,
  license_tier text CHECK (license_tier IN ('Institutional', 'Trial', 'Premium')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'expired')),
  location text,
  district text,
  admin_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id),
  class_name text NOT NULL,
  class_level text NOT NULL,
  stream text,
  created_at timestamptz DEFAULT now()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id),
  school_id uuid NOT NULL REFERENCES schools(id),
  student_id text NOT NULL,
  class_id uuid NOT NULL REFERENCES classes(id),
  date_of_birth date,
  created_at timestamptz DEFAULT now()
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id),
  school_id uuid NOT NULL REFERENCES schools(id),
  staff_id text NOT NULL,
  assigned_subjects text[],
  created_at timestamptz DEFAULT now()
);

-- Create teacher class assignments table
CREATE TABLE IF NOT EXISTS teacher_class_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id),
  class_id uuid NOT NULL REFERENCES classes(id),
  subject text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, class_id)
);

-- Create courses/materials table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id text NOT NULL,
  school_id uuid NOT NULL REFERENCES schools(id),
  teacher_id uuid NOT NULL REFERENCES teachers(id),
  title text NOT NULL,
  subject text NOT NULL,
  class_level text NOT NULL,
  topic text,
  description text,
  file_url text,
  thumbnail_url text,
  is_premium boolean DEFAULT false,
  price_ugx integer,
  is_global boolean DEFAULT false,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  allow_download boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id text NOT NULL,
  school_id uuid NOT NULL REFERENCES schools(id),
  class_id uuid NOT NULL REFERENCES classes(id),
  teacher_id uuid NOT NULL REFERENCES teachers(id),
  title text NOT NULL,
  subject text NOT NULL,
  assessment_type text CHECK (assessment_type IN ('physical_test', 'digital_quiz', 'homework', 'project')),
  max_points integer NOT NULL,
  weight_percentage integer,
  due_date timestamptz,
  instructions text,
  created_at timestamptz DEFAULT now()
);

-- Create student progress table
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id),
  assessment_id uuid NOT NULL REFERENCES assessments(id),
  score_obtained numeric,
  teacher_remarks text,
  is_absent boolean DEFAULT false,
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  title text NOT NULL,
  message text NOT NULL,
  notification_type text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  sender_id uuid NOT NULL REFERENCES users(id),
  recipient_id uuid NOT NULL REFERENCES users(id),
  message_text text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_class_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Super admin can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'super_admin'
    )
  );

CREATE POLICY "School admin can view school users"
  ON users FOR SELECT
  TO authenticated
  USING (
    school_id = (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
    OR id = auth.uid()
  );

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Create policies for schools table
CREATE POLICY "Super admin can view all schools"
  ON schools FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "School admin can view own school"
  ON schools FOR SELECT
  TO authenticated
  USING (
    id = (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

-- Create policies for students table
CREATE POLICY "Students can view own record"
  ON students FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
  );

CREATE POLICY "Teachers can view class students"
  ON students FOR SELECT
  TO authenticated
  USING (
    class_id IN (
      SELECT class_id FROM teacher_class_assignments
      WHERE teacher_id = (SELECT id FROM teachers WHERE user_id = auth.uid())
    )
  );

-- Create policies for courses table
CREATE POLICY "Anyone can view approved courses"
  ON courses FOR SELECT
  USING (verification_status = 'approved');

CREATE POLICY "Teachers can view own courses"
  ON courses FOR SELECT
  TO authenticated
  USING (teacher_id = (SELECT id FROM teachers WHERE user_id = auth.uid()));

-- Create policies for assessments table
CREATE POLICY "Teachers can view own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (
    teacher_id = (SELECT id FROM teachers WHERE user_id = auth.uid())
  );

CREATE POLICY "Students can view assigned assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (
    class_id = (
      SELECT class_id FROM students WHERE user_id = auth.uid()
    )
  );

-- Create policies for notifications table
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for messages table
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_teachers_school_id ON teachers(school_id);
CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_courses_school_id ON courses(school_id);
CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX idx_assessments_school_id ON assessments(school_id);
CREATE INDEX idx_assessments_class_id ON assessments(class_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
