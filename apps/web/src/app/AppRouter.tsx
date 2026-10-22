import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { InboxPage } from '@/features/incidents/pages/InboxPage';
import { IncidentDetailPage } from '@/features/incidents/pages/IncidentDetailPage';
import { ReportIncidentPage } from '@/features/incidents/pages/ReportIncidentPage';
import { ROUTE_PATHS } from '@/shared/routing/route-paths';

import { AuthenticatedLayout } from './layout/AuthenticatedLayout';
import { NotFoundPage } from './pages/NotFoundPage';

export function AppRouter(): ReactElement {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.login} element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route
            path={ROUTE_PATHS.home}
            element={<Navigate to={ROUTE_PATHS.incidents} replace />}
          />
          <Route path={ROUTE_PATHS.incidents} element={<InboxPage />} />
          <Route path={ROUTE_PATHS.newIncident} element={<ReportIncidentPage />} />
          <Route path={ROUTE_PATHS.incidentDetail} element={<IncidentDetailPage />} />
        </Route>
      </Route>
      <Route path={ROUTE_PATHS.notFound} element={<NotFoundPage />} />
    </Routes>
  );
}
