import { Box, VStack, Text, Badge, Table } from '@chakra-ui/react'
import type { Item, Address } from '../../types'
import { formatPrice, formatTags, extractYear } from '../../utils/format'
import { CompactCheckbox } from '../CompactCheckbox'
import { SelectAllCheckbox } from '../SelectAllCheckbox'

interface ListViewProps {
  items: Item[]
  addresses: Address[]
  selectedItems: Set<string>
  multiSelect: boolean
  onItemClick: (item: Item) => void
  onToggleItem: (id: string) => void
  onSelectAll: (checked: boolean) => void
}

export const ListView = ({
  items,
  addresses,
  selectedItems,
  multiSelect,
  onItemClick,
  onToggleItem,
  onSelectAll
}: ListViewProps) => {
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
          compact
        />
      )}

      {/* Table */}
      <Box bg="white" rounded="xl" shadow="sm" border="1px solid" borderColor="border.muted" overflow="hidden">
        <Table.Root variant="line" size="md" css={{ '& td, & th': { paddingLeft: '16px', paddingRight: '16px' } }}>
          <Table.Header>
            <Table.Row>
              {multiSelect && (
                <Table.ColumnHeader w="40px" textAlign="center" px={2}>
                  <Text fontSize="xs" color="fg.muted" fontWeight="medium">Select</Text>
                </Table.ColumnHeader>
              )}
              <Table.ColumnHeader fontWeight="semibold" color="fg.emphasized">Name</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="fg.emphasized" w="150px">Address</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="fg.emphasized" w="200px">Tags</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="fg.emphasized" w="80px">Date</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="semibold" color="fg.emphasized" textAlign="right" w="100px">Price</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item) => {
              const addr = item.addressId === undefined ? 'Unlocated' : (addresses.find((a) => a.id === item.addressId)?.label ?? '')
              const year = extractYear(item.purchaseDate)
              const isSelected = selectedItems.has(item.id)
              
              return (
                <Table.Row
                  key={item.id}
                  cursor="pointer"
                  onClick={() => { if (multiSelect) onToggleItem(item.id); else onItemClick(item) }}
                  bg={isSelected ? "blue.50" : "transparent"}
                  borderLeft={isSelected ? "6px solid" : "1px solid transparent"}
                  borderLeftColor={isSelected ? "blue.500" : "transparent"}
                  boxShadow={isSelected ? "inset 0 0 0 2px var(--chakra-colors-blue-300)" : "none"}
                  _hover={{
                    bg: isSelected ? "blue.100" : "bg.muted",
                    transform: "translateY(-1px)",
                    shadow: isSelected ? "lg" : "sm"
                  }}
                  transition="all 0.2s ease"
                  data-selected={isSelected ? "" : undefined}
                >
                  {multiSelect && (
                    <Table.Cell textAlign="center" px={2}>
                      <CompactCheckbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleItem(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        size="sm"
                      />
                    </Table.Cell>
                  )}
                  <Table.Cell>
                    <Text
                      fontWeight="semibold"
                      fontSize="md"
                      color={isSelected ? "blue.800" : "fg.emphasized"}
                      lineClamp={1}
                    >
                      {item.name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      size="sm"
                      colorPalette={item.addressId === undefined ? 'orange' : 'blue'}
                      variant={isSelected ? "solid" : "subtle"}
                      rounded="full"
                    >
                      {addr}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {item.tags && item.tags.length ? (
                      <Text fontSize="sm" color={isSelected ? "blue.700" : "fg.muted"} lineClamp={1}>
                        {formatTags(item.tags)}
                      </Text>
                    ) : (
                      <Text color="fg.muted" fontSize="sm">—</Text>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {year ? (
                      <Text fontSize="sm" color={isSelected ? "blue.700" : "fg.muted"}>
                        {year}
                      </Text>
                    ) : (
                      <Text color="fg.muted" fontSize="sm">—</Text>
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {item.purchasePriceCents !== undefined ? (
                      <Text fontWeight="medium" color={isSelected ? "blue.700" : "green.600"} fontSize="sm">
                        {formatPrice(item.purchasePriceCents)}
                      </Text>
                    ) : (
                      <Text color="fg.muted" fontSize="sm">—</Text>
                    )}
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
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
      </Box>
    </VStack>
  )
}

