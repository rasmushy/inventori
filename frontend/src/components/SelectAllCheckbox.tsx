import { Box, HStack, Checkbox, Badge } from '@chakra-ui/react'

interface SelectAllCheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  totalItems: number
  selectedCount: number
  size?: 'sm' | 'md' | 'lg'
  compact?: boolean
}

export const SelectAllCheckbox = ({ 
  checked, 
  onCheckedChange, 
  totalItems, 
  selectedCount,
  size = 'sm',
  compact = true
}: SelectAllCheckboxProps) => {
  const padding = compact ? 3 : 4
  const badgeSize = size === 'lg' ? 'lg' : size === 'md' ? 'md' : 'sm'
  const labelSize = size === 'lg' ? 'md' : 'sm'
  
  return (
    <Box bg="blue.25" borderColor="blue.300" rounded="lg" p={padding} shadow="sm">
      <HStack gap={1} align="center" justify="space-between">
        <Checkbox.Root
          checked={checked}
          defaultChecked
          variant="outline"
          colorPalette="blue"
          onCheckedChange={(e) => onCheckedChange(!!e.checked)}
          size={size}
          css={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            '& [data-part="control"]': {
              width: size === 'sm' ? '16px' : size === 'md' ? '18px' : '20px',
              height: size === 'sm' ? '16px' : size === 'md' ? '18px' : '20px',
              flexShrink: 0
            }
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control border="1px solid" />
 
          <Checkbox.Label fontSize={labelSize} fontWeight="bold" color="blue.800">
            Select all ({totalItems} items)
          </Checkbox.Label>
        </Checkbox.Root>
        {selectedCount > 0 && (
          <Badge colorPalette="blue" size={badgeSize} variant="solid" rounded="full" px={size === 'sm' ? 2 : 3} py={size === 'sm' ? 0.5 : 1}>
            {selectedCount} selected
          </Badge>
        )}
      </HStack>
    </Box>
  )
}

