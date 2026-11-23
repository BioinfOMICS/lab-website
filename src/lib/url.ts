/**
 * Internal links must go through url(), because the site can be served from a
 * sub-path (https://<account>.github.io/<repository>/) as well as from the root of a domain.
 *
 *   url('/people/')            -> '/people/'  or  '/<repository>/people/'
 *   url('/tools/') + '#immir'  -> a link to one block of the Tools page
 */
const base = import.meta.env.BASE_URL;

export function url(path = '/'): string {
  const root = base.endsWith('/') ? base.slice(0, -1) : base;
  const rest = path.startsWith('/') ? path : `/${path}`;
  return root + rest;
}
