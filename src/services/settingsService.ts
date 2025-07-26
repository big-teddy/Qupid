import { supabase } from './supabaseClient';

export interface UserSetting {
  id: string;
  user_id: string;
  setting_key: string;
  setting_value: any;
  updated_at: string;
}

// 사용자 설정 조회
export async function getUserSettings(userId: string): Promise<UserSetting[]> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

// 특정 설정 조회
export async function getUserSetting(userId: string, settingKey: string): Promise<any> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('setting_value')
    .eq('user_id', userId)
    .eq('setting_key', settingKey)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.setting_value || null;
}

// 설정 저장/업데이트
export async function setUserSetting(userId: string, settingKey: string, settingValue: any): Promise<UserSetting> {
  const { data, error } = await supabase
    .from('user_settings')
    .upsert([{
      user_id: userId,
      setting_key: settingKey,
      setting_value: settingValue
    }], {
      onConflict: 'user_id,setting_key'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 여러 설정 한번에 저장
export async function setMultipleUserSettings(userId: string, settings: Record<string, any>): Promise<UserSetting[]> {
  const settingsArray = Object.entries(settings).map(([key, value]) => ({
    user_id: userId,
    setting_key: key,
    setting_value: value
  }));

  const { data, error } = await supabase
    .from('user_settings')
    .upsert(settingsArray, {
      onConflict: 'user_id,setting_key'
    })
    .select();

  if (error) throw error;
  return data || [];
}

// 설정 삭제
export async function deleteUserSetting(userId: string, settingKey: string): Promise<void> {
  const { error } = await supabase
    .from('user_settings')
    .delete()
    .eq('user_id', userId)
    .eq('setting_key', settingKey);

  if (error) throw error;
}

// 기본 설정값들
export const DEFAULT_SETTINGS = {
  practice_notification: true,
  analysis_display: true,
  dark_mode: false,
  sound_effects: true,
  haptic_feedback: true,
  daily_goal: 3,
  weekly_goal: 15,
  notification_time: '20:00',
  language: 'ko',
  auto_save: true
};

// 사용자의 모든 설정을 기본값으로 초기화
export async function initializeUserSettings(userId: string): Promise<UserSetting[]> {
  return await setMultipleUserSettings(userId, DEFAULT_SETTINGS);
}

// 설정을 객체 형태로 조회 (키-값 쌍)
export async function getUserSettingsAsObject(userId: string): Promise<Record<string, any>> {
  const settings = await getUserSettings(userId);
  const settingsObject: Record<string, any> = {};
  
  settings.forEach(setting => {
    settingsObject[setting.setting_key] = setting.setting_value;
  });

  // 기본값과 병합
  return { ...DEFAULT_SETTINGS, ...settingsObject };
}

// 알림 설정 관련 헬퍼 함수들
export async function getNotificationSettings(userId: string) {
  const settings = await getUserSettingsAsObject(userId);
  return {
    practice_notification: settings.practice_notification ?? true,
    notification_time: settings.notification_time ?? '20:00',
    daily_goal: settings.daily_goal ?? 3,
    weekly_goal: settings.weekly_goal ?? 15
  };
}

export async function updateNotificationSettings(userId: string, settings: {
  practice_notification?: boolean;
  notification_time?: string;
  daily_goal?: number;
  weekly_goal?: number;
}) {
  return await setMultipleUserSettings(userId, settings);
}

// UI 설정 관련 헬퍼 함수들
export async function getUISettings(userId: string) {
  const settings = await getUserSettingsAsObject(userId);
  return {
    dark_mode: settings.dark_mode ?? false,
    language: settings.language ?? 'ko',
    sound_effects: settings.sound_effects ?? true,
    haptic_feedback: settings.haptic_feedback ?? true
  };
}

export async function updateUISettings(userId: string, settings: {
  dark_mode?: boolean;
  language?: string;
  sound_effects?: boolean;
  haptic_feedback?: boolean;
}) {
  return await setMultipleUserSettings(userId, settings);
} 