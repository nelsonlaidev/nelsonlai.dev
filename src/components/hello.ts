'use client'

import { useEffect } from 'react'

export function Hello() {
  useEffect(() => {
    console.log(
      `\
%cHey there, awesome developer!

If you're digging this code, check out my GitHub repo:

https://github.com/nelsonlaidev/nelsonlai.dev

and give it a star ⭐
`,
      'font-size: 16px',
    )
  }, [])

  return null
}
