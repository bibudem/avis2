import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Avis from '@/models/Avis'
import dbConnect from '@/lib/dbConnect'
import { respond } from '@/lib/respond'
import { respondWithError } from '@/lib/respondWithError'
//import { authOptions } from '@/config/auth'

const textHtml = 'text/html; charset=utf-8'

const headers = {
  'Content-Type': textHtml
}

export async function GET(request) {

  try {

    await dbConnect()

    const avis = await Avis.findOne({ active: true })

    if (avis) {
      if (request.nextUrl.pathname.endsWith('/site-web/important')) {

        // return text/html
        return respond(avis, { accept: textHtml })

      }

      return respond(avis, { accept: request.headers.get('accept') })

    }

    return new NextResponse(null, { status: 204, headers })


  } catch (error) {
    console.error('Request error at %s: %o', request.nextUrl.href, error)

    const acceptsJson = request.headers.has('accept') && request.headers.get('accept').startsWith('application/json')

    if (acceptsJson) {
      return respondWithError(error)
    }

    return new NextResponse(error.stack, { status: 500, headers })
  }
}

// export async function POST(request) {

//   try {

//     await dbConnect()

//     const data = await request.json()

//     const avis = await Avis.create(data)

//     return respond(avis, { status: 201, headers: { 'Location': `${request.nextUrl.pathname}/${avis.id}` } })

//   } catch (error) {

//     return respondWithError(error)
//   }
// }
