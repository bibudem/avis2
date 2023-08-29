import { NextResponse } from 'next/server'

export function respondWithError(error, status = 500) {
  const data = {}

  if (typeof error === 'string') {
    data.message = error
  } else {
    // error instanceof Error === true
    data.message = error.message
    data.stack = process.env.NODE_ENV !== 'production' ? error.stack : undefined
    data.code = error.code
    data.name = error.name
    data.cause = error
  }

  return NextResponse.json({ success: false, data }, { status })
}