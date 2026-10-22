# Sistema de Gestión y Reporte de Incidentes de Seguridad y Mantenimiento
## Especificación del MVP — Versión 1.0

**Proyecto:** Sistema de Gestión y Reporte de Incidentes de Seguridad y Mantenimiento
**Empresa ejecutora:** Folio SpA
**Cliente:** Paralelo 29 SpA (administradora de condominios)
**Patrocinador:** Pedro Santuber, Gerente General
**Curso:** IIC3113 Gestión de Proyectos TI — Grupo 9 — Semestre 2/2026

---

## 0. Cómo leer este documento

Este documento es la especificación completa del producto a construir. Está escrito para ser
implementado de principio a fin sin necesidad de consultar otras fuentes.

- La sección 1 explica el problema de negocio. **No es relleno:** varias reglas técnicas solo
  tienen sentido a la luz de ella, y existe para evitar que se "simplifiquen" reglas que son
  justamente el valor del producto.
- La sección 2 define el alcance. Lo que no está en el alcance **no se construye**, aunque
  parezca una mejora obvia.
- Las secciones 3 a 10 son la especificación funcional y técnica.
- La sección 11 define los criterios de aceptación. Una funcionalidad está terminada cuando
  cumple su criterio, no antes.

Convenciones del documento: `MUST` indica obligatorio, `NO` indica prohibido explícitamente.

---

## 1. Contexto y problema de negocio

Paralelo 29 SpA administra una cartera de condominios. Hoy, los incidentes de seguridad y
mantenimiento de esos edificios (robos en estacionamientos, filtraciones, fallas de ascensor,
daños en áreas comunes) se reportan por WhatsApp o verbalmente en conserjería.

Ese registro informal produce tres pérdidas:

1. **No hay fecha cierta del hecho.** Nadie puede probar cuándo ocurrió.
2. **La evidencia fotográfica se dispersa** en teléfonos personales y se pierde.
3. **No queda constancia de quién quedó a cargo** ni de qué se hizo.

La consecuencia es económica. Cuando el condominio debe reclamar a la aseguradora, a la empresa
de mantención de ascensores o a la inmobiliaria dentro del plazo de garantía legal (el artículo
18 del DFL 458 fija plazos de 10, 5 y 3 años según el tipo de falla), la administradora no puede
acreditar la ocurrencia ni la oportunidad del reclamo, y la comunidad pierde la cobertura.

**El producto existe para resolver exactamente eso: generar, por cada incidente, un expediente
digital trazable y exportable que sirva como respaldo probatorio ante un tercero.**

Esta frase es el criterio de decisión de todo el proyecto. Ante cualquier duda de diseño, gana la
opción que fortalezca la cadena probatoria: fecha confiable, evidencia íntegra, historial
inalterable, responsable identificado.

---

## 2. Alcance de esta versión

### 2.1 Naturaleza de la entrega

Esta primera versión es un **MVP funcional que corre en ambiente local**. No contempla despliegue
en producción, dominio propio, ni operación real en un condominio. Debe ser completamente
funcional y demostrable en una sesión en vivo desde `localhost`.

### 2.2 Dentro del alcance

| # | Capacidad |
|---|---|
| A1 | Autenticación con usuarios precargados y tres perfiles (residente, conserje, administrador) |
| A2 | Registro de incidente con categoría, descripción, ubicación, geolocalización, fecha del hecho y fotografías |
| A3 | Asignación automática de folio único e irrepetible |
| A4 | Ciclo de vida del incidente mediante máquina de estados con responsable asignado |
| A5 | Bitácora de solo inserción con cada cambio de estado y cada reasignación |
| A6 | Bandeja de incidentes con filtros por estado, categoría, período y texto, con semáforo de SLA |
| A7 | Detalle del incidente con evidencia, mapa y bitácora cronológica |
| A8 | Exportación del expediente formal del incidente en PDF |
| A9 | Panel de métricas con los indicadores de éxito del caso de negocio |
| A10 | Interfaz utilizable desde navegador móvil y de escritorio, sin aplicación nativa |
| A11 | Integridad verificable de la evidencia mediante hash SHA-256 |
| A12 | Geocodificación inversa de las coordenadas del incidente |

### 2.3 Fuera del alcance

Lo siguiente **NO** se construye en esta versión. Está documentado aquí para que quede constancia
de que fue una decisión y no un olvido.

| Excluido | Sustituto en esta versión |
|---|---|
| Notificaciones por correo o push al responsable y al reportante | El evento queda registrado en la bitácora y se emite una entrada en el log del servidor |
| Operación multi-condominio real | El modelo de datos lleva `condominio_id` en todas las tablas relevantes y **todas** las consultas filtran por él, pero se precarga un único condominio |
| Perfil "Comité de Administración" | El perfil administrador cubre la vista de consulta y métricas |
| Registro público de usuarios, recuperación de contraseña, gestión de usuarios desde la interfaz | Usuarios precargados mediante seed |
| Edición o eliminación de incidentes y de evidencia | Decisión deliberada: la inmutabilidad es parte del valor probatorio |
| Despliegue, CI/CD, dominio, HTTPS | Ejecución local mediante Docker Compose y npm |
| Internacionalización | Interfaz y datos en español de Chile |
| Clasificación automática de categoría mediante NLP | Categoría seleccionada manualmente por el usuario |

---

## 3. Modelo de dominio

### 3.1 Entidades

```
Condominio      Un edificio administrado. En esta versión existe uno solo precargado.
Usuario         Persona que usa el sistema. Pertenece a un condominio y tiene un perfil.
Categoria       Tipo de incidente. Define el SLA en horas.
Incidente       Núcleo del sistema. Agrega evidencia y bitácora.
Evidencia       Archivo fotográfico asociado a un incidente. Inmutable.
Bitacora        Entrada histórica de un cambio sobre el incidente. Solo inserción.
ContadorFolio   Soporte para la generación atómica de folios.
```

### 3.2 Perfiles de usuario

| Perfil | Quién es | Para qué usa el sistema |
|---|---|---|
| `RESIDENTE` | Copropietario o arrendatario | Reportar incidentes y seguir el estado de los que reportó |
| `CONSERJE` | Personal de conserjería del condominio | Reportar incidentes y hacerlos avanzar operativamente |
| `ADMINISTRADOR` | Administrador designado por Paralelo 29 SpA | Asignar responsables, cerrar casos, exportar expedientes y consultar métricas |

### 3.3 Estados del incidente

```
INGRESADO ──▶ EN_REVISION ──┬──▶ RECHAZADO      (terminal)
                            │
                            └──▶ ASIGNADO ──▶ EN_EJECUCION ──▶ CERRADO   (terminal)
```

