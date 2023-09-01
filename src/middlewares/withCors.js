export const withCors = (next) => {
  return async (request, _next) => {
    const res = await next(request, _next)
    const pathname = request.nextUrl.pathname
    if (pathname.startsWith('/api') || pathname.startsWith('/site-web')) {
      if (res) {
        // add the CORS headers to the response
        res.headers.append('Access-Control-Allow-Credentials', "true")
        res.headers.append('Access-Control-Allow-Origin', '*') // replace this your actual origin
        res.headers.append('Access-Control-Allow-Methods', 'GET,PATCH,POST,PUT')
        res.headers.append(
          'Access-Control-Allow-Headers',
          'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        )
      }
    }
    return res
  }
}
