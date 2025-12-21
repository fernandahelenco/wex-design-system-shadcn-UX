import { DocsRoutes } from '@/docs/routes'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

/**
 * Main App component
 * Renders the docs site routes
 */
function App() {
  return (
    <TooltipProvider>
      <DocsRoutes />
      <Toaster />
    </TooltipProvider>
  )
}

export default App