| Estado | Significado |
|---|---|
| `INGRESADO` | Reportado, aún no revisado por conserjería o administración |
| `EN_REVISION` | Alguien del condominio lo está evaluando |
| `RECHAZADO` | Duplicado, no procede o fuera del ámbito del condominio. Requiere motivo |
| `ASIGNADO` | Tiene responsable designado pero no ha comenzado la atención |
| `EN_EJECUCION` | La atención está en curso |
| `CERRADO` | Resuelto y documentado |

### 3.4 Reglas de negocio

Estas reglas **MUST** hacerse cumplir en el backend. La interfaz puede además ocultar acciones
inválidas, pero la validación de la interfaz nunca sustituye a la del servidor.

**RN-01 — Transiciones hacia adelante únicamente.**
Solo se permiten las transiciones del diagrama de 3.3. Cualquier otro par origen→destino se
rechaza con HTTP 409 y código `TRANSICION_INVALIDA`. No existe forma de retroceder un estado ni
de reabrir un incidente cerrado o rechazado: retroceder rompe la trazabilidad, que es el valor
del producto.

**RN-02 — Responsable obligatorio al asignar.**
La transición a `ASIGNADO` requiere un `responsableId` válido. Sin él se rechaza con HTTP 400 y
código `RESPONSABLE_REQUERIDO`. El responsable debe ser un usuario del mismo condominio con
perfil `CONSERJE` o `ADMINISTRADOR`.

**RN-03 — No se cierra sin evidencia.**
La transición a `CERRADO` requiere que el incidente tenga **al menos una evidencia fotográfica**.
Si no la tiene, se rechaza con HTTP 409 y código `CIERRE_SIN_EVIDENCIA`.
*Razón:* el indicador de negocio "≥90% de incidentes con fotografías y fecha al cierre" queda
garantizado por construcción y no por disciplina del usuario. Esta regla es un diferenciador del
producto y se demuestra explícitamente en la presentación.

**RN-04 — Observación obligatoria en toda transición.**
Toda transición exige `observacion` con al menos 10 caracteres. Sin ella se rechaza con HTTP 400.

**RN-05 — Toda transición escribe bitácora.**
La actualización del incidente y la inserción en bitácora ocurren dentro de **una misma
transacción de base de datos**. Si falla la bitácora, falla la transición completa.

**RN-06 — Reasignación de responsable.**
El responsable puede cambiarse mientras el incidente esté en `ASIGNADO` o `EN_EJECUCION`. La
reasignación **MUST** generar una entrada de bitácora con `estadoAnterior = estadoNuevo = estado
actual`. En cualquier otro estado se rechaza con HTTP 409.

**RN-07 — Dos fechas distintas.**
- `fechaRegistro`: la asigna el servidor con la hora del sistema. **NO** se acepta del cliente.
  Es inmutable. Es la que acredita oportunidad del reporte.
- `fechaHecho`: la declara el usuario. **MUST** cumplir `fechaHecho <= fechaRegistro` y no tener
  más de 30 días de antigüedad respecto del registro. Fuera de rango se rechaza con HTTP 400 y
  código `FECHA_HECHO_INVALIDA`.

**RN-08 — Folio único.**
Cada incidente recibe al crearse un folio con formato `{códigoCondominio}-{año}-{correlativo de 4
dígitos}`, por ejemplo `C29-2026-0043`. El correlativo es por condominio y por año, comienza en
1, y la generación **MUST** ser atómica frente a creaciones concurrentes. Existe un índice único
sobre `(condominio_id, folio)`.

**RN-09 — Cálculo de SLA.**
Al crear el incidente, `fechaLimite = fechaRegistro + categoria.slaHoras`. Un incidente está
vencido cuando no está en estado terminal y `ahora > fechaLimite`, o cuando está cerrado y
`fechaCierre > fechaLimite`.

**RN-10 — Segregación por condominio.**
Toda consulta y toda escritura **MUST** filtrarse por el `condominioId` contenido en el token del
usuario autenticado. **NO** se acepta `condominioId` como parámetro de ruta, de query ni de
cuerpo. Un usuario nunca puede ver ni modificar un incidente de otro condominio, y el intento
devuelve HTTP 404 (no 403, para no revelar la existencia del recurso).

**RN-11 — Visibilidad del residente.**
Un usuario con perfil `RESIDENTE` solo ve los incidentes donde él es el reportante. Conserje y
administrador ven todos los del condominio.

**RN-12 — Inmutabilidad de bitácora y evidencia.**
Las tablas `bitacora` y `evidencia` son de **solo inserción**. No existen endpoints de
actualización ni de borrado, y la base de datos **MUST** impedirlo mediante triggers que lancen
excepción ante `UPDATE` o `DELETE`.

**RN-13 — Integridad de la evidencia.**
Al cargar cada archivo se calcula su hash **SHA-256**, que se persiste y se imprime en el
expediente PDF. Permite verificar que la fotografía del expediente es idénticamente la que se
cargó en su momento.

**RN-14 — Geocodificación no bloqueante.**
Si el incidente llega con coordenadas, el servidor intenta obtener la dirección mediante
geocodificación inversa. Si el servicio externo falla o demora, el incidente **MUST** crearse
igual con `direccionGeocodificada = null`. La geocodificación nunca puede hacer fallar un
registro de incidente.

### 3.5 Matriz de permisos

| Acción | `RESIDENTE` | `CONSERJE` | `ADMINISTRADOR` |
|---|---|---|---|
| Crear incidente | Sí | Sí | Sí |
| Listar incidentes | Solo propios | Todos del condominio | Todos del condominio |
| Ver detalle | Solo propios | Todos del condominio | Todos del condominio |
| Agregar evidencia a un incidente | Solo propios y solo si no está en estado terminal | Sí | Sí |
| Transición a `EN_REVISION` | No | Sí | Sí |
| Transición a `RECHAZADO` | No | No | Sí |
| Transición a `ASIGNADO` (asignar responsable) | No | No | Sí |
| Transición a `EN_EJECUCION` | No | Sí | Sí |
| Transición a `CERRADO` | No | Sí | Sí |
| Reasignar responsable | No | No | Sí |
| Descargar expediente PDF | No | Sí | Sí |
| Ver panel de métricas | No | No | Sí |

### 3.6 Catálogo de categorías y SLA

Corresponde a los plazos de atención definidos por el cliente. Se precargan por seed.

| Código | Nombre | SLA (horas) |
|---|---|---|
| `SEGURIDAD` | Robo o incidente de seguridad | 24 |
| `ASCENSOR` | Falla de ascensor | 24 |
| `FILTRACION` | Filtración o daño por agua | 48 |
| `ELECTRICO` | Falla eléctrica | 48 |
| `AREAS_COMUNES` | Daño en áreas comunes | 72 |
| `OTRO` | Otro | 72 |

