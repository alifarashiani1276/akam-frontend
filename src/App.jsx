import { MotionConfig } from 'motion/react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DEFAULT_LANG } from './config/languages'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'

// To add a page later: add <Route path="about" element={<About />} /> inside the layout route.
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/${DEFAULT_LANG}`} replace />} />
        <Route path="/:lang" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </MotionConfig>
  )
}
