import { notFound } from 'next/navigation'
import Avis from '@/models/Avis'
import AvisDialog from '@/components/AvisDialog'

export default async function EditAvisModal({ params }) {
  try {
    const id = params.id
    const avis = await Avis.findById(id)

    if (avis) {
      return (
        <AvisDialog avis={avis} />
      )
    }

    notFound()
  } catch (error) {
    notFound()
  }
}