import { List } from '@mui/material'
import { getList } from '@/actions'
import AvisListItem from '@/components/AvisListItem'
import AddAvisButton from '@/components/AddAvisButton'
// import { TransitionGroup } from 'react-transition-group'

export default async function DashboardPage() {
  const data = await getList()

  return (
    <>
      <List>
        {
          data.map(avis => (
            <AvisListItem key={avis.id} avis={avis.toObject()} />
          )
          )
        }
      </List>
      <AddAvisButton />
    </>
  )
}