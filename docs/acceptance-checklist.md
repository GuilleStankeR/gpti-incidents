# Checklist de criterios de aceptación

Verificación de los criterios de la sección 11 de `ESPECIFICACION-MVP.md` sobre la aplicación
corriendo en local con los datos del seed (`npm start`). Los códigos de error se nombran según el
glosario de `CLAUDE.md`; entre paréntesis, el nombre de la especificación.

Las pruebas de interfaz se hicieron con Chrome headless (interacción real, capturas a 1440 px y
390 px) y las de API con `curl` y `psql`. La columna "Commit" indica dónde se verificó cada
criterio.

| ID | Criterio | Resultado | Cómo se verificó | Commit |
|---|---|---|---|---|
| CA-01 | Las tres cuentas de demostración inician sesión y aterrizan en la bandeja | ✅ Cumple | Login por API de las tres cuentas; login en la interfaz con redirección a `/incidents` | 08, 20 |
| CA-02 | Un residente ve exclusivamente los incidentes que reportó | ✅ Cumple | `GET /api/incidents` como residente devuelve solo sus 8 incidentes; el detalle de uno ajeno responde 404; la bandeja muestra solo los suyos | 13, 21 |
| CA-03 | El folio tiene formato `C29-2026-NNNN` y el correlativo avanza de a uno | ✅ Cumple | Creaciones sucesivas y ocho simultáneas producen folios consecutivos sin repetir; la interfaz muestra el folio en un aviso destacado | 12, 22 |
| CA-04 | La fecha de registro la fija el servidor | ✅ Cumple | Enviar `reportedAt` o `folio` en la creación no altera los valores asignados | 12 |
| CA-05 | Una fecha del hecho futura o de más de 30 días se rechaza | ✅ Cumple | `INVALID_OCCURRED_AT` (`FECHA_HECHO_INVALIDA`) en ambos casos; la interfaz además lo valida antes de enviar | 12, 22 |
| CA-06 | Pasar de `REPORTED` a `CLOSED` se rechaza | ✅ Cumple | `INVALID_TRANSITION` (`TRANSICION_INVALIDA`); tampoco se reabre un rechazado | 14 |
| CA-07 | Pasar a `ASSIGNED` sin responsable se rechaza | ✅ Cumple | `ASSIGNEE_REQUIRED` (`RESPONSABLE_REQUERIDO`) desde la API; la interfaz marca el campo antes de enviar | 14, 23 |
| CA-08 | Cerrar sin evidencia se rechaza y el mensaje se ve en el modal | ✅ Cumple | `CLOSURE_WITHOUT_EVIDENCE` (`CIERRE_SIN_EVIDENCIA`); el modal muestra "No se puede cerrar un incidente sin evidencia fotográfica adjunta." y conserva la observación escrita | 14, 23 |
| CA-09 | Tras adjuntar una fotografía, el mismo cierre tiene éxito | ✅ Cumple | Carga desde el panel "Adjuntar evidencia" y cierre exitoso en la interfaz | 15, 23 |
| CA-10 | Un conserje no ve el botón de asignar y el endpoint responde `FORBIDDEN_ROLE` | ✅ Cumple | La interfaz no muestra "Asignar responsable" al conserje; la API responde `FORBIDDEN_ROLE` (`PERFIL_NO_AUTORIZADO`) | 14, 23 |
| CA-11 | Cada transición agrega exactamente una entrada de bitácora | ✅ Cumple | Flujo completo con 6 entradas (incluida la evidencia adjunta); tres transiciones simultáneas producen un solo cambio y una sola entrada | 14, 23 |
| CA-12 | `UPDATE` o `DELETE` sobre la bitácora desde `psql` fallan | ✅ Cumple | `UPDATE`, `DELETE` y `TRUNCATE` sobre `audit_entry` y `evidence` fallan con "Table … is insert-only" | 06 |
| CA-13 | El hash SHA-256 coincide con el del archivo original | ✅ Cumple | El hash de la API coincide con `shasum -a 256` del archivo original y del descargado | 15 |
| CA-14 | Con ubicación concedida, el detalle muestra coordenadas, dirección y mapa | ✅ Cumple | Reporte con geolocalización concedida; el detalle muestra coordenadas, dirección de Nominatim y mapa de OpenStreetMap | 16, 22, 23 |
| CA-15 | Denegar la ubicación no impide reportar | ✅ Cumple | Con el permiso denegado se muestra un aviso discreto y el incidente se crea igual | 22 |
| CA-16 | Nominatim inalcanzable no impide crear el incidente ni muestra errores | ✅ Cumple | Con `NOMINATIM_URL` apuntando a una IP inalcanzable el incidente se crea en ~3 s, sin dirección y sin error visible | 16 |
| CA-17 | El PDF tiene las cinco secciones, imágenes, hashes completos y numeración | ✅ Cumple | PDF revisado página por página (JPEG, PNG y WebP); descarga `expediente-{folio}.pdf` desde la interfaz | 17, 23 |
| CA-18 | Los filtros de la bandeja se reflejan en la URL y sobreviven a la recarga | ✅ Cumple | Estado y búsqueda en la query string; tras recargar se reconstruyen los filtros y los resultados | 21 |
| CA-19 | El semáforo muestra al menos un vencido en rojo con el seed | ✅ Cumple | El seed deja dos incidentes abiertos vencidos, visibles en rojo en la bandeja | 19, 21 |
| CA-20 | Evidencia al cierre en 100 % y dentro de SLA distinto de 100 % | ✅ Cumple | Con el seed: 100 % con evidencia al cierre y 81 % dentro de SLA | 19, 24 |
| CA-21 | Usable a 390×844 px, sin desborde horizontal y con objetivos táctiles de 44 px | ✅ Cumple | Medición automática en cada pantalla a 390 px: desborde 0 px y ningún control interactivo visible menor a 44 px | 20–24 |
| CA-22 | `npm run probar` pasa en verde | ⛔ No aplica | Por decisión del equipo el proyecto no incluye pruebas automatizadas (`CLAUDE.md` §2) | — |
| CA-23 | `npm run build` compila sin errores ni advertencias | ✅ Cumple | Build completo de `shared`, API y web sin errores ni advertencias | 25 |

