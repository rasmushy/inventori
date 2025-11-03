import { Box, VStack, SimpleGrid, Text, Badge, Card, Image, HStack } from '@chakra-ui/react'
import type { Item, Address } from '../../types'
import { formatPrice } from '../../utils/format'
import { CompactCheckbox } from '../CompactCheckbox'
import { SelectAllCheckbox } from '../SelectAllCheckbox'

interface GridViewProps {
  items: Item[]
  addresses: Address[]
  selectedItems: Set<string>
  multiSelect: boolean
  onItemClick: (item: Item) => void
  onToggleItem: (id: string) => void
  onSelectAll: (checked: boolean) => void
}

export const GridView = ({
  items,
  addresses,
  selectedItems,
  multiSelect,
  onItemClick,
  onToggleItem,
  onSelectAll
}: GridViewProps) => {
  const allSelected = items.length > 0 && items.every(item => selectedItems.has(item.id))

  return (
    <VStack gap={4} align="stretch">
      {/* Select All Section */}
      {multiSelect && items.length > 0 && (
        <SelectAllCheckbox
          checked={allSelected}
          onCheckedChange={onSelectAll}
          totalItems={items.length}
          selectedCount={selectedItems.size}
          size="md"
        />
      )}

      {/* Grid */}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={6}>
        {items.map((item) => {
          const addr = item.addressId === undefined ? 'Unlocated' : (addresses.find((a) => a.id === item.addressId)?.label ?? '')
          const thumbUrl = item.images && item.images.length ? item.images[0].url : null
          const isSelected = selectedItems.has(item.id)
          
          return (
            <Card.Root
              key={item.id}
              cursor="pointer"
              onClick={() => { if (multiSelect) onToggleItem(item.id); else onItemClick(item) }}
              position="relative"
              bg={isSelected ? "blue.50" : "white"}
              border="1px solid"
              borderColor={isSelected ? "blue.200" : "border.muted"}
              borderLeft={isSelected ? "4px solid" : "4px solid transparent"}
              borderLeftColor={isSelected ? "blue.500" : "transparent"}
              rounded="xl"
              overflow="hidden"
              _hover={{
                shadow: "lg",
                transform: "translateY(-2px)",
                borderColor: isSelected ? "blue.300" : "blue.200",
                bg: isSelected ? "blue.100" : "white"
              }}
              transition="all 0.3s ease"
              data-selected={isSelected ? "" : undefined}
            >
              {multiSelect && (
                <Box position="absolute" top={3} left={3} zIndex={1}>
                  <CompactCheckbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleItem(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    size="md"
                  />
                </Box>
              )}
              <Card.Body p={0}>
                <VStack gap={0} align="stretch">
                  <Box
                    aspectRatio="1"
                    bg="bg.muted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="3xl"
                    position="relative"
                    overflow="hidden"
                  >
                    {thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt={item.name}
                        objectFit="cover"
                        w="full"
                        h="full"
                      />
                    ) : (
                      <Text opacity={0.6}>📦</Text>
                    )}
                  </Box>
                  <Box p={4}>
                    <VStack gap={2} align="flex-start">
                      <Text
                        fontWeight="semibold"
                        fontSize="md"
                        lineClamp={2}
                        color={isSelected ? "blue.700" : "fg.emphasized"}
                      >
                        {item.name}
                      </Text>
                      <HStack gap={2} align="center">
                        <Badge
                          size="sm"
                          colorPalette={item.addressId === undefined ? 'orange' : 'blue'}
                          variant={isSelected ? "solid" : "subtle"}
                          rounded="full"
                        >
                          {addr}
                        </Badge>
                        {item.purchasePriceCents !== undefined && (
                          <Text fontSize="sm" fontWeight="medium" color={isSelected ? "blue.600" : "green.600"}>
                            {formatPrice(item.purchasePriceCents)}
                          </Text>
                        )}
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </Card.Body>
            </Card.Root>
          )
        })}
        {items.length === 0 && (
          <Box gridColumn="1 / -1" textAlign="center" py={12}>
            <VStack gap={4}>
              <Text fontSize="xl" color="fg.muted" fontWeight="medium">
                No items found
              </Text>
              <Text color="fg.muted">
                Try adjusting your filters or add some items to get started.
              </Text>
            </VStack>
          </Box>
        )}
      </SimpleGrid>
    </VStack>
  )
}

