import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth.store'

// Pages
import { LandingPage } from '@/pages/LandingPage'
import { AuthPage } from '@/pages/auth/AuthPage'
import { MyListsPage } from '@/pages/admin/MyListsPage'
import { CreateListPage } from '@/pages/admin/CreateListPage'
import { ListDetailsPage } from '@/pages/admin/ListDetailsPage'
import { EditListPage } from '@/pages/admin/EditListPage'
import { PublicListPage } from '@/pages/public/PublicListPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/lists/:id/public" element={<PublicListPage />} />

          <Route
            path="/my-lists"
            element={
              <ProtectedRoute>
                <MyListsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lists/create"
            element={
              <ProtectedRoute>
                <CreateListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lists/:id"
            element={
              <ProtectedRoute>
                <ListDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lists/:id/edit"
            element={
              <ProtectedRoute>
                <EditListPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
