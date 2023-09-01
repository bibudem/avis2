import AddAvisButton from '@/components/AddAvisButton.js'
import AvisList, { AvisListItem } from '@/components/AvisList'
// import Avis from '@/models/Avis'
import { List } from '@mui/material'
import { getList } from '../../actions'
// import { TransitionGroup } from 'react-transition-group'

export default async function DashboardPage() {
  const data = await getList()

  // function onClick() {
  //   console.log('click')
  // }

  return (
    <>
      <List>
        {/* <TransitionGroup> */}
        {
          data.map(avis => (
            <AvisListItem key={avis._id} avis={avis.toObject()} />
          )
          )
        }
        {/* </TransitionGroup> */}
      </List>
      <AddAvisButton />
    </>
  )
}