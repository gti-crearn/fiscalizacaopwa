import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import TeamPage from './pages/Team/TeamId'
import MinhasFiscalizacoesPage from './pages/MinhasFiscalizacoes/MinhasFiscalizacoes'
import MapaPage from './pages/Mapa/Mapa'
import DefaultLayout from './components/DefaultLayout/DefaultLayout'
import TargetsPage from './pages/Fiscalizacoes/Fiscalizacoes'
import TargetDetailPage from './pages/TargetDetailPage/TargetDetailPage'
import ProtectedRoute from './Router/ProtectedRoute'
import UnauthorizedPage from './pages/UnauthorizedPage/UnauthorizedPage'
import PendentesPage from './pages/PendentesEnvio/PendentesEnvio'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/view/unauthorized" element={<UnauthorizedPage />} />
      <Route element={<DefaultLayout />}>

        <Route path="/view/dashboard" element={
          <ProtectedRoute allowedRoles={["ADMIN"]} >
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/view/equipe/:id" element={
          <ProtectedRoute allowedRoles={["ADMIN"]} >
            <TeamPage />
          </ProtectedRoute>}
        />
        <Route path="/view/meus_alvos" element={
          <ProtectedRoute >
            <MinhasFiscalizacoesPage />
          </ProtectedRoute>}
        />
        <Route path="/view/alvos_pendentes" element={
          <ProtectedRoute >
            <PendentesPage />
          </ProtectedRoute>} />

        <Route path="/view/meus_alvos/mapa" element={
          <ProtectedRoute >
            <MapaPage />
          </ProtectedRoute>}
        />
        <Route path="/view/alvos/mapa" element={
          <ProtectedRoute allowedRoles={["ADMIN"]} >
            <MapaPage />
          </ProtectedRoute>}
        />

        <Route path="/view/alvos" element={
          <ProtectedRoute allowedRoles={["ADMIN"]} >
            <TargetsPage />
          </ProtectedRoute>}
        />
        <Route path="/view/target/:id" element={
          <ProtectedRoute  >
            <TargetDetailPage />
          </ProtectedRoute>}
        />
      </Route>

    </Routes>
  )
}

export default App
