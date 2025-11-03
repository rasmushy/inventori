import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import type { User } from '../types'

interface AuthContextValue {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    devLogin?: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    const me = await api.me()
                    if (!cancelled) setUser(me)
                } catch {
                    if (!cancelled) setUser(null)
                } finally {
                    if (!cancelled) setLoading(false)
                }
            })()
        return () => {
            cancelled = true
        }
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        const loggedIn = await api.login(email, password)
        setUser(loggedIn)
    }, [])

    const signup = useCallback(async (email: string, password: string) => {
        const created = await api.signup(email, password)
        setUser(created)
    }, [])

    const logout = useCallback(async () => {
        try {
            await api.logout()
        } catch {
            console.warn('Failed to logout')
        } finally {
            setUser(null)
        }
    }, [])

    // TODO: Remove this after backend is done, also check AuthForm.tsx for the buttons that use it
    const devLogin = useCallback(() => {
        if (!import.meta.env.DEV) return
        setUser({ id: 'demo', email: 'demo@example.com', displayName: 'Demo User' })
    }, [])

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            loading,
            login,
            signup,
            logout,
            devLogin: import.meta.env.DEV ? devLogin : undefined
        }),
        [user, loading, login, signup, logout, devLogin],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
