import { Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom'
import { useState } from 'react'
import { Box, Button, HStack, Input, Text } from '@chakra-ui/react'
import { LuBackpack, LuSearch } from 'react-icons/lu'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { AuthModal } from './components/AuthModal'
import { SearchModal } from './components/SearchModal'
import UserPage from './pages/UserPage'
import HomePage from './pages/HomePage'
import './styles/layout.scss'
import './styles/components.scss'

function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    window.dispatchEvent(new CustomEvent('global-search-change', { detail: query }))
  }

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

              {/* Search Bar */}
              <div className="nav-search">
                <Box className="search-desktop">
                  <Input
                    size="lg"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </Box>
                <Button
                  className="search-mobile"
                  variant="ghost"
                  size="lg"
                  onClick={() => setSearchOpen(true)}
                >
                  <LuSearch size={20} />
                </Button>
              </div>

              {/* Nav Links */}
              <div className="nav-group nav-links">
                <NavLinks onLoginClick={() => setAuthOpen(true)} />
              </div>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <Box as="main" flex="1" w="full">
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage routeMode="local" />} />
              <Route path="/addresses" element={<HomePage />} />
              <Route path="/addresses/:addressId" element={<HomePage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Box>

        {/* Footer */}
        <footer className="site-footer">
          <div className="container">
            <Text fontSize="sm" color="fg.muted" textAlign="center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to the top
            </Text>
          </div>
        </footer>

        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        <SearchModal 
          open={searchOpen} 
          onClose={() => setSearchOpen(false)}
          onSearch={handleSearch}
          initialQuery={searchQuery}
        />
      </div>
    </AuthProvider>
  )
}

function NavLinks({ onLoginClick }: { onLoginClick: () => void }) {
  const { user, logout } = useAuth()
  return (
    <HStack>
      {user ? (
        <>
          <Button asChild variant="ghost" size="lg">
            /* TODO: maybe settings icon instead of "User"? */
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
