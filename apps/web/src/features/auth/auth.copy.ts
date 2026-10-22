export const authCopy = {
  brand: {
    eyebrow: 'Paralelo 29 SpA',
    headline: 'Cada incidente, con respaldo probatorio.',
    description:
      'Registra, sigue y documenta los incidentes de seguridad y mantenimiento del condominio en un expediente trazable.',
    highlights: [
      'Folio único y fecha de registro asignada por el sistema',
      'Evidencia fotográfica con hash SHA-256 verificable',
      'Bitácora inalterable de cada cambio de estado',
    ],
  },
  form: {
    title: 'Iniciar sesión',
    description: 'Ingresa con tu correo y contraseña.',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'nombre@paralelo29.cl',
    passwordLabel: 'Contraseña',
    submit: 'Ingresar',
    errorTitle: 'No pudimos iniciar tu sesión',
  },
  demo: {
    title: 'Cuentas de demostración',
    description: 'Todas usan la contraseña demo1234.',
    useAccount: 'Usar',
    useAccountLabel: (email: string): string => `Usar la cuenta ${email}`,
    accounts: [
      { roleLabel: 'Residente', email: 'residente@paralelo29.cl', password: 'demo1234' },
      { roleLabel: 'Conserje', email: 'conserje@paralelo29.cl', password: 'demo1234' },
      { roleLabel: 'Administrador', email: 'admin@paralelo29.cl', password: 'demo1234' },
    ],
  },
} as const;

export type DemoAccount = (typeof authCopy.demo.accounts)[number];
