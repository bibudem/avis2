import { NextResponse } from 'next/server'

const headers = {
  'Content-Type': 'text/html; charset=utf-8'
}

export function respond(body = null, options = { status: 200 }) {

  /*
   * return respond({ foo: 'bar' }, 201)
   */
  if (typeof options === 'number') {
    options = {
      status: options
    }
  }

  let { status = 200, accept } = options

  /*
   * return respond(201)
   */
  if (typeof body === 'number') {
    status = body
    body = null
  }

  const acceptsJson = accept?.startsWith('application/json')

  if (acceptsJson) {
    body = {
      success: status < 300 ? true : false,
      data: body
    }

    return NextResponse.json(body, { status })
  }

  return new NextResponse(body.message, { status, headers })
}