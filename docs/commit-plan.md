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
| 11 | Backend | `feat(api): add file storage and photo validation` | [ ] |
| 12 | Backend | `feat(api): add incident creation and detail` | [ ] |
| 13 | Backend | `feat(api): add incident inbox with filters` | [ ] |
| 14 | Backend | `feat(api): add incident transitions and reassignment` | [ ] |
| 15 | Backend | `feat(api): add evidence attachment and file download` | [ ] |
| 16 | Backend | `feat(api): add non-blocking reverse geocoding` | [ ] |
| 17 | Backend | `feat(api): add case file pdf export` | [ ] |
| 18 | Backend | `feat(api): add metrics endpoint` | [ ] |
| 19 | Backend | `feat(db): add historical incidents seed` | [ ] |
| 20 | Frontend | `feat(web): add authentication and app layout` | [ ] |
| 21 | Frontend | `feat(web): add incidents inbox` | [ ] |
| 22 | Frontend | `feat(web): add report incident form` | [ ] |
| 23 | Frontend | `feat(web): add incident detail and actions` | [ ] |
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
  `{STORAGE_DIR}/{incidentId}/{uuid}.{ext}` y devuelve la ruta relativa.
- `src/modules/storage/storage.module.ts`.
- `src/common/files/photo-signature.ts`: detección por bytes mágicos (JPEG, PNG, WebP); el
  `mimetype` declarado por el cliente no basta.
- `src/common/files/sha256.ts`: hash del buffer.
- `src/common/files/photo-files.pipe.ts`: valida cantidad, tamaño y firma; lanza `INVALID_FILE`.
- `src/common/files/photo-upload.constants.ts`: nombre del campo `photos`.
- Configuración de Multer con `MulterModule.registerAsync` (memoria, límites desde `AppConfig`).

**Verificación:** se ejerce en el commit 12.

---

## 12 · `feat(api): add incident creation and detail`

**Objetivo:** A2, A3 y A7 del lado servidor.

**Archivos (`src/modules/incidents/`):**
- `dto/create-incident.dto.ts`: `categoryCode`, `description` (10 a 2000), `location` (del
  catálogo), `occurredAt` (ISO 8601), `latitude` y `longitude` opcionales y en pareja (numéricos
  vía `@Type`).
- `incidents.repository.ts`: `nextFolioSequence(tx, condominiumId, year)` con el `UPSERT`
  atómico de §6.3, `create`, `findDetail(scope, id)` con relaciones.
- `audit-trail.repository.ts`: `append(tx, entry)`; sin update ni delete.
- `src/modules/evidence/evidence.repository.ts`: `createMany(tx, items)`; sin update ni delete.
- `incidents.service.ts` → `create(user, input, photos)`: `reportedAt` del servidor; dentro de
  `$transaction`: RN-07, categoría existente, folio, `dueAt`, incidente `REPORTED`, archivos al
  storage con SHA-256, filas de evidencia, entrada inicial de bitácora (`fromStatus: null`). Si la
  transacción falla, se eliminan los archivos ya escritos (compensación). `findDetail(user, id)`.
- `incidents.mapper.ts`: `toIncidentDetail(entity, role, now)` con `availableTransitions`,
  `isOverdue`, `hoursRemaining`, `slaStatus`, `url` de cada evidencia
  (`/api/evidence/{id}/file`); sin `storagePath` ni `passwordHash`.
- `incidents.copy.ts`: observación inicial de bitácora.
- `incidents.controller.ts`: `POST /incidents` (multipart, `FilesInterceptor('photos')` +
  `PhotoFilesPipe`) y `GET /incidents/:id`.
- `incidents.module.ts`.

**Verificación:** crear con dos fotos devuelve 201 con folio `C29-2026-NNNN` y el correlativo
avanza de a uno (CA-03); enviar `reportedAt` no lo altera (CA-04); `occurredAt` futura o de más
de 30 días → `INVALID_OCCURRED_AT` (CA-05); un `.txt` renombrado a `.jpg` → `INVALID_FILE`.

