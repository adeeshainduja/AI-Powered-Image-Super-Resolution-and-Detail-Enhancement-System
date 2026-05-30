import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import TopNav from "./components/TopNav.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import JobPage from "./pages/JobPage.jsx";
import DocsPage from "./pages/DocsPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import SignIn from "./pages/SignIn";

function Layout() {
  return (
    <>
      <TopNav />
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages with navbar and footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/job/:jobId" element={<JobPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}