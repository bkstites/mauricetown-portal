import { requireStaffUser } from '@/lib/auth'
import AdminQuoteClient from './quote-client'

export default async function AdminQuotePage({ params }: { params: { id: string } }) {
  await requireStaffUser()

  return <AdminQuoteClient id={params.id} />
}
