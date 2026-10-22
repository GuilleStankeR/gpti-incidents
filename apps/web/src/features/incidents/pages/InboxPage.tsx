import type { ReactElement } from 'react';

import { incidentsCopy } from '@/features/incidents/incidents.copy';
import { PageHeader } from '@/shared/ui/PageHeader';

export function InboxPage(): ReactElement {
  return (
    <PageHeader title={incidentsCopy.inbox.title} description={incidentsCopy.inbox.description} />
  );
}
