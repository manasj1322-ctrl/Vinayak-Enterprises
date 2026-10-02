import './globals.css'
import { ThemeProvider } from 'next-themes'
export const metadata = { title: 'Vinayak Enterprises – Client Tracker' }
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="en" suppressHydrationWarning><body className="bg-gray-50 dark:bg-gray-950"><ThemeProvider attribute="class" defaultTheme="light">{children}</ThemeProvider></body></html>)
}
