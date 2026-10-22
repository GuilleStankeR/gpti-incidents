# Plan de commits

Plan técnico de implementación del MVP, un commit a la vez. Las reglas de `CLAUDE.md` aplican a
cada commit. Al completar un commit se marca su casilla en la tabla de estado, dentro del mismo
commit.

Verificación común a todo commit, desde que existen los scripts: `npm run lint`,
`npm run typecheck` y `npm run build` sin errores ni advertencias. Cada commit agrega además una
verificación manual propia.

---

## Estado

| # | Fase | Commit | Estado |
|---|---|---|---|
| 01 | Reglas | `docs: add project rules and commit plan` | [x] |
| 02 | Base | `chore(root): scaffold npm workspaces monorepo` | [x] |
| 03 | Base | `chore(root): add eslint, prettier and pre-commit hooks` | [x] |
| 04 | Base | `feat(shared): add shared domain package` | [x] |
| 05 | Base | `feat(api): bootstrap nestjs application` | [x] |
| 06 | Base | `feat(db): add prisma schema, migrations and base seed` | [x] |
| 07 | Base | `feat(web): bootstrap react application` | [x] |
| 07b | Base | `chore(deps): upgrade stack to clear npm audit` | [x] |
| 08 | Backend | `feat(api): add jwt authentication and role guards` | [x] |
| 09 | Backend | `feat(api): add catalogs and assignable users endpoints` | [x] |
| 10 | Backend | `feat(api): add pure incident domain rules` | [x] |
| 11 | Backend | `feat(api): add file storage and photo validation` | [x] |
| 12 | Backend | `feat(api): add incident creation and detail` | [x] |
| 13 | Backend | `feat(api): add incident inbox with filters` | [x] |
| 14 | Backend | `feat(api): add incident transitions and reassignment` | [x] |
| 15 | Backend | `feat(api): add evidence attachment and file download` | [x] |
| 16 | Backend | `feat(api): add non-blocking reverse geocoding` | [x] |
| 17 | Backend | `feat(api): add case file pdf export` | [x] |
| 18 | Backend | `feat(api): add metrics endpoint` | [x] |
| 19 | Backend | `feat(db): add historical incidents seed` | [x] |
| 20 | Frontend | `feat(web): add authentication and app layout` | [x] |
| 21 | Frontend | `feat(web): add incidents inbox` | [x] |
| 22 | Frontend | `feat(web): add report incident form` | [x] |
| 23 | Frontend | `feat(web): add incident detail and actions` | [x] |
| 24 | Frontend | `feat(web): add metrics dashboard` | [ ] |
| 25 | Cierre | `docs: add readme and acceptance checklist` | [ ] |

La fase **Base** (02 a 07) deja el monorepo, el tooling, el paquete compartido, la API, la base
de datos y la web arrancando, sin funcionalidades de negocio.

---

## Versiones objetivo

| Paquete | Versión | Motivo |
|---|---|---|
| Node.js | 22 LTS (`.nvmrc`), `engines >= 22` | La especificación pide 20 o superior; Node 20 ya no tiene soporte y parte del tooling exige 22 |
| TypeScript | 5.9.x | typescript-eslint 8 no soporta TypeScript 6+ |
| NestJS | 11.2.x (`@nestjs/cli` 11.0.x, `@nestjs/config` 4.x) | NestJS 10 arrastra vulnerabilidades sin parche (commit 07b) |
| Prisma / `@prisma/client` | 5.22.x | Especificación §4 |
| PostgreSQL | imagen `postgres:16-alpine` | Especificación §4 |
| React / React DOM | 18.3.x | Especificación §4 |
| Vite / `@vitejs/plugin-react` | 7.3.x / 5.x | Última combinación estable compatible con React 18 |
| react-router-dom | 7.18.x | La 6.x tiene vulnerabilidades corregidas solo en 7.x (commit 07b) |
| @tanstack/react-query | 5.x | Especificación §4 |
| Tailwind CSS | 4.3.x con `@tailwindcss/vite` | Tailwind 3 depende de `braces`, vulnerable y sin versión corregida (commit 07b) |
| ESLint | 9.39.x | Flat config; plugins aún no soportan todos ESLint 10 |
| typescript-eslint | 8.x | Lint con información de tipos |
| eslint-plugin-unicorn | 62.x | Última versión compatible con ESLint 9 |
| Prettier | 3.x | Formato |

---

## 01 · `docs: add project rules and commit plan`

**Objetivo:** reglas de trabajo y plan antes de escribir código.

**Archivos:** `CLAUDE.md`, `docs/commit-plan.md`, `ESPECIFICACION-MVP.md` (se versiona tal cual).

**Verificación:** revisión del usuario.

---

## 02 · `chore(root): scaffold npm workspaces monorepo`

**Objetivo:** esqueleto del monorepo y base de datos levantable.

**Archivos:**
- `package.json` raíz: `private: true`, `workspaces: ["packages/*", "apps/*"]` (este orden
  garantiza que `shared` compile primero), `engines.node: ">=22"`, scripts iniciales `setup`,
  `build`, `typecheck`, `db:up`, `db:down`. Dev deps: `typescript`. El script `dev` y
  `concurrently` llegan en el commit 07, cuando existen las dos apps.
- `tsconfig.base.json`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`,
  `noImplicitReturns`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`,
  `forceConsistentCasingInFileNames`, `isolatedModules`, `esModuleInterop`, `skipLibCheck`,
  `resolveJsonModule`, `target: ES2022`.
- `.nvmrc` (`22`), `.npmrc` (`save-exact=true`, `engine-strict=true`), `.editorconfig`.
- `.gitignore`: `node_modules`, `dist`, `.env`, `apps/api/storage/`, `*.tsbuildinfo`,
  `.DS_Store`, logs.
