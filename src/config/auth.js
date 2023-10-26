const providers = []

if (process.env.NODE_ENV === 'production') {

} else {

  const { default: GithubProvider } = await import('next-auth/providers/github')
  const github = GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  })

  providers.push(github)
}

// https://avis.bib.umontreal.ca/api/auth/callback/udem

export const authOptions = {
  providers,
  pages: {
    signIn: '/signin',
    //   signOut: '/auth/signout',
    //   error: '/auth/error', // Error code passed in query string as ?error=
    //   verifyRequest: '/auth/verify-request', // (used for check email message)
    //   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  }
}