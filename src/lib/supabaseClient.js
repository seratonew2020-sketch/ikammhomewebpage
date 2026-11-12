import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL || 'https://pxlqylmlktavvptxonym.supabase.co'
).trim()
const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_VAEStEmaDCPyhwd6cAhYFQ_xV-7rgvK'
).trim()

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Test connectivity to the Supabase project and check whether the `articles` table exists.
 */
export async function testSupabaseConnection() {
  try {
    const { count, error } = await supabase
      .from('articles')
      .select('id', { count: 'exact', head: true })
    if (error) {
      console.warn('Supabase connected (table check):', error.message)
      return { connected: true, tableReady: false, message: error.message }
    }
    return { connected: true, tableReady: true, count: count ?? 0 }
  } catch (err) {
    console.error('Supabase connection error:', err)
    return { connected: false, tableReady: false, error: err?.message || 'Unknown error' }
  }
}
