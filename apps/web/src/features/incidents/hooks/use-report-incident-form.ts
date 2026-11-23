import { useState } from 'react';
import type { FormEvent } from 'react';

import type { CatalogsResponse } from '@incidents/shared';

import { getErrorMessage } from '@/shared/api/error-message';
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '@/shared/lib/datetime-local';

import { hasErrors, validateReportIncident } from './report-incident-validation';
import type { ReportIncidentErrors, ReportIncidentValues } from './report-incident-validation';
import { useCategorySuggestion } from './use-category-suggestion';
import type { CategorySuggestionState } from './use-category-suggestion';
import { useCreateIncident } from './use-create-incident';
import { useGeolocation } from './use-geolocation';
import type { GeolocationState } from './use-geolocation';
import { usePhotoSelection } from './use-photo-selection';
import type { PhotoSelectionState } from './use-photo-selection';

type ReportTextValues = Omit<ReportIncidentValues, 'categoryCode'>;

export type ReportTextField = keyof ReportTextValues;

export interface ReportIncidentFormState {
  readonly values: ReportIncidentValues;
  readonly errors: ReportIncidentErrors;
  readonly category: CategorySuggestionState;
  readonly geolocation: GeolocationState;
  readonly photos: PhotoSelectionState;
  readonly isSubmitting: boolean;
  readonly submitError: string | null;
  readonly setValue: (field: ReportTextField, value: string) => void;
  readonly submit: (event: FormEvent<HTMLFormElement>) => void;
}

function createInitialValues(): ReportTextValues {
  return {
    description: '',
    location: '',
    occurredAt: toDateTimeLocalValue(new Date()),
  };
}

export function useReportIncidentForm(catalogs: CatalogsResponse): ReportIncidentFormState {
  const [textValues, setTextValues] = useState<ReportTextValues>(createInitialValues);
  const [validatedAt, setValidatedAt] = useState<Date | null>(null);
  const category = useCategorySuggestion(textValues);
  const geolocation = useGeolocation();
  const photos = usePhotoSelection(catalogs.uploadLimits);
  const createMutation = useCreateIncident();
  const values: ReportIncidentValues = { ...textValues, categoryCode: category.categoryCode };

  return {
    values,
    errors: validatedAt === null ? {} : validateReportIncident(values, validatedAt),
    category,
    geolocation,
    photos,
    isSubmitting: createMutation.isPending,
    submitError: createMutation.isError ? getErrorMessage(createMutation.error) : null,
    setValue: (field, value) => {
      setTextValues({ ...textValues, [field]: value });
    },
    submit: (event) => {
      event.preventDefault();
      const now = new Date();
      setValidatedAt(now);
      if (hasErrors(validateReportIncident(values, now))) {
        return;
      }
      createMutation.mutate({
        ...values,
        description: values.description.trim(),
        occurredAt: fromDateTimeLocalValue(values.occurredAt).toISOString(),
        coordinates: geolocation.coordinates,
        photos: photos.photos.map((photo) => photo.file),
      });
    },
  };
}
