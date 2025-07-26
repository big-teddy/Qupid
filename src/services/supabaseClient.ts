import { createClient } from '@supabase/supabase-js';

// Add this type declaration for Vite env variables
/// <reference types="vite/client" />

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'your_supabase_anon_key_here';

// Use real Supabase client if credentials are valid, otherwise use mock
let supabase: any;

if (hasValidCredentials) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Using real Supabase client');
  } catch (error) {
    console.warn('⚠️ Failed to create Supabase client, using mock:', error);
    // Fallback to mock client
    const { supabase: mockSupabase } = await import('./mockSupabaseClient');
    supabase = mockSupabase;
  }
} else {
  console.log('🧪 Using Mock Supabase client (no valid credentials)');
  // Use mock client for testing
  const { supabase: mockSupabase } = await import('./mockSupabaseClient');
  supabase = mockSupabase;
}

export { supabase }; 