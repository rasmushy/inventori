import { Box, Text, Toaster as ChakraToaster, createToaster, ToastRoot } from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
})

export function Toaster() {
    return (
        <ChakraToaster toaster={toaster}>
            {(toast) => (
                <ToastRoot>
                    <Box>
                        <Text>{toast.title}</Text>
                        <Text>{toast.description}</Text>
                    </Box>
                </ToastRoot>
            )}
        </ChakraToaster>
    )
}
