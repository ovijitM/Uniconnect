
import { User, UserRole, AuthState } from '@/types/auth';
import { useAuthLogin } from './auth/useAuthLogin';
import { useAuthSignup } from './auth/useAuthSignup';
import { useAuthLogout } from './auth/useAuthLogout';
import { useAuthProfile } from './auth/useAuthProfile';

export interface AuthActions {
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string, role: UserRole, university?: string) => Promise<User>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthActions = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
): AuthActions => {
  const { login } = useAuthLogin(authState, setAuthState);
  const { signup } = useAuthSignup(authState, setAuthState);
  const { logout } = useAuthLogout(setAuthState);
  const { updateUser } = useAuthProfile(authState, setAuthState);

  return {
    login,
    signup,
    logout,
    updateUser
  };
};
