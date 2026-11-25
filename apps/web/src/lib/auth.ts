import { createAuth } from '@repo/auth'

import { db } from './db'

export const auth = createAuth(db)
