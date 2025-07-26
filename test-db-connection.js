// Simple test script to verify database connection
// Run with: node test-db-connection.js

const { createClient } = require('@supabase/supabase-js');

// Test function
async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');
  
  // Check environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Environment Variables:');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Not set');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Not set');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('\n⚠️  Environment variables not set. Using mock mode.');
    console.log('To use real Supabase:');
    console.log('1. Update .env.local with your Supabase credentials');
    console.log('2. Run the Supabase schema in your dashboard');
    console.log('3. Restart the development server');
    return;
  }
  
  if (supabaseUrl === 'your_supabase_url_here' || supabaseAnonKey === 'your_supabase_anon_key_here') {
    console.log('\n⚠️  Placeholder values detected. Using mock mode.');
    return;
  }
  
  try {
    console.log('\n🔗 Attempting to connect to Supabase...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connection by querying a table
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('\nPossible issues:');
      console.log('- Invalid credentials');
      console.log('- Database schema not applied');
      console.log('- Network connectivity issues');
    } else {
      console.log('✅ Connection successful!');
      console.log('📊 Data sample:', data);
    }
    
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

// Run test
testSupabaseConnection(); 