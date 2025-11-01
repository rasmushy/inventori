import { useAuth } from '../auth/AuthContext'
import * as store from '../storage/local'
import { useEffect, useState } from 'react'
import type { Address } from '../types'
import { ShareModal } from '../components/ShareModal'
import {
    Button,
    Box,
    VStack,
    HStack,
    Text,
    Container,
    Flex,
    Card,
    Heading,
    Badge,
    Separator
} from '@chakra-ui/react'

export default function UserPage() {
    const { user, logout } = useAuth()
    const [addresses, setAddresses] = useState<Address[]>([])
    const [shareOpen, setShareOpen] = useState(false)
    const [shareTarget, setShareTarget] = useState<Address | null>(null)

    useEffect(() => {
        const res = store.listAddresses()
        setAddresses(res.items)
    }, [])

    function openShare(addr: Address) {
        setShareTarget(addr)
        setShareOpen(true)
    }

    function addShare(email: string) {
        if (!shareTarget) return
        const updated = store.shareAddress(shareTarget.id, email)
        if (updated) setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
        setShareTarget(updated ?? shareTarget)
    }

    function removeShare(email: string) {
        if (!shareTarget) return
        const updated = store.unshareAddress(shareTarget.id, email)
        if (updated) setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
        setShareTarget(updated ?? shareTarget)
    }
    return (
        <Container maxW="7xl" py={6}>
            <VStack gap={6} align="stretch">
                <Box>
                    <Heading size="lg" mb={2}>User Profile</Heading>
                    <Text color="fg.muted">Manage your account and shared addresses</Text>
                </Box>

                {user ? (
                    <VStack gap={6} align="stretch">
                        <Card.Root>
                            <Card.Body p={6}>
                                <VStack gap={4} align="stretch">
                                    <HStack justify="space-between" align="center">
                                        <VStack align="flex-start" gap={1}>
                                            <Text fontSize="sm" color="fg.muted">Email</Text>
                                            <Text fontWeight="semibold">{user.email}</Text>
                                        </VStack>
                                        <Button onClick={() => void logout()} variant="outline">
                                            Logout
                                        </Button>
                                    </HStack>

                                    <HStack justify="space-between" align="center">
                                        <VStack align="flex-start" gap={1}>
                                            <Text fontSize="sm" color="fg.muted">Display Name</Text>
                                            <Text fontWeight="semibold">{user.displayName ?? '—'}</Text>
                                        </VStack>
                                    </HStack>
                                </VStack>
                            </Card.Body>
                        </Card.Root>

                        <Separator />

                        <Box>
                            <Heading size="md" mb={4}>Your Addresses</Heading>
                            <VStack gap={3} align="stretch">
                                {addresses.map((a) => (
                                    <Card.Root key={a.id} _hover={{ shadow: "sm" }}>
                                        <Card.Body p={4}>
                                            <Flex justify="space-between" align="center" gap={4}>
                                                <HStack gap={3} flex="1">
                                                    <Text fontWeight="semibold" fontSize="lg">
                                                        {a.label}
                                                    </Text>
                                                    {(a.sharedWith?.length ?? 0) > 0 && (
                                                        <Badge size="sm" colorPalette="blue">
                                                            Shared · {a.sharedWith!.length}
                                                        </Badge>
                                                    )}
                                                </HStack>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openShare(a)}
                                                >
                                                    Share
                                                </Button>
                                            </Flex>
                                        </Card.Body>
                                    </Card.Root>
                                ))}
                                {addresses.length === 0 && (
                                    <Box textAlign="center" py={8}>
                                        <Text color="fg.muted" fontSize="lg">
                                            No addresses yet.
                                        </Text>
                                        <Text color="fg.muted" fontSize="sm" mt={2}>
                                            Create your first address to start organizing your items.
                                        </Text>
                                    </Box>
                                )}
                            </VStack>
                        </Box>
                    </VStack>
                ) : (
                    <Box textAlign="center" py={8}>
                        <Text color="fg.muted" fontSize="lg">
                            Not signed in.
                        </Text>
                        <Text color="fg.muted" fontSize="sm" mt={2}>
                            Please sign in to access your profile.
                        </Text>
                    </Box>
                )}

                <ShareModal
                    open={shareOpen}
                    address={shareTarget}
                    onAdd={addShare}
                    onRemove={removeShare}
                    onClose={() => setShareOpen(false)}
                />
            </VStack>
        </Container>
    )
}


