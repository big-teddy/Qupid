import { supabase } from './supabaseClient';
import { Persona } from '../types';

export async function addPersona(persona: Omit<Persona, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('personas')
    .insert([persona])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function getPersonas(userId: string) {
  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
} 