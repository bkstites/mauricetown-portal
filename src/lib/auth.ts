import 'server-only'

import { Role } from '@prisma/client'
import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export type AppUser = {
  email: string
  name: string | null
  role: Role
}

export function isStaffRole(role: Role | null | undefined) {
  return role === Role.STAFF || role === Role.ADMIN
}

async function buildAppUser(email: string, fallbackName?: string | null): Promise<AppUser> {
  const dbUser = await prisma.user.findUnique({ where: { email } })

  return {
    email,
    name: dbUser?.name ?? fallbackName ?? email,
    role: dbUser?.role ?? Role.CUSTOMER,
  }
}

export async function getCurrentAppUser(): Promise<AppUser | null> {
  try {
    const supabase = createServerComponentClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return null
    }

    return buildAppUser(user.email, user.user_metadata?.name ?? null)
  } catch {
    return null
  }
}

export async function requireSignedInUser() {
  const user = await getCurrentAppUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requireStaffUser() {
  const user = await requireSignedInUser()
  if (!isStaffRole(user.role)) {
    redirect('/orders')
  }
  return user
}

export async function getRequestAppUser(): Promise<AppUser | null> {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return null
    }

    return buildAppUser(user.email, user.user_metadata?.name ?? null)
  } catch {
    return null
  }
}