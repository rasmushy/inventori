import { useState } from 'react'
import { useAuth } from './AuthContext'
import {
    Box,
    Button,
    Input,
    VStack,
    Text,
    Tabs,
    Field,
} from '@chakra-ui/react'
import { addTestData, createTestData } from '../utils/testData'

interface AuthFormProps {
    onSuccess?: () => void
}

export function AuthForm({ onSuccess }: AuthFormProps) {
    const { login, signup, devLogin } = useAuth()
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            if (mode === 'login') {
                await login(email, password)
            } else {
                await signup(email, password)
            }
            onSuccess?.()
        } catch (err: any) {
            setError(err.message ?? 'Authentication failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box>
            <Tabs.Root
                value={mode}
                onValueChange={(e) => setMode(e.value as 'login' | 'signup')}
            >
                <Tabs.List mb={4}>
                    <Tabs.Trigger value="login">Login</Tabs.Trigger>
                    <Tabs.Trigger value="signup">Sign Up</Tabs.Trigger>
                </Tabs.List>
            </Tabs.Root>

            <form onSubmit={handleSubmit}>
                <VStack gap={4} align="stretch">
                    <Field.Root>
                        <Field.Label>Email</Field.Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Password</Field.Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Field.Root>

                    {error && (
                        <Text color="red.500" fontSize="sm">
                            {error}
                        </Text>
                    )}

                    <Button
                        type="submit"
                        loading={loading}
                        colorPalette="blue"
                    >
                        {mode === 'login' ? 'Login' : 'Sign Up'}
                    </Button>

                    {devLogin && (
                        <Button
                            variant="outline"
                            colorPalette="blue"
                            onClick={() => {
                                devLogin()
                                onSuccess?.()
                            }}
                        >
                            Dev Login (Skip Auth)
                        </Button>
                    )}
                    
                    {import.meta.env.DEV && (
                        <Button
                            variant="outline"
                            colorPalette="green"
                            onClick={() => {
                                createTestData()
                            }}
                            disabled={loading}
                        >
                            Create Test Data (Clears existing data)
                        </Button>
                    )}

                    {import.meta.env.DEV && (
                        <Button
                            variant="outline"
                            colorPalette="green"
                            onClick={() => {
                                addTestData()
                            }}
                            disabled={loading}
                        >
                            Dev Item Test (Add more test data)
                        </Button>
                    )}
                </VStack>
            </form>
        </Box>
    )
}
