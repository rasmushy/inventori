import { ThemeProvider } from 'next-themes'


export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}
