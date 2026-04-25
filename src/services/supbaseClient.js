import { createClient } from '@supabase/supabase-js'

//  These values come from your .env file
// Replace them in .env, NOT here
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
