import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'

const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage })),
)
const UserPage = lazy(() =>
  import('@/pages/UserPage').then((module) => ({ default: module.UserPage })),
)
const RepositoryDetailsPage = lazy(() =>
  import('@/pages/RepositoryDetailsPage').then((module) => ({
    default: module.RepositoryDetailsPage,
  })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  })),
)

export function AppRoutes() {
  return (
    <Suspense fallback={<main className="container py-4"><LoadingSpinner /></main>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/:username" element={<UserPage />} />
        <Route
          path="/user/:username/repos/:repoName"
          element={<RepositoryDetailsPage />}
        />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}