### 3.7 Catálogo de ubicaciones

Lista fija precargada, seleccionable al reportar:

`Estacionamiento -1`, `Estacionamiento -2`, `Hall de acceso`, `Ascensor Torre A`,
`Ascensor Torre B`, `Pasillo común`, `Terraza`, `Sala multiuso`, `Sala de basura`,
`Fachada`, `Otro`

---

## 4. Stack y decisiones técnicas

Las decisiones de esta sección están cerradas. **NO** sustituir una tecnología por otra
equivalente.

| Área | Decisión |
|---|---|
| Lenguaje | TypeScript en modo `strict` en todo el monorepo |
| Runtime | Node.js 20 LTS o superior |
| Monorepo | npm workspaces. Sin Nx, sin Turborepo, sin Lerna |
| Backend | NestJS 10 |
| ORM | Prisma 5 |
| Base de datos | PostgreSQL 16, levantada con Docker Compose |
| Autenticación | JWT con `@nestjs/jwt`. Sin Passport |
| Hash de contraseñas | `bcryptjs` |
| Validación | `class-validator` y `class-transformer` con `ValidationPipe` global |
| Carga de archivos | Multer mediante `FilesInterceptor` de Nest, con almacenamiento en memoria |
| Almacenamiento de archivos | Disco local, directorio `apps/api/almacenamiento/` |
| Generación de PDF | `pdfkit` |
| Frontend | React 18 con Vite |
| Routing | `react-router-dom` 6 |
| Estado de servidor | `@tanstack/react-query` 5 |
| Estilos | Tailwind CSS 3.4 con PostCSS. **NO** usar Tailwind 4 |
| Formularios | Estado local con `useState`. Sin librerías de formularios |
| Testing | Jest para backend, con pruebas unitarias de dominio y una prueba e2e |

### 4.1 Decisiones que conviene justificar

- **Prisma sobre TypeORM:** el esquema queda declarado en un solo archivo legible, las
  migraciones son explícitas y admiten SQL personalizado, que es necesario para los triggers de
  inmutabilidad.
- **Sin Passport:** un `AuthGuard` propio de unas 25 líneas cubre el caso completo y elimina tres
  dependencias y una capa de indirección.
- **`pdfkit` sobre alternativas con navegador headless:** no descarga Chromium, no requiere
  binarios externos, y el expediente es un documento de estructura simple.
- **Sin mapa estático en el PDF:** los servicios gratuitos de mapas estáticos son inestables o
  requieren llave. El expediente imprime coordenadas y dirección geocodificada, que es lo que
  tiene valor probatorio. El mapa visual se muestra en la interfaz web mediante el `iframe`
  público de OpenStreetMap, que no requiere llave.

---

## 5. Estructura del monorepo

```
.
├── package.json                   # workspaces + scripts raíz
├── docker-compose.yml             # solo PostgreSQL
├── .env.example
├── README.md
├── packages/
│   └── compartido/                # @incidentes/compartido
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── estados.ts         # enum de estados y mapa de transiciones
│           ├── perfiles.ts
│           ├── codigos-error.ts
│           └── contratos.ts       # interfaces de request y response
└── apps/
    ├── api/                       # @incidentes/api
    │   ├── package.json
    │   ├── prisma/
    │   │   ├── schema.prisma
    │   │   ├── migrations/
    │   │   └── seed.ts
    │   ├── almacenamiento/        # archivos subidos (en .gitignore)
    │   └── src/
    │       ├── main.ts
    │       ├── app.module.ts
    │       ├── comun/
    │       │   ├── guards/auth.guard.ts
    │       │   ├── guards/perfiles.guard.ts
    │       │   ├── decoradores/usuario-actual.decorador.ts
    │       │   ├── decoradores/perfiles.decorador.ts
    │       │   ├── filtros/excepciones.filtro.ts
    │       │   ├── errores/error-dominio.ts
    │       │   └── utilidades/fechas.ts
    │       ├── prisma/prisma.service.ts
    │       ├── configuracion/configuracion.ts
    │       ├── auth/
    │       ├── catalogos/
    │       ├── usuarios/
    │       ├── incidentes/
    │       │   ├── dominio/       # funciones puras, sin Nest ni Prisma
    │       │   │   ├── maquina-estados.ts
    │       │   │   ├── maquina-estados.spec.ts
    │       │   │   ├── folio.ts
    │       │   │   ├── folio.spec.ts
    │       │   │   ├── sla.ts
    │       │   │   └── sla.spec.ts
    │       │   ├── dto/
    │       │   ├── incidentes.controller.ts
    │       │   ├── incidentes.service.ts
    │       │   ├── incidentes.mapper.ts
    │       │   └── incidentes.module.ts
    │       ├── evidencias/
    │       ├── expedientes/
    │       ├── metricas/
    │       └── geocodificacion/
    └── web/                       # @incidentes/web
        ├── package.json
        ├── vite.config.ts
        ├── tailwind.config.js
        └── src/
            ├── main.tsx
            ├── App.tsx
            ├── rutas.tsx
            ├── api/
            │   ├── cliente.ts
            │   ├── auth.api.ts
            │   ├── incidentes.api.ts
            │   ├── catalogos.api.ts
            │   └── metricas.api.ts
            ├── auth/
            │   ├── AuthContext.tsx
            │   ├── useAuth.ts
            │   └── RutaProtegida.tsx
            ├── componentes/
            │   ├── Boton.tsx
            │   ├── Campo.tsx
            │   ├── EtiquetaEstado.tsx
            │   ├── SemaforoSla.tsx
            │   ├── Modal.tsx
            │   └── Diseno.tsx          # layout con cabecera y navegación
            ├── paginas/
            │   ├── LoginPagina.tsx
            │   ├── BandejaPagina.tsx
            │   ├── NuevoIncidentePagina.tsx
            │   ├── DetalleIncidentePagina.tsx
            │   └── MetricasPagina.tsx
            ├── dominio/
            │   ├── etiquetas.ts
            │   ├── permisos.ts
            │   └── formato.ts
            └── estilos/index.css
```

### 5.1 Reglas de código

1. **Identificadores de dominio en español, sin tildes.** `crearIncidente`, `fechaLimite`,
   `direccionGeocodificada`, `bitacora`. Los nombres impuestos por los frameworks se mantienen
   (`main.ts`, `useEffect`, `AppModule`).
2. **La capa `incidentes/dominio/` es pura.** No importa nada de NestJS, de Prisma ni de HTTP.
   Recibe datos planos y devuelve datos planos o lanza `ErrorDominio`. Es la única capa con
   pruebas unitarias obligatorias.
