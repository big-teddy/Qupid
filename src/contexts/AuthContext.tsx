import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, AuthUser, LoginCredentials, SignUpCredentials } from '../types';
import { authService } from '../services/authService';
import { userDataService } from '../services/userDataService';
import { supabase } from '../services/supabaseClient';

interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signUp: (credentials: SignUpCredentials) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  // 초기 세션 확인
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { session, error } = await authService.getCurrentSession();
        if (error) {
          console.error('Session initialization error:', error);
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
        }

        if (session?.user) {
          const { user, error: userError } = await authService.getCurrentUser();
          if (userError) {
            console.error('User fetch error:', userError);
            setAuthState(prev => ({ ...prev, loading: false }));
            return;
          }

          setAuthState({
            user: user as AuthUser,
            session,
            loading: false,
            error: null,
          });
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Supabase 인증 상태 변경 감지
  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase client not initialized');
      return;
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const { user, error } = await authService.getCurrentUser();
          if (!error && user) {
            // Google 로그인 후 사용자 프로필 자동 생성
            try {
              console.log('Creating user profile for:', user);
              console.log('User metadata:', user.user_metadata);
              
              // Google OAuth 사용자의 경우 이름을 자동으로 설정
              if (user.user_metadata?.full_name || user.user_metadata?.name) {
                console.log('Google OAuth user - auto-setting name from metadata');
                await userDataService.createOrGetUserProfile(user.id, user);
              } else {
                console.log('Email user - profile created without name');
                await userDataService.createOrGetUserProfile(user.id, user);
              }
            } catch (profileError) {
              console.error('Profile creation error:', profileError);
            }
            
            setAuthState({
              user: user as AuthUser,
              session,
              loading: false,
              error: null,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await authService.signIn(credentials);
      
      if (error) {
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message || '로그인에 실패했습니다.' 
        }));
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setAuthState({
          user: data.user as AuthUser,
          session: data.session,
          loading: false,
          error: null,
        });
        return { success: true };
      }

      return { success: false, error: '로그인에 실패했습니다.' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await authService.signUp(credentials);
      
      if (error) {
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message || '회원가입에 실패했습니다.' 
        }));
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setAuthState({
          user: data.user as AuthUser,
          session: data.session,
          loading: false,
          error: null,
        });
        return { success: true, user: data.user };
      }

      return { success: false, error: '회원가입에 실패했습니다.' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다.';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      console.log('Signing out...');
      const { error } = await authService.signOut();
      if (error) {
        console.error('Signout error:', error);
      } else {
        console.log('Signout successful');
      }
    } catch (error) {
      console.error('Signout error:', error);
    } finally {
      // 로컬 스토리지도 정리
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('user_profile');
      localStorage.removeItem('user_favorites');
      localStorage.removeItem('user_custom_personas');
      
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
      
      // 페이지 새로고침으로 완전한 초기화
      window.location.reload();
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 