---

## 13 · `feat(api): add incident inbox with filters`

**Objetivo:** A6 del lado servidor.

**Archivos:**
- `dto/list-incidents.query.ts`: `status`, `category`, `from`, `to` (instantes ISO; la web
  convierte días locales a límites del día), `search`, `page` (≥ 1, por defecto 1),
  `pageSize` (1 a 100, por defecto 20).
- `incidents.repository.ts`: `findPage(scope, filters, pagination)`: `count` + `findMany` en
  una transacción, orden `reportedAt desc`, búsqueda `insensitive` en `folio` y `description`,
  `_count` de evidencia.
- `incidents.mapper.ts`: `toIncidentSummary`.
- `incidents.service.ts`: `list(user, query)` → `PaginatedResponse<IncidentSummary>`.
- `incidents.controller.ts`: `GET /incidents`.

**Verificación:** combinaciones de filtros por curl; un residente ve solo sus incidentes
(CA-02); `pageSize=500` → `VALIDATION_FAILED`.

---

## 14 · `feat(api): add incident transitions and reassignment`

**Objetivo:** A4 y A5: ciclo de vida con bitácora transaccional.

**Archivos:**
- `dto/transition-incident.dto.ts`: `targetStatus`, `assigneeId?`, `note` (mínimo 10).
- `dto/reassign-incident.dto.ts`: `assigneeId`, `note`.
- `incident-workflow.service.ts`:
  - `transition(user, id, input)`: carga en alcance (404) → rol permitido para el destino
    (`FORBIDDEN_ROLE`) → transición válida (`INVALID_TRANSITION`) → requisitos
    (`ASSIGNEE_REQUIRED`, `CLOSURE_WITHOUT_EVIDENCE`) → responsable válido del mismo condominio y
    rol asignable (`INVALID_ASSIGNEE`). En `$transaction`: `updateMany` condicionado al estado de
    origen (si otra petición cambió el estado primero, `INVALID_TRANSITION`), `closedAt` cuando el
    destino es `CLOSED`, entrada de bitácora. Log del evento como sustituto de notificación.
  - `reassign(user, id, input)`: RN-06 (`INVALID_REASSIGNMENT`), bitácora con
    `fromStatus = toStatus = estado actual`.
- `users.repository.ts`: `findAssignable(condominiumId, userId)`.
- `incidents.controller.ts`: `POST /incidents/:id/transitions` y
  `PATCH /incidents/:id/assignee` (`@Roles(ADMIN)`).

**Verificación:** `REPORTED → CLOSED` → `INVALID_TRANSITION` (CA-06); a `ASSIGNED` sin
responsable → `ASSIGNEE_REQUIRED` (CA-07); cerrar sin evidencia → `CLOSURE_WITHOUT_EVIDENCE`
(CA-08); conserje asignando → `FORBIDDEN_ROLE` (CA-10); cada transición agrega exactamente una
entrada (CA-11).

---

## 15 · `feat(api): add evidence attachment and file download`

**Objetivo:** evidencia adicional y entrega controlada de archivos.

**Archivos:**
- `incident-evidence.service.ts` (en `incidents/`): `attach(user, id, photos)`: alcance (el
  residente solo los propios), `assertCanAttachEvidence` (`EVIDENCE_NOT_ALLOWED` en terminales),
  al menos una foto; en `$transaction`: archivos, filas y bitácora "Se adjuntaron N evidencias"
  (copy con singular y plural).
- `incidents.controller.ts`: `POST /incidents/:id/evidence`.
- `src/modules/evidence/`: `evidence.controller.ts` (`GET /evidence/:id/file`),
  `evidence.service.ts` (busca la evidencia con alcance sobre el incidente padre; 404 si no es
  visible), respuesta `StreamableFile` con `Content-Type` real y `Cache-Control: private`.
  `evidence.module.ts`.

**Verificación:** tras adjuntar, el cierre que fallaba tiene éxito (CA-09); el hash de la
respuesta coincide con `shasum -a 256` del archivo original (CA-13); un residente no descarga
evidencia ajena (404).