3. **Los controladores no contienen lógica.** Validan entrada mediante DTO, delegan al servicio y
   mapean la salida. Máximo 15 líneas por método.
4. **Los servicios no construyen respuestas HTTP.** Lanzan `ErrorDominio` con un código de la
   sección 6.4; el filtro global lo traduce a HTTP.
5. **Un mapper explícito por recurso.** Las entidades de Prisma nunca se devuelven directamente
   al cliente. `password_hash` y `ruta_archivo` jamás salen de la API.
6. **Sin `any`.** Sin `@ts-ignore`. `strict: true` en todos los `tsconfig.json`.
7. **Sin comentarios que describan lo obvio.** Comentar solo el porqué de una decisión no
   evidente, por ejemplo la generación atómica del folio.
8. **Nombres de archivo en kebab-case**, sufijados por su rol: `.controller.ts`, `.service.ts`,
   `.dto.ts`, `.mapper.ts`, `.module.ts`, `.spec.ts`.

---

## 6. Especificación del backend

### 6.1 Esquema de base de datos

Nombres de tabla y columna en `snake_case` mediante `@@map` y `@map`. Todos los timestamps son
`timestamptz`.

```prisma
model Condominio {
  id        String   @id @default(uuid())
  codigo    String   @unique            // "C29"
  nombre    String
  direccion String
  usuarios   Usuario[]
  incidentes Incidente[]
  @@map("condominio")
}

model Usuario {
  id            String   @id @default(uuid())
  condominioId  String   @map("condominio_id")
  nombre        String
  email         String   @unique
  passwordHash  String   @map("password_hash")
  perfil        Perfil
  telefono      String?
  creadoEn      DateTime @default(now()) @map("creado_en")

  condominio            Condominio  @relation(fields: [condominioId], references: [id])
  incidentesReportados  Incidente[] @relation("reportante")
  incidentesAsignados   Incidente[] @relation("responsable")
  entradasBitacora      Bitacora[]
  evidenciasSubidas     Evidencia[]
  @@index([condominioId, perfil])
  @@map("usuario")
}

model Categoria {
  codigo     String      @id             // "FILTRACION"
  nombre     String
  slaHoras   Int         @map("sla_horas")
  incidentes Incidente[]
  @@map("categoria")
}

model Incidente {
  id                      String    @id @default(uuid())
  condominioId            String    @map("condominio_id")
  folio                   String
  categoriaCodigo         String    @map("categoria_codigo")
  descripcion             String
  ubicacionTexto          String    @map("ubicacion_texto")
  latitud                 Decimal?  @db.Decimal(10, 7)
  longitud                Decimal?  @db.Decimal(10, 7)
  direccionGeocodificada  String?   @map("direccion_geocodificada")
  fechaHecho              DateTime  @map("fecha_hecho")
  fechaRegistro           DateTime  @default(now()) @map("fecha_registro")
  fechaLimite             DateTime  @map("fecha_limite")
  fechaCierre             DateTime? @map("fecha_cierre")
  estado                  Estado    @default(INGRESADO)
  reportanteId            String    @map("reportante_id")
  responsableId           String?   @map("responsable_id")

  condominio  Condominio  @relation(fields: [condominioId], references: [id])
  categoria   Categoria   @relation(fields: [categoriaCodigo], references: [codigo])
  reportante  Usuario     @relation("reportante",  fields: [reportanteId],  references: [id])
  responsable Usuario?    @relation("responsable", fields: [responsableId], references: [id])
  evidencias  Evidencia[]
  bitacora    Bitacora[]

  @@unique([condominioId, folio])
  @@index([condominioId, estado])
  @@index([condominioId, fechaRegistro])
  @@map("incidente")
}

model Evidencia {
  id             String   @id @default(uuid())
  incidenteId    String   @map("incidente_id")
  rutaArchivo    String   @map("ruta_archivo")
  nombreOriginal String   @map("nombre_original")
  mime           String
  tamanoBytes    Int      @map("tamano_bytes")
  hashSha256     String   @map("hash_sha256")
  subidoPorId    String   @map("subido_por_id")
  creadoEn       DateTime @default(now()) @map("creado_en")

  incidente Incidente @relation(fields: [incidenteId], references: [id])
  subidoPor Usuario   @relation(fields: [subidoPorId], references: [id])
  @@index([incidenteId])
  @@map("evidencia")
}

model Bitacora {
  id             String   @id @default(uuid())
  incidenteId    String   @map("incidente_id")
  estadoAnterior Estado?  @map("estado_anterior")
  estadoNuevo    Estado   @map("estado_nuevo")
  usuarioId      String   @map("usuario_id")
  observacion    String
  creadoEn       DateTime @default(now()) @map("creado_en")

  incidente Incidente @relation(fields: [incidenteId], references: [id])
  usuario   Usuario   @relation(fields: [usuarioId], references: [id])
  @@index([incidenteId, creadoEn])
  @@map("bitacora")
}

model ContadorFolio {
  condominioId String @map("condominio_id")
  anio         Int
  ultimo       Int    @default(0)
  @@id([condominioId, anio])
  @@map("contador_folio")
}

enum Estado  { INGRESADO EN_REVISION RECHAZADO ASIGNADO EN_EJECUCION CERRADO }
enum Perfil  { RESIDENTE CONSERJE ADMINISTRADOR }
```

### 6.2 Migración de inmutabilidad

Crear una migración SQL adicional que implemente RN-12:

```sql
CREATE OR REPLACE FUNCTION impedir_modificacion()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'La tabla % es de solo inserción', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bitacora_solo_insercion
  BEFORE UPDATE OR DELETE ON bitacora
  FOR EACH ROW EXECUTE FUNCTION impedir_modificacion();

CREATE TRIGGER evidencia_solo_insercion
  BEFORE UPDATE OR DELETE ON evidencia
  FOR EACH ROW EXECUTE FUNCTION impedir_modificacion();
```

### 6.3 Generación atómica del folio

Implementar dentro de la misma transacción que crea el incidente, usando `UPSERT` atómico en
lugar de bloqueo explícito:

```ts
const [fila] = await tx.$queryRaw<{ ultimo: number }[]>`
  INSERT INTO contador_folio (condominio_id, anio, ultimo)
  VALUES (${condominioId}, ${anio}, 1)
  ON CONFLICT (condominio_id, anio)
  DO UPDATE SET ultimo = contador_folio.ultimo + 1
  RETURNING ultimo;
`;
const folio = formatearFolio(codigoCondominio, anio, fila.ultimo);
```

`formatearFolio` vive en `incidentes/dominio/folio.ts` como función pura y tiene prueba unitaria.

### 6.4 Catálogo de errores de dominio

