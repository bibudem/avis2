import { notFound } from 'next/navigation'
import Avis from '@/models/Avis'
import EditAvis from '@/components/EditAvis'

export default async function EditAvisPage({ params }) {

  try {
    const id = params.id
    const avis = await Avis.findById(id)

    if (avis) {
      return (
        <EditAvis avis={avis} />
      )
    }

    notFound()
  } catch (error) {
    notFound()
  }
}