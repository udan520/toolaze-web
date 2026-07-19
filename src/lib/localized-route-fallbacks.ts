export const ENGLISH_ONLY_ROOT_ROUTES = ['admin'] as const

export type EnglishOnlyRootRoute = (typeof ENGLISH_ONLY_ROOT_ROUTES)[number]

export function isEnglishOnlyRootRoute(route: string): route is EnglishOnlyRootRoute {
  return (ENGLISH_ONLY_ROOT_ROUTES as readonly string[]).includes(route)
}