```ts
export const CodigoError = {
  CREDENCIALES_INVALIDAS:  'CREDENCIALES_INVALIDAS',   // 401
  NO_AUTENTICADO:          'NO_AUTENTICADO',           // 401
  PERFIL_NO_AUTORIZADO:    'PERFIL_NO_AUTORIZADO',     // 403
  RECURSO_NO_ENCONTRADO:   'RECURSO_NO_ENCONTRADO',    // 404
  TRANSICION_INVALIDA:     'TRANSICION_INVALIDA',      // 409
  CIERRE_SIN_EVIDENCIA:    'CIERRE_SIN_EVIDENCIA',     // 409
  REASIGNACION_INVALIDA:   'REASIGNACION_INVALIDA',    // 409
  RESPONSABLE_REQUERIDO:   'RESPONSABLE_REQUERIDO',    // 400
  RESPONSABLE_INVALIDO:    'RESPONSABLE_INVALIDO',     // 400
  FECHA_HECHO_INVALIDA:    'FECHA_HECHO_INVALIDA',     // 400
  ARCHIVO_INVALIDO:        'ARCHIVO_INVALIDO',         // 400
  VALIDACION:              'VALIDACION',               // 400
} as const;
```

Forma única de respuesta de error, producida por el filtro global de excepciones:

```json
{ "codigo": "CIERRE_SIN_EVIDENCIA",
  "mensaje": "No se puede cerrar un incidente sin evidencia fotográfica adjunta.",
  "estado": 409 }
```

Los mensajes se redactan en español, en tono de aplicación de negocio, y se muestran tal cual en
la interfaz.

### 6.5 Endpoints

Prefijo global `/api`. Todos requieren `Authorization: Bearer <token>` salvo `POST /api/auth/login`.

---

**`POST /api/auth/login`**

```jsonc
// request
{ "email": "conserje@paralelo29.cl", "password": "demo1234" }
// response 200
{ "token": "...",
  "usuario": { "id": "...", "nombre": "...", "email": "...",
               "perfil": "CONSERJE", "condominio": { "id": "...", "nombre": "...", "codigo": "C29" } } }
```

JWT firmado con HS256, vigencia 8 horas, payload `{ sub, perfil, condominioId }`.

---

**`GET /api/catalogos`**

Devuelve en una sola llamada lo que necesita el formulario de reporte:

```jsonc
{ "categorias": [{ "codigo": "FILTRACION", "nombre": "Filtración o daño por agua", "slaHoras": 48 }],
  "ubicaciones": ["Estacionamiento -1", "..."] }
```

---

**`GET /api/usuarios/asignables`**

Perfil requerido: `ADMINISTRADOR`. Devuelve los usuarios del condominio con perfil `CONSERJE` o
`ADMINISTRADOR`, para poblar el selector de responsable.

---

**`GET /api/incidentes`**

Query opcional: `estado`, `categoria`, `desde` (ISO date), `hasta` (ISO date), `texto`,
`pagina` (por defecto 1), `porPagina` (por defecto 20, máximo 100).

`texto` busca, sin distinguir mayúsculas, en `folio` y en `descripcion`.
Orden por `fechaRegistro` descendente.
Aplica RN-10 y RN-11.

```jsonc
{ "datos": [ { "id": "...", "folio": "C29-2026-0043", "categoria": { "codigo": "...", "nombre": "..." },
               "descripcion": "...", "ubicacionTexto": "...", "estado": "ASIGNADO",
               "fechaHecho": "...", "fechaRegistro": "...", "fechaLimite": "...", "fechaCierre": null,
               "reportante": { "id": "...", "nombre": "..." },
               "responsable": { "id": "...", "nombre": "..." },
               "cantidadEvidencias": 2, "vencido": false, "horasRestantes": 19.5 } ],
  "total": 37, "pagina": 1, "porPagina": 20 }
```

---

**`POST /api/incidentes`** — `multipart/form-data`

Campos: `categoriaCodigo`, `descripcion` (10 a 2000 caracteres), `ubicacionTexto`,
`fechaHecho` (ISO), `latitud` opcional, `longitud` opcional, `fotos` (0 a 5 archivos).

Restricciones de archivo: `image/jpeg`, `image/png`, `image/webp`; máximo 5 MB cada uno.
Otro tipo o tamaño devuelve `ARCHIVO_INVALIDO`.

Comportamiento, todo dentro de una transacción:
1. Valida `fechaHecho` (RN-07).
2. Genera folio (RN-08).
3. Calcula `fechaLimite` (RN-09).
4. Crea el incidente en estado `INGRESADO`.
5. Persiste cada archivo en `almacenamiento/{incidenteId}/{uuid}.{ext}`, calculando SHA-256 (RN-13).
6. Inserta la entrada inicial de bitácora con `estadoAnterior = null`, `estadoNuevo = INGRESADO`,
   `observacion = "Incidente reportado"`.

Tras confirmar la transacción, y solo si llegaron coordenadas, dispara la geocodificación inversa
y actualiza `direccionGeocodificada` (RN-14).

Respuesta 201 con el detalle completo del incidente.

---

**`GET /api/incidentes/:id`**

```jsonc
{ "id": "...", "folio": "C29-2026-0043",
  "categoria": {...}, "descripcion": "...", "ubicacionTexto": "...",
  "latitud": -33.4172, "longitud": -70.6056, "direccionGeocodificada": "Av. Providencia 1234, Providencia",
  "fechaHecho": "...", "fechaRegistro": "...", "fechaLimite": "...", "fechaCierre": null,
  "estado": "ASIGNADO", "vencido": false, "horasRestantes": 19.5,
  "reportante": {...}, "responsable": {...},
  "transicionesPosibles": ["EN_EJECUCION"],
  "evidencias": [ { "id": "...", "nombreOriginal": "filtracion-1.jpg", "mime": "image/jpeg",
                    "tamanoBytes": 824113, "hashSha256": "9f2b...", "creadoEn": "...",
                    "subidoPor": { "id": "...", "nombre": "..." },
                    "url": "/api/evidencias/{id}/archivo" } ],
  "bitacora": [ { "id": "...", "estadoAnterior": null, "estadoNuevo": "INGRESADO",
                  "observacion": "Incidente reportado", "creadoEn": "...",
                  "usuario": { "id": "...", "nombre": "...", "perfil": "CONSERJE" } } ] }
```

`transicionesPosibles` se calcula combinando la máquina de estados con el perfil del solicitante,
de modo que la interfaz solo deba renderizar botones.
La bitácora se ordena ascendente por `creadoEn`.

---

**`POST /api/incidentes/:id/transiciones`**

```jsonc
{ "estadoDestino": "ASIGNADO", "responsableId": "uuid-opcional", "observacion": "..." }
```

