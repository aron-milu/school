export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'guardian';

export type EducationLevel = 'primary' | 'secondary' | 'tertiary' | 'university' | 'vocational';

export interface User {
  id: string;
  email: string;
  phone_number?: string;
  full_name: string;
  role: UserRole;
  school_id?: string;
  education_level?: EducationLevel;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  school_id: string;
  school_name: string;
  school_reg_number: string;
  license_tier: 'Institutional' | 'Trial' | 'Premium';
  status: 'active' | 'suspended' | 'trial' | 'expired';
  location: string;
  district: string;
  admin_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  school_id: string;
  class_name: string;
  class_level: string;
  stream?: string;
  created_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  school_id: string;
  student_id: string;
  class_id: string;
  date_of_birth?: string;
  created_at: string;
}

export interface Teacher {
  id: string;
  user_id: string;
  school_id: string;
  staff_id: string;
  assigned_subjects?: string[];
  created_at: string;
}

export interface Course {
  id: string;
  material_id: string;
  school_id: string;
  teacher_id: string;
  title: string;
  subject: string;
  class_level: string;
  topic?: string;
  description?: string;
  file_url?: string;
  thumbnail_url?: string;
  is_premium: boolean;
  price_ugx?: number;
  is_global: boolean;
  verification_status: 'pending' | 'approved' | 'rejected';
  allow_download: boolean;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  assessment_id: string;
  school_id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  subject: string;
  assessment_type: 'physical_test' | 'digital_quiz' | 'homework' | 'project';
  max_points: number;
  weight_percentage?: number;
  due_date?: string;
  instructions?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type?: string;
  is_read: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  message_text?: string;
  is_read: boolean;
  created_at: string;
}
