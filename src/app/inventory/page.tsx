import { prisma } from '@/lib/prisma'
import InventoryClient from './inventory-client'

export default async function InventoryPage() {
  let parts: {
    id: string
    partNumber: string
    description: string
    category: string
    qtyOnHand: number
  }[] = []
  try {
    parts = await prisma.inventoryItem.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { partNumber: 'asc' }],
    })
  } catch {
    // DB not configured — show empty state
  }

  return <InventoryClient parts={parts} />
}