Valida RN-01, RN-02, RN-03, RN-04 y la matriz de permisos de 3.5. Dentro de una transacción
actualiza el incidente, fija `fechaCierre` cuando el destino es `CERRADO`, e inserta la bitácora
(RN-05). Devuelve el detalle actualizado.

---

**`PATCH /api/incidentes/:id/responsable`**

```jsonc
{ "responsableId": "uuid", "observacion": "..." }
```

Perfil requerido: `ADMINISTRADOR`. Aplica RN-06.

---

**`POST /api/incidentes/:id/evidencias`** — `multipart/form-data`, campo `fotos`

Mismas restricciones de archivo. Rechaza si el incidente está en estado terminal.
Inserta además una entrada de bitácora con `estadoAnterior = estadoNuevo = estado actual` y
observación `"Se adjuntaron N evidencias"`.

---

**`GET /api/evidencias/:id/archivo`**

Entrega el binario con su `Content-Type` real. Verifica permisos de acceso al incidente padre
antes de servirlo. **NO** exponer el directorio de almacenamiento como estático.

---

**`GET /api/incidentes/:id/expediente.pdf`**

Perfil requerido: `CONSERJE` o `ADMINISTRADOR`.
Devuelve `application/pdf` con
`Content-Disposition: attachment; filename="expediente-{folio}.pdf"`.
Contenido especificado en la sección 7.

---

**`GET /api/metricas`**

Perfil requerido: `ADMINISTRADOR`. Query opcional `desde`, `hasta`; por defecto, los últimos 90 días.

```jsonc
{ "periodo": { "desde": "...", "hasta": "..." },
  "totalIncidentes": 37,
  "porEstado": { "INGRESADO": 3, "EN_REVISION": 2, "ASIGNADO": 4,
                 "EN_EJECUCION": 5, "CERRADO": 21, "RECHAZADO": 2 },
  "porCategoria": [ { "codigo": "FILTRACION", "nombre": "...", "cantidad": 9 } ],
  "tiempoPromedioResolucionHoras": 31.4,
  "porcentajeDentroSla": 81.0,
  "porcentajeConEvidenciaAlCierre": 100.0,
  "abiertosVencidos": 2 }
```

Definiciones exactas:

| Métrica | Cálculo |
|---|---|
| `totalIncidentes` | Incidentes con `fechaRegistro` dentro del período |
| `tiempoPromedioResolucionHoras` | Promedio de `fechaCierre − fechaRegistro` sobre los cerrados en el período, redondeado a un decimal |
| `porcentajeDentroSla` | Cerrados con `fechaCierre <= fechaLimite` dividido por el total de cerrados |
| `porcentajeConEvidenciaAlCierre` | Cerrados con al menos una evidencia dividido por el total de cerrados. Debe dar 100% por RN-03, y esa es justamente la demostración |
| `abiertosVencidos` | No terminales con `fechaLimite < ahora` |

Si el denominador es cero, devolver `null` en lugar de `0`, y la interfaz muestra un guion.

---

## 7. Expediente PDF

Es el entregable que justifica el proyecto completo. Debe verse como un documento formal
presentable a una aseguradora, no como un volcado de datos.

Formato carta, márgenes de 50 puntos, tipografía Helvetica.

**Encabezado**
- Título: `EXPEDIENTE DE INCIDENTE`
- Folio en tamaño destacado
- Nombre y dirección del condominio
- Línea divisoria

**Sección 1 — Identificación del incidente**
Categoría · Ubicación dentro del condominio · Estado actual
Fecha del hecho (declarada) · Fecha de registro en el sistema (asignada automáticamente)
Plazo de atención comprometido · Fecha de cierre, si aplica
Coordenadas geográficas y dirección geocodificada, cuando existan

**Sección 2 — Partes**
Reportante: nombre y perfil · Responsable asignado: nombre y perfil

**Sección 3 — Descripción**
Texto íntegro de la descripción, sin truncar.

**Sección 4 — Evidencia fotográfica**
Por cada archivo: la imagen ajustada a un máximo de 240×240 puntos, y bajo ella, en cuerpo 8,
el nombre original, la fecha y hora de carga, quién la cargó, el tamaño, y el **hash SHA-256
completo**.

**Sección 5 — Bitácora de trazabilidad**
Una entrada por bloque, en orden cronológico ascendente:
`[fecha y hora] — Nombre del usuario (Perfil)` seguido de `Estado anterior → Estado nuevo` y la
observación.

**Pie de página en todas las hojas**
`Expediente emitido el {fecha y hora} por {usuario} · {folio} · Página N de M`
y la leyenda:
*"Documento generado automáticamente por el Sistema de Gestión y Reporte de Incidentes. El hash
SHA-256 de cada archivo permite verificar que la evidencia aquí incorporada no ha sido alterada
desde su registro."*

Todas las fechas se formatean con `Intl.DateTimeFormat('es-CL')` en zona horaria
`America/Santiago`, con formato `dd-MM-yyyy HH:mm`.

---

## 8. Especificación del frontend

### 8.1 Lineamientos de interfaz

Diseño sobrio, de herramienta de trabajo, no de producto de consumo. Paleta neutra con un color
de acento azul oscuro. Tipografía del sistema. Sin animaciones decorativas.

Responsiva de verdad: la bandeja es tabla desde 768 px y lista de tarjetas por debajo. El
formulario de reporte se usa con una mano en un teléfono, porque el usuario real es un conserje
de pie frente al incidente.

Colores de estado:

| Estado | Color |
|---|---|
| `INGRESADO` | gris |
| `EN_REVISION` | ámbar |
| `ASIGNADO` | azul |
| `EN_EJECUCION` | índigo |
| `CERRADO` | verde |
| `RECHAZADO` | rojo tenue |

Semáforo de SLA, aplicable solo a incidentes no terminales:

| Condición | Indicador |
|---|---|
| Queda más del 50% del plazo | Verde, `En plazo` |
| Queda entre 0% y 50% | Ámbar, `Por vencer` |
| `fechaLimite` superada | Rojo, `Vencido` |

### 8.2 Pantallas

**`/login` — Inicio de sesión**
Correo y contraseña. Bajo el formulario, un recuadro con las tres cuentas de demostración y sus
contraseñas, para que la presentación no dependa de recordarlas. Error de credenciales en línea,
sin alertas del navegador.

**`/incidentes` — Bandeja**
Pantalla por defecto tras autenticarse.
Barra de filtros: estado, categoría, rango de fechas, búsqueda por texto. Los filtros se reflejan
en la query string, de modo que la vista sea recargable y compartible.
Columnas: folio, categoría, descripción truncada, ubicación, estado, responsable, semáforo de SLA.
Botón primario `Reportar incidente`. Estado vacío explicativo cuando no hay resultados.
Paginación simple de anterior y siguiente.