---

## 16 · `feat(api): add non-blocking reverse geocoding`

**Objetivo:** A12 sin poner en riesgo el registro (RN-14).

**Archivos:**
- `src/modules/geocoding/geocoder.port.ts`: `Geocoder.reverse(coordinates): Promise<string | null>`
  y token `GEOCODER`.
- `src/modules/geocoding/nominatim-geocoder.adapter.ts`: `fetch` con
  `AbortSignal.timeout(NOMINATIM_TIMEOUT_MS)`, `User-Agent` configurado,
  `accept-language=es`, `format=jsonv2`; arma la dirección desde `address` (calle, número,
  comuna) con respaldo en `display_name`; ante cualquier fallo registra un `warn` y devuelve
  `null`.
- `src/modules/geocoding/geocoding.module.ts`.
- `incidents.service.ts`: después de confirmar la transacción, si hay coordenadas, geocodifica y
  actualiza `geocodedAddress`; el error nunca se propaga.

**Verificación:** con red, el detalle trae dirección (CA-14); con
`NOMINATIM_URL=http://10.255.255.1` el incidente se crea igual, con `geocodedAddress: null` y
sin error visible (CA-16).

---

## 17 · `feat(api): add case file pdf export`

**Objetivo:** A8, el entregable probatorio (§7 de la especificación).

**Dependencias:** `pdfkit`, `sharp` (convierte WebP a PNG, formato que pdfkit no soporta, y genera
las imágenes del seed en el commit 19). Dev: `@types/pdfkit`.

**Archivos (`src/modules/case-files/`):**
- `case-files.controller.ts`: `GET /incidents/:id/case-file.pdf` con
  `@Roles(CONCIERGE, ADMIN)`; `Content-Type: application/pdf` y
  `Content-Disposition: attachment; filename="expediente-{folio}.pdf"`.
- `case-files.service.ts`: carga el expediente en alcance, lee archivos desde `FileStorage`,
  normaliza imágenes y delega en el documento.
- `case-files.repository.ts`: incidente con condominio, categoría, personas, evidencia y bitácora
  ascendente.
- `pdf/case-file-document.ts`: compone el documento (carta, márgenes 50, Helvetica,
  `bufferPages`).
- `pdf/sections/`: `header.section.ts`, `identification.section.ts`, `parties.section.ts`,
  `description.section.ts`, `evidence.section.ts` (imagen máx. 240×240 y ficha en cuerpo 8 con
  hash completo), `audit-trail.section.ts`, `footer.section.ts` (emisión, folio, "Página N de M" y
  leyenda en todas las hojas).
- `pdf/pdf-primitives.ts`: título de sección, par etiqueta-valor, divisor, salto de página
  controlado.
- `pdf/case-file-layout.constants.ts` y `case-files.copy.ts`.
- Fechas con `formatDateTime` de `shared` y `TIME_ZONE` de la configuración.

**Verificación:** el PDF descargado tiene las cinco secciones, imágenes, hashes completos y
numeración (CA-17); un residente recibe `FORBIDDEN_ROLE`.

---

## 18 · `feat(api): add metrics endpoint`

**Objetivo:** A9 con las definiciones exactas de la especificación.

**Archivos (`src/modules/metrics/`):**
- `dto/metrics.query.ts`: `from` y `to` opcionales; por defecto, últimos 90 días.
- `metrics.repository.ts`: `groupBy` por estado y por categoría, cerrados del período con
  `reportedAt`, `closedAt`, `dueAt` y conteo de evidencia, y no terminales vencidos.
- `metrics.calculator.ts`: funciones puras para promedio de resolución (un decimal),
  porcentaje dentro de SLA, porcentaje con evidencia al cierre y `null` cuando el denominador es
  cero.
- `metrics.service.ts`, `metrics.mapper.ts`, `metrics.controller.ts` (`@Roles(ADMIN)`),
  `metrics.module.ts`.

