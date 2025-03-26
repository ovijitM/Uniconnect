
export type UserRole = 'student' | 'club_admin' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  university?: string;
  universityId?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string, role: UserRole, university?: string) => Promise<User>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}