**`/incidentes/nuevo` — Reportar incidente**
Campos en este orden: categoría (mostrando el SLA al seleccionar), descripción, ubicación, fecha
y hora del hecho (por defecto el momento actual), botón `Usar mi ubicación` que invoca la
Geolocation API y muestra las coordenadas obtenidas, y carga de hasta cinco fotografías con
previsualización y opción de quitar antes de enviar.
La denegación del permiso de ubicación no bloquea el envío; se informa discretamente.
Al guardar, navega al detalle mostrando el folio asignado en un aviso destacado.

**`/incidentes/:id` — Detalle**
Encabezado con folio, etiqueta de estado y semáforo de SLA.
Bloque de datos del incidente.
Mapa embebido de OpenStreetMap mediante `iframe` cuando hay coordenadas, más la dirección
geocodificada y un enlace para abrir la ubicación en una pestaña nueva.
Galería de evidencia; al pulsar una imagen se abre en tamaño completo mostrando su hash.
Bitácora en formato de línea de tiempo vertical.
Barra de acciones construida a partir de `transicionesPosibles`: un botón por transición,
más `Reasignar responsable` y `Descargar expediente` según perfil.
Carga de evidencia adicional cuando el incidente no está en estado terminal.

**Modal de transición**
Muestra el estado destino, el selector de responsable cuando el destino es `ASIGNADO`, y el campo
de observación obligatorio con contador de caracteres. Si el backend rechaza por regla de
negocio, el mensaje se muestra dentro del modal sin perder lo escrito.

**`/metricas` — Panel**
Solo administrador. Cuatro tarjetas destacadas: total del período, tiempo promedio de resolución,
porcentaje dentro de SLA y porcentaje con evidencia al cierre. Debajo, desglose por estado y por
categoría como barras horizontales simples en HTML y CSS, sin librería de gráficos. Selector de
rango de fechas.

### 8.3 Comportamiento transversal

- El token se guarda en `localStorage` bajo la clave `incidentes.token` y se inyecta en cada
  petición desde un único `cliente.ts`.
- Una respuesta 401 limpia la sesión y redirige a `/login`.
- `RutaProtegida` exige sesión; acepta además una lista de perfiles permitidos y redirige a la
  bandeja cuando el perfil no corresponde.
- Toda vista con datos remotos maneja de forma explícita sus tres estados: cargando, error con
  botón de reintento, y vacío.
- El mensaje de error que se muestra al usuario es siempre el campo `mensaje` que entrega la API.

---

## 9. Datos precargados (seed)

El seed es parte del entregable y es lo que hace demostrable el sistema. Debe ser idempotente.

**Condominio**
`C29` — Condominio Parque Oriente, Av. Providencia 1234, Providencia, Santiago.

**Categorías y ubicaciones:** las de las secciones 3.6 y 3.7.

**Usuarios** (contraseña `demo1234` para todos):

| Nombre | Email | Perfil |
|---|---|---|
| Carla Jiménez | `residente@paralelo29.cl` | `RESIDENTE` |
| Luis Meneses | `conserje@paralelo29.cl` | `CONSERJE` |
| Patricia Rojas | `admin@paralelo29.cl` | `ADMINISTRADOR` |
| Héctor Salas | `conserje2@paralelo29.cl` | `CONSERJE` |
| Daniel Fuentes | `residente2@paralelo29.cl` | `RESIDENTE` |

**Incidentes históricos: 32 registros**, distribuidos en los 90 días anteriores a la fecha de
ejecución del seed, con esta composición:

- 21 en estado `CERRADO`, de los cuales **17 cerrados dentro del SLA y 4 fuera**, para que
  `porcentajeDentroSla` resulte cercano a 81% y el panel no muestre un 100% irreal.
- 2 en `RECHAZADO`, con motivo registrado.
- 9 abiertos repartidos entre `INGRESADO`, `EN_REVISION`, `ASIGNADO` y `EN_EJECUCION`, de los
  cuales **2 con `fechaLimite` ya superada**, para que el semáforo rojo aparezca en la bandeja.
- Todos los cerrados tienen al menos una evidencia, por RN-03.
- Distribución por categoría desbalanceada de forma realista: predominan filtraciones y daños en
  áreas comunes.
- Cada incidente tiene su bitácora completa y coherente, con marcas de tiempo crecientes y
  usuarios verosímiles según el perfil que podía ejecutar cada transición.
- Las descripciones son textos realistas de condominio, no texto de relleno. Por ejemplo:
  *"Filtración en el cielo del estacionamiento -2, bajo la jardinera del patio central. El agua
  cae sobre dos estacionamientos y hay mancha de humedad de aproximadamente un metro."*

**Evidencia del seed:** generar imágenes JPEG sintéticas pequeñas (por ejemplo, 800×600 de color
plano con el folio escrito encima) mediante un script, para que la galería y el PDF tengan
contenido sin depender de archivos externos. Sus hashes se calculan igual que los de las cargas
reales.

---

## 10. Puesta en marcha

### 10.1 Variables de entorno

`.env.example` en la raíz, documentado:

```
DATABASE_URL=postgresql://incidentes:incidentes@localhost:5432/incidentes
JWT_SECRET=cambiar-en-produccion
JWT_EXPIRACION=8h
PUERTO_API=3000
DIRECTORIO_ALMACENAMIENTO=./almacenamiento
TAMANO_MAXIMO_ARCHIVO_MB=5
MAXIMO_ARCHIVOS_POR_CARGA=5
NOMINATIM_URL=https://nominatim.openstreetmap.org/reverse
NOMINATIM_USER_AGENT=FolioSpA-Incidentes/1.0
ZONA_HORARIA=America/Santiago
```

La configuración se valida al arrancar con `@nestjs/config` y un esquema de validación. Si falta
una variable obligatoria, la aplicación **MUST** fallar en el arranque con un mensaje claro, no
arrancar a medias.

### 10.2 Scripts de la raíz

```jsonc
{
  "scripts": {
    "preparar":    "npm install && npm run construir -w @incidentes/compartido && docker compose up -d && npm run bd:migrar -w @incidentes/api && npm run bd:seed -w @incidentes/api",
    "dev":         "npm run construir -w @incidentes/compartido && concurrently -n api,web -c blue,green \"npm run dev -w @incidentes/api\" \"npm run dev -w @incidentes/web\"",
    "construir":   "npm run construir --workspaces --if-present",
    "probar":      "npm run probar -w @incidentes/api",
    "lint":        "npm run lint --workspaces --if-present"
  }
}
```

Objetivo: que `npm run preparar && npm run dev` deje el sistema operativo y con datos desde un
clon limpio. Nada más debe ser necesario.

