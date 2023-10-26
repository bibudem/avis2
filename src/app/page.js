import { redirect } from 'next/navigation'
import { adminRoute } from '@/config/app'

export default async function Home() {
  redirect(adminRoute)
}
