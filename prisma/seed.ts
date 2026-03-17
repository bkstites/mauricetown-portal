import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed inventory
  const parts = [
    // Engine
    { partNumber: 'PAI-131643', description: 'Cummins ISX Cylinder Head Gasket', category: 'Engine', qtyOnHand: 8 },
    { partNumber: 'PAI-131644', description: 'Cummins ISX Cylinder Head Gasket (Upper)', category: 'Engine', qtyOnHand: 12 },
    { partNumber: 'PAI-430860', description: 'Detroit DD15 Head Gasket Set', category: 'Engine', qtyOnHand: 5 },
    { partNumber: 'PAI-111486', description: 'Caterpillar C15 Front Crankshaft Seal', category: 'Engine', qtyOnHand: 0 },
    { partNumber: 'PAI-331001', description: 'Cummins N14 Overhaul Kit', category: 'Engine', qtyOnHand: 3 },
    // Brake
    { partNumber: 'PAI-196580', description: 'Meritor Air Cam Brake Repair Kit', category: 'Brake', qtyOnHand: 15 },
    { partNumber: 'PAI-196581', description: 'Meritor Brake Shoe Set', category: 'Brake', qtyOnHand: 20 },
    { partNumber: 'PAI-197000', description: 'Haldex Slack Adjuster', category: 'Brake', qtyOnHand: 7 },
    { partNumber: 'PAI-196700', description: 'Gunite Brake Drum', category: 'Brake', qtyOnHand: 0 },
    { partNumber: 'PAI-196701', description: 'Gunite Brake Hub Assembly', category: 'Brake', qtyOnHand: 4 },
    // Suspension
    { partNumber: 'PAI-430500', description: 'Peterbilt Leaf Spring Assembly', category: 'Suspension', qtyOnHand: 6 },
    { partNumber: 'PAI-430501', description: 'Kenworth Equalizer Beam Kit', category: 'Suspension', qtyOnHand: 9 },
    { partNumber: 'PAI-430200', description: 'Hendrickson Suspension Bushing Kit', category: 'Suspension', qtyOnHand: 11 },
    { partNumber: 'PAI-430201', description: 'Holland Fifth Wheel Repair Kit', category: 'Suspension', qtyOnHand: 2 },
    { partNumber: 'PAI-430202', description: 'Reyco Air Bag Suspension Kit', category: 'Suspension', qtyOnHand: 14 },
  ]

  for (const part of parts) {
    await prisma.inventoryItem.upsert({
      where: { partNumber: part.partNumber },
      update: part,
      create: part,
    })
  }

  // Seed a demo staff user (password management is handled via Supabase Auth)
  await prisma.user.upsert({
    where: { email: 'staff@mauricetownrepair.com' },
    update: {},
    create: {
      email: 'staff@mauricetownrepair.com',
      name: 'Staff User',
      company: 'Mauricetown Truck & Auto Repair',
      role: Role.STAFF,
    },
  })

  console.log('Seed complete: 15 parts and 1 staff user created.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
