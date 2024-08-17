'use server'

import { signIn } from '@/auth'

export const login = async (formData: any) => {
  await signIn('credentials', { ...formData, redirectTo: '/' })
}
