
export type UserRole = 'student' | 'club_admin' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
