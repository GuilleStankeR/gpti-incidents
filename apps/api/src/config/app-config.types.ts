export interface JwtSettings {
  readonly secret: string;
  readonly expiresIn: string;
}

export interface UploadSettings {
  readonly maxFileSizeBytes: number;
  readonly maxFilesPerUpload: number;
}

export interface NominatimSettings {
  readonly url: string;
  readonly userAgent: string;
  readonly timeoutMs: number;
}