## Entrega final

Criterios de las capacidades F1 a F6 de `CLAUDE.md` §2.1, verificados sobre el seed actual.

| ID | Criterio | Resultado | Cómo se verificó | Commit |
|---|---|---|---|---|
| CF-01 | Al escribir la descripción se sugiere la categoría y se muestran los términos detectados | ✅ Cumple | Chrome headless a 390 px: una filtración selecciona "Filtración o daño por agua" con «filtra», «agua», «mancha» y «humedad» | 27, 30 |
| CF-02 | La elección manual prevalece y "Usar sugerencia" la restituye | ✅ Cumple | Elegir otra categoría la mantiene aunque se siga escribiendo; el botón (44 px) vuelve a la sugerida | 30 |
| CF-03 | El servidor recalcula y guarda la sugerencia; ignora la que envía el cliente | ✅ Cumple | `POST /api/incidents` con `suggestedCategoryCode=SECURITY` guarda `WATER_LEAK`, la calculada por el servidor | 28 |
| CF-04 | Al asignar o reasignar se sugiere un responsable con su motivo y la elección manual prevalece | ✅ Cumple | Modal de asignación con Luis Meneses preseleccionado y el motivo; al reasignar se excluye al actual; el conserje recibe `FORBIDDEN_ROLE` y un incidente inexistente, 404 | 29, 31 |
| CF-05 | El detalle indica si la categoría fue la sugerida | ✅ Cumple | Etiqueta "Sugerida automáticamente" o "La sugerencia automática era «…»" | 31 |
| CF-06 | El panel muestra el porcentaje de sugerencias de categoría aceptadas | ✅ Cumple | 96,4 % con el seed (27 de 28 sugerencias) | 28, 31, 32 |
| CF-07 | Con `STORAGE_DRIVER=database` la evidencia vive en la base y no se puede modificar | ✅ Cumple | Reporte con fotografía, visor y PDF sin archivos en disco; el hash descargado coincide; `UPDATE stored_file` falla | 33 |
| CF-08 | En una base vacía, el arranque de producción migra, carga el seed y responde el chequeo de salud; un segundo arranque no duplica datos | ✅ Cumple | `start:production` contra una base nueva: 4 migraciones, 32 incidentes, 36 archivos, `{"status":"ok"}`; el segundo arranque omite el seed | 34 |
| CF-09 | CORS solo para el origen configurado y cabeceras de seguridad | ✅ Cumple | El origen permitido recibe `Access-Control-Allow-Origin`; otro origen no; respuestas con `Strict-Transport-Security`, `X-Content-Type-Options` y `Cross-Origin-Resource-Policy` | 34 |
| CF-10 | Límite de intentos de inicio de sesión por cliente | ✅ Cumple | El undécimo intento en un minuto responde `TOO_MANY_REQUESTS` (429); otro cliente entra sin problemas | 34 |
| CF-11 | La web compilada opera contra la API desde otro origen, como en Vercel | ✅ Cumple | Build con `VITE_API_URL` servido en otro puerto: inicio de sesión, reporte con fotografía, evidencia visible y detalle sin errores | 34 |
| CF-12 | La integración continua pasa en verde | ✅ Cumple | GitHub Actions con Node 22 y el npm que trae: `npm ci`, lint, tipos, build, formato y `npm audit` en verde | 35 |
| CF-13 | `npm audit` sin vulnerabilidades | ✅ Cumple | 0 vulnerabilidades tras actualizar Nest 11.2.11, `@nestjs/cli` 12, `typescript-eslint` 8.73 y `eslint-plugin-import-x` 4.18 | 34 |
| CF-14 | Aplicación desplegada en Render y Vercel | ⏳ Pendiente | La ejecuta el equipo con sus cuentas siguiendo `docs/deployment.md` | 36 |

