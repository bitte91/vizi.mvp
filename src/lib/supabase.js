import { createClient } from '@supabase/supabase-js'

const url = window?.ENV?.SUPABASE_URL
const anon = window?.ENV?.SUPABASE_ANON_KEY

if (!url || !anon) {
  console.warn('[Supabase] Configure public/env.js com SUPABASE_URL e SUPABASE_ANON_KEY.')
}

export const supabase = createClient(url || '', anon || '')
