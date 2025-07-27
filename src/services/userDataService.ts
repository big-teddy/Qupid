import { supabase } from './supabaseClient';
import { UserProfile, ConversationAnalysis, Achievement, Badge, WeeklyGoal, ChatHistory } from '../types';

export const userDataService = {
  // 사용자 프로필 생성 또는 가져오기
  async createOrGetUserProfile(userId: string, userData?: any): Promise<UserProfile | null> {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return null;
      }
      
      console.log('createOrGetUserProfile called with:', { userId, userData });
      console.log('User metadata:', userData?.user_metadata);
      
      // Google OAuth 데이터에서 이름 추출 (이메일 사용자는 이름을 설정하지 않음)
      const googleName = userData?.user_metadata?.full_name || 
                        userData?.user_metadata?.name || 
                        null;
      
      console.log('Extracted Google name:', googleName);
      
      // 먼저 기존 프로필 확인
      const existingProfile = await this.getUserProfile(userId);
      if (existingProfile) {
        console.log('Existing profile found:', existingProfile);
        
        // Google OAuth 데이터로 업데이트
        const updateData: any = {};
        let needsUpdate = false;
        
        // Google OAuth 이름과 다른 경우 업데이트
        if (existingProfile.name !== googleName) {
          updateData.name = googleName;
          needsUpdate = true;
          console.log('Updating name from', existingProfile.name, 'to', googleName);
        }
        
        if (userData?.user_metadata?.avatar_url && existingProfile.profile_image_url !== userData.user_metadata.avatar_url) {
          updateData.profile_image_url = userData.user_metadata.avatar_url;
          needsUpdate = true;
        }
        
        if (userData?.email && existingProfile.email !== userData.email) {
          updateData.email = userData.email;
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          updateData.updated_at = new Date().toISOString();
          updateData.last_login_at = new Date().toISOString();
          await this.updateUserProfile(userId, updateData);
          console.log('Profile updated with OAuth data:', updateData);
          
          // 업데이트된 프로필 다시 가져오기
          const updatedProfile = await this.getUserProfile(userId);
          return updatedProfile;
        }
        
        return existingProfile;
      }

      // 새 프로필 생성
      const profileData = {
        id: userId,
        name: userData?.user_metadata?.full_name || userData?.user_metadata?.name || '닉네임을 설정해주세요',
        email: userData?.email || '',
        user_gender: userData?.user_metadata?.user_gender || null,
        experience: null,
        confidence: null,
        difficulty: null,
        interests: [],
        profile_image_url: userData?.user_metadata?.avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
        is_active: true,
        subscription_tier: 'free'
      };

      console.log('Creating new profile with data:', profileData);

      const { data, error } = await supabase
        .from('users')
        .insert(profileData)
        .select('*')
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Profile created successfully:', data);
      return data;
    } catch (error) {
      console.error('Create or get user profile error:', error);
      return null;
    }
  },

  // 사용자 프로필 가져오기
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return null;
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  },

  // 사용자 프로필 업데이트
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Update user profile error:', error);
      return false;
    }
  },

  // 대화 세션 생성
  async createConversationSession(userId: string, personaId: string, personaName: string, isTutorial: boolean = false): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('conversation_sessions')
        .insert({
          user_id: userId,
          persona_id: personaId,
          persona_name: personaName,
          is_tutorial: isTutorial
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Create conversation session error:', error);
      return null;
    }
  },

  // 대화 메시지 저장
  async saveMessage(sessionId: string, sender: 'user' | 'ai' | 'system', messageText: string, messageOrder: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversation_messages')
        .insert({
          session_id: sessionId,
          sender,
          message_text: messageText,
          message_order: messageOrder
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Save message error:', error);
      return false;
    }
  },

  // 대화 세션 완료
  async completeConversationSession(sessionId: string, analysis: ConversationAnalysis): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversation_sessions')
        .update({
          end_time: new Date().toISOString(),
          analysis_score: analysis.overallScore,
          friendliness_score: analysis.friendliness,
          curiosity_score: analysis.curiosity,
          empathy_score: analysis.empathy,
          feedback: analysis.feedback,
          positive_points: analysis.positivePoints,
          points_to_improve: analysis.pointsToImprove
        })
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Complete conversation session error:', error);
      return false;
    }
  },

  // 사용자 성취 가져오기
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user achievements error:', error);
      return [];
    }
  },

  // 성취 업데이트
  async updateAchievement(userId: string, achievementId: string, progress: number, acquired: boolean = false): Promise<boolean> {
    try {
      const updateData: any = {
        progress_current: progress,
        updated_at: new Date().toISOString()
      };

      if (acquired) {
        updateData.acquired = true;
        updateData.acquired_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('user_achievements')
        .update(updateData)
        .eq('user_id', userId)
        .eq('achievement_id', achievementId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Update achievement error:', error);
      return false;
    }
  },

  // 사용자 배지 가져오기
  async getUserBadges(userId: string): Promise<Badge[]> {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user badges error:', error);
      return [];
    }
  },

  // 배지 업데이트
  async updateBadge(userId: string, badgeId: string, progress: number, acquired: boolean = false): Promise<boolean> {
    try {
      const updateData: any = {
        progress_current: progress,
        updated_at: new Date().toISOString()
      };

      if (acquired) {
        updateData.acquired = true;
        updateData.acquired_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('user_badges')
        .update(updateData)
        .eq('user_id', userId)
        .eq('badge_id', badgeId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Update badge error:', error);
      return false;
    }
  },

  // 주간 목표 가져오기
  async getWeeklyGoals(userId: string): Promise<WeeklyGoal[]> {
    try {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('user_weekly_goals')
        .select('*')
        .eq('user_id', userId)
        .gte('week_start_date', weekStart.toISOString().split('T')[0])
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get weekly goals error:', error);
      return [];
    }
  },

  // 주간 목표 생성 (없으면)
  async createWeeklyGoalsIfNotExist(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('create_weekly_goals_for_user', {
        user_uuid: userId
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Create weekly goals error:', error);
      return false;
    }
  },

  // 사용자 즐겨찾기 가져오기
  async getUserFavorites(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('persona_id')
        .eq('user_id', userId);

      if (error) throw error;
      return data?.map((item: any) => item.persona_id) || [];
    } catch (error) {
      console.error('Get user favorites error:', error);
      return [];
    }
  },

  // 즐겨찾기 추가/제거
  async toggleFavorite(userId: string, personaId: string): Promise<boolean> {
    try {
      const { data: existing } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('persona_id', personaId)
        .single();

      if (existing) {
        // 제거
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('persona_id', personaId);

        if (error) throw error;
      } else {
        // 추가
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: userId,
            persona_id: personaId
          });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Toggle favorite error:', error);
      return false;
    }
  },

  // 대화 히스토리 가져오기
  async getChatHistory(userId: string, limit: number = 10): Promise<ChatHistory[]> {
    try {
      const { data, error } = await supabase
        .from('conversation_sessions')
        .select(`
          id,
          persona_name,
          start_time,
          end_time,
          analysis_score,
          is_tutorial
        `)
        .eq('user_id', userId)
        .not('end_time', 'is', null)
        .order('start_time', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map((session: any) => ({
        id: session.id,
        personaName: session.persona_name,
        date: new Date(session.start_time),
        score: session.analysis_score,
        isTutorial: session.is_tutorial
      })) || [];
    } catch (error) {
      console.error('Get chat history error:', error);
      return [];
    }
  },

  // 사용자 성장 통계 가져오기
  async getUserGrowthStats(userId: string, days: number = 7): Promise<any[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('user_growth_stats')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user growth stats error:', error);
      return [];
    }
  },

  // 사용자 맞춤 페르소나 가져오기
  async getUserCustomPersonas(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_custom_personas')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user custom personas error:', error);
      return [];
    }
  },

  // 맞춤 페르소나 저장
  async saveCustomPersona(userId: string, personaData: any): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_custom_personas')
        .insert({
          user_id: userId,
          ...personaData
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Save custom persona error:', error);
      return null;
    }
  },

  // 사용자 알림 설정 가져오기
  async getNotificationSettings(userId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('user_notification_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get notification settings error:', error);
      return null;
    }
  },

  // 알림 설정 업데이트
  async updateNotificationSettings(userId: string, settings: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_notification_settings')
        .update(settings)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Update notification settings error:', error);
      return false;
    }
  },

  // 강제로 사용자 이름 업데이트 (디버깅용)
  async forceUpdateUserName(userId: string, newName: string): Promise<boolean> {
    try {
      console.log('Force updating user name:', { userId, newName });
      
      const { error } = await supabase
        .from('users')
        .update({
          name: newName,
          updated_at: new Date().toISOString(),
          last_login_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Force update error:', error);
        throw error;
      }
      
      console.log('Force update successful');
      return true;
    } catch (error) {
      console.error('Force update user name error:', error);
      return false;
    }
  },

  // 사용자 데이터 완전 삭제 (디버깅용)
  async deleteUserData(userId: string): Promise<boolean> {
    try {
      console.log('Deleting all user data for:', userId);
      
      // 관련 테이블에서 사용자 데이터 삭제
      const tables = [
        'user_favorites',
        'user_badges',
        'user_achievements',
        'user_weekly_goals',
        'user_growth_stats',
        'user_custom_personas',
        'user_notification_settings',
        'conversation_messages',
        'conversation_sessions',
        'users'
      ];

      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('user_id', userId);

        if (error && !error.message.includes('does not exist')) {
          console.error(`Error deleting from ${table}:`, error);
        }
      }

      console.log('User data deletion completed');
      return true;
    } catch (error) {
      console.error('Delete user data error:', error);
      return false;
    }
  },

  // 닉네임 설정
  async setUserNickname(userId: string, nickname: string): Promise<boolean> {
    try {
      console.log('Setting nickname for user:', { userId, nickname });
      
      const { error } = await supabase
        .from('users')
        .update({
          name: nickname,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Set nickname error:', error);
        throw error;
      }
      
      console.log('Nickname set successfully');
      return true;
    } catch (error) {
      console.error('Set nickname error:', error);
      return false;
    }
  },

  // 기존 사용자 이름 업데이트 (하드코딩된 이름들을 수정)
  async updateExistingUserNames(): Promise<boolean> {
    try {
      console.log('Updating existing user names...');
      
      // 하드코딩된 이름들을 가진 사용자들을 찾아서 업데이트
      const { data: usersToUpdate, error: fetchError } = await supabase
        .from('users')
        .select('id, name, email')
        .or('name.eq.준호,name.eq.사용자,name.eq.닉네임을 설정해주세요');

      if (fetchError) {
        console.error('Fetch users error:', fetchError);
        throw fetchError;
      }

      if (usersToUpdate && usersToUpdate.length > 0) {
        console.log('Found users to update:', usersToUpdate);
        
        for (const user of usersToUpdate) {
          let newName = '닉네임을 설정해주세요';
          
          // 이메일에서 이름 추출 시도
          if (user.email) {
            const emailName = user.email.split('@')[0];
            if (emailName && emailName.length > 1) {
              newName = emailName;
            }
          }
          
          const { error: updateError } = await supabase
            .from('users')
            .update({
              name: newName,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

          if (updateError) {
            console.error(`Update error for user ${user.id}:`, updateError);
          } else {
            console.log(`Updated user ${user.id} name to: ${newName}`);
          }
        }
      }
      
      console.log('Existing user names update completed');
      return true;
    } catch (error) {
      console.error('Update existing user names error:', error);
      return false;
    }
  }
}; 