### 10.3 Vite

`apps/web/vite.config.ts` define un proxy de `/api` hacia `http://localhost:3000`, de modo que el
frontend nunca maneje una URL absoluta de API.

### 10.4 README

Debe contener, en este orden: qué es el sistema en tres frases, requisitos previos, los dos
comandos de puesta en marcha, las credenciales de demostración, el mapa de carpetas del
monorepo, y un apartado "Decisiones de diseño" que recoja de forma resumida las justificaciones
de 4.1 y las reglas RN-03, RN-12 y RN-13, que son las que un evaluador va a preguntar.

---

## 11. Criterios de aceptación

Cada criterio debe poder verificarse manualmente en la aplicación corriendo.

| ID | Criterio |
|---|---|
| CA-01 | Las tres cuentas de demostración inician sesión y aterrizan en la bandeja |
| CA-02 | Un residente autenticado ve exclusivamente los incidentes que él reportó |
| CA-03 | Al crear un incidente, el sistema devuelve un folio con formato `C29-2026-NNNN` y el correlativo avanza de a uno |
| CA-04 | La fecha de registro la fija el servidor; enviarla desde el cliente no la altera |
| CA-05 | Una `fechaHecho` futura o con más de 30 días de antigüedad se rechaza con `FECHA_HECHO_INVALIDA` |
| CA-06 | Intentar pasar de `INGRESADO` a `CERRADO` se rechaza con `TRANSICION_INVALIDA` |
| CA-07 | Intentar pasar a `ASIGNADO` sin responsable se rechaza con `RESPONSABLE_REQUERIDO` |
| CA-08 | Intentar cerrar un incidente sin evidencia se rechaza con `CIERRE_SIN_EVIDENCIA`, y el mensaje se ve en el modal |
| CA-09 | Tras adjuntar una fotografía, el mismo cierre tiene éxito |
| CA-10 | Un conserje no ve el botón de asignar responsable, y si invoca el endpoint directamente recibe `PERFIL_NO_AUTORIZADO` |
| CA-11 | Cada transición agrega exactamente una entrada de bitácora, con usuario, estados y observación |
| CA-12 | Ejecutar `UPDATE` o `DELETE` sobre `bitacora` desde `psql` falla con la excepción del trigger |
| CA-13 | La ficha de evidencia muestra un hash SHA-256 que coincide con el del archivo original calculado por fuera |
| CA-14 | Al reportar con permiso de ubicación concedido, el detalle muestra coordenadas, dirección geocodificada y mapa |
| CA-15 | Denegar el permiso de ubicación no impide reportar el incidente |
| CA-16 | Dejar Nominatim inalcanzable no impide crear el incidente ni produce error visible al usuario |
| CA-17 | El expediente PDF descarga con las cinco secciones, las imágenes visibles, los hashes completos y la numeración de páginas |
| CA-18 | Los filtros de la bandeja se reflejan en la URL y la vista se reconstruye al recargar |
| CA-19 | El semáforo muestra al menos un incidente vencido en rojo con los datos del seed |
| CA-20 | El panel de métricas muestra `porcentajeConEvidenciaAlCierre` igual a 100% y `porcentajeDentroSla` distinto de 100% |
| CA-21 | La aplicación es usable en un viewport de 390×844 px: sin desbordes horizontales y con objetivos táctiles de al menos 44 px |
| CA-22 | `npm run probar` pasa en verde |
| CA-23 | `npm run construir` compila sin errores ni advertencias de TypeScript |

### 11.1 Pruebas automatizadas mínimas

**Unitarias, sobre `incidentes/dominio/`:**
- `maquina-estados.spec.ts`: cada transición válida se acepta; una muestra representativa de
  inválidas se rechaza; los estados terminales no admiten salida.
- `folio.spec.ts`: formato con relleno de ceros; correlativo 1 produce `0001`; correlativo 9999
  produce `9999`.
- `sla.spec.ts`: cálculo de `fechaLimite`; clasificación del semáforo en los tres tramos;
  detección de vencimiento.

**End to end, un solo flujo completo:**
Autenticarse como administrador → crear incidente → verificar folio → transitar a `EN_REVISION`
→ transitar a `ASIGNADO` con responsable → transitar a `EN_EJECUCION` → intentar `CERRADO` y
esperar 409 → adjuntar evidencia → `CERRADO` con éxito → descargar el expediente y verificar
HTTP 200 con `content-type: application/pdf`.

---

## 12. Guion de demostración

La versión está terminada cuando esta secuencia corre completa y sin incidentes, en una sola toma:

1. Entrar como **conserje** (`conserje@paralelo29.cl`). Mostrar la bandeja con los 32 incidentes
   del seed y un vencido en rojo.
2. Reportar una filtración: categoría, descripción, ubicación `Estacionamiento -2`, fecha del
   hecho, conceder ubicación, adjuntar dos fotografías.
3. Mostrar el **folio asignado** en el aviso de confirmación.
4. Abrir el detalle: coordenadas, dirección geocodificada, mapa, evidencia con hash, bitácora con
   la entrada inicial.
5. Cerrar sesión y entrar como **administrador** (`admin@paralelo29.cl`).
6. Pasar el incidente a `EN_REVISION`, luego a `ASIGNADO` designando a Luis Meneses, luego a
   `EN_EJECUCION`. Mostrar cómo crece la bitácora.
7. **Intentar cerrar un incidente sin evidencia** y mostrar el rechazo del sistema. Es el momento
   central de la demostración: la regla de negocio operando en vivo.
8. Adjuntar la evidencia faltante y cerrar con éxito.
9. **Descargar el expediente PDF** y abrirlo en pantalla: encabezado, fotografías, hashes y
   bitácora completa.
10. Abrir el panel de métricas y mostrar los cuatro indicadores del caso de negocio.

---

## 13. Lo que explícitamente no se debe hacer

- **No** agregar funcionalidades que no estén en la sección 2.2, por evidentes que parezcan.
- **No** sustituir ninguna decisión técnica de la sección 4.
- **No** implementar edición ni borrado de incidentes, evidencia o bitácora.
- **No** exponer `passwordHash` ni `rutaArchivo` en ninguna respuesta de la API.
- **No** aceptar `condominioId`, `reportanteId`, `fechaRegistro`, `folio`, `estado` ni
  `fechaLimite` desde el cliente: todos los determina el servidor.
- **No** servir el directorio de almacenamiento como contenido estático.
- **No** usar `any`, `@ts-ignore` ni desactivar reglas de linter para avanzar.
- **No** dejar valores de configuración incrustados en el código: van en el módulo de
  configuración validado.
- **No** crear migraciones manuales de esquema por fuera de Prisma, salvo la migración SQL de
  triggers descrita en 6.2.