**Verificación:** con datos del commit 19, `percentWithEvidenceAtClosure = 100` y
`percentWithinSla ≈ 81` (CA-20); conserje → `FORBIDDEN_ROLE`.

---

## 19 · `feat(db): add historical incidents seed`

**Objetivo:** 32 incidentes realistas que hacen demostrable el sistema (§9).

**Archivos (`apps/api/prisma/seed/`):**
- `data/incidents.data.ts`: 32 definiciones con categoría, ubicación, descripción realista,
  estado final, antigüedad, duraciones, responsable, observaciones por transición y si cierra
  dentro del SLA. Composición: 21 `CLOSED` (17 dentro y 4 fuera de SLA), 2 `REJECTED` con motivo,
  9 abiertos repartidos en los cuatro estados no terminales, 2 de ellos vencidos. Predominan
  `WATER_LEAK` y `COMMON_AREAS`.
- `generators/audit-trail.generator.ts`: bitácora coherente con la ruta de estados, marcas de
  tiempo crecientes y actor con el rol que podía ejecutar cada transición.
- `generators/evidence-image.generator.ts`: JPEG 800×600 de color plano con el folio escrito
  (SVG renderizado con `sharp`).
- `seeders/incidents.seeder.ts`: si el condominio ya tiene incidentes no hace nada
  (idempotencia sin borrar, que los triggers impedirían); reutiliza `formatFolio` y
  `calculateDueAt` del dominio, el mismo `UPSERT` de folio, el mismo esquema de rutas de
  almacenamiento y el mismo SHA-256 que la API.

**Verificación:** `npm run db:reset -w @incidents/api` deja 32 incidentes; la bandeja tiene al
menos un vencido (CA-19); métricas según CA-20; el seed corre dos veces sin duplicar.

---

## 20 · `feat(web): add authentication and app layout`

**Objetivo:** login, sesión y navegación por perfil (A1, A10).

**Archivos:**
- `src/features/auth/api/auth.api.ts`.
- `src/features/auth/session-storage.ts`: token en `localStorage` bajo `incidents.token` y
  usuario bajo `incidents.user`; lectura tolerante a fallos.
- `src/features/auth/AuthProvider.tsx` y `auth-context.ts`: sesión, `login`, `logout`; registra
  el token y el manejador de 401 en el `http-client`.
- `src/features/auth/hooks/use-auth.ts` y `use-login-form.ts`.
- `src/features/auth/components/`: `LoginForm.tsx`, `DemoAccountsCard.tsx`,
  `ProtectedRoute.tsx` (exige sesión; acepta roles permitidos y redirige a la bandeja si no
  corresponde).
- `src/features/auth/pages/LoginPage.tsx`, `demo-accounts.data.ts`, `auth.copy.ts`.
- `src/shared/ui/`: `TextField.tsx`, `InlineAlert.tsx`.
- `src/shared/layout/`: `AppLayout.tsx`, `AppHeader.tsx`, `MainNavigation.tsx` (enlaces según
  capacidades de `shared`), `UserMenu.tsx`.
- `src/shared/copy/domain-labels.copy.ts`: etiquetas de roles, estados, categorías y semáforo.
- Router: `/login` pública; `/incidents` protegida (página inicial mínima que el commit 21
  completa).

**Verificación:** las tres cuentas aterrizan en la bandeja (CA-01); credenciales erróneas
muestran el error en línea; un token inválido redirige a `/login`.

---

## 21 · `feat(web): add incidents inbox`

**Objetivo:** bandeja con filtros en la URL y semáforo (A6).

**Archivos (`src/features/incidents/`):**
- `api/incidents.api.ts`, `api/catalogs.api.ts`, `api/incidents.keys.ts`.
- `hooks/use-incident-filters.ts` (query string ↔ filtros tipados; cambiar un filtro vuelve a la
  página 1), `use-incidents.ts` (con `placeholderData` para paginar sin parpadeo),
  `use-catalogs.ts`, `use-debounced-value.ts` en `shared/hooks`.
