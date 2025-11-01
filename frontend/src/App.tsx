import { Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom'
import { useState } from 'react'
import { Box, Button, HStack, Text } from '@chakra-ui/react'
import { LuBackpack } from 'react-icons/lu'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { AuthModal } from './components/AuthModal'
import './styles/layout.scss'
import './styles/components.scss'

function App() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <AuthProvider>
      <div className="app-root">
        <header className="app-header">
          <div className="container">
            <nav className="nav">
              {/* Homepage logo/link */}
              <div className="nav-group nav-start">
                <Button asChild variant="ghost" size="lg">
                  <RouterLink to="/">
                    <LuBackpack size={24} />
                  </RouterLink>
                </Button>
              </div>

              {/* Nav Links */}
              <div className="nav-group nav-links">
                <NavLinks onLoginClick={() => setAuthOpen(true)} />
              </div>
            </nav>
          </div>
        </header>

        <Box as="main" flex="1" w="full">
          <div className="container">
            <Routes>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Box>

        <footer className="site-footer">
          <div className="container">
            <Text fontSize="sm" color="fg.muted" textAlign="center">
              Back to the top
            </Text>
          </div>
        </footer>

        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </AuthProvider>
  )
}

function NavLinks({ onLoginClick }: { onLoginClick: () => void }) {
  const { user, logout } = useAuth()
  return (
    <HStack gap={3}>
      {user ? (
        <>
          <Button asChild variant="ghost" size="lg">
            <RouterLink to="/user">User</RouterLink>
          </Button>
          <Button variant="ghost" size="lg" onClick={() => void logout()}>
            Logout
          </Button>
        </>
      ) : (
        <Button variant="ghost" size="lg" onClick={onLoginClick}>
          Login
        </Button>
      )}
    </HStack>
  )
}

export default App
