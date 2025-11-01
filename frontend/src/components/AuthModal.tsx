import { Dialog } from '@chakra-ui/react'
import { AuthForm } from '../auth/AuthForm'

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Welcome</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <AuthForm onSuccess={onClose} />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
