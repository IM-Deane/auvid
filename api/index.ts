import { supabase } from '../utils/supabase'

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  } catch (error) {
    console.log(error)
  }
}
