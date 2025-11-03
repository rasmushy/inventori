import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        bg: { value: '#f7f6f3' }, // $color-bg
        'bg-elev': { value: '#ffffff' }, // $color-bg-elev
        text: { value: '#2a2a2a' }, // $color-text
        'text-muted': { value: '#6b6b6b' }, // $color-text-muted
        border: { value: '#e5e2da' }, // $color-border
        accent: { value: '#6b6ff6' }, // $color-accent
        'accent-strong': { value: '#5055ee' }, // $color-accent-strong
        'accent-soft': { value: '#eef0ff' }, // $color-accent-soft
        
        blue: {
          50: { value: '#eef0ff' },
          100: { value: '#dce0ff' },
          200: { value: '#c1c7ff' },
          300: { value: '#a5adff' },
          400: { value: '#8a94ff' },
          500: { value: '#6b6ff6' },
          600: { value: '#5055ee' },
          700: { value: '#3f44d9' },
          800: { value: '#3035b8' },
          900: { value: '#252997' },
          950: { value: '#1a1d76' },
        },
        
        red: {
          50: { value: '#fef2f2' },
          100: { value: '#fee2e2' },
          200: { value: '#fecaca' },
          300: { value: '#fca5a5' },
          400: { value: '#f87171' },
          500: { value: '#ef4444' },
          600: { value: '#dc2626' },
          700: { value: '#b91c1c' },
          800: { value: '#991b1b' },
          900: { value: '#7f1d1d' },
          950: { value: '#450a0a' },
        },
        
        gray: {
          50: { value: '#fafaf9' },
          100: { value: '#f5f5f4' },
          200: { value: '#e7e5e4' },
          300: { value: '#d6d3d1' },
          400: { value: '#a8a29e' },
          500: { value: '#78716c' },
          600: { value: '#57534e' },
          700: { value: '#44403c' },
          800: { value: '#292524' },
          900: { value: '#1c1917' },
          950: { value: '#0c0a09' },
        },
        
        green: {
          50: { value: '#f0fdf4' },
          100: { value: '#dcfce7' },
          200: { value: '#bbf7d0' },
          300: { value: '#86efac' },
          400: { value: '#4ade80' },
          500: { value: '#22c55e' },
          600: { value: '#16a34a' },
          700: { value: '#15803d' },
          800: { value: '#166534' },
          900: { value: '#14532d' },
          950: { value: '#052e16' },
        },
        
        orange: {
          50: { value: '#fff7ed' },
          100: { value: '#ffedd5' },
          200: { value: '#fed7aa' },
          300: { value: '#fdba74' },
          400: { value: '#fb923c' },
          500: { value: '#f97316' },
          600: { value: '#ea580c' },
          700: { value: '#c2410c' },
          800: { value: '#9a3412' },
          900: { value: '#7c2d12' },
          950: { value: '#431407' },
        },
      },
      spacing: {
        '025': { value: '0.25rem' },
        '050': { value: '0.5rem' },
        '075': { value: '0.75rem' },
        '100': { value: '1rem' },
        '125': { value: '1.25rem' },
        '150': { value: '1.5rem' },
      },
      radii: {
        sm: { value: '4px' },
        md: { value: '6px' },
        lg: { value: '8px' },
        xl: { value: '12px' },
      },
      shadows: {
        card: { value: '0 1px 2px rgba(17, 17, 17, 0.05), 0 8px 24px rgba(17, 17, 17, 0.06)' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
