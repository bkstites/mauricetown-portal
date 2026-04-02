const fs = require('node:fs')
const path = require('node:path')

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName)
  if (!fs.existsSync(filePath)) {
    return
  }

  const raw = fs.readFileSync(filePath, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    let value = trimmed.slice(separatorIndex + 1).trim()

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    process.env[key] = value
  }
}

loadEnvFile('.env')
loadEnvFile('.env.local')

const { PrismaClient, Role } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')

const prisma = new PrismaClient()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
}

if (!supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local')
}

const publicClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const accounts = [
  {
    email: 'customer@mauricetownrepair.com',
    password: 'PortalTest123!',
    name: 'Portal Customer',
    company: 'Customer Test Fleet',
    phone: '8565550101',
    role: Role.CUSTOMER,
  },
  {
    email: 'staff@mauricetownrepair.com',
    password: 'PortalTest123!',
    name: 'Portal Worker',
    company: 'Mauricetown Truck & Auto Repair',
    phone: '8565550110',
    role: Role.ADMIN,
  },
]

async function createOrVerifyAuthUser(account) {
  const initialSignIn = await publicClient.auth.signInWithPassword({
    email: account.email,
    password: account.password,
  })

  if (!initialSignIn.error && initialSignIn.data.user) {
    return initialSignIn.data.user.id
  }

  const authUser = await findAuthUserByEmail(account.email)

  if (authUser) {
    const { error } = await adminClient.auth.admin.updateUserById(authUser.id, {
      password: account.password,
      email_confirm: true,
      user_metadata: { name: account.name },
    })

    if (error) {
      throw new Error(`Failed to update auth user for ${account.email}: ${error.message}`)
    }
  } else {
    const { data, error } = await adminClient.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: { name: account.name },
    })

    if (error) {
      throw new Error(`Failed to create auth user for ${account.email}: ${error.message}`)
    }

    if (data.user?.id) {
      return data.user.id
    }
  }

  const verifiedSignIn = await publicClient.auth.signInWithPassword({
    email: account.email,
    password: account.password,
  })

  if (verifiedSignIn.error || !verifiedSignIn.data.user) {
    throw new Error(`Sign-in verification failed for ${account.email}: ${verifiedSignIn.error?.message || 'Unknown sign-in error'}`)
  }

  return verifiedSignIn.data.user.id
}

async function findAuthUserByEmail(email) {
  let page = 1

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 200 })

    if (error) {
      throw new Error(`Failed to list auth users: ${error.message}`)
    }

    const users = data?.users ?? []
    const match = users.find(user => user.email?.toLowerCase() === email.toLowerCase())
    if (match) {
      return match
    }

    if (users.length < 200) {
      return null
    }

    page += 1
  }
}

async function main() {
  if (process.argv.includes('--inspect-auth')) {
    const rows = await prisma.$queryRawUnsafe(
      "select column_name, column_default, is_nullable from information_schema.columns where table_schema = 'auth' and table_name = 'users' order by ordinal_position",
    )
    console.log(JSON.stringify(rows, null, 2))
    return
  }

  for (const account of accounts) {
    const authUserId = await createOrVerifyAuthUser(account)
    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        name: account.name,
        company: account.company,
        phone: account.phone,
        role: account.role,
      },
      create: {
        email: account.email,
        name: account.name,
        company: account.company,
        phone: account.phone,
        role: account.role,
      },
    })

    console.log(`${account.email} ready as ${account.role} (${authUserId})`)
  }

  console.log('Credentials:')
  console.log('customer@mauricetownrepair.com / PortalTest123!')
  console.log('staff@mauricetownrepair.com / PortalTest123!')
}

main()
  .catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })