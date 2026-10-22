# Sistema de Gestión y Reporte de Incidentes

Plataforma web para registrar, seguir y documentar los incidentes de seguridad y mantenimiento de
los condominios que administra Paralelo 29 SpA. Cada incidente recibe un folio único, una fecha de
registro asignada por el servidor, evidencia fotográfica con hash SHA-256 y una bitácora
inalterable de sus cambios de estado. El resultado es un expediente digital trazable y exportable
en PDF, que sirve como respaldo probatorio ante aseguradoras, empresas de mantención o la
inmobiliaria.

---

## Requisitos previos

| Requisito | Detalle |
|---|---|
| Node.js | 22 o superior (ver `.nvmrc`) |
| npm | 10 o superior |
| Docker Desktop | En ejecución: PostgreSQL 16 corre en un contenedor |
| Puertos libres | `3000` (API), `5173` (web), `5432` (PostgreSQL) |
| Internet (opcional) | Para la geocodificación inversa (Nominatim) y el mapa (OpenStreetMap). Sin conexión el sistema funciona igual |

## Puesta en marcha

Desde un clon limpio:

```bash
npm run setup
npm run dev
```

O ambos con un solo comando:

```bash
npm start
```

Luego abrir **http://localhost:5173**.

`npm run setup` crea el `.env` a partir de `.env.example`, verifica que Docker esté corriendo,
instala dependencias, compila el paquete compartido, levanta PostgreSQL, genera el cliente de
Prisma, aplica las migraciones y carga los datos de demostración. `npm run dev` levanta la API
(NestJS, puerto 3000) y la web (Vite, puerto 5173); la web accede a la API mediante el proxy
`/api` de Vite.

| Otros comandos | Qué hace |
|---|---|
| `npm run db:reset` | Vacía el almacenamiento de archivos, recrea la base y vuelve a cargar el seed |
| `npm run build` | Compila todos los workspaces |
| `npm run lint` | ESLint sobre todo el monorepo |
| `npm run typecheck` | Verificación de tipos de todos los workspaces |
| `npm run format` | Formatea con Prettier |
| `npm run db:down` | Detiene el contenedor de PostgreSQL |

## Cuentas de demostración

Todas las cuentas usan la contraseña **`demo1234`**.

| Nombre | Correo | Perfil |
|---|---|---|
| Carla Jiménez | `residente@paralelo29.cl` | Residente |
| Luis Meneses | `conserje@paralelo29.cl` | Conserje |
| Patricia Rojas | `admin@paralelo29.cl` | Administrador |
| Héctor Salas | `conserje2@paralelo29.cl` | Conserje |
| Daniel Fuentes | `residente2@paralelo29.cl` | Residente |

El seed carga el Condominio Parque Oriente (`C29`) con 32 incidentes de los últimos 90 días:
21 cerrados (17 dentro del plazo y 4 fuera), 2 rechazados y 9 abiertos, de los cuales 2 están
vencidos. Todos tienen bitácora completa y los cerrados tienen evidencia fotográfica.

## Mapa del monorepo

```
.
├── package.json             npm workspaces y scripts raíz
├── docker-compose.yml       PostgreSQL 16
├── .env.example             variables de entorno (ver tabla al final)
├── CLAUDE.md                reglas de desarrollo del proyecto
├── ESPECIFICACION-MVP.md    especificación funcional
├── docs/
│   ├── commit-plan.md       plan técnico de implementación, commit por commit
│   └── acceptance-checklist.md
├── tooling/eslint/          configuración de ESLint y regla propia sin comentarios
├── scripts/                 scripts de soporte (.env, Docker, almacenamiento)
├── packages/
│   └── shared/              @incidents/shared: estados, transiciones, permisos, errores y contratos
└── apps/
    ├── api/                 @incidents/api: NestJS 11 + Prisma 5
    │   ├── prisma/          esquema, migraciones (incluye triggers) y seed
    │   └── src/
    │       ├── config/      configuración validada al arrancar
    │       ├── common/      errores, guards, decoradores, validación de archivos
    │       └── modules/     auth, catalogs, users, incidents, evidence, storage,
    │                        geocoding, case-files (PDF), metrics
    └── web/                 @incidents/web: React 18 + Vite + Tailwind CSS
        └── src/
            ├── app/         proveedores, router y layout autenticado
            ├── shared/      cliente HTTP, kit de UI, layout, utilidades y copy común
            └── features/    auth, incidents (bandeja, reporte, detalle), metrics
```

## Decisiones de diseño

**Prisma sobre TypeORM.** El esquema queda declarado en un solo archivo legible, las migraciones
son explícitas y admiten SQL personalizado, que es necesario para los triggers de inmutabilidad.

**Sin Passport.** Un `AuthGuard` propio verifica el JWT (HS256, 8 horas) y un `CapabilityGuard`
aplica la matriz de permisos compartida con el frontend. Se evitan dependencias y una capa de
indirección.

**`pdfkit` sobre un navegador headless.** No descarga Chromium ni requiere binarios externos, y el
expediente es un documento de estructura simple. Las imágenes se normalizan con `sharp` para que
el PDF muestre también fotografías WebP.

**Sin mapa estático en el PDF.** Los servicios gratuitos de mapas estáticos son inestables o
requieren llave. El expediente imprime coordenadas y dirección geocodificada, que es lo que tiene
valor probatorio; el mapa visual se muestra en la web con el iframe público de OpenStreetMap.

**RN-03: no se cierra sin evidencia.** El backend rechaza el cierre de un incidente sin al menos
una fotografía (`CLOSURE_WITHOUT_EVIDENCE`). Así, el indicador "incidentes con evidencia al
cierre" es 100 % por construcción y no por disciplina del usuario. La interfaz muestra el rechazo
dentro del modal de cierre.

**RN-12: bitácora y evidencia de solo inserción.** No existen endpoints de edición ni de borrado,
y la base de datos lo garantiza: triggers lanzan una excepción ante `UPDATE`, `DELETE` o
`TRUNCATE` sobre `audit_entry` y `evidence`. Cada transición y su entrada de bitácora se escriben
en la misma transacción; si otra petición cambió el estado primero, no se escribe nada.

**RN-13: integridad de la evidencia.** Cada archivo se guarda en disco en solo lectura, con su
hash SHA-256 calculado al momento de la carga. El hash se muestra en la web y se imprime completo
en el expediente PDF, de modo que cualquiera puede verificar que la fotografía no fue alterada.
El tipo de archivo se valida por su contenido real, no por la extensión.

Otras decisiones relevantes:

- El folio (`C29-2026-0043`) se genera con un `UPSERT` atómico, sin bloqueos explícitos.
- La fecha de registro la asigna el servidor; la fecha del hecho declarada se valida (no futura,
  máximo 30 días).
- Toda consulta se filtra por el condominio del token; un recurso ajeno responde 404.
- La geocodificación nunca hace fallar un registro: ante un error o un timeout, el incidente se
  crea sin dirección.

### Desviaciones respecto de la especificación

| Tema | Especificación | Implementación |
|---|---|---|
| Idioma del código | Identificadores en español | Código en inglés y textos de la interfaz en español. El glosario está en `CLAUDE.md` (por ejemplo, `INGRESADO` → `REPORTED`, `CIERRE_SIN_EVIDENCIA` → `CLOSURE_WITHOUT_EVIDENCE`, `/api/incidentes` → `/api/incidents`) |
| Pruebas automatizadas | Jest, unitarias y e2e | No se incluyen, por decisión del equipo; los criterios se verificaron manualmente (ver checklist) |
| Versiones | NestJS 10, react-router-dom 6, Tailwind 3.4 | NestJS 11, react-router-dom 7, Tailwind 4: las versiones anteriores tienen vulnerabilidades sin parche y `npm audit` debe quedar en 0 |
| Node.js | 20 o superior | 22 o superior: Node 20 ya no tiene soporte y parte del tooling lo exige |

## Variables de entorno

`npm run setup` crea el `.env` desde `.env.example`. La API valida todas las variables al arrancar
y no inicia si falta alguna o tiene un valor inválido.

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `POSTGRES_USER` | `incidents` | Usuario de PostgreSQL del contenedor |
| `POSTGRES_PASSWORD` | `incidents` | Contraseña de PostgreSQL del contenedor |
| `POSTGRES_DB` | `incidents` | Nombre de la base de datos |
| `POSTGRES_PORT` | `5432` | Puerto publicado por el contenedor |
| `DATABASE_URL` | se compone con las anteriores | Cadena de conexión que usa Prisma |
| `JWT_SECRET` | `change-me-in-production` | Secreto de firma de los tokens (mínimo 16 caracteres) |
| `JWT_EXPIRES_IN` | `8h` | Vigencia del token (`s`, `m`, `h` o `d`) |
| `API_PORT` | `3000` | Puerto de la API; el proxy de Vite lo usa |
| `STORAGE_DIR` | `./storage` | Directorio de archivos subidos, relativo a `apps/api` |
| `MAX_FILE_SIZE_MB` | `5` | Tamaño máximo por fotografía |
| `MAX_FILES_PER_UPLOAD` | `5` | Fotografías máximas por carga |
| `NOMINATIM_URL` | `https://nominatim.openstreetmap.org/reverse` | Servicio de geocodificación inversa |
| `NOMINATIM_USER_AGENT` | `FolioSpA-Incidents/1.0` | User-Agent exigido por Nominatim |
| `NOMINATIM_TIMEOUT_MS` | `3000` | Tiempo máximo de espera de la geocodificación |
| `TIME_ZONE` | `America/Santiago` | Zona horaria para fechas, folios, PDF y filtros |

## Desarrollo

Las reglas de código (código en inglés, sin comentarios, componentes, capas, nombres y copy
centralizado) están en `CLAUDE.md` y las hace cumplir ESLint, que corre también en un hook de
pre-commit. El plan de implementación y el detalle técnico de cada commit están en
`docs/commit-plan.md`, y la verificación de los criterios de aceptación en
`docs/acceptance-checklist.md`.