- `docker-compose.yml`: servicio `postgres` con `postgres:16-alpine`, credenciales y puerto desde
  variables de `.env` (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`;
  `DATABASE_URL` se compone por expansión desde ellas),
  volumen nombrado y `healthcheck` con `pg_isready` para que `docker compose up --wait` espere a
  que la base esté lista.
- `.env.example` sin comentarios (la documentación de cada variable va en el README, commit 25):
  `POSTGRES_*`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN=8h`, `API_PORT=3000`,
  `STORAGE_DIR=./storage`, `MAX_FILE_SIZE_MB=5`, `MAX_FILES_PER_UPLOAD=5`, `NOMINATIM_URL`,
  `NOMINATIM_USER_AGENT`, `NOMINATIM_TIMEOUT_MS=3000`, `TIME_ZONE=America/Santiago`.
- `scripts/ensure-env.mjs`: copia `.env.example` a `.env` si no existe, para que `npm run setup`
  funcione desde un clon limpio sin pasos manuales.

**Verificación:** `npm install` sin errores; `node scripts/ensure-env.mjs` crea `.env` y es
idempotente; `npm run db:up` deja el contenedor `healthy`.

---

## 03 · `chore(root): add eslint, prettier and pre-commit hooks`

**Objetivo:** que las reglas de `CLAUDE.md` se cumplan por máquina, no por disciplina.

**Dependencias (dev, raíz):** `eslint`, `@eslint/js`, `typescript-eslint`, `globals`,
`eslint-plugin-import-x`, `eslint-import-resolver-typescript`, `eslint-plugin-unicorn`,
`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`,
`eslint-config-prettier`, `prettier`, `husky`, `lint-staged`.
`prettier-plugin-tailwindcss` llega en el commit 07 junto con Tailwind.

**Archivos:**
- `tooling/eslint/no-comments.rule.mjs`: regla propia que reporta todo comentario
  (`sourceCode.getAllComments()`), salvo shebang.
- `tooling/eslint/local.plugin.mjs`: plugin local que expone la regla.
- `tooling/eslint/constants.mjs`: globs por área del monorepo.
- `tooling/eslint/configs/*.config.mjs`: un módulo por bloque (`base`, `typescript`, `imports`,
  `unicorn`, `api`, `web`, `web-layers`, `shared-package`, `tooling`, `formatting`), para que
  ningún archivo de configuración supere el máximo de líneas.
- `eslint.config.mjs`: solo compone los módulos, en este orden de bloques:
  - Ignorados globales: `dist`, `node_modules`, `coverage`, `apps/api/storage`,
    `apps/api/prisma/migrations`.
  - `linterOptions`: `noInlineConfig: true`, `reportUnusedDisableDirectives: "error"`.
  - Base TypeScript: `@eslint/js` recommended, `tseslint.configs.strictTypeChecked` y
    `stylisticTypeChecked` con `parserOptions.projectService: true`.
  - Reglas globales: `local/no-comments`, `@typescript-eslint/no-explicit-any`,
    `no-non-null-assertion`, `consistent-type-imports`, `consistent-type-definitions: interface`,
    `explicit-module-boundary-types`, `naming-convention` (camelCase, PascalCase para tipos,
    UPPER_CASE para constantes, prefijos `is/has/can/should` en booleanos),
    `no-restricted-syntax` contra `TSEnumDeclaration`, `no-console`, `no-nested-ternary`,
    `max-lines-per-function: 40`, `max-lines: 200`, `max-params: 4`, `complexity: 10`,
    `max-depth: 3`, `@typescript-eslint/no-magic-numbers` (ignorando `-1`, `0`, `1`, índices de
    tipos y enums), `prefer-const`, `eqeqeq`, `no-else-return`, `curly`.
  - `import-x`: `order` con grupos y alfabético, `no-duplicates`, `no-cycle`,
    `no-default-export`, `no-relative-packages`, `no-extraneous-dependencies`.
  - `unicorn`: preset recomendado sin `prevent-abbreviations`, `no-null` ni `no-array-reduce`;
    `filename-case` kebab-case para `.ts` y `.mjs`, PascalCase para `.tsx` (excepción `main.tsx`).
  - Bloque API: globals de Node; `no-restricted-imports` en `**/domain/**` contra `@nestjs/*`,
    `@prisma/*`, `express`, `node:*`; `max-lines-per-function: 15` en `*.controller.ts`.
  - Bloque web: globals de navegador; `react` (recommended + `jsx-runtime`), `react-hooks`,
    `react-refresh`; `react/jsx-no-literals` con `noStrings: true` e `ignoreProps: true`;
    `no-restricted-syntax` contra literales en `placeholder`, `title`, `alt`, `aria-label` y
    `label`; `react/no-multi-comp`, `react/function-component-definition`,
    `react/jsx-no-useless-fragment`, `react/self-closing-comp`, `react/no-array-index-key`;
    `max-lines: 150` en `.tsx`; `import-x/no-restricted-paths` con las fronteras de §6.3 de
    `CLAUDE.md`.
  - Bloque `packages/shared`: prohibido importar de `apps/`.
  - Archivos de configuración: se permite `export default`.
  - `eslint-config-prettier` al final para desactivar reglas de formato.
- `.prettierrc.json` (`singleQuote`, `semi`, `trailingComma: all`, `printWidth: 100`),
  `.prettierignore` (excluye Markdown para no reformatear la especificación ni los documentos).
- `.husky/pre-commit` ejecuta `npx lint-staged`; configuración de `lint-staged` en el
  `package.json` raíz (ESLint `--max-warnings 0` y Prettier sobre los archivos en stage).
- Scripts raíz: `lint`, `lint:fix`, `format`, `format:check`, `prepare` (husky).

**Verificación:** `npm run lint` pasa; un archivo de prueba con un comentario, un `any`, un
`export default` o un `// eslint-disable` falla (se borra antes del commit); el hook bloquea un
commit con errores de lint.

---

## 04 · `feat(shared): add shared domain package`

**Objetivo:** fuente única de enums, reglas de transición, permisos, códigos de error y contratos
para API y web.

**Archivos (`packages/shared`):**
- `package.json`: `@incidents/shared`, `"type": "module"`, `exports` con condiciones `types`,
  `import` (`dist/esm`) y `require` (`dist/cjs`), scripts `build` y `typecheck`. Sin
  dependencias de runtime.
- `tsconfig.json` (`NodeNext`, typecheck: obliga a usar extensión `.js` en imports relativos),
  `tsconfig.esm.json` y `tsconfig.cjs.json` (CommonJS + declaraciones en `dist/types`): doble
  compilación porque Nest consume CommonJS y Vite consume ESM.
- `scripts/write-package-type.mjs` (raíz): escribe `dist/cjs/package.json` con
  `"type": "commonjs"` para que Node cargue ese build como CommonJS.
- `src/incident-status.ts`: `IncidentStatus` (`as const` + tipo), `TERMINAL_STATUSES`,
  `REASSIGNABLE_STATUSES`, `STATUS_TRANSITIONS`, `isTerminalStatus()`,
  `isReassignableStatus()`, `isTransitionAllowed()`.
- `src/role.ts`: `Role`, `ASSIGNABLE_ROLES`, `isAssignableRole()`.
- `src/permissions.ts`: `Capability` (`VIEW_ALL_INCIDENTS`, `MANAGE_ASSIGNMENTS`,
  `DOWNLOAD_CASE_FILE`, `VIEW_METRICS`), `ROLE_CAPABILITIES`, `TRANSITION_ROLES` (quién puede
  ejecutar cada estado destino, según la matriz §3.5), `hasCapability()`,
  `getRolesWithCapability()`, `canRoleTransitionTo()`.
- `src/sla-status.ts`: `SlaStatus`.
- `src/error-code.ts`: `ErrorCode` según el glosario de `CLAUDE.md`.
- `src/limits.ts`: `DESCRIPTION_MIN_LENGTH`, `DESCRIPTION_MAX_LENGTH`, `NOTE_MIN_LENGTH`,
  `NOTE_MAX_LENGTH`, `SEARCH_MAX_LENGTH`, `OCCURRED_AT_MAX_AGE_DAYS`, `DEFAULT_PAGE`,
  `DEFAULT_PAGE_SIZE`, `MAX_PAGE_SIZE`, `DEFAULT_METRICS_PERIOD_DAYS`,
  `ACCEPTED_PHOTO_MIME_TYPES`.
- `src/date-format.ts`: `formatDateTime(date, timeZone)` con `Intl.DateTimeFormat('es-CL')` y
  `formatToParts` para garantizar `dd-MM-yyyy HH:mm`.
- `src/contracts/`: `auth`, `catalogs`, `users`, `incidents`, `evidence`, `audit-trail`,
  `metrics`, `pagination` y `api-error`. Interfaces de request y response con los nombres del
  glosario; los nombres evitan chocar con los modelos de Prisma (`IncidentSummary`,
  `IncidentDetail`, `EvidenceItem`, `AuditEntryItem`, `CatalogCategory`, `SessionUser`).
- `src/index.ts`: barrel del paquete (`export type *` para los contratos).

**Verificación:** `npm run build -w @incidents/shared` genera `dist/cjs`, `dist/esm` y tipos; el
paquete carga desde Node con `require` y con `import`; lint y typecheck en verde.

---

## 05 · `feat(api): bootstrap nestjs application`

**Objetivo:** API que arranca con configuración validada y formato de error único.

**Dependencias:** `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`,
`@nestjs/config`, `class-validator`, `class-transformer`, `reflect-metadata`, `rxjs`,
`@incidents/shared`. Dev: `@nestjs/cli`, `@types/express`, `@types/node`, `dotenv-cli`.

**Archivos (`apps/api`):**
- `package.json`: scripts `dev` (`dotenv -e ../../.env -- nest start --watch`), `build`,
  `start`, `typecheck`. El `.env` raíz lo cargan los scripts; la app solo valida.
- `nest-cli.json`, `tsconfig.json` (CommonJS, `experimentalDecorators`,
  `emitDecoratorMetadata`, alias `@/*`, que `nest build` reescribe a rutas relativas),
  `tsconfig.build.json`.
- `src/main.ts`: `NestFactory.create` con `abortOnError: false` (un error de arranque termina el
  proceso con su mensaje en vez de abortar), prefijo global `/api`, `enableShutdownHooks`,
  puerto desde `AppConfig`.
- `src/app.module.ts`: registra el filtro (`APP_FILTER`) y el `ValidationPipe` (`APP_PIPE`) como
  proveedores globales.
- `src/config/environment.ts`: clase con decoradores de `class-validator` por variable.
- `src/config/validate-environment.ts`: `plainToInstance` + `validateSync`; ante faltantes lanza
  un error que lista cada variable inválida, y la app no arranca.
- `src/config/app-config.ts` y `app-config.types.ts`: servicio con getters tipados (`apiPort`,
  `jwt`, `storageDirectory` resuelto a ruta absoluta, `uploads`, `nominatim`, `timeZone`).
- `src/config/app-config.module.ts`: módulo global.
- `src/common/errors/domain-error.ts`: `DomainError extends Error` con `code: ErrorCode` y
  `detail` opcional (mensaje de validación de un DTO).
- `src/common/errors/error-http-status.ts`: `Record<ErrorCode, HttpStatus>` y el mapa de estados
  HTTP del framework a `ErrorCode` (400, 401, 403, 404 y 413 de Multer).
- `src/common/errors/error-messages.copy.ts`: `Record<ErrorCode, string>` en español.
- `src/common/errors/error-response.ts`: `buildErrorResponse(exception)` →
  `{ code, message, status }`.
- `src/common/filters/api-exception.filter.ts`: `@Catch()` global que responde con
  `buildErrorResponse` y registra el stack de los `INTERNAL_ERROR`.
- `src/common/pipes/validation.pipe.ts`: `ValidationPipe` (`whitelist`, `transform`,
  `stopAtFirstError`) cuyo `exceptionFactory` lanza `VALIDATION_FAILED` con el primer mensaje
  de validación. Los mensajes en español de cada DTO viven en `validation-messages.copy.ts`, que
  nace con el primer DTO (commit 08).
- Corrección del lint del commit 03: `import-x/no-relative-parent-imports` también rechazaba los
  imports con alias `@/`; se reemplaza por `no-restricted-imports` con un patrón que solo
  rechaza `../`.

**Verificación:** la API arranca; sin `JWT_SECRET` o con `API_PORT` inválido falla al arrancar con
un mensaje que nombra cada variable; `GET /api/inexistente` responde 404 y un JSON mal formado
responde 400, ambos con el formato único.

---

## 06 · `feat(db): add prisma schema, migrations and base seed`

**Objetivo:** esquema completo, inmutabilidad garantizada por la base y datos maestros.

**Dependencias:** `@prisma/client`, `bcryptjs`. Dev: `prisma`, `tsx`. En `allowScripts` (npm 12
bloquea los scripts de instalación por defecto) se aprueban `prisma` y `@prisma/engines`, que
descarga los motores; el resto queda denegado de forma explícita.

**Archivos:**
- `prisma/schema.prisma`: modelos `Condominium`, `User` (tabla `user_account`), `Category`,
  `Incident`, `Evidence`, `AuditEntry`, `FolioCounter`; enums `IncidentStatus` y `Role`. Nombres
  según glosario; tablas y columnas en snake_case con `@@map`/`@map`; ids `uuid` nativos;
  timestamps `@db.Timestamptz(3)`; `latitude`/`longitude` `Decimal(10, 7)`; `sha256`
  `Char(64)`; `@@unique([condominiumId, folio])`; índices de la especificación §6.1.
- `prisma/migrations/<ts>_init/`: generada con `prisma migrate dev --create-only`, sin
  comentarios.
- `prisma/migrations/<ts>_immutability_triggers/migration.sql`: función
  `prevent_modification()`, triggers `BEFORE UPDATE OR DELETE` por fila y `BEFORE TRUNCATE` por
  sentencia sobre `audit_entry` y `evidence` (los triggers por fila no cubren `TRUNCATE`).
- `src/database/prisma.service.ts` (`extends PrismaClient`, conecta en `onModuleInit` y
  desconecta en `onModuleDestroy`) y `src/database/database.module.ts` (global).
- `prisma/seed/seed.ts`: orquesta los seeders en orden con un único `PrismaClient`.
- `prisma/seed/seeders/`: `condominium.seeder.ts`, `categories.seeder.ts`,
  `users.seeder.ts`. Todos con `upsert` por clave natural (`code`, `email`): idempotentes. El
  hash de contraseña solo se escribe al crear.
- `prisma/seed/data/`: `condominium.data.ts` (C29, Condominio Parque Oriente),
  `categories.data.ts` (§3.6), `users.data.ts` (§9, contraseña `demo1234` hasheada con bcryptjs).
- Scripts API: `db:generate`, `db:migrate` (`migrate deploy`), `db:migrate:dev`, `db:seed`,
  `db:reset`, `db:studio`, todos vía `dotenv -e ../../.env --`. `prisma.seed` apunta a `tsx`.
  `build` y `typecheck` corren `prisma generate` antes, para funcionar desde un clon limpio.
- Script raíz `setup` completo: `ensure-env` → `npm install` → build de `shared` →
  `docker compose up -d --wait` → `db:generate` → `db:migrate` → `db:seed`.

**Verificación:** `npm run setup` desde cero deja la base migrada y con datos; correr el seed dos
veces no duplica; `UPDATE`, `DELETE` y `TRUNCATE` sobre `audit_entry` y `evidence` en `psql`
fallan con la excepción del trigger (CA-12); la API arranca conectada a la base.

---

## 07 · `feat(web): bootstrap react application`

**Objetivo:** SPA que arranca con proveedores, router, cliente HTTP y kit de UI base.

**Dependencias:** `react`, `react-dom`, `react-router-dom`, `@tanstack/react-query`,
`@incidents/shared`. Dev: `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`,
`autoprefixer`, `@types/react`, `@types/react-dom`, `@types/node`. Raíz: `concurrently` y
`prettier-plugin-tailwindcss` (ordena las clases, también dentro de `classNames`).

**Archivos (`apps/web`):**
- `package.json` (`"type": "module"`): scripts `dev`, `build` (typecheck + `vite build`),
  `preview`, `typecheck`.
- `index.html` con `lang="es-CL"`.
- `vite.config.ts`: alias `@/`, `envDir` en la raíz y proxy `/api` hacia
  `http://localhost:${API_PORT}` leyendo el `.env` raíz con `loadEnv` (falla con un mensaje claro
  si falta), de modo que el frontend nunca use una URL absoluta de API.
- `tsconfig.json` (solo referencias), `tsconfig.app.json` (`src`, DOM, `Bundler`,
  `react-jsx`, `vite/client`, alias `@/*`) y `tsconfig.node.json` (archivos de configuración con
  tipos de Node).
- `tailwind.config.ts` (tokens `accent`, `accent-hover`, `accent-ring`, `accent-muted` sobre la
  escala azul oscura; tipografía del sistema por defecto), `postcss.config.mjs`,
  `src/styles/index.css`.
- `src/main.tsx`; `src/app/App.tsx`, `AppProviders.tsx` (`QueryClientProvider`,
  `BrowserRouter`), `AppRouter.tsx`, `query-client.ts` (sin reintentos ante errores 4xx).
- `src/app/pages/NotFoundPage.tsx`.
- `src/shared/routing/route-paths.ts`: rutas de la app. Viven en `shared` porque las features no
  pueden importar de `app/`.
- `src/shared/api/api-error.ts` (`ApiError` con `code`, `message`, `status`),
  `http-status.ts` y `http-client.ts` (`get`, `getBlob`, `post`, `patch`, `postForm`; query
  params; token y manejador de sesión inválida registrables con `configureHttpClient`; errores de
  red y respuestas no JSON normalizados a `ApiError` con copy en español).
- `src/shared/lib/class-names.ts`.
- `src/shared/ui/`: `button-styles.ts`, `Button.tsx` (variantes `primary`, `secondary`,
  `danger`, `ghost`; mínimo 44 px; estado de carga), `ButtonLink.tsx`, `Spinner.tsx`,
  `Card.tsx`, `PageHeader.tsx`, `LoadingState.tsx`, `ErrorState.tsx` (con reintento),
  `EmptyState.tsx`.
- `src/shared/copy/common.copy.ts`.
- Script raíz `dev`: compila `shared` y levanta API y web con `concurrently`.
- Corrección del lint: la zona `components → api` de `web-layers.mjs` necesita `/**` para cubrir
  archivos y no solo carpetas.

**Verificación:** `npm run dev` levanta ambas apps y el proxy de Vite llega a la API; Vite resuelve
el build ESM de `shared`; `npm run build` genera `dist` sin advertencias; un literal en JSX, un
`fetch` directo, dos componentes en un archivo o un import que cruza capas hacen fallar el lint.

---

## 07b · `chore(deps): upgrade stack to clear npm audit`

**Objetivo:** `npm audit` en 0 vulnerabilidades, por instrucción del usuario.

**Cambios:**
- API: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` 11.2.x (Express 5,
  `multer` 2.4), `@nestjs/cli` 11.0.x, `@nestjs/config` 4.x, `@types/express` 5.
- Web: `react-router-dom` 7.18.x (modo librería, misma API declarativa).
- Web: Tailwind CSS 4 con `@tailwindcss/vite`. Se eliminan `tailwind.config.ts`,
  `postcss.config.mjs`, `postcss` y `autoprefixer`; el tema pasa a `@theme` en
  `src/styles/index.css`; se ajustan utilidades renombradas (`outline-2`, `shadow-xs`).
  `prettier-plugin-tailwindcss` usa `tailwindStylesheet`.
- `npm audit fix` para el resto de dependencias transitivas sin cambios mayores.
- `CLAUDE.md` registra las desviaciones de stack y la regla de 0 vulnerabilidades.

**Verificación:** `npm audit` → 0 vulnerabilidades; lint, typecheck y build en verde; API y web
levantan con `npm run dev`; el CSS generado incluye los tokens `accent`.

---

## 08 · `feat(api): add jwt authentication and role guards`

**Objetivo:** login y protección de toda la API (A1).

**Dependencias:** `@nestjs/jwt` 11.

**Archivos:**
- `src/modules/auth/`: `auth.controller.ts` (`POST /auth/login`, `@Public()`),
  `auth.service.ts` (busca por email, compara con bcryptjs; si el email no existe compara contra
  un hash fijo para no revelar usuarios por tiempo de respuesta), `access-token.service.ts`
  (firma `{ sub, role, condominiumId }` con HS256 y vigencia de `JWT_EXPIRES_IN`; al verificar
  valida la forma del payload), `auth.guard.ts` (Bearer → `request.authenticatedUser`;
  `UNAUTHENTICATED`), `auth.mapper.ts`, `dto/login.dto.ts` (email normalizado a minúsculas),
  `auth.module.ts` (registra `AuthGuard` y `CapabilityGuard` como `APP_GUARD`, en ese orden).
- `src/modules/users/users.repository.ts` (`findByEmailWithCondominium`) y `users.module.ts`.
- `src/common/auth/`: `authenticated-user.ts` y `authenticated-request.ts`
  (`requireAuthenticatedUser`).
- `src/common/decorators/`: `public.decorator.ts`, `require-capability.decorator.ts`,
  `current-user.decorator.ts`.
- `src/common/guards/capability.guard.ts`: compara la capacidad requerida con la matriz de
  `shared` (`FORBIDDEN_ROLE`).
- `src/common/errors/validation-messages.copy.ts`: mensajes de validación en español.
- `src/config/duration.ts`: convierte `JWT_EXPIRES_IN` (`8h`) a segundos.
- Lint: los parámetros sin uso que exige el framework se nombran con guion bajo inicial.

**Verificación:** las tres cuentas demo obtienen token con vigencia de 8 horas; contraseña
errónea o email inexistente → 401 `INVALID_CREDENTIALS`; email inválido → 400 con mensaje en
español. El rechazo sin token se verifica con el primer endpoint protegido (commit 09).

---

## 09 · `feat(api): add catalogs and assignable users endpoints`

**Objetivo:** datos para el formulario de reporte y el selector de responsable.

**Archivos:**
- `src/modules/catalogs/`: `GET /catalogs` → `{ categories, locations, uploadLimits }`.
  `locations.catalog.ts` con la lista fija de §3.7; `uploadLimits` (`maxFiles`,
  `maxFileSizeBytes`, `acceptedMimeTypes`) sale de `AppConfig`, así la web no duplica límites.
  `categories.repository.ts`, `catalogs.service.ts`, `catalogs.mapper.ts`.
- Las categorías se ordenan por SLA y luego por nombre. `CategoriesRepository` se exporta para
  validar la categoría al crear incidentes.
- `src/modules/users/`: `GET /users/assignable` con
  `@RequireCapability(MANAGE_ASSIGNMENTS)`: usuarios del condominio con rol en
  `ASSIGNABLE_ROLES`, ordenados por nombre. `users.service.ts`, `users.mapper.ts`
  (`toUserSummary`, `toUserWithRole`), `users.controller.ts`; `users.repository.ts` suma
  `findAssignable` y `findAssignableById` (este último lo usa el commit 14).

**Verificación:** catálogos con 6 categorías, 11 ubicaciones y límites de carga; asignables como
admin devuelve tres usuarios; como conserje → 403 `FORBIDDEN_ROLE`; sin token o con token
inválido → 401 `UNAUTHENTICATED`.

---

## 10 · `feat(api): add pure incident domain rules`

**Objetivo:** todas las reglas de negocio como funciones puras, sin NestJS ni Prisma.

**Archivos (`src/modules/incidents/domain/`):**
- `state-machine.ts`: `assertTransitionAllowed(from, to)` (RN-01) y
  `getAvailableTransitions(status, role)` (combina máquina de estados y matriz de permisos).
- `transition-policy.ts`: `assertRoleCanTransition(role, target)` (§3.5), `assertValidNote`
  y `assertTransitionRequirements({ target, assigneeId, evidenceCount, note })` (RN-02, RN-03,
  RN-04).
- `reassignment-policy.ts`: `assertReassignable(status)` (RN-06).
- `evidence-policy.ts`: `assertCanAttachEvidence(status)`.
- `folio.ts`: `formatFolio(condominiumCode, year, sequence)` (RN-08).
- `sla.ts`: `calculateDueAt`, `isOverdue`, `getHoursRemaining`, `getSlaStatus` (RN-09 y
  semáforo de §8.1: más de 50 % restante, entre 0 y 50 %, vencido).
- `occurred-at.ts`: `assertValidOccurredAt(occurredAt, reportedAt)` (RN-07).
- `visibility.ts`: `buildVisibilityScope(user)` → `{ condominiumId, reporterId? }` (RN-10,
  RN-11).
- `domain.constants.ts`: dígitos del folio, umbral del semáforo y redondeo de horas.
- `src/common/time/date-math.ts`: aritmética de fechas pura (`addHours`, `subtractDays`,
  `hoursBetween`, `roundToDecimals`), reutilizada por métricas y seed.

**Verificación:** lint confirma que `domain/` no importa infraestructura; un script desechable en
`tsx` (fuera del repositorio) ejercita cada regla: folio con relleno, tres tramos del semáforo,
vencimiento de cerrados y rechazados, RN-01 a RN-07 y la matriz de permisos.

---

## 11 · `feat(api): add file storage and photo validation`

**Objetivo:** infraestructura de evidencia íntegra (RN-13) sin exponer el disco.

**Dependencias:** dev `@types/multer`.

**Archivos:**
- `src/modules/storage/file-storage.port.ts`: interfaz `FileStorage` (`save`, `read`, `remove`)
  y token `FILE_STORAGE`.
- `src/modules/storage/local-disk-storage.adapter.ts`: escribe en
  `{STORAGE_DIR}/{incidentId}/{uuid}.{ext}` con creación exclusiva (nunca sobrescribe), deja el
  archivo en solo lectura, rechaza rutas que escapen del directorio y devuelve la ruta relativa.
- `src/modules/storage/storage.module.ts`.
- `src/common/files/photo-signature.ts`: detección por bytes mágicos (JPEG, PNG, WebP) y extensión
  por tipo; el `mimetype` declarado por el cliente no se usa.
- `src/common/files/sha256.ts`: hash del buffer.
- `src/common/files/validated-photo.ts`: foto validada (nombre, tipo detectado, tamaño, hash,
  contenido).
- `src/common/files/photo-files.pipe.ts`: valida cantidad, tamaño y firma; lanza `INVALID_FILE`.
- `src/common/files/photo-upload.interceptor.ts`: envuelve `FilesInterceptor('photos')` con
  límites de `AppConfig` (memoria, nombres de archivo UTF-8) y traduce los errores de Multer a
  `INVALID_FILE`.
- `@types/multer` en `types` del `tsconfig` de la API; `overrides.rxjs` en la raíz para tener
  una sola copia de `rxjs` (dos copias rompen los tipos de `Observable`).

**Verificación:** detección de firma sobre JPEG y PNG reales y un archivo falso; el flujo HTTP
completo se ejerce en el commit 12.

---

## 12 · `feat(api): add incident creation and detail`

**Objetivo:** A2, A3 y A7 del lado servidor.

**Archivos (`src/modules/incidents/`):**
- `dto/create-incident.dto.ts`: `categoryCode`, `description` (10 a 2000, recortada), `location`
  (del catálogo), `occurredAt` (ISO 8601), `latitude` y `longitude` opcionales y en pareja
  (numéricos vía `@Type`). Mensajes en `validation-messages.copy.ts`.
- `folio-counter.repository.ts`: `incrementFolioCounter(transaction, condominiumId, year)` con el
  `UPSERT` atómico de §6.3; función reutilizable por el seed.
- `incident-write.repository.ts`: repositorio de escritura del agregado. `register` guarda los
  archivos, abre la transacción (folio con el año en `TIME_ZONE`, incidente `REPORTED`, filas de
  evidencia, entrada inicial de bitácora con `fromStatus: null`) y borra los archivos si la
  transacción falla.
- `incidents.repository.ts`: consultas (`findDetail(scope, id)` con relaciones y orden ascendente
  de evidencia y bitácora; `toScopeFilter` aplica RN-10 y RN-11).
- `audit-trail.repository.ts` (`appendAuditEntry`) y `audit-trail.mapper.ts`; sin update ni
  delete.
- `incidents.service.ts`: lecturas (`findDetail` → 404 si no está en alcance).
- `incident-registration.service.ts`: `reportedAt` del servidor, RN-07, categoría existente,
  `dueAt` (RN-09), registro y log del evento.
- `incidents.mapper.ts`: `toIncidentSummary` y `toIncidentDetail(entity, role, now)` con
  `availableTransitions`, `isOverdue`, `hoursRemaining`, `slaStatus` y `url` de cada evidencia;
  sin `storagePath` ni `passwordHash`.
- `incidents.copy.ts`: observación inicial de bitácora.
- `incidents.controller.ts`: `POST /incidents` (multipart, `PhotoUploadInterceptor` +
  `PhotoFilesPipe`) y `GET /incidents/:incidentId` (`ResourceIdPipe`: un id que no es UUID
  responde 404).
- `src/modules/evidence/`: `evidence-files.service.ts` (guarda y descarta archivos vía
  `FileStorage`), `evidence.repository.ts` (`insertEvidenceBatch`), `evidence.mapper.ts`,
  `stored-photo.ts`, `evidence.module.ts`.
- `src/common/http/api-routes.ts` (prefijo `/api` y URL de archivo de evidencia),
  `src/common/pipes/resource-id.pipe.ts`, `src/database/database-transaction.ts`,
  `getYearInTimeZone` en `date-math.ts`.

**Verificación:** crear con dos fotos devuelve 201 con folio `C29-2026-NNNN` y el correlativo
avanza de a uno (CA-03); ocho creaciones simultáneas producen folios consecutivos sin repetir;
enviar `reportedAt` o `folio` no los altera (CA-04); `occurredAt` futura o de más de 30 días →
`INVALID_OCCURRED_AT` (CA-05); un archivo que no es imagen, más de cinco fotos o una de más de
5 MB → `INVALID_FILE`; el hash coincide con `shasum -a 256`; los archivos quedan en solo
lectura; un residente no ve el incidente de otro (404).

---

## 13 · `feat(api): add incident inbox with filters`

**Objetivo:** A6 del lado servidor.

**Archivos:**
- `dto/list-incidents-query.dto.ts`: `status`, `category`, `from`, `to` (ISO 8601: una fecha
  sola se interpreta como el día completo en `TIME_ZONE`), `search` (recortada, máximo 100),
  `page` (≥ 1, por defecto 1), `pageSize` (1 a 100, por defecto 20).
- `src/common/time/time-zone.ts` (`startOfDayInTimeZone`) y `date-range.ts`
  (`resolveDateRange`), reutilizados por métricas.
- `incidents.repository.ts`: `findPage(scope, filters, pageRequest)`: `count` + `findMany` en
  una transacción, orden `reportedAt desc` y `folio desc` como desempate, búsqueda
  `insensitive` en `folio` y `description`, `_count` de evidencia; el rango filtra por
  `reportedAt`.
- `incidents.mapper.ts`: `toIncidentPage`.
- `incidents.service.ts`: `list(user, query)` con valores por defecto de paginación.
- `incidents.controller.ts`: `GET /incidents`.

**Verificación:** filtros por estado, categoría, texto (folio y descripción, sin distinguir
mayúsculas), rango de fechas y paginación por curl; un residente ve solo sus incidentes (CA-02);
`pageSize=500`, un estado inexistente o una fecha inválida → `VALIDATION_FAILED`.

---

## 14 · `feat(api): add incident transitions and reassignment`

**Objetivo:** A4 y A5: ciclo de vida con bitácora transaccional.

**Archivos:**
- `dto/transition-incident.dto.ts`: `targetStatus`, `assigneeId?` (UUID), `note`.
- `dto/reassign-incident.dto.ts`: `assigneeId`, `note`.
- `dto/note.decorator.ts`: `@IsAuditNote()` (recorte y largo 10 a 1000 con mensaje en español).
- `src/common/validation/trim-text.ts`: transformación compartida por los DTO.
- `incident-workflow.service.ts`:
  - `transition(user, id, input)`: carga en alcance (404) → rol permitido para el destino
    (`FORBIDDEN_ROLE`) → transición válida (`INVALID_TRANSITION`) → requisitos
    (`ASSIGNEE_REQUIRED`, `CLOSURE_WITHOUT_EVIDENCE`, observación) → responsable del mismo
    condominio y rol asignable (`INVALID_ASSIGNEE`). `closedAt` cuando el destino es `CLOSED`.
    Log del evento como sustituto de notificación.
  - `reassign(user, id, input)`: RN-06 (`INVALID_REASSIGNMENT`), bitácora con
    `fromStatus = toStatus = estado actual`.
- `incident-write.repository.ts`: `applyStatusChange` y `applyAssigneeChange` en una transacción
  con `updateMany` condicionado a condominio y estado de origen; si otra petición cambió el
  estado primero no se escribe nada y el servicio responde con el código de error del caso.
- `incidents.controller.ts`: `POST /incidents/:incidentId/transitions` (200) y
  `PATCH /incidents/:incidentId/assignee` (`@RequireCapability(MANAGE_ASSIGNMENTS)`).

**Verificación:** `REPORTED → CLOSED` → `INVALID_TRANSITION` (CA-06); a `ASSIGNED` sin
responsable → `ASSIGNEE_REQUIRED` (CA-07); cerrar sin evidencia → `CLOSURE_WITHOUT_EVIDENCE`
(CA-08); conserje asignando → `FORBIDDEN_ROLE` (CA-10); cada transición agrega exactamente una
entrada (CA-11); un rechazado no se reabre; reasignar en `REPORTED` → `INVALID_REASSIGNMENT`;
tres transiciones simultáneas del mismo incidente producen un solo cambio y una sola entrada.

---

## 15 · `feat(api): add evidence attachment and file download`

**Objetivo:** evidencia adicional y entrega controlada de archivos.

**Archivos:**
- `incident-evidence.service.ts` (en `incidents/`): `attach(user, id, photos)`: alcance (el
  residente solo los propios), `assertCanAttachEvidence` (`EVIDENCE_NOT_ALLOWED` en terminales),
  al menos una foto (`INVALID_FILE`).
- `incident-write.repository.ts`: `attachEvidence` guarda los archivos y, en una transacción,
  confirma que el incidente sigue en el mismo estado, inserta las filas y la bitácora
  ("Se adjuntó 1 evidencia" / "Se adjuntaron N evidencias"); si el estado cambió, descarta los
  archivos.
- `incident-workflow.repository.ts`: los cambios de estado y de responsable pasan a su propio
  repositorio; `incident-state-guard.repository.ts` concentra el `updateMany` condicionado.
- `audit-trail.repository.ts` mapea campo por campo (un spread con campos de más rompería el
  insert en tiempo de ejecución).
- `incidents.controller.ts`: `POST /incidents/:incidentId/evidence`.
- `src/modules/evidence/`: `evidence.controller.ts` (`GET /evidence/:evidenceId/file`),
  `evidence-download.service.ts` (busca la evidencia con alcance sobre el incidente padre; 404 si
  no es visible), `EvidenceRepository.findAccessible`; respuesta `StreamableFile` con
  `Content-Type` real, `Content-Disposition` con nombre UTF-8 y `Cache-Control: private,
  no-store`.
- `src/common/http/content-disposition.ts`: encabezado con nombre ASCII y `filename*` UTF-8,
  reutilizado por el PDF.

**Verificación:** tras adjuntar, el cierre que fallaba tiene éxito (CA-09); el hash de la
respuesta coincide con `shasum -a 256` del archivo original y del descargado (CA-13); un
residente no descarga evidencia ajena ni adjunta a incidentes ajenos (404); adjuntar a un cerrado
→ `EVIDENCE_NOT_ALLOWED`; el directorio de almacenamiento no se sirve como estático.

---

## 16 · `feat(api): add non-blocking reverse geocoding`

**Objetivo:** A12 sin poner en riesgo el registro (RN-14).

**Archivos:**
- `src/modules/geocoding/geocoder.port.ts`: `Geocoder.reverse(coordinates): Promise<string | null>`
  y token `GEOCODER`.
- `src/modules/geocoding/nominatim-geocoder.adapter.ts`: `fetch` con
  `AbortSignal.timeout(NOMINATIM_TIMEOUT_MS)`, `User-Agent` configurado, `Accept-Language: es`,
  `format=jsonv2`; ante cualquier fallo registra un `warn` y devuelve `null`.
- `src/modules/geocoding/nominatim-address.ts`: arma "calle número, comuna" desde `address`
  validando la forma de la respuesta, con respaldo en `display_name`.
- `src/modules/geocoding/geocoding.module.ts`.
- `incidents/incident-geocoding.service.ts`: después de confirmar el registro, si hay coordenadas,
  geocodifica y guarda `geocodedAddress` (`IncidentWriteRepository.setGeocodedAddress`); ningún
  error se propaga (RN-14). El registro espera como máximo el timeout configurado, así la
  respuesta ya incluye la dirección.

**Verificación:** con red, el detalle trae dirección (CA-14); con
`NOMINATIM_URL=http://10.255.255.1/reverse` el incidente se crea igual en ~3 s, con
`geocodedAddress: null`, sin error visible y con un `warn` en el log (CA-16).

---

## 17 · `feat(api): add case file pdf export`

**Objetivo:** A8, el entregable probatorio (§7 de la especificación).

**Dependencias:** `pdfkit`, `sharp` (normaliza las imágenes para el PDF y genera las del seed en
el commit 19). Dev: `@types/pdfkit`.

**Archivos (`src/modules/case-files/`):**
- `case-files.controller.ts`: `GET /incidents/:incidentId/case-file.pdf` con
  `@RequireCapability(DOWNLOAD_CASE_FILE)`; `Content-Type: application/pdf`,
  `Content-Disposition: attachment; filename="expediente-{folio}.pdf"` y
  `Cache-Control: private, no-store`.
- `case-files.service.ts`: carga el expediente en alcance, lee los archivos desde
  `EvidenceFilesService`, normaliza cada imagen (si una falla, el PDF indica que la vista previa no
  está disponible) y registra la emisión en el log.
- `case-files.repository.ts`: incidente con condominio, categoría, personas, evidencia y bitácora
  ascendentes; nombre del emisor.
- `case-file-view.mapper.ts`: arma un modelo de presentación con todos los textos ya formateados
  (fechas `dd-MM-yyyy HH:mm` en `TIME_ZONE`, etiquetas de estado y perfil, tamaños), de modo que
  las secciones solo dibujan.
- `pdf/case-file-document.ts`: compone el documento (carta, márgenes 50, Helvetica,
  `bufferPages`) y devuelve un `Buffer`.
- `pdf/pdf-writer.ts`: primitivas sobre pdfkit (título de sección que no queda huérfano, par
  etiqueta-valor, párrafo, líneas pequeñas, imagen ajustada a 240×240, flecha vectorial entre
  estados porque Helvetica no tiene el carácter `→`, divisor, salto de página y pie en todas las
  hojas).
- `pdf/sections/`: `header`, `fields` (identificación y partes), `description`, `evidence`
  (imagen y ficha en cuerpo 8 con hash completo), `audit-trail`, `footer` ("Expediente emitido el
  … por … · folio · Página N de M" y leyenda).
- `pdf/pdf-image.ts`: con `sharp` aplica la orientación EXIF, limita a 960 px y convierte a JPEG
  (pdfkit no soporta WebP ni PNG entrelazado); devuelve las dimensiones para calcular el ajuste.
  El hash impreso es siempre el del archivo original.
- `pdf/case-file-layout.constants.ts`, `pdf/case-file-view.ts` y `case-files.copy.ts`.
- `src/common/files/image-decoding.ts`: la carga de fotos exige además que la imagen sea
  decodificable (firma válida con contenido corrupto → `INVALID_FILE`).

**Verificación:** el PDF descargado (incidente con JPEG, PNG y WebP, flujo completo hasta
`CLOSED`) tiene las cinco secciones, imágenes, hashes completos, bitácora con flechas y
numeración en cada hoja (CA-17), revisado renderizando cada página; un residente recibe
`FORBIDDEN_ROLE`; un JPEG con firma válida pero contenido corrupto se rechaza al cargar.

---

## 18 · `feat(api): add metrics endpoint`

**Objetivo:** A9 con las definiciones exactas de la especificación.

**Archivos (`src/modules/metrics/`):**
- `dto/metrics-query.dto.ts`: `from` y `to` opcionales (fecha sola = día completo en
  `TIME_ZONE`); por defecto, los 90 días anteriores a `to` o a ahora.
- `metrics.repository.ts`: conteo total, `groupBy` por estado y por categoría, catálogo de
  categorías, cerrados con `reportedAt`, `closedAt`, `dueAt` y conteo de evidencia, y no
  terminales vencidos; consultas en paralelo.
- `domain/metrics-calculator.ts`: funciones puras para promedio de resolución (un decimal),
  porcentaje dentro de SLA, porcentaje con evidencia al cierre (`null` cuando no hay cerrados) y
  conteo por estado con ceros.
- `metrics.service.ts`, `metrics.mapper.ts` (categorías con conteo, ordenadas de mayor a menor),
  `metrics.controller.ts` (`@RequireCapability(VIEW_METRICS)`), `metrics.module.ts`.
- Criterio de período: todas las métricas se calculan sobre la cohorte de incidentes registrados
  en el período (`reportedAt`), incluidos los abiertos vencidos.

**Verificación:** los conteos coinciden con la base; un período sin cerrados devuelve `null` en
los tres indicadores; conserje → `FORBIDDEN_ROLE`. Con los datos del commit 19,
`percentWithEvidenceAtClosure = 100` y `percentWithinSla ≈ 81` (CA-20).

---

## 19 · `feat(db): add historical incidents seed`

**Objetivo:** 32 incidentes realistas que hacen demostrable el sistema (§9).

**Archivos (`apps/api/prisma/seed/`):**
- `data/incidents/`: 32 definiciones repartidas en `closed-incidents-1..4.data.ts`,
  `rejected-incidents.data.ts` y `open-incidents.data.ts`, unidas en
  `historical-incidents.data.ts`; tipos en `seed-incident.types.ts`. Cada una declara
  categoría, ubicación, reportante, antigüedad, descripción realista, fotos y desenlace (horas
  de resolución y texto de cierre, motivo de rechazo o estado abierto con responsable).
  Composición: 21 `CLOSED` (17 dentro y 4 fuera de SLA), 2 `REJECTED` con motivo, 9 abiertos
  (2 `REPORTED`, 2 `UNDER_REVIEW`, 2 `ASSIGNED`, 3 `IN_PROGRESS`), 2 de ellos vencidos y 2 por
  vencer. Predominan `WATER_LEAK` (10) y `COMMON_AREAS` (8).
- `data/seed-texts.data.ts`, `data/demo-emails.data.ts`; `data/condominium.data.ts` suma la
  ubicación de demostración (coordenadas y dirección para los incidentes con mapa).
- `generators/incident-timeline.generator.ts`, `timeline-steps.ts` y `timeline.constants.ts`:
  bitácora coherente (pasos en fracciones del tiempo de resolución, marcas crecientes, actor con
  el rol que podía ejecutar cada transición, evidencia previa al cierre con su entrada).
- `generators/evidence-image.generator.ts`: JPEG 800×600 de color plano con el folio escrito
  (SVG renderizado con `sharp`).
- `seeders/incidents.seeder.ts`, `incident-writer.ts`, `evidence-writer.ts` y
  `seed-context.ts`: si el condominio ya tiene incidentes no hace nada (idempotencia sin borrar,
  que los triggers impedirían); reutiliza `formatFolio`, `calculateDueAt`, el mismo `UPSERT` de
  folio, el mismo almacenamiento inmutable y el mismo SHA-256 que la API. Los folios siguen el
  orden cronológico.
- `src/modules/storage/local-disk-files.ts`: la lógica de disco del adaptador pasa a funciones
  reutilizables por el seed.
- `src/config/environment.ts`: `@Type(() => Number)` explícito en las variables numéricas (el
  seed corre con `tsx`, que no emite metadatos de decoradores).
- Scripts: `scripts/clear-storage.mjs` y `db:reset` (vacía el almacenamiento y recrea la base con
  el seed); `scripts/ensure-docker.mjs`; `npm start` en la raíz (`setup` + `dev`): un solo
  comando levanta todo desde cero con datos.

**Verificación:** `npm run db:reset` deja 32 incidentes con la composición indicada; bitácoras con
marcas crecientes, cadena de estados coherente y estado final igual al de la última entrada;
la bandeja muestra dos vencidos (CA-19); métricas con 81 % dentro de SLA y 100 % con evidencia
(CA-20); el residente ve solo sus 8 incidentes (CA-02); el seed corre dos veces sin duplicar;
el expediente de un incidente del seed muestra sus imágenes; un clon limpio con `npm start` deja
todo operativo.

---

## 20 · `feat(web): add authentication and app layout`

**Objetivo:** login, sesión y navegación por perfil (A1, A10).

**Archivos:**
- Sistema visual: tokens `accent*` en `@theme`, tipografía del sistema, favicon SVG y
  `theme-color`; set de íconos SVG propio (`shared/ui/icons/`, trazos de Heroicons, licencia MIT)
  sin dependencias nuevas.
- `src/shared/ui/`: `FieldShell.tsx`, `TextField.tsx`, `field-styles.ts` (controles de 44 px,
  texto de 16 px en móvil para evitar zoom, anillo de foco), `InlineAlert.tsx`, `Avatar.tsx`,
  `IconButton.tsx`, `Card.tsx` con cabecera opcional.
- `src/shared/layout/`: `AppShell.tsx` presentacional con `BrandMark`, `DesktopNavigation`,
  `BottomNavigation` (barra inferior tipo app en móvil) y `UserMenu`. Vive en `shared` y recibe
  todo por props, porque `shared` no puede importar de features.
- `src/app/layout/AuthenticatedLayout.tsx` y `use-navigation-items.ts`: contenedor que lee la
  sesión y arma la navegación por capacidad (Métricas solo con `VIEW_METRICS`).
- `src/features/auth/`: `api/auth.api.ts`, `session-storage.ts` (token en `incidents.token`,
  usuario en `incidents.user`, lectura validada y tolerante a fallos), `session-events.ts`
  (evento de sesión expirada que el `http-client` emite ante un 401 y el `AuthProvider` escucha),
  `AuthProvider.tsx`, `auth-context.ts`, `session.types.ts`, `hooks/use-auth.ts` (`useAuth`,
  `useSession`, `useCapability`), `hooks/use-login-form.ts`, `components/` (`LoginForm`,
  `LoginCredentialsFields`, `DemoAccountsCard` con botón para autocompletar, `LoginBrandPanel`,
  `ProtectedRoute` por capacidad), `pages/LoginPage.tsx` y `auth.copy.ts`.
- `src/app/configure-http-client.ts`: conecta el token y el evento de sesión expirada al cliente
  HTTP antes del primer render.
- `src/shared/copy/domain-labels.copy.ts`, `src/shared/lib/format.ts` (fechas en `TIME_ZONE`,
  expuesta desde el `.env` raíz con `envPrefix`), `initials.ts`, `shared/api/error-message.ts`.
- Router: `/login` pública; `/` redirige a `/incidents`; rutas protegidas bajo el layout; la
  bandeja es una página mínima que el commit 21 completa.

**Verificación:** con Chrome headless: sin sesión redirige a `/login`; credenciales erróneas
muestran el error en línea; el botón de cuenta demo autocompleta; el login aterriza en la
bandeja (CA-01); cerrar sesión limpia el almacenamiento; capturas a 1440 px y 390 px sin desborde
horizontal ni objetivos táctiles menores a 44 px.

---

## 21 · `feat(web): add incidents inbox`

**Objetivo:** bandeja con filtros en la URL y semáforo (A6).

**Archivos (`src/features/incidents/`):**
- `api/incidents.api.ts`, `api/catalogs.api.ts`, `api/incidents.keys.ts`.
- `hooks/incident-filters-params.ts` (lectura y escritura pura de la query string),
  `use-incident-filters.ts` (cambiar un filtro vuelve a la página 1; cambiar de página vuelve
  arriba), `use-incidents.ts` (con `placeholderData` para paginar sin parpadeo),
  `use-catalogs.ts`; `use-debounced-value.ts` en `shared/hooks`.
- `components/`: `IncidentFiltersBar`, `SearchFilter` (estado local con commit diferido a la URL:
  React Router 7 actualiza la URL en una transición y un input controlado desde la URL pierde
  teclas), `StatusFilter`, `CategoryFilter`, `ClearFiltersFooter`, `IncidentsTable` e
  `IncidentsTableRow` (desde `md`, fila clickeable y folio como enlace), `IncidentCardList` e
  `IncidentCard` (bajo `md`), `IncidentStatusBadge`, `SlaIndicator`, `IncidentsEmptyState`,
  `InboxResults` (cargando, error con reintento, vacío con o sin filtros, paginación).
- `presentation/status-tones.ts` y `sla-presentation.ts` (semáforo con tiempo restante o vencido
  en horas o días; cerrados muestran si cumplieron el plazo).
- `src/shared/ui/`: `Badge`, `SelectField`, `SearchField`, `DateRangeFields` (ya en `shared`
  para reutilizarlo en métricas), `Pagination`, `EmptyState` con ícono.
- `pages/InboxPage.tsx` e `incidents.copy.ts`.

**Verificación:** con Chrome headless: los filtros viven en la URL y se reconstruyen al recargar
(CA-18); la búsqueda no pierde caracteres; la paginación y el clic en una fila funcionan; se ven
dos vencidos en rojo (CA-19); el residente ve solo sus 8 incidentes y no ve Métricas (CA-02); un
token inválido devuelve al login; sin desborde a 390 px.

---

## 22 · `feat(web): add report incident form`

**Objetivo:** reporte usable con una mano en el teléfono (A2, A10).

**Archivos (`src/features/incidents/`):**
- `hooks/use-report-incident-form.ts` (estado, validación al enviar y luego en vivo),
  `report-incident-validation.ts` (reglas puras con los límites de `shared`),
  `use-geolocation.ts` (`idle`, `locating`, `granted`, `denied`, `unavailable`; coordenadas a 7
  decimales), `use-photo-selection.ts` y `photo-selection-rules.ts` (tipo, tamaño y cantidad
  según `uploadLimits` del catálogo; previsualización con object URLs liberadas al quitar y al
  desmontar), `use-create-incident.ts` (arma el `FormData` en `api/incidents.api.ts` y navega al
  detalle con el folio en el estado de navegación), `use-incident.ts`, `use-created-folio.ts`.
- `components/report/`: `ReportIncidentForm`, `IncidentWhatSection`, `IncidentWhereWhenSection`,
  `CategorySelect` (muestra el SLA), `GeolocationField` y `GeolocationResult` (aviso discreto si
  se deniega), `PhotoPicker`, `PhotoDropzone`, `PhotoPreviewGrid`, `ReportFormActions`.
- Los componentes de incidentes se ordenan por vista: `components/inbox/`, `components/report/`
  y `components/detail/`; badge de estado y semáforo quedan en la raíz.
- `incident.types.ts` (`Coordinates`, para que los componentes no importen la capa `api`),
  `report-incident.copy.ts`, `incident-detail.copy.ts`.
- `src/shared/ui/`: `TextAreaField` (contador), `FormSection` (sección numerada);
  `src/shared/lib/datetime-local.ts`.
- `pages/ReportIncidentPage.tsx` y una primera versión de `pages/IncidentDetailPage.tsx` con el
  aviso del folio asignado (`CreatedFolioNotice`), que el commit 23 completa.

**Verificación:** con Chrome headless, a 390 px y 1440 px: el envío vacío marca los campos; la
categoría muestra su SLA; la ubicación concedida muestra coordenadas; un archivo que no es imagen
se rechaza; las fotos se previsualizan y se quitan; el envío navega al detalle con el folio en un
aviso destacado (CA-03); con la ubicación denegada se informa discretamente y el reporte se crea
igual (CA-15).

---

## 23 · `feat(web): add incident detail and actions`

**Objetivo:** detalle con mapa, evidencia, bitácora y acciones (A4, A5, A7, A8).

**Archivos (`src/features/incidents/`):**
- `api/`: `transitionIncident`, `reassignIncident`, `attachEvidence`, `downloadCaseFile`,
  `getEvidenceFile`, `users.api.ts`; claves `lists` y `evidenceKeys`.
- `hooks/`: `use-incident-mutations.ts` (transición, reasignación y evidencia; actualizan el
  detalle en caché e invalidan los listados), `use-assignable-users.ts` (solo con
  `MANAGE_ASSIGNMENTS`), `use-action-form-fields.ts` y `use-transition-form.ts` (observación y
  responsable con validación local), `use-case-file-download.ts`, `use-evidence-image.ts` (blob a
  data URL: evita los problemas de ciclo de vida de los object URL con StrictMode).
- `components/detail/`: `IncidentDetailView`, `IncidentDetailHeader`, `IncidentInfoCard`,
  `LocationCard` y `MapLocationDetails` (iframe de OpenStreetMap, dirección, coordenadas y enlace
  externo), `EvidenceGalleryCard`, `EvidenceGrid`, `EvidenceThumbnail`, `ProtectedImage`,
  `EvidenceViewer` (imagen completa y hash), `AttachEvidencePanel` (reutiliza el selector de
  fotos del reporte), `AuditTimelineCard` y `AuditTimelineItem`, `IncidentActionsCard`,
  `TransitionButtons`, `IncidentActionDialogs`, `TransitionForm`, `ReassignForm`,
  `AssigneeSelect`, `NoteField`, `DialogFooter` (error del backend dentro del modal sin perder lo
  escrito), `CaseFileDownloadButton`, `CreatedFolioNotice`.
- `presentation/transition-actions.ts` y `map-urls.ts`; `incident-detail.copy.ts`.
- `src/shared/ui/`: `Modal` y `ModalHeader` (portal, `role="dialog"`, Escape, foco y bloqueo de
  scroll; hoja inferior en móvil), `DescriptionList`; `shared/hooks/use-modal-behavior.ts`;
  `shared/lib/blob.ts`; `formatFileSize`; el `http-client` acepta rutas que ya incluyen `/api`.
- `pages/IncidentDetailPage.tsx`: en escritorio, columna principal y acciones en una columna
  lateral fija; en móvil, acciones primero.

**Verificación:** con Chrome headless se recorren los pasos 4 a 9 del guion §12: revisión,
asignación a Luis Meneses (con validación local de responsable y observación), inicio, intento
de cierre sin evidencia con el rechazo dentro del modal conservando la observación (CA-08),
carga de una fotografía y cierre exitoso (CA-09), bitácora con 6 entradas (CA-11), descarga de
`expediente-{folio}.pdf` (CA-17) y visor con el hash completo; el conserje no ve "Asignar
responsable" (CA-10); mapa con dirección (CA-14); sin desborde a 390 px.

---

## 24 · `feat(web): add metrics dashboard`

**Objetivo:** panel de indicadores para el administrador (A9).

**Archivos (`src/features/metrics/`):**
- `api/metrics.api.ts`, `api/metrics.keys.ts`.
- `hooks/use-metrics.ts`, `use-metrics-range.ts` (rango en la query string).
- `components/`: `MetricsSummary.tsx` (cuatro tarjetas), `MetricCard.tsx` (guion cuando el
  valor es `null`), `HorizontalBarChart.tsx` (barras en HTML y CSS), `StatusBreakdown.tsx`,
  `CategoryBreakdown.tsx`.
- `DateRangeFilter.tsx` pasa de `incidents` a `shared/ui` para reutilizarse.
- `pages/MetricsPage.tsx` (ruta protegida solo para `ADMIN`) y `metrics.copy.ts`.

**Verificación:** evidencia al cierre en 100 % y dentro de SLA distinto de 100 % (CA-20); un
conserje que entra a `/metrics` vuelve a la bandeja.

---

## 25 · `docs: add readme and acceptance checklist`

**Objetivo:** documentación de entrega y verificación final.

**Archivos:**
- `README.md` en el orden de §10.4 de la especificación: qué es en tres frases, requisitos,
  los dos comandos (`npm run setup` y `npm run dev`), credenciales demo, mapa de carpetas,
  decisiones de diseño (justificaciones de §4.1, RN-03, RN-12, RN-13) y tabla de variables de
  entorno.
- `docs/acceptance-checklist.md`: CA-01 a CA-23 con el resultado de la verificación manual y
  los criterios que no aplican por las decisiones de `CLAUDE.md` §2 (CA-22).

**Verificación:** clon limpio en un directorio temporal → `npm run setup && npm run dev` deja el
sistema operativo con datos; se ejecuta el guion completo de §12 de la especificación.
