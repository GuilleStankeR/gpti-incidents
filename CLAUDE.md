# CLAUDE.md — Reglas del proyecto gpti-incidents

Reglas obligatorias para todo cambio en este repositorio. No tienen excepciones implícitas: si una
regla parece estorbar, se corrige el código o se propone cambiar la regla, nunca se ignora.

---

## 1. Contexto

- Producto: Sistema de Gestión y Reporte de Incidentes de Seguridad y Mantenimiento para
  condominios (cliente Paralelo 29 SpA, ejecutor Folio SpA).
- Especificación funcional: `ESPECIFICACION-MVP.md`. Es la fuente de verdad de reglas de negocio
  (RN-01 a RN-14), matriz de permisos, endpoints, pantallas, seed y criterios de aceptación.
- Plan de trabajo: `docs/commit-plan.md`. Es la fuente de verdad del orden de implementación.
- Criterio de desempate ante cualquier duda de diseño: gana la opción que fortalece la cadena
  probatoria (fecha confiable, evidencia íntegra, historial inalterable, responsable identificado).

## 2. Precedencia frente a la especificación

Este archivo prevalece sobre `ESPECIFICACION-MVP.md` donde difieren:

| Tema | Especificación | Regla vigente |
|---|---|---|
| Idioma de identificadores | Español sin tildes | Inglés, según el glosario de §4.3. Incluye tablas, columnas, enums, códigos de error, rutas de API y de frontend, query params, variables de entorno, scripts y nombres de paquetes |
| Pruebas | Jest, unitarias y e2e, script `probar` | No se escriben pruebas. No hay script de pruebas ni dependencias de testing |
| Comentarios | Permitidos para explicar el porqué | Prohibidos sin excepción (§7.1) |
| Estructura de carpetas | §5 de la especificación | §6 de este archivo |
| Backend | NestJS 10 | NestJS 11 (Express 5, `@nestjs/config` 4): NestJS 10 arrastra vulnerabilidades sin parche |
| Routing web | `react-router-dom` 6 | `react-router-dom` 7, en modo librería (misma API declarativa) |
| Estilos | Tailwind CSS 3.4 con PostCSS; prohibido Tailwind 4 | Tailwind CSS 4 con `@tailwindcss/vite`: Tailwind 3 depende de `braces`, vulnerable y sin versión corregida |

Las tres actualizaciones de stack las autorizó el usuario para dejar `npm audit` sin
vulnerabilidades. Todo lo demás de la especificación sigue vigente: resto del stack (§4), reglas de
negocio, matriz de permisos, contratos (traducidos según el glosario) y prohibiciones (§13).

## 3. Flujo de trabajo

1. Se avanza **un commit a la vez**, en el orden de `docs/commit-plan.md`.
2. Antes de empezar un commit se relee su sección del plan. Si el plan resulta incorrecto o
   insuficiente, se propone el ajuste antes de desviarse.
3. Un commit está listo cuando `npm run lint`, `npm run typecheck` y `npm run build` terminan sin
   errores ni advertencias (desde que existen esos scripts) y se cumplió su verificación manual.
4. Al cerrar un commit se marca como completado en el plan, dentro del mismo commit, y se espera
   revisión del usuario antes de empezar el siguiente.
