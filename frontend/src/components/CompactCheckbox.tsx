import { Checkbox } from '@chakra-ui/react'

interface CompactCheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  onClick?: (e: React.MouseEvent) => void
  size?: 'sm' | 'md' | 'lg'
}

export const CompactCheckbox = ({ 
  checked, 
  onCheckedChange, 
  onClick,
  size = 'sm'
}: CompactCheckboxProps) => {
  return (
    <Checkbox.Root
      checked={checked}
      onCheckedChange={(e) => onCheckedChange(!!e.checked)}
      onClick={onClick}
      size={size}
      variant="outline"
      colorPalette="blue"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      css={{
        '& [data-part="control"]': {
          width: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
          height: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
        }
      }}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
    </Checkbox.Root>
  )
}

