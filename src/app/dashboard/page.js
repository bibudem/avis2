import AvisList from '@/components/AvisList'
import AddAvis from '@/components/AddAvis'

export default function DashboardPage({ params, searchParams, children }) {
  return (
    <>
      <AvisList />
      <AddAvis />
    </>
  )
}