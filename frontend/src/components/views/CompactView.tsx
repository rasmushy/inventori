import { Box, VStack, HStack, Text, Badge, Card, Image } from '@chakra-ui/react'
import type { Item, Address } from '../../types'
import { formatPrice, formatTags, extractYear } from '../../utils/format'
import { CompactCheckbox } from '../CompactCheckbox'
import { SelectAllCheckbox } from '../SelectAllCheckbox'

interface CompactViewProps {
  items: Item[]
  addresses: Address[]
  selectedItems: Set<string>
  multiSelect: boolean
  onItemClick: (item: Item) => void
  onToggleItem: (id: string) => void
  onSelectAll: (checked: boolean) => void
}

export const CompactView = ({
  items,
  addresses,
  selectedItems,
  multiSelect,
  onItemClick,
  onToggleItem,
  onSelectAll
}: CompactViewProps) => {
  const allSelected = items.length > 0 && items.every(item => selectedItems.has(item.id))

  return (
    <VStack gap={2} align="stretch">
      {/* Select All Section */}
      {multiSelect && items.length > 0 && (
        <SelectAllCheckbox
          checked={allSelected}
          onCheckedChange={onSelectAll}
          totalItems={items.length}
          selectedCount={selectedItems.size}
          size="sm"
          compact
        />
      )}

      {/* Compact Horizontal Cards */}
      <VStack gap={1} align="stretch">
        {items.map((item) => {
          const addr = item.addressId === undefined ? 'Unlocated' : (addresses.find((a) => a.id === item.addressId)?.label ?? '')
          const thumbUrl = item.images && item.images.length ? item.images[0].url : null
          const year = extractYear(item.purchaseDate)
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
              rounded="md"
              overflow="hidden"
              _hover={{
                shadow: "sm",
                transform: "translateY(-1px)",
                borderColor: isSelected ? "blue.300" : "blue.200",
                bg: isSelected ? "blue.100" : "bg.muted"
              }}
              transition="all 0.2s ease"
              data-selected={isSelected ? "" : undefined}
            >
              {multiSelect && (
                <Box position="absolute" top={2} left={2} zIndex={1}>
                  <CompactCheckbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleItem(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    size="sm"
                  />
                </Box>
              )}
              <Card.Body p={3}>
                <HStack gap={3} align="center">
                  {/* Thumbnail */}
                  <Box
                    w={12}
                    h={12}
                    bg="bg.muted"
                    rounded="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="lg"
                    flexShrink={0}
                    overflow="hidden"
                  >
                    {thumbUrl ? (
                      <Image src={thumbUrl} alt={item.name} objectFit="cover" w="full" h="full" />
                    ) : (
                      <Text opacity={0.6}>📦</Text>
                    )}
                  </Box>

                  {/* Content */}
                  <HStack gap={4} align="center" flex="1" minW={0}>
                    <VStack gap={1} align="flex-start" flex="1" minW={0}>
                      <Text
                        fontWeight="semibold"
                        fontSize="sm"
                        lineClamp={1}
                        color={isSelected ? "blue.700" : "fg.emphasized"}
                      >
                        {item.name}
                      </Text>
                      <HStack gap={2} align="center" wrap="wrap">
                        <Badge
                          size="xs"
                          colorPalette={item.addressId === undefined ? 'orange' : 'blue'}
                          variant={isSelected ? "solid" : "subtle"}
                          rounded="full"
                        >
                          {addr}
                        </Badge>
                        {item.purchasePriceCents !== undefined && (
                          <Text fontSize="xs" fontWeight="medium" color={isSelected ? "blue.600" : "green.600"}>
                            {formatPrice(item.purchasePriceCents)}
                          </Text>
                        )}
                        {year && (
                          <Text fontSize="xs" color={isSelected ? "blue.600" : "fg.muted"}>
                            {year}
                          </Text>
                        )}
                      </HStack>
                    </VStack>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <Text
                        fontSize="xs"
                        color={isSelected ? "blue.600" : "fg.muted"}
                        lineClamp={1}
                        maxW="120px"
                        flexShrink={0}
                      >
                        {formatTags(item.tags)}
                      </Text>
                    )}
                  </HStack>
                </HStack>
              </Card.Body>
            </Card.Root>
          )
        })}

        {items.length === 0 && (
          <Box textAlign="center" py={12}>
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
      </VStack>
    </VStack>
  )
}