- `components/`: `IncidentFiltersBar.tsx`, `StatusFilter.tsx`, `CategoryFilter.tsx`,
  `DateRangeFilter.tsx`, `SearchFilter.tsx`, `IncidentsTable.tsx` (desde `md`),
  `IncidentCardList.tsx` e `IncidentCard.tsx` (bajo `md`), `IncidentStatusBadge.tsx`,
  `SlaIndicator.tsx`, `IncidentsEmptyState.tsx`.
- `presentation/status-tones.ts` y `sla-tones.ts`: mapas únicos de color.
- `src/shared/ui/`: `SelectField.tsx`, `Pagination.tsx`, `Badge.tsx`.
- `pages/InboxPage.tsx` y `incidents.copy.ts`.

**Verificación:** los filtros viven en la URL y se reconstruyen al recargar (CA-18); se ve al
menos un vencido en rojo (CA-19); el residente ve solo lo suyo (CA-02); sin desborde a 390 px.

---

## 22 · `feat(web): add report incident form`

**Objetivo:** reporte usable con una mano en el teléfono (A2, A10).

**Archivos (`src/features/incidents/`):**
- `hooks/use-report-incident-form.ts` (estado y validación con límites de `shared`),
  `use-geolocation.ts` (estados `idle`, `locating`, `granted`, `denied`, `unavailable`),
  `use-photo-selection.ts` (máximo desde `uploadLimits`, previsualización con object URLs y su
  liberación), `use-create-incident.ts` (arma `FormData` y navega al detalle con el folio en el
  estado de navegación).
- `components/`: `ReportIncidentForm.tsx`, `CategorySelect.tsx` (muestra el SLA),
  `DescriptionField.tsx` (contador), `LocationSelect.tsx`, `OccurredAtField.tsx` (por defecto
  ahora), `GeolocationField.tsx` (aviso discreto si se deniega), `PhotoPicker.tsx`,
  `PhotoPreviewGrid.tsx`.
- `src/shared/ui/`: `TextAreaField.tsx`, `DateTimeField.tsx`, `FieldHint.tsx`.
- `pages/ReportIncidentPage.tsx`.

**Verificación:** se crea un incidente y se ve el folio (CA-03); `occurredAt` inválida muestra
el mensaje de la API; denegar ubicación no bloquea el envío (CA-15).

---

## 23 · `feat(web): add incident detail and actions`

**Objetivo:** detalle con mapa, evidencia, bitácora y acciones (A4, A5, A7, A8).

**Archivos (`src/features/incidents/`):**
- `hooks/`: `use-incident.ts`, `use-transition-incident.ts`, `use-reassign-incident.ts`,
  `use-attach-evidence.ts`, `use-assignable-users.ts` (solo habilitado para admin),
  `use-case-file-download.ts` (blob y descarga con el nombre del expediente),
  `use-protected-image.ts` (blob a object URL con liberación).
- `components/`: `IncidentHeader.tsx`, `CreatedFolioNotice.tsx`, `IncidentInfoCard.tsx`,
  `LocationMap.tsx` (iframe de OpenStreetMap, dirección y enlace externo), `EvidenceGallery.tsx`,
  `ProtectedImage.tsx`, `EvidenceViewerModal.tsx` (imagen completa con hash),
  `AuditTimeline.tsx` y `AuditTimelineItem.tsx`, `IncidentActionsBar.tsx` (un botón por
  `availableTransitions`, más reasignar y descargar según capacidades), `TransitionModal.tsx`
  (selector de responsable si el destino es `ASSIGNED`, observación con contador, error dentro
  del modal sin perder lo escrito), `ReassignModal.tsx`, `AttachEvidencePanel.tsx`.
- `src/shared/ui/`: `Modal.tsx` (`role="dialog"`, Escape, foco inicial), `NoteField.tsx`.
- `pages/IncidentDetailPage.tsx`.

**Verificación:** recorrido completo del guion §12 de la especificación, pasos 4 a 9 (CA-06 a
CA-11, CA-14, CA-17) desde la interfaz; un conserje no ve el botón de asignar (CA-10).

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
