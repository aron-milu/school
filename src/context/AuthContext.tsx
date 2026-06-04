import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo - covers all education levels
const MOCK_USERS: Record<string, User> = {
  // Secondary School (Lubiri SS)
  'student@example.com': {
    id: '550e8400-e29b-41d4-a716-446655440005',
    email: 'student@example.com',
    phone_number: '+256700000004',
    full_name: 'Namuli Sarah',
    role: 'student',
    school_id: '550e8400-e29b-41d4-a716-446655440001',
    education_level: 'secondary',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  'teacher@example.com': {
    id: '550e8400-e29b-41d4-a716-446655440004',
    email: 'teacher@example.com',
    phone_number: '+256700000003',
    full_name: 'Mark Lee',
    role: 'teacher',
    school_id: '550e8400-e29b-41d4-a716-446655440001',
    education_level: 'secondary',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  'admin@example.com': {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'admin@example.com',
    phone_number: '+256700000002',
    full_name: 'School Admin',
    role: 'school_admin',
    school_id: '550e8400-e29b-41d4-a716-446655440001',
    education_level: 'secondary',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  // Primary School
  'primary-student@example.com': {
    id: '660e8400-e29b-41d4-a716-446655440101',
    email: 'primary-student@example.com',
    phone_number: '+256700000101',
    full_name: 'Nakamya Grace',
    role: 'student',
    school_id: '660e8400-e29b-41d4-a716-446655440201',
    education_level: 'primary',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  'primary-teacher@example.com': {
    id: '660e8400-e29b-41d4-a716-446655440102',
    email: 'primary-teacher@example.com',
    phone_number: '+256700000102',
    full_name: 'Mrs. Apolot Sarah',
    role: 'teacher',
    school_id: '660e8400-e29b-41d4-a716-446655440201',
    education_level: 'primary',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  'primary-admin@example.com': {
    id: '660e8400-e29b-41d4-a716-446655440103',
    email: 'primary-admin@example.com',
    phone_number: '+256700000103',
    full_name: 'Headteacher Mukasa',
    role: 'school_admin',
    school_id: '660e8400-e29b-41d4-a716-446655440201',
    education_level: 'primary',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  // University
  'uni-student@example.com': {
    id: '770e8400-e29b-41d4-a716-446655440301',
    email: 'uni-student@example.com',
    phone_number: '+256700000301',
    full_name: 'Okello David',
    role: 'student',
    school_id: '770e8400-e29b-41d4-a716-446655440401',
    education_level: 'university',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  'uni-lecturer@example.com': {
    id: '770e8400-e29b-41d4-a716-446655440302',
    email: 'uni-lecturer@example.com',
    phone_number: '+256700000302',
    full_name: 'Dr. Mugisha Peter',
    role: 'teacher',
    school_id: '770e8400-e29b-41d4-a716-446655440401',
    education_level: 'university',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  'uni-admin@example.com': {
    id: '770e8400-e29b-41d4-a716-446655440303',
    email: 'uni-admin@example.com',
    phone_number: '+256700000303',
    full_name: 'Registrar Kintu',
    role: 'school_admin',
    school_id: '770e8400-e29b-41d4-a716-446655440401',
    education_level: 'university',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  // Tertiary (Technical College)
  'tertiary-student@example.com': {
    id: '880e8400-e29b-41d4-a716-446655440501',
    email: 'tertiary-student@example.com',
    phone_number: '+256700000501',
    full_name: 'Ssewankambo James',
    role: 'student',
    school_id: '880e8400-e29b-41d4-a716-446655440601',
    education_level: 'tertiary',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  'tertiary-lecturer@example.com': {
    id: '880e8400-e29b-41d4-a716-446655440502',
    email: 'tertiary-lecturer@example.com',
    phone_number: '+256700000502',
    full_name: 'Eng. Achieng Ruth',
    role: 'teacher',
    school_id: '880e8400-e29b-41d4-a716-446655440601',
    education_level: 'tertiary',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  // Vocational
  'voc-student@example.com': {
    id: '990e8400-e29b-41d4-a716-446655440701',
    email: 'voc-student@example.com',
    phone_number: '+256700000701',
    full_name: 'Achieng Mary',
    role: 'student',
    school_id: '990e8400-e29b-41d4-a716-446655440801',
    education_level: 'vocational',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  'voc-instructor@example.com': {
    id: '990e8400-e29b-41d4-a716-446655440702',
    email: 'voc-instructor@example.com',
    phone_number: '+256700000702',
    full_name: 'Mr. Ochieng Paul',
    role: 'teacher',
    school_id: '990e8400-e29b-41d4-a716-446655440801',
    education_level: 'vocational',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  // Super Admin & Guardian
  'superadmin@example.com': {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'superadmin@example.com',
    phone_number: '+256700000001',
    full_name: 'Super Admin',
    role: 'super_admin',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
  'guardian@example.com': {
    id: '550e8400-e29b-41d4-a716-446655440006',
    email: 'guardian@example.com',
    phone_number: '+256700000005',
    full_name: 'Guardian Parent',
    role: 'guardian',
    school_id: '550e8400-e29b-41d4-a716-446655440001',
    education_level: 'secondary',
    is_active: true,
    must_change_password: false,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
  },
};

// Mock credentials for demo
const MOCK_CREDENTIALS: Record<string, string> = {
  'student@example.com': 'password123',
  'teacher@example.com': 'password123',
  'admin@example.com': 'password123',
  'superadmin@example.com': 'password123',
  'guardian@example.com': 'password123',
  'primary-student@example.com': 'password123',
  'primary-teacher@example.com': 'password123',
  'primary-admin@example.com': 'password123',
  'uni-student@example.com': 'password123',
  'uni-lecturer@example.com': 'password123',
  'uni-admin@example.com': 'password123',
  'tertiary-student@example.com': 'password123',
  'tertiary-lecturer@example.com': 'password123',
  'voc-student@example.com': 'password123',
  'voc-instructor@example.com': 'password123',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (MOCK_CREDENTIALS[email] !== password) {
        throw new Error('Invalid credentials. Please try again.');
      }

      const userData = MOCK_USERS[email];
      if (!userData) {
        throw new Error('User not found');
      }

      setUser(userData);
      return userData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}