import { createClient } from '@supabase/supabase-js';

// Add this type declaration for Vite env variables
/// <reference types="vite/client" />

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase credentials
const hasValidCredentials = false; // 강제로 Mock 클라이언트 사용

// Initialize supabase client
let supabase: any;

if (hasValidCredentials) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Using real Supabase client');
  } catch (error) {
    console.warn('⚠️ Failed to create Supabase client, using mock:', error);
    // Fallback to mock client
    import('./mockSupabaseClient').then(({ supabase: mockSupabase }) => {
      supabase = mockSupabase;
    });
  }
} else {
  console.log('🧪 Using Mock Supabase client (no valid credentials)');
  // Use mock client for testing
  import('./mockSupabaseClient').then(({ supabase: mockSupabase }) => {
    supabase = mockSupabase;
  });
}

export { supabase }; 