import dbConnect from '@/lib/dbConnect'
import Avis from '@/models/Avis'
import { respondWithError } from '@/lib/respondWithError'
import { respond } from '@/lib/respond'

export async function PUT(request, { params }) {

  try {

    await dbConnect()

    const result = await Avis.findByIdAndUpdate(params.id)

  } catch (error) {

    return respondWithError(error)
  }
}

export async function DELETE(request, { params }) {

  try {

    await dbConnect()

    const data = await Avis.findByIdAndRemove(params.id)

    if (data) {

      return respond(data)

    }

    return respond({ message: 'L\'avis n\'a pas pu être supprimé car il n\'existe pas dans la base de données.' }, 404)


  } catch (error) {

    return respondWithError(error)
  }
}