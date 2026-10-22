import { useState } from 'react';
import type { FormEvent } from 'react';

import type { CatalogsResponse } from '@incidents/shared';

import { getErrorMessage } from '@/shared/api/error-message';
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '@/shared/lib/datetime-local';

import { hasErrors, validateReportIncident } from './report-incident-validation';
import type { ReportIncidentErrors, ReportIncidentValues } from './report-incident-validation';
import { useCreateIncident } from './use-create-incident';
import { useGeolocation } from './use-geolocation';
import type { GeolocationState } from './use-geolocation';
import { usePhotoSelection } from './use-photo-selection';
import type { PhotoSelectionState } from './use-photo-selection';

export interface ReportIncidentFormState {
  readonly values: ReportIncidentValues;
  readonly errors: ReportIncidentErrors;
  readonly geolocation: GeolocationState;
  readonly photos: PhotoSelectionState;
  readonly isSubmitting: boolean;
  readonly submitError: string | null;
  readonly setValue: (field: keyof ReportIncidentValues, value: string) => void;
  readonly submit: (event: FormEvent<HTMLFormElement>) => void;
}

function createInitialValues(): ReportIncidentValues {
  return {
    categoryCode: '',
    description: '',
    location: '',
    occurredAt: toDateTimeLocalValue(new Date()),
  };
}

export function useReportIncidentForm(catalogs: CatalogsResponse): ReportIncidentFormState {
  const [values, setValues] = useState<ReportIncidentValues>(createInitialValues);
  const [errors, setErrors] = useState<ReportIncidentErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const geolocation = useGeolocation();
  const photos = usePhotoSelection(catalogs.uploadLimits);
  const createMutation = useCreateIncident();

  return {
    values,
    errors,
    geolocation,
    photos,
    isSubmitting: createMutation.isPending,
    submitError: createMutation.isError ? getErrorMessage(createMutation.error) : null,
    setValue: (field, value) => {
      const nextValues = { ...values, [field]: value };
      setValues(nextValues);
      if (hasSubmitted) {
        setErrors(validateReportIncident(nextValues, new Date()));
      }
    },
    submit: (event) => {
      event.preventDefault();
      const validationErrors = validateReportIncident(values, new Date());
      setHasSubmitted(true);
      setErrors(validationErrors);
      if (hasErrors(validationErrors)) {
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
