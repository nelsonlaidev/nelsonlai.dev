import createMiddleware from 'next-intl/middleware'

import { routing } from './routing'

export const i18nMiddleware = createMiddleware(routing)