5. Mensajes de commit en inglés con Conventional Commits: `type(scope): summary`.
   Tipos: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`. Scopes: `root`, `shared`, `api`,
   `db`, `web`, `docs`.
6. Nada fuera del alcance (§2.2 de la especificación), aunque parezca una mejora obvia.
7. Dependencias: solo las del stack de la especificación y las de tooling listadas en el plan.
   Cualquier otra requiere aprobación explícita. Versiones exactas (`save-exact`).
8. `npm audit` debe reportar 0 vulnerabilidades. Agregar o actualizar una dependencia no puede
   romper esa condición.

## 4. Idioma

### 4.1 Código en inglés

Identificadores, nombres de archivos y carpetas, tablas y columnas, enums, códigos de error, rutas,
query params, variables de entorno, scripts, logs del servidor y mensajes de commit: en inglés.

### 4.2 Copy en español

Todo texto que ve el usuario final está en español de Chile: interfaz, `message` de los errores de
la API, observaciones automáticas de la bitácora, contenido del PDF y nombre del archivo descargado
(`expediente-{folio}.pdf`). Los datos de negocio precargados (nombres de categorías, ubicaciones,
usuarios, descripciones del seed) también están en español.

### 4.3 Glosario obligatorio

| Español (especificación / UI) | Código |
|---|---|
| Condominio | `Condominium`, `condominiumId` |
| Usuario | `User` (tabla `user_account`: `user` es palabra reservada en PostgreSQL) |
| Perfil | `Role`: `RESIDENT`, `CONCIERGE`, `ADMIN` |
| Categoría, SLA en horas | `Category`: `code`, `name`, `slaHours` |
| Incidente | `Incident` |
| Folio | `folio` |
| Contador de folio | `FolioCounter` |
| Evidencia | `Evidence` (colección: `evidence`, conteo: `evidenceCount`) |
| Bitácora | `AuditEntry` (colección: `auditTrail`) |
| Expediente | `CaseFile` |
| Reportante / Responsable | `reporter` / `assignee` |
| Observación | `note` |
| Estado / Transición / Reasignación | `status` / `transition` / `reassignment` |
| Ubicación (texto del catálogo) | `location` |
| Latitud / Longitud | `latitude` / `longitude` |
| Dirección geocodificada | `geocodedAddress` |
| Fecha del hecho | `occurredAt` |
| Fecha de registro | `reportedAt` |
| Fecha límite | `dueAt` |
| Fecha de cierre | `closedAt` |
| Vencido / Horas restantes | `isOverdue` / `hoursRemaining` |
| Semáforo de SLA | `SlaStatus`: `ON_TRACK`, `AT_RISK`, `OVERDUE` |
| Transiciones posibles | `availableTransitions` |
| Usuarios asignables | `assignable users` |
| Usuario de una entrada de bitácora | `user` |
| Capacidad de un perfil | `Capability`: `VIEW_ALL_INCIDENTS`, `MANAGE_ASSIGNMENTS`, `DOWNLOAD_CASE_FILE`, `VIEW_METRICS` |
| Bandeja | `Inbox` |
| Filtros: estado / categoría / desde / hasta / texto | `status` / `category` / `from` / `to` / `search` |
| Paginación: datos / página / por página | `items` / `page` / `pageSize` |
| Métricas | `Metrics` |
| Período / Total de incidentes / Por estado / Por categoría / Cantidad | `period` / `totalIncidents` / `byStatus` / `byCategory` / `count` |
| Tiempo promedio de resolución (horas) | `averageResolutionHours` |
| Porcentaje dentro de SLA / con evidencia al cierre | `percentWithinSla` / `percentWithEvidenceAtClosure` |
| Abiertos vencidos | `openOverdue` |
| Ruta de archivo / Nombre original / Tamaño / Hash | `storagePath` / `originalName` / `sizeBytes` / `sha256` |
| Subido por / Creado en | `uploadedBy` / `createdAt` |

Estados del incidente:

| Especificación | Código |
|---|---|
| `INGRESADO` | `REPORTED` |
| `EN_REVISION` | `UNDER_REVIEW` |
| `RECHAZADO` | `REJECTED` |
| `ASIGNADO` | `ASSIGNED` |
| `EN_EJECUCION` | `IN_PROGRESS` |
| `CERRADO` | `CLOSED` |

Categorías: `SEGURIDAD` → `SECURITY`, `ASCENSOR` → `ELEVATOR`, `FILTRACION` → `WATER_LEAK`,
`ELECTRICO` → `ELECTRICAL`, `AREAS_COMUNES` → `COMMON_AREAS`, `OTRO` → `OTHER`.

Códigos de error (respuesta `{ code, message, status }`):

| Especificación | Código | HTTP |
|---|---|---|
| `CREDENCIALES_INVALIDAS` | `INVALID_CREDENTIALS` | 401 |
| `NO_AUTENTICADO` | `UNAUTHENTICATED` | 401 |
| `PERFIL_NO_AUTORIZADO` | `FORBIDDEN_ROLE` | 403 |
| `RECURSO_NO_ENCONTRADO` | `RESOURCE_NOT_FOUND` | 404 |
| `TRANSICION_INVALIDA` | `INVALID_TRANSITION` | 409 |
| `CIERRE_SIN_EVIDENCIA` | `CLOSURE_WITHOUT_EVIDENCE` | 409 |
| `REASIGNACION_INVALIDA` | `INVALID_REASSIGNMENT` | 409 |
| (nuevo) | `EVIDENCE_NOT_ALLOWED` | 409 |
| `RESPONSABLE_REQUERIDO` | `ASSIGNEE_REQUIRED` | 400 |
| `RESPONSABLE_INVALIDO` | `INVALID_ASSIGNEE` | 400 |
| `FECHA_HECHO_INVALIDA` | `INVALID_OCCURRED_AT` | 400 |
| `ARCHIVO_INVALIDO` | `INVALID_FILE` | 400 |
| `VALIDACION` | `VALIDATION_FAILED` | 400 |
| (nuevo) | `INTERNAL_ERROR` | 500 |

Un término nuevo se agrega a este glosario antes de usarse en el código.

## 5. Texto visible: dónde vive

- El copy vive **solo** en archivos `*.copy.ts`. Ningún otro archivo contiene texto para el usuario.
  - Web: `src/shared/copy/*.copy.ts` (transversal) y `src/features/<feature>/<feature>.copy.ts`.
  - API: `src/modules/<module>/<module>.copy.ts` y `src/common/errors/error-messages.copy.ts`.
- Excepciones acotadas: catálogos de datos de negocio (`*.catalog.ts`) y datos del seed
  (`apps/api/prisma/seed/data/`). Son datos, no copy.
- Cada archivo de copy exporta un objeto `as const`. Los textos con valores dinámicos son funciones
  puras: `evidenceAttached: (count: number): string => ...`.
- En JSX no hay strings literales como hijos ni en atributos visibles (`placeholder`, `title`,
  `alt`, `aria-label`, `label`). Lo hace cumplir el lint.
- Los servicios de la API nunca redactan mensajes: lanzan `DomainError` con un `ErrorCode` y el
  mensaje sale de `error-messages.copy.ts`.
- Los valores de enums nunca se muestran crudos: estados, perfiles, categorías y semáforo se
  traducen con mapas de copy.

## 6. Estructura del monorepo

```
.
├── CLAUDE.md
├── ESPECIFICACION-MVP.md
├── docs/commit-plan.md
├── package.json                 npm workspaces y scripts raíz
├── tsconfig.base.json           opciones estrictas compartidas
├── eslint.config.mjs            lint único para todo el monorepo
├── tooling/eslint/              reglas de lint propias del proyecto
├── scripts/                     scripts de soporte del monorepo (Node, .mjs)
├── docker-compose.yml           solo PostgreSQL 16
├── .env.example
├── packages/
│   └── shared/                  @incidents/shared
└── apps/
    ├── api/                     @incidents/api
    └── web/                     @incidents/web
```

### 6.1 `packages/shared`

```
src/
├── index.ts                     único barrel permitido del monorepo
├── incident-status.ts           IncidentStatus, transiciones, estados terminales
├── role.ts                      Role, roles asignables
├── permissions.ts               capacidades y transiciones permitidas por rol
├── sla-status.ts                SlaStatus
├── error-code.ts                ErrorCode
├── limits.ts                    límites de validación compartidos
├── date-format.ts               formato es-CL dd-MM-yyyy HH:mm
└── contracts/                   interfaces de request y response por recurso
```

Sin dependencias de runtime. No importa nada de `apps/`. Es un paquete ESM (`"type": "module"`,
`NodeNext`): los imports relativos llevan extensión `.js`, y el compilador lo exige. Se compila dos
veces: ESM para la web y CommonJS para la API.

### 6.2 `apps/api`

```
prisma/
├── schema.prisma
├── migrations/
└── seed/
    ├── seed.ts                  punto de entrada
    ├── seeders/                 un seeder por entidad
    ├── data/                    datos de negocio en español
    └── generators/              imágenes sintéticas y bitácoras coherentes
storage/                         archivos subidos (en .gitignore)
src/
├── main.ts
├── app.module.ts
├── config/                      esquema de entorno validado y AppConfig tipado
├── database/                    PrismaService y DatabaseModule
├── common/
│   ├── errors/                  DomainError, mapa código→HTTP, mensajes
│   ├── filters/                 filtro global de excepciones
│   ├── guards/                  AuthGuard, RolesGuard
│   ├── decorators/              @Public, @Roles, @CurrentUser
│   ├── files/                   validación de fotos, firma binaria, SHA-256
│   └── types/                   AuthenticatedUser y tipos transversales
└── modules/
    ├── auth/
    ├── catalogs/
    ├── users/
    ├── incidents/
    │   ├── domain/              funciones puras: máquina de estados, folio, SLA, reglas
    │   ├── dto/
    │   ├── incidents.controller.ts
    │   ├── incidents.service.ts
    │   ├── incident-workflow.service.ts
    │   ├── incident-evidence.service.ts
    │   ├── incidents.repository.ts
    │   ├── audit-trail.repository.ts
    │   ├── incidents.mapper.ts
    │   ├── incidents.copy.ts
    │   └── incidents.module.ts
    ├── evidence/
    ├── storage/                 puerto FileStorage + adaptador de disco local
    ├── geocoding/               puerto Geocoder + adaptador Nominatim
    ├── case-files/              expediente PDF por secciones
    └── metrics/
```

### 6.3 `apps/web`

```
src/
├── main.tsx
├── app/                         App, proveedores, router, rutas, QueryClient
├── shared/
│   ├── api/                     http-client y ApiError
│   ├── ui/                      kit de componentes genéricos
│   ├── layout/                  layout autenticado, cabecera, navegación
│   ├── hooks/                   hooks genéricos
│   ├── lib/                     utilidades puras
│   ├── routing/                 rutas de la app (las features no pueden importar de app/)
│   └── copy/                    copy transversal y etiquetas de dominio
├── features/
│   ├── auth/
│   ├── incidents/
│   └── metrics/
│       ├── api/                 <feature>.api.ts y <feature>.keys.ts
│       ├── components/          componentes de la feature
│       ├── hooks/               use-*.ts
│       ├── pages/               páginas enrutables
│       └── <feature>.copy.ts
└── styles/index.css
```

Dependencias permitidas entre carpetas del frontend:
`app` → todo; `features/*` → `shared` y `features/auth`; `shared` → solo `shared`.
Una feature no importa de otra feature (salvo `auth`).

## 7. Reglas generales de código

### 7.1 Prohibido

- Comentarios de cualquier tipo en cualquier archivo del repositorio que no sea Markdown: incluye
  JSDoc, `TODO`, código comentado, `eslint-disable`, `@ts-ignore` y `@ts-expect-error`, y también
  SQL, Prisma, CSS, YAML y `.env`. Si algo necesita explicación, se renombra o se extrae a una
  función con nombre expresivo. Las migraciones que genera Prisma se limpian de comentarios antes
  de aplicarse. Única excepción: `prisma/migrations/migration_lock.toml`, que Prisma reescribe.
- `any` explícito o implícito, `as unknown as`, aserción non-null `!`.
- `enum` de TypeScript: se usan objetos `as const` con un tipo derivado del mismo nombre.
- `export default`, salvo archivos de configuración que lo exigen (`vite.config.ts`,
  `eslint.config.mjs`).
- Barrels (`index.ts` que reexportan), salvo `packages/shared/src/index.ts`.
- `console.*`: la API usa `Logger` de Nest; la web no loguea.
- Valores configurables incrustados (URLs, puertos, secretos, límites, zona horaria): van en la
  configuración validada.
- Números y strings mágicos: constantes con nombre en `*.constants.ts` o en la configuración.
- Importar entre apps. Lo compartido vive en `@incidents/shared`.

### 7.2 Obligatorio

- `strict: true` en todos los `tsconfig.json`, más `noUncheckedIndexedAccess`,
  `noImplicitOverride`, `noImplicitReturns`, `noUnusedLocals`, `noUnusedParameters` y
  `noFallthroughCasesInSwitch`.
- Funciones pequeñas con una sola responsabilidad: máximo 40 líneas por función, 4 parámetros
  (más que eso se recibe un objeto), complejidad ciclomática 10, profundidad de anidación 3.
  Máximo 200 líneas por archivo `.ts` y 150 por archivo `.tsx`.
- Early return en vez de `if/else` anidados. Sin ternarios anidados.
- Inmutabilidad por defecto: `const`, propiedades `readonly`, arreglos `readonly T[]`, no mutar
  argumentos.
- `interface` para formas de objetos; `type` para uniones y tipos derivados. Tipo de retorno
  explícito en funciones exportadas.
- `import type` para importaciones de solo tipos. Alias `@/` para el `src` de cada app.
- `async/await`. Sin promesas sueltas. Sin cadenas de `.then`.
- Las excepciones no se tragan. Solo se capturan para traducirlas o para aplicar una política
  explícita (por ejemplo, la geocodificación no bloqueante).
- Nombres que revelan intención. Sin abreviaturas crípticas (`inc`, `usr`, `tmp`, `data2`).

## 8. Backend (`apps/api`)

### 8.1 Capas

| Capa | Responsabilidad | No puede |
|---|---|---|
| `domain/` | Reglas de negocio como funciones puras sobre datos planos. Lanza `DomainError` | Importar NestJS, Prisma, Express, `node:fs` ni nada con I/O |
| `*.controller.ts` | HTTP: recibe DTO validado y `@CurrentUser()`, delega en un servicio, devuelve el resultado | Tener lógica, `try/catch`, Prisma, más de 15 líneas por método |
| `*.service.ts` | Casos de uso: orquesta dominio, repositorios y puertos; maneja transacciones | Construir respuestas HTTP o lanzar `HttpException` |
| `*.repository.ts` | Único lugar que usa `PrismaService` | Omitir el filtro por `condominiumId` |
| `*.mapper.ts` | Entidad Prisma → contrato de `@incidents/shared` | Exponer `passwordHash` o `storagePath` |
| `dto/*.dto.ts` | Validación con `class-validator`, mensajes desde copy | Aceptar campos que define el servidor |
| `*.port.ts` / `*.adapter.ts` | Interfaz de I/O externo y su implementación | Ser inyectados por clase concreta: se inyecta el token del puerto |

### 8.2 Reglas transversales

- `AuthGuard` y `RolesGuard` globales. Los endpoints públicos se marcan con `@Public()` y la
  autorización por perfil se declara con `@Roles(...)`.
- `ValidationPipe` global con `whitelist: true` y `transform: true`: los campos no declarados se
  descartan. `condominiumId`, `reporterId`, `reportedAt`, `folio`, `status`, `dueAt` y `closedAt`
  nunca forman parte de un DTO de entrada.
- Toda consulta y escritura filtra por el `condominiumId` del token. Recursos de otro condominio, o
  no visibles para un residente, responden 404 `RESOURCE_NOT_FOUND`, nunca 403.
- Toda escritura que genera bitácora ocurre en la misma `prisma.$transaction`.
- `audit_entry` y `evidence` son de solo inserción: sus repositorios no tienen métodos de
  actualización ni de borrado.
- Errores de negocio con `DomainError(ErrorCode)`. El filtro global responde siempre
  `{ code, message, status }`.
- Logs con `new Logger(ClassName.name)`, en inglés y con identificadores de contexto.
- La configuración se lee solo a través de `AppConfig`, nunca de `process.env` directamente.

## 9. Frontend (`apps/web`)

### 9.1 Todo es un componente

- Las páginas (`pages/`) solo componen: obtienen datos con hooks y renderizan componentes.
- Un componente por archivo; el archivo se llama igual que el componente (PascalCase).
  Componentes declarados como `function` con nombre y props tipadas como `<Nombre>Props`.
- Componentes presentacionales (`shared/ui`, `features/*/components`) no hacen fetch: reciben
  datos y callbacks por props.
- La lógica (estado de formularios, filtros en URL, derivaciones) vive en hooks `use-*.ts`. El JSX
  solo contiene condicionales simples y `map`.
- Las features usan el kit de `shared/ui`; no se estilan botones, campos ni modales a mano.
- Formularios con `useState`, sin librerías de formularios.

### 9.2 Datos remotos

- Un único cliente HTTP en `shared/api/http-client.ts`: inyecta el token, normaliza errores en
  `ApiError` y ante un 401 cierra la sesión y redirige a `/login`.
- Cada feature tiene `api/<feature>.api.ts`, query keys en `api/<feature>.keys.ts` y hooks de
  React Query. Los componentes nunca llaman a `fetch` ni a `*.api.ts` directamente.
- Toda vista con datos remotos maneja de forma explícita cargando, error con reintento y vacío.
- El error mostrado al usuario es siempre `ApiError.message` (el `message` de la API).
- Recursos protegidos (imágenes de evidencia y PDF) se obtienen con el cliente HTTP como blob, nunca
  con una URL directa.

### 9.3 Estilos y UX

- Solo Tailwind CSS 4. Sin `style={{}}`, sin CSS por componente, sin librerías de componentes.
  El tema (tokens de color) vive en `@theme` dentro de `src/styles/index.css`.
- Mobile-first: se diseña para 390 px y se amplía con `md:` (768 px). Objetivos táctiles de al
  menos 44 px. Sin desborde horizontal.
- Paleta neutra con acento azul oscuro (`accent`, `accent-hover`, `accent-ring`, `accent-muted`).
  Los colores de estado y de semáforo viven en un único mapa por concepto.
- Accesibilidad: `label` asociado a cada campo, `button` para acciones y `Link` para navegación,
  `alt` en imágenes, foco visible, modales con `role="dialog"` y cierre con Escape.
- Sin animaciones decorativas.

## 10. Convenciones de nombres

| Elemento | Convención | Ejemplo |
|---|---|---|
| Archivos `.ts` | kebab-case, sufijo de rol cuando aplica | `incidents.service.ts`, `use-incident-filters.ts` |
| Archivos `.tsx` | PascalCase igual al componente | `IncidentStatusBadge.tsx` |
| Variables y funciones | camelCase; funciones con verbo | `calculateDueAt` |
| Clases, interfaces, tipos, componentes | PascalCase, sin prefijo `I` | `IncidentDetail` |
| Constantes de módulo | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| Objetos tipo enum | PascalCase con claves UPPER_SNAKE_CASE | `IncidentStatus.UNDER_REVIEW` |
| Booleanos | prefijo `is`, `has`, `can`, `should` | `isOverdue`, `canReassign` |
| Hooks | `use` + PascalCase, archivo `use-*.ts` | `useIncidentDetail` |
| Tablas y columnas | snake_case vía `@@map` y `@map` | `audit_entry.from_status` |
| Rutas de API y web | kebab-case en inglés, recursos en plural | `/api/incidents/:id/case-file.pdf` |

Sufijos de la API: `.controller`, `.service`, `.repository`, `.mapper`, `.module`, `.dto`,
`.guard`, `.decorator`, `.filter`, `.pipe`, `.port`, `.adapter`, `.copy`, `.catalog`,
`.constants`, `.types`.

## 11. Lint y formato

- ESLint 9 con flat config única en `eslint.config.mjs`, typescript-eslint con información de
  tipos, y Prettier para el formato.
- `linterOptions.noInlineConfig: true`: ninguna regla se desactiva desde el código.
- Reglas propias en `tooling/eslint/`: prohibición total de comentarios.
- Lo que hace cumplir el lint: sin comentarios, sin `any`, sin non-null, sin `enum`, sin default
  exports, sin `console`, sin literales en JSX, nombres de archivo por convención, límites de
  tamaño y complejidad, orden de imports, fronteras entre capas (dominio puro, features aisladas,
  sin imports entre apps), reglas de hooks de React y de promesas.
- `husky` + `lint-staged` corren ESLint y Prettier sobre los archivos en stage antes de cada commit.
- Cambiar la configuración del lint requiere acuerdo explícito del usuario.

## 12. Prohibiciones de producto (especificación §13)

- No agregar funcionalidades fuera de §2.2 de la especificación.
- No sustituir ninguna tecnología de §4 de la especificación.
- No implementar edición ni borrado de incidentes, evidencia o bitácora.
- No exponer `passwordHash` ni `storagePath` en ninguna respuesta.
- No aceptar desde el cliente `condominiumId`, `reporterId`, `reportedAt`, `folio`, `status`,
  `dueAt` ni `closedAt`.
- No servir el directorio de almacenamiento como contenido estático.
- No crear migraciones de esquema fuera de Prisma, salvo la migración SQL de triggers.

## 13. Comandos

| Comando | Qué hace |
|---|---|
| `npm run setup` | Crea `.env`, instala, compila `shared`, levanta PostgreSQL, migra y carga el seed |
| `npm run dev` | Compila `shared` y levanta API y web en paralelo |
| `npm run build` | Compila todos los workspaces |
| `npm run typecheck` | `tsc --noEmit` en todos los workspaces |
| `npm run lint` / `npm run lint:fix` | ESLint sobre todo el monorepo |
| `npm run format` / `npm run format:check` | Prettier sobre todo el monorepo |
| `npm run db:reset -w @incidents/api` | Recrea la base, aplica migraciones y carga el seed |
