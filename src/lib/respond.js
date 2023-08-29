import { NextResponse } from 'next/server'

export function respond(response = null, options = { status: 200 }) {


  /*
   * return respond({ foo: 'bar' }, 201)
   */
  if (typeof options === 'number') {
    options = {
      status: options
    }
  }

  /*
   * return respond(201)
   */
  if (typeof response === 'number') {
    options.status = response
    response = null
  }

  if (response) {
    response = {
      success: options.status < 300 ? true : false,
      data: response
    }
  }


  return NextResponse.json(response, options)
}