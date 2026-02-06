import { atom, useAtom } from 'jotai'

const signInDialogAtom = atom(false)

export function useSignInDialog() {
  const [open, setOpen] = useAtom(signInDialogAtom)

  return {
    open,
    setOpen,
    openDialog: () => {
      setOpen(true)
    },
    closeDialog: () => {
      setOpen(false)
    },
  }
}
