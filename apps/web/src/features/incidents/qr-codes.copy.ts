export const qrCodesCopy = {
  title: 'Códigos QR para reportar',
  description:
    'Genera un código QR para imprimir y pegar en conserjería, ascensores o estacionamientos. Al escanearlo se abre el formulario de reporte con el condominio y la ubicación ya seleccionados.',
  settingsTitle: 'Configuración',
  locationLabel: 'Ubicación',
  locationPlaceholder: 'Todo el condominio (sin ubicación)',
  locationHint: 'Opcional. Si eliges una, quedará preseleccionada en el formulario.',
  loginHint:
    'Si quien escanea no ha iniciado sesión, el sistema le pide entrar y luego abre el formulario.',
  poster: {
    title: 'Reporta un incidente',
    instruction: 'Escanea el código con la cámara de tu celular',
    allLocations: 'Todo el condominio',
  },
  qrLabel: (location: string): string => `Código QR para reportar un incidente: ${location}`,
  linkLabel: 'Enlace del código',
  download: 'Descargar PNG',
  print: 'Imprimir',
  downloadError: 'No pudimos generar la imagen. Intenta nuevamente.',
  fileName: (slug: string): string => `qr-reporte-${slug}.png`,
} as const;
