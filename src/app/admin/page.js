import { List, Typography } from '@mui/material'
import { getCurrent, getList } from '@/actions'
import ListItem from '@/components/ListItem'
import AddAvisButton from '@/components/AddAvisButton'
import Avis from '@/components/Avis'
import AvisEmpty from '@/components/AvisEmpty'

function Heading({ children, ...props }) {
  return (
    <Typography variant='h6' mb={2} {...props}>
      {children}
    </Typography>
  )
}

export default async function DashboardPage() {
  const data = await getList()
  const current = await getCurrent()

  return (
    <>
      <Heading>
        Message actif
      </Heading>
      {
        current.success ?
          current.data ? (
            <Avis key={current.data.id} avis={current.data} />
          ) : (
            <AvisEmpty>
              Aucun avis actif en ce moment.
            </AvisEmpty>
          ) : (
            <AvisEmpty>
              Erreur de chargement de l'avis.
            </AvisEmpty>
          )
      }
      <Heading mt={4}>
        Banque de messages
      </Heading>
      <List sx={{ p: 0, '& > *:first-child .MuiListItem-root': { pt: 0 } }}>
        {
          data.map(avis => (
            <ListItem key={avis.id} avis={avis} />
          )
          )
        }
      </List>
      <AddAvisButton />
    </>
  )
}