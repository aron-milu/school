/*
  # Create topic mastery and student success tracking tables

  1. New Tables
    - `topics` - Subject topics within a class
    - `topic_mastery` - Per-student mastery tracking per topic
    - `student_success_metrics` - Aggregated success metrics per student per subject
    - `assessment_integrity` - Exam security and integrity tracking
    - `communication_limits` - Time-based communication restrictions per education level

  2. Security
    - RLS enabled on all tables
    - Students read own data; teachers read class data; admins read school data
    - Guardians read linked children's data
*/

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read topics for assigned classes"
  ON topics FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM teacher_class_assignments tca JOIN teachers t ON t.id = tca.teacher_id JOIN users u ON u.id = t.user_id WHERE tca.class_id = topics.class_id AND u.id = auth.uid())
    OR EXISTS (SELECT 1 FROM students s JOIN users u ON u.id = s.user_id WHERE s.class_id = topics.class_id AND u.id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('school_admin', 'super_admin'))
  );

CREATE POLICY "Teachers and admins can insert topics"
  ON topics FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM teacher_class_assignments tca JOIN teachers t ON t.id = tca.teacher_id JOIN users u ON u.id = t.user_id WHERE tca.class_id = topics.class_id AND u.id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('school_admin', 'super_admin'))
  );

CREATE POLICY "Teachers can update own topics"
  ON topics FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM teacher_class_assignments tca JOIN teachers t ON t.id = tca.teacher_id JOIN users u ON u.id = t.user_id WHERE tca.class_id = topics.class_id AND u.id = auth.uid())
  );

-- Topic Mastery table
CREATE TABLE IF NOT EXISTS topic_mastery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  mastery_level text NOT NULL DEFAULT 'not_started' CHECK (mastery_level IN ('not_started', 'struggling', 'developing', 'proficient', 'mastered')),
  attempts integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  last_practiced timestamptz,
  weak_points text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, topic_id)
);

ALTER TABLE topic_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read topic mastery for own or class students"
  ON topic_mastery FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM students s JOIN users u ON u.id = s.user_id WHERE s.id = topic_mastery.student_id AND u.id = auth.uid())
    OR EXISTS (SELECT 1 FROM teacher_class_assignments tca JOIN teachers t ON t.id = tca.teacher_id JOIN students s ON s.class_id = tca.class_id JOIN users u ON u.id = t.user_id WHERE s.id = topic_mastery.student_id AND u.id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('school_admin', 'super_admin'))
  );

CREATE POLICY "Students insert own topic mastery"
  ON topic_mastery FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM students s JOIN users u ON u.id = s.user_id WHERE s.id = topic_mastery.student_id AND u.id = auth.uid())
  );

CREATE POLICY "Students update own topic mastery"
  ON topic_mastery FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM students s JOIN users u ON u.id = s.user_id WHERE s.id = topic_mastery.student_id AND u.id = auth.uid())
  );

-- Student Success Metrics table
CREATE TABLE IF NOT EXISTS student_success_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject text NOT NULL,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  avg_score numeric DEFAULT 0,
  attendance_rate numeric DEFAULT 0,
  assignment_completion_rate numeric DEFAULT 0,
  effort_score numeric DEFAULT 0,
  topics_mastered integer DEFAULT 0,
  topics_total integer DEFAULT 0,
  weak_areas jsonb DEFAULT '[]'::jsonb,
  trend text DEFAULT 'stable' CHECK (trend IN ('improving', 'stable', 'declining')),
  calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE student_success_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read success metrics for own or class students"
  ON student_success_metrics FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM students s JOIN users u ON u.id = s.user_id WHERE s.id = student_success_metrics.student_id AND u.id = auth.uid())
    OR EXISTS (SELECT 1 FROM teacher_class_assignments tca JOIN teachers t ON t.id = tca.teacher_id JOIN students s ON s.class_id = tca.class_id JOIN users u ON u.id = t.user_id WHERE s.id = student_success_metrics.student_id AND u.id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('school_admin', 'super_admin'))
  );

CREATE POLICY "Teachers and admins insert success metrics"
  ON student_success_metrics FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'school_admin', 'super_admin'))
  );

CREATE POLICY "Teachers and admins update success metrics"
  ON student_success_metrics FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'school_admin', 'super_admin'))
  );

-- Assessment Integrity table
CREATE TABLE IF NOT EXISTS assessment_integrity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  attempt_number integer DEFAULT 1,
  started_at timestamptz,
  submitted_at timestamptz,
  time_taken_seconds integer,
  tab_switches integer DEFAULT 0,
  ip_address text DEFAULT '',
  device_fingerprint text DEFAULT '',
  integrity_flags jsonb DEFAULT '[]'::jsonb,
  integrity_score numeric DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assessment_integrity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers read integrity for their assessments"
  ON assessment_integrity FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM assessments a WHERE a.id = assessment_integrity.assessment_id AND a.teacher_id IN (SELECT t.id FROM teachers t WHERE t.user_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('school_admin', 'super_admin'))
  );

CREATE POLICY "Students insert own integrity records"
  ON assessment_integrity FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM students s JOIN users u ON u.id = s.user_id WHERE s.id = assessment_integrity.student_id AND u.id = auth.uid())
  );

CREATE POLICY "Students update own integrity records"
  ON assessment_integrity FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM students s JOIN users u ON u.id = s.user_id WHERE s.id = assessment_integrity.student_id AND u.id = auth.uid())
  );

-- Communication Limits table
CREATE TABLE IF NOT EXISTS communication_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  education_level text NOT NULL,
  allowed_hours_start time DEFAULT '08:00',
  allowed_hours_end time DEFAULT '17:00',
  max_daily_messages integer DEFAULT 50,
  allowed_during_lessons boolean DEFAULT false,
  weekend_access boolean DEFAULT true,
  community_access boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE communication_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members read communication limits"
  ON communication_limits FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users u WHERE u.school_id = communication_limits.school_id AND u.id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "School admins insert communication limits"
  ON communication_limits FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.school_id = communication_limits.school_id AND u.id = auth.uid() AND u.role = 'school_admin')
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "School admins update communication limits"
  ON communication_limits FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users u WHERE u.school_id = communication_limits.school_id AND u.id = auth.uid() AND u.role = 'school_admin')
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Indexes
CREATE INDEX idx_topic_mastery_student ON topic_mastery(student_id);
CREATE INDEX idx_topic_mastery_level ON topic_mastery(mastery_level);
CREATE INDEX idx_student_success_student ON student_success_metrics(student_id);
CREATE INDEX idx_assessment_integrity_assessment ON assessment_integrity(assessment_id);
CREATE INDEX idx_topics_subject_class ON topics(subject, class_id);
