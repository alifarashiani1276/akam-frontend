import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { MotionConfig } from 'motion/react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DEFAULT_LANG } from './config/languages'
import MainLayout from './components/layout/MainLayout'
import Loader from './components/ui/Loader'
import Home from './pages/Home'

const AdminApp = lazy(() => import('./admin/AdminApp'))
const ProductsPage = lazy(() => import('./pages/Products'))
const ProductSectionPage = lazy(() => import('./pages/Section'))
const ProductSubcategoryPage = lazy(() => import('./pages/Subcategory'))
const ProductPage = lazy(() => import('./pages/Product'))
const ServicePage = lazy(() => import('./pages/Service'))
const AboutPage = lazy(() => import('./pages/About'))
const CapabilitiesPage = lazy(() => import('./pages/Capabilities'))
const ProjectsPage = lazy(() => import('./pages/Projects'))
const ProjectPage = lazy(() => import('./pages/ProjectDetail'))
const ContactPage = lazy(() => import('./pages/Contact'))
const BlogList = lazy(() => import('./pages/PlaceholderPages').then((m) => ({ default: m.BlogList })))
const BlogPost = lazy(() => import('./pages/PlaceholderPages').then((m) => ({ default: m.BlogPost })))
const NotFound = lazy(() => import('./pages/NotFound'))

function LazyPage({ children }) {
  const { t } = useTranslation()
  return <Suspense fallback={<Loader layout="page" label={t('states.loaders.page')} />}>{children}</Suspense>
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<Suspense fallback={<Loader layout="page" label="در حال بارگذاری پنل…" />}><AdminApp /></Suspense>} />
          <Route path="/" element={<Navigate to={`/${DEFAULT_LANG}`} replace />} />
          <Route path="/:lang" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<LazyPage><ProductsPage /></LazyPage>} />
            <Route path="products/:sectionSlug" element={<LazyPage><ProductSectionPage /></LazyPage>} />
            <Route path="products/:sectionSlug/:subSlug" element={<LazyPage><ProductSubcategoryPage /></LazyPage>} />
            <Route path="product/:slug" element={<LazyPage><ProductPage /></LazyPage>} />
            <Route path="service/:slug" element={<LazyPage><ServicePage /></LazyPage>} />
            <Route path="about" element={<LazyPage><AboutPage /></LazyPage>} />
            <Route path="capabilities" element={<LazyPage><CapabilitiesPage /></LazyPage>} />
            <Route path="projects" element={<LazyPage><ProjectsPage /></LazyPage>} />
            <Route path="projects/:slug" element={<LazyPage><ProjectPage /></LazyPage>} />
            <Route path="contact" element={<LazyPage><ContactPage /></LazyPage>} />
            <Route path="blog" element={<LazyPage><BlogList /></LazyPage>} />
            <Route path="blog/:slug" element={<LazyPage><BlogPost /></LazyPage>} />
            <Route path="*" element={<LazyPage><NotFound /></LazyPage>} />
          </Route>
          <Route path="*" element={<Navigate to={`/${DEFAULT_LANG}/not-found`} replace />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
