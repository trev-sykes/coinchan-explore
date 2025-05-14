import { WagmiProvider } from 'wagmi'
import { config } from './wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashboardLayout from './components/layout/dashboardLayout/DashboardLayout'
import { ExploreGrid } from './pages/dashboard/exploreGrid/ExploreGrid'
import { DashboardHome } from './pages/dashboard/dashboardHome/DashboardHome'
import LandingPage from './pages/landing/landingpage/LandingPage'

function App() {
  const queryClient = new QueryClient()
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="explore" element={<ExploreGrid />} />
            </Route >
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
