import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import TopNav from './components/TopNav.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import JobPage from './pages/JobPage.jsx'
import DocsPage from './pages/DocsPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'

function Layout() {
  return (
    <>
      <TopNav />
      <Outlet />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/job/:jobId" element={<JobPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
