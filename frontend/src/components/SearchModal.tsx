import { useState, useEffect } from 'react'
import { Input, Button, VStack, HStack, Text, Box } from '@chakra-ui/react'
import { LuSearch, LuX } from 'react-icons/lu'

interface SearchModalProps {
  open: boolean
  onClose: () => void
  onSearch: (query: string) => void
  initialQuery?: string
}

export function SearchModal({ open, onClose, onSearch, initialQuery = '' }: SearchModalProps) {
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    if (open) {
      setQuery(initialQuery)
    }
  }, [open, initialQuery])

  const handleSearch = () => {
    onSearch(query)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <Box className="modal" role="dialog" aria-modal="true" aria-labelledby="search-modal-title" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <HStack justify="space-between" align="center" w="full">
            <Text id="search-modal-title" fontSize="lg" fontWeight="semibold" style={{ margin: 0 }}>
              Search Items
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close search"
            >
              <LuX size={20} />
            </Button>
          </HStack>
        </header>
        
        <div className="modal-body">
          <VStack gap={4} align="stretch">
            <Box position="relative">
              <Input
                size="lg"
                placeholder="Search items..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                pl="3rem"
              />
              <Box
                position="absolute"
                left="0.75rem"
                top="50%"
                transform="translateY(-50%)"
                color="fg.muted"
                pointerEvents="none"
              >
                <LuSearch size={20} />
              </Box>
            </Box>
            
            <HStack gap={3} justify="flex-end">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorPalette="blue" 
                onClick={handleSearch}
                disabled={!query.trim()}
              >
                Search
              </Button>
            </HStack>
          </VStack>
        </div>
      </Box>
    </div>
  )
}
