import type { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ROUTE_PATHS } from '@/shared/routing/route-paths';

import { NotFoundPage } from './pages/NotFoundPage';

export function AppRouter(): ReactElement {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.notFound} element={<NotFoundPage />} />
    </Routes>
  );
}
