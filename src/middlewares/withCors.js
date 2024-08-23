export const withCors = (next) => {
  return async (request, _next) => {
    // Ajout des en-têtes x-forwarded
    request.headers.set('x-forwarded-host', request.headers.get('host'));
    request.headers.set('x-forwarded-proto', request.protocol);
    request.headers.set('x-forwarded-for', request.ip);

    // Traitement de la requête
    const res = await next(request, _next);

    if (res) {
      // Ajout des en-têtes CORS à la réponse
      res.headers.set('Access-Control-Allow-Credentials', "true");
      res.headers.set('Access-Control-Allow-Origin', '*');
      res.headers.set('Access-Control-Allow-Methods', 'GET,PATCH,POST,PUT');
      res.headers.set(
          'Access-Control-Allow-Headers',
          'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      );
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return res;
  };
};
