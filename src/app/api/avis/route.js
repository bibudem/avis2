import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Avis from '@/models/Avis'
import { respond } from '@/lib/respond.js'
import { respondWithError } from '@/lib/respondWithError.js'

const headers = {
  'Content-Type': 'text/html; charset=utf-8'
}

export async function GET(request) {

  try {

    await dbConnect()

    const params = request.nextUrl.searchParams

    if (params.get('active') === 'true' || request.nextUrl.pathname.endsWith('/site-web/important')) {
      const avis = await Avis.findOne({ active: true })

      if (avis) {
        if (request.nextUrl.pathname.endsWith('/site-web/important')) {
          // return text/html
          return new Response(avis.message, {
            status: 200,
            headers
          })

        }
        return respond(avis.toObject())

      }

      return new NextResponse(null, { status: 204, headers })
    }

    const avisList = await Avis.find().sort({ active: -1, updated: -1 }).limit(15)

    return respond(avisList)


  } catch (error) {
    console.error('Request error at %s: %o', request.nextUrl.href, error)

    const acceptsJson = request.headers.has('accept') && request.headers.get('accept').startsWith('application/json')

    if (acceptsJson) {
      return respondWithError(error)
    }

    return new NextResponse(error.stack, { status: 500, headers })
  }
}

export async function POST(request) {

  try {

    await dbConnect()

    const data = await request.json()

    const avis = await Avis.create(data)

    return respond(avis, { status: 201, headers: { 'Location': `${request.nextUrl.pathname}/${avis.id}` } })

  } catch (error) {

    return respondWithError(error)
  }
}