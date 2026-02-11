'use client'

import { useEffect } from 'react'

function Hello() {
  useEffect(() => {
    // This is a fun little message for anyone who might be inspecting the code.
    // So we disable the rule for this line.
    // eslint-disable-next-line no-console
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

export default Hello
