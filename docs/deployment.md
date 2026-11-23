# Despliegue en producción

La API y su base de datos corren en **Render**; la web, en **Vercel**. Ambos servicios se
configuran desde archivos del repositorio (`render.yaml` y `vercel.json`), así que el despliegue
se reduce a conectar el repositorio de GitHub y completar dos variables.

```
Navegador ──HTTPS──▶ Vercel (web estática, React)
    │
    └────HTTPS──▶ Render: gpti-incidents-api (NestJS) ──▶ Render: gpti-incidents-db (PostgreSQL 16)
                                   │
                                   └──▶ Nominatim (geocodificación inversa)
```

Las fotografías se guardan en la base de datos (`STORAGE_DRIVER=database`): el disco de los
servicios gratuitos de Render se borra en cada reinicio, y la evidencia no se puede perder.

---

## Requisitos

- El repositorio en GitHub con la rama `main` al día.
- Una cuenta en [Render](https://render.com) y otra en [Vercel](https://vercel.com). Ambas
  permiten entrar con la cuenta de GitHub.

## 1. API y base de datos en Render

1. En Render: **New → Blueprint** y elegir el repositorio `gpti-incidents`.
2. Render lee `render.yaml` y muestra dos recursos: la base `gpti-incidents-db` y el servicio web
   `gpti-incidents-api`. Confirmar con **Apply**.
3. Esperar a que el servicio quede en **Live**. El primer despliegue:
   - instala dependencias y compila (`npm ci --include=dev && npm run build:api`);
   - al arrancar aplica las migraciones, carga los datos de demostración si la base está vacía y
     levanta la API (`npm run start:production -w @incidents/api`).
4. Anotar la URL del servicio, por ejemplo `https://gpti-incidents-api.onrender.com`, y abrir
   `https://<url-de-render>/api/health`. Debe responder `{"status":"ok"}`.

`JWT_SECRET` lo genera Render. El resto de las variables ya viene en `render.yaml`.

## 2. Web en Vercel

1. En Vercel: **Add New → Project** e importar el repositorio `gpti-incidents`.
2. Dejar **Root Directory** en la raíz del repositorio. `vercel.json` define la instalación, el
   build (`npm run build:web`), la carpeta publicada (`apps/web/dist`) y la redirección de las
   rutas de la aplicación a `index.html`.
3. En **Environment Variables** agregar:

   | Variable | Valor |
   |---|---|
   | `VITE_API_URL` | URL de Render del paso 1, sin barra final |
   | `TIME_ZONE` | `America/Santiago` |

4. **Deploy** y anotar la URL pública, por ejemplo `https://gpti-incidents.vercel.app`.

## 3. Permitir el origen de la web en la API

`render.yaml` deja `CORS_ORIGINS=https://gpti-incidents.vercel.app`. Si Vercel asignó otra URL:
en Render, servicio `gpti-incidents-api` → **Environment** → editar `CORS_ORIGINS` con la URL de
Vercel (sin barra final; varias se separan con coma) → **Save Changes**. Render vuelve a desplegar
solo.

## 4. Probar

Abrir la URL de Vercel y entrar con cualquiera de las cuentas. Todas usan la contraseña
**`demo1234`**:

| Nombre | Correo | Perfil |
|---|---|---|
| Carla Jiménez | `residente@paralelo29.cl` | Residente |
| Luis Meneses | `conserje@paralelo29.cl` | Conserje |
| Patricia Rojas | `admin@paralelo29.cl` | Administrador |
| Héctor Salas | `conserje2@paralelo29.cl` | Conserje |
| Daniel Fuentes | `residente2@paralelo29.cl` | Residente |

Con HTTPS, la geolocalización del navegador funciona también desde el celular.

---

## Antes de una presentación

- **Despertar la API.** El plan gratuito de Render duerme el servicio tras unos 15 minutos sin
  uso y tarda cerca de un minuto en volver. Abrir `/api/health` unos minutos antes.
- **Refrescar los datos de demostración.** Las fechas del seed se calculan respecto del momento
  en que se cargan, así que con los días los plazos abiertos aparecen vencidos. Para recargarlos
  desde un computador con el repositorio:
  1. En Render: base `gpti-incidents-db` → **Connect** → copiar la **External Database URL**.
  2. Desde la raíz del repositorio:

     ```bash
     STORAGE_DRIVER=database DATABASE_URL="<external-database-url>" npm run db:reset
     ```

     Recrea el esquema, aplica las migraciones y carga el seed con las fotografías en la base.
     Las sesiones abiertas dejan de valer: hay que volver a entrar.
- **Vigencia de la base gratuita.** Render da de baja las bases gratuitas pasado un plazo (hoy,
  30 días desde su creación). Conviene crear el Blueprint cerca de la fecha de entrega.

## Variables de producción

| Variable | Dónde | Valor |
|---|---|---|
| `DATABASE_URL` | Render | La toma de `gpti-incidents-db` |
| `JWT_SECRET` | Render | Generado por Render |
| `STORAGE_DRIVER` | Render | `database` |
| `API_PORT` | Render | `10000`, el puerto que Render espera |
| `CORS_ORIGINS` | Render | URL de Vercel |
| `TRUST_PROXY_HOPS` | Render | `1`: Render antepone un proxy, necesario para identificar al cliente en el límite de intentos |
| `LOGIN_MAX_ATTEMPTS_PER_MINUTE` | Render | `10` |
| `VITE_API_URL` | Vercel | URL de Render |
| `TIME_ZONE` | Render y Vercel | `America/Santiago` |

## Problemas frecuentes

| Síntoma | Causa y solución |
|---|---|
| La web muestra "No se pudo conectar con el servidor" | La API está despertando (esperar un minuto) o `VITE_API_URL` está mal escrita. Corregirla en Vercel y volver a desplegar |
| La consola del navegador muestra un error de CORS | `CORS_ORIGINS` en Render no coincide exactamente con la URL de Vercel |
| El build de Vercel falla con `TIME_ZONE is not defined` | Falta la variable `TIME_ZONE` en Vercel |
| Recargar una ruta como `/incidents` da 404 | No se está usando `vercel.json`: revisar que **Root Directory** sea la raíz del repositorio |
| El inicio de sesión responde "Demasiados intentos…" | Se superó el límite de intentos por minuto: esperar un minuto |
