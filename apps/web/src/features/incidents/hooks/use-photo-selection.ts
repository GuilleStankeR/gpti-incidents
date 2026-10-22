import { useEffect, useRef, useState } from 'react';

import type { UploadLimits } from '@incidents/shared';

import { selectPhotos } from './photo-selection-rules';

export interface SelectedPhoto {
  readonly id: string;
  readonly file: File;
  readonly previewUrl: string;
}

export interface PhotoSelectionState {
  readonly photos: readonly SelectedPhoto[];
  readonly error: string | null;
  readonly limits: UploadLimits;
  readonly add: (files: readonly File[]) => void;
  readonly remove: (photoId: string) => void;
}

function toSelectedPhoto(file: File): SelectedPhoto {
  return { id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) };
}

export function usePhotoSelection(limits: UploadLimits): PhotoSelectionState {
  const [photos, setPhotos] = useState<readonly SelectedPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const photosRef = useRef<readonly SelectedPhoto[]>([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(
    () => () => {
      for (const photo of photosRef.current) {
        URL.revokeObjectURL(photo.previewUrl);
      }
    },
    [],
  );

  return {
    photos,
    error,
    limits,
    add: (files) => {
      const selection = selectPhotos(files, photos.length, limits);
      setPhotos([...photos, ...selection.accepted.map(toSelectedPhoto)]);
      setError(selection.error);
    },
    remove: (photoId) => {
      const removed = photos.find((photo) => photo.id === photoId);
      if (removed !== undefined) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      setPhotos(photos.filter((photo) => photo.id !== photoId));
      setError(null);
    },
  };
}