### Momentos nuevos para el guion de demostración

- **Paso 2:** al escribir la descripción de la filtración, la categoría se completa sola y se ven
  los términos detectados. Elegir otra categoría y volver con "Usar sugerencia" muestra que la
  decisión final es del usuario.
- **Paso 6:** el modal "Asignar responsable" abre con Luis Meneses sugerido y el motivo (casos de
  filtración cerrados y carga actual).
- **Paso 10:** el panel suma el indicador de sugerencias de categoría aceptadas.

## Cómo reproducir las verificaciones de base de datos

```bash
docker compose exec postgres psql -U incidents -d incidents \
  -c "UPDATE audit_entry SET note = 'alterado';"
```

Con datos cargados, el comando falla con `ERROR: Table audit_entry is insert-only`.

## Guion de demostración

Los diez pasos de la sección 12 de la especificación se ejecutaron en una sola corrida
automatizada (Chrome headless) sobre un clon limpio del repositorio, levantado con `npm start`
sobre una base vacía:

| Paso | Resultado |
|---|---|
| 1 | El conserje entra y ve la bandeja con los 32 incidentes del seed y dos vencidos en rojo |
| 2 | Reporta una filtración desde un viewport móvil: categoría, descripción, `Estacionamiento -2`, fecha del hecho, ubicación concedida y dos fotografías |
| 3 | El aviso muestra el folio asignado (`C29-2026-0033`) |
| 4 | El detalle muestra mapa, dirección geocodificada, coordenadas, evidencia con hash de 64 caracteres y la bitácora con la entrada inicial |
| 5 | Cierra sesión y entra como administrador |
| 6 | Pasa el incidente a revisión, lo asigna a Luis Meneses y lo inicia; la bitácora crece a 4 entradas |
| 7 | Intenta cerrar el incidente en ejecución sin evidencia del seed (portón vehicular): el modal muestra el rechazo del sistema |
| 8 | Adjunta la evidencia faltante y el cierre tiene éxito |
| 9 | Descarga el expediente PDF (`expediente-{folio}.pdf`) |
| 10 | El panel de métricas muestra los cuatro indicadores, con 100 % de evidencia al cierre |
