import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, RegisterRequest, AccountType } from '../types';
import { uploadFileMock } from '../services/onboardingService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credential: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (request: RegisterRequest) => Promise<User>;
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

type InvitationRecord = {
  institutionId: string;
  accountType: AccountType;
  invitedBy: 'INSTITUTION_ADMIN' | 'SCHOOL_ADMIN';
};

const INVITATION_REPOSITORY: Record<string, InvitationRecord> = {
  'INST-STUD-001': {
    institutionId: '550e8400-e29b-41d4-a716-446655440001',
    accountType: 'INSTITUTION_STUDENT',
    invitedBy: 'INSTITUTION_ADMIN',
  },
  'TEACH-001': {
    institutionId: '550e8400-e29b-41d4-a716-446655440001',
    accountType: 'TEACHER',
    invitedBy: 'INSTITUTION_ADMIN',
  },
  'INST-STUD-PRIMARY': {
    institutionId: '660e8400-e29b-41d4-a716-446655440201',
    accountType: 'INSTITUTION_STUDENT',
    invitedBy: 'INSTITUTION_ADMIN',
  },
};

const validateInvitation = (code: string, accountType: AccountType, institutionId?: string) => {
  if (!code) {
    throw new Error('Invitation code is required.');
  }

  const invitation = INVITATION_REPOSITORY[code.trim().toUpperCase()];
  if (!invitation) {
    throw new Error('Invalid invitation code.');
  }

  if (invitation.accountType !== accountType) {
    throw new Error('Invitation code does not match the requested account type.');
  }

  if (institutionId && invitation.institutionId !== institutionId) {
    throw new Error('Invitation code does not belong to the selected institution.');
  }

  return invitation;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('soma365-mock-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem('soma365-mock-user');
      }
    }
  }, []);

  const login = async (credential: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const key = credential.trim();
      const userKey = MOCK_USERS[key]
        ? key
        : Object.keys(MOCK_USERS).find(id => MOCK_USERS[id].phone_number === key);

      if (!userKey || MOCK_CREDENTIALS[userKey] !== password) {
        throw new Error('Invalid credentials. Please try again.');
      }

      const userData = MOCK_USERS[userKey];
      if (!userData) {
        throw new Error('User not found');
      }

      setUser(userData);
      window.localStorage.setItem('soma365-mock-user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (request: RegisterRequest): Promise<User> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));

      if (!request.email && !request.phone) {
        throw new Error('Provide either email or phone to create your account.');
      }

      if (request.accountType === 'INSTITUTION_STUDENT') {
        if (!request.institutionId) {
          throw new Error('Institution ID is required for institutional students.');
        }
        validateInvitation(request.invitationCode ?? '', request.accountType, request.institutionId);
      }

      if (request.accountType === 'TEACHER') {
        if (!request.institutionId) {
          throw new Error('Institution ID is required for teachers.');
        }
        validateInvitation(request.invitationCode ?? '', request.accountType, request.institutionId);
      }

      // Require education level for student accounts
      if (request.accountType === 'INSTITUTION_STUDENT' || request.accountType === 'INDIVIDUAL_STUDENT') {
        if (!request.educationLevel) {
          throw new Error('Education level is required for student accounts.');
        }
        if (request.educationLevel === 'primary' || request.educationLevel === 'secondary') {
          if (!request.classId) {
            throw new Error('Class selection is required for primary and secondary students.');
          }
        }
      }

      if (request.invitationCode) {
        validateInvitation(request.invitationCode, request.accountType, request.institutionId);
      }

      const now = new Date().toISOString();
      const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `user-${Math.random().toString(36).slice(2, 10)}`;
      const role = request.accountType === 'TEACHER' ? 'teacher' : 'student';
      const storageKey = request.email ? request.email : request.phone as string;

      const userData: User = {
        id,
        email: request.email,
        phone_number: request.phone,
        full_name: request.full_name,
        role,
        school_id: request.institutionId,
        education_level: request.educationLevel,
        class_id: request.classId,
        is_active: true,
        must_change_password: false,
        created_at: now,
        updated_at: now,
      };

      MOCK_USERS[storageKey] = userData;
      MOCK_CREDENTIALS[storageKey] = request.password;

      // If teacher provided KYC files during registration, simulate upload and save mock URLs
      if (request.accountType === 'TEACHER' && (request as any).kycFiles && Array.isArray((request as any).kycFiles)) {
        try {
          const files: File[] = (request as any).kycFiles;
          const uploaded = [] as Array<{ name: string; path: string; mimeType?: string; size?: number }>;
          for (const f of files) {
            const meta = await uploadFileMock(f);
            uploaded.push({ name: f.name, path: meta.path, mimeType: meta.mimeType, size: meta.size });
          }
          // Store teacher docs in localStorage (demo mode)
          const key = `teacher-docs-${id}`;
          localStorage.setItem(key, JSON.stringify({ uploaded, created_at: now }));
        } catch (err) {
          console.warn('Teacher KYC upload simulation failed', err);
        }
      }

      setUser(userData);
      window.localStorage.setItem('soma365-mock-user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Register failed';
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
      window.localStorage.removeItem('soma365-mock-user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context as {
    user: any;
    loading: boolean;
    login: (credential: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    register: (req: any) => Promise<any>;
    isAuthenticated: boolean;
  };
}