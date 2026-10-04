# Backend - Protectora de Animales (BFF)

Servidor **Backend for Frontend (BFF)** para una aplicación de adopciones.
El frontend será Angular 21.

Sigue el principio de **única fuente de verdad**:

- **RescueGroups.org** es la única fuente de los **animales** (y de sus fotos).
- **MongoDB** es la única fuente de los **usuarios** y los **formularios**.

El frontend nunca llama a RescueGroups directamente: pide a esta API, que se
encarga de llamar a RescueGroups, normalizar la respuesta y cruzarla con los
datos locales (favoritos, formularios, adopciones).

## Tecnologías

- **Node.js** + **Express** para el servidor
- **MongoDB** + **Mongoose** para usuarios y formularios
- **RescueGroups.org API v2** como fuente de animales
- **JWT** para autenticación de usuarios
- **bcrypt** para guardar contraseñas hasheadas
- **CORS** habilitado para conectar con el frontend
- **Swagger / OpenAPI** para documentar la API (`swagger-jsdoc` + `swagger-ui-express`)
- Preparado para desplegar en **Vercel**

## Qué puede hacer la API

### Animales (fuente: RescueGroups)
- Listar animales **paginados** con filtros (especie, género, edad, tamaño, nombre).
- Ver el detalle de un animal por su ID externo.
- Si llega un token válido, cada animal se enriquece con:
  - `isFavorite`: si está en los favoritos del usuario.
  - `localAdoptionStatus`: estado local derivado de Mongo (`Reservado` si tiene
    formulario, `Adoptado` si está en `pets`, `null` si no hay datos locales).

### Usuarios (fuente: MongoDB)
- Registro y login con email y contraseña.
- Guardar favoritos (`favPets`) y animales en proceso (`inProcessPets`) como IDs externos.
- Ver el perfil con sus solicitudes de adopción.

### Formularios de adopción (fuente: MongoDB)
- Crear un formulario (el usuario sale del token; el animal es un ID externo).
- Consultar, actualizar y eliminar formularios.

### Autenticación
- Al hacer **login o registro** se establece una **cookie `httpOnly`** (`jwt`) con el token.
- El token **no** viaja en el cuerpo ni se guarda en `localStorage` (evita robo por XSS).
- La API también acepta `Authorization: Bearer <token>` como fallback (Swagger/Postman).
- `isAuth` protege las rutas privadas; `isAuthOptional` permite personalizar rutas
  públicas (`GET /animales`) cuando hay sesión.
- `POST /user/logout` elimina la cookie.

## Documentación de la API (Swagger)

Con el servidor arrancado:

- **Swagger UI:** `http://localhost:5002/api-docs`
- **OpenAPI en JSON:** `http://localhost:5002/api-docs.json` (para Postman/Insomnia)

Los endpoints se documentan con comentarios `@openapi` encima de cada ruta y la
configuración (esquemas, seguridad JWT...) está en `docs/swagger.js`.

La autenticación principal es la **cookie `httpOnly`**. Además, la API acepta el
token en `Authorization: Bearer <token>` como **fallback**, pensado para Swagger UI,
Postman o apps móviles.

- **Angular**: se autentica con la cookie (necesita `withCredentials: true`).
- **Swagger/Postman**: pueden usar Bearer. Como el login ya **no** devuelve el token
  en el cuerpo (por seguridad), el token se obtiene del valor de la cookie `jwt`
  (visible en las cabeceras `Set-Cookie` de la respuesta). Pulsa **Authorize** y
  pégalo en el esquema `bearerAuth`.

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/animales` | Opcional | Lista animales de RescueGroups (`?page=&limit=` + filtros) |
| GET | `/animales/:id` | Opcional | Detalle de un animal de RescueGroups |
| POST | `/user/register` | No | Registro (abre sesión con cookie) |
| POST | `/user/login` | No | Login (establece la cookie `jwt`) |
| POST | `/user/logout` | No | Cierra sesión (borra la cookie) |
| GET | `/user/:id` | Sí | Perfil propio (admin: cualquiera) |
| POST | `/user/checksession` | Sí | Devuelve el usuario de la sesión |
| POST | `/user/addfav` | Sí | Actualiza los favoritos del usuario |
| POST | `/user/addAdoption` | Sí | Actualiza los animales en proceso |
| GET | `/form` | Sí | Lista los formularios del usuario (admin: todos) |
| GET | `/form/:id` | Sí | Detalle de un formulario (solo dueño/admin) |
| POST | `/form` | Sí | Crea un formulario (usuario de la sesión) |
| PUT | `/form/:id` | Sí | Actualiza un formulario (solo dueño/admin) |
| DELETE | `/form/:id` | Sí | Elimina un formulario (solo dueño/admin) |
| GET | `/` | No | Comprueba que la API responde |

`GET /animales` devuelve un objeto paginado con cada animal ya normalizado:

```json
{
  "data": [
    {
      "id": "12345",
      "nombre": "Rex",
      "especie": "Perro",
      "genero": "Macho",
      "rangoEdad": "Joven",
      "size": "Mediano",
      "foto": "https://.../rex.jpg",
      "imagenes": ["https://.../rex.jpg"],
      "estadoAdopcion": "Disponible",
      "isFavorite": true,
      "localAdoptionStatus": null
    }
  ],
  "pagination": { "totalItems": 42, "currentPage": 1, "totalPages": 5, "limit": 10 }
}
```

## Cómo está organizado

```
├── config/         # Configuración centralizada (env.js, db.js)
├── models/         # Esquemas de Mongoose (User.js, AdoptionForm.js)
├── controllers/    # Entrada/salida HTTP (animals, users, forms)
├── routes/         # Rutas + documentación Swagger
├── services/       # Lógica de negocio
│   ├── rescueGroups.service.js  # Cliente de la API externa + normalización (DTO)
│   ├── animals.service.js       # Merge BFF (RescueGroups + Mongo)
│   ├── user.service.js
│   └── form.service.js
├── middleware/     # auth (isAuth), isAuthOptional, cors, notFound, errorHandler
├── docs/           # Configuración de Swagger/OpenAPI
├── jwt/            # Generación y verificación de tokens
├── validators/     # Validaciones de email y contraseña
├── utils/          # AppError, catchAsync, seed.utils
├── Data/           # Datos de ejemplo usados por el seed
├── app.js          # Configuración de Express (app reutilizable)
├── seed.js         # Script para poblar usuarios y formularios de prueba
└── script.js       # Punto de entrada (conecta a Mongo y levanta el servidor)
```

Los controllers son finos: solo traducen HTTP ↔ servicio. La lógica vive en los
services. Los errores se lanzan con `AppError` y los centraliza un único
middleware de errores.

## Cómo arrancarlo

1. Clonar el repo
2. Crear un archivo `.env` en la raíz con:
   ```
   DB_URL=tu_url_de_mongodb
   JWT_KEY=una_clave_secreta
   PORT=5002

   # CORS: origin del frontend (Angular). NO es la URL de la API.
   CORS_ORIGINS=http://localhost:4200,https://protectora-orcin.vercel.app

   # Cookie de sesión
   # En local (mismo sitio) vale "strict"; en producción cross-site usa "none" + HTTPS.
   COOKIE_SAMESITE=strict
   JWT_EXPIRES_IN=1d

   # Fuente de animales (RescueGroups API v2)
   RESCUEGROUPS_APIKEY=tu_api_key
   RESCUEGROUPS_API_URL=https://api.rescuegroups.org/http/v2.json
   ```
   > `DB_URL` y `JWT_KEY` son obligatorias. Las de RescueGroups son necesarias
   > para que funcionen los endpoints de animales.
3. Instalar dependencias:
   ```bash
   npm install
   ```
4. Poblar la base de datos con datos de prueba:
   ```bash
   npm run seed
   ```
5. Arrancar en desarrollo:
   ```bash
   npm run dev
   ```
   o en producción:
   ```bash
   npm start
   ```

La app se levanta por defecto en el puerto 5002, o en el que indique `PORT`.

## Sobre los datos de prueba

El seed crea **usuarios y formularios** (los animales no se guardan en Mongo, se
leen de RescueGroups):

- `npm run seed` - genera datos nuevos
- `npm run seed:reset` - limpia las colecciones y vuelve a generar
- `npm run seed:drop` - borra toda la base de datos

Los formularios de prueba apuntan a IDs externos ficticios.

## Notas

- **Animales no viven en Mongo:** se consultan a RescueGroups en cada petición.
  La API key queda solo en el servidor (el frontend nunca la ve).
- `favPets`, `inProcessPets` y `pets` del usuario son **IDs externos** (String), no ObjectIds.
- `AdoptionForm.animalExternalId` es el ID del animal en RescueGroups; tiene índice.
- El **estado local** del animal no se guarda: se **deriva** de los formularios
  (Reservado) y de los `pets` de los usuarios (Adoptado).
- `POST /form` toma el usuario de la **sesión** (cookie), no del cuerpo.
- Los formularios son **privados**: `GET/PUT/DELETE /form/:id` exigen ser el dueño
  (o admin) y devuelven `403` si no lo eres; `GET /form` solo devuelve los tuyos.
- El perfil (`GET /user/:id`) también es privado: solo el propio usuario o un admin
  (evita el IDOR de usuarios).
- **Sesión por cookie `httpOnly`** (`jwt`): el JWT no viaja en el cuerpo ni en
  `localStorage`. Como **fallback** también se acepta `Authorization: Bearer <token>`.
  `app.js` usa `cookie-parser` y CORS con `credentials: true`.
- ⚠️ **Producción cross-site:** si el frontend y el backend están en dominios
  distintos (p. ej. dos subdominios de `vercel.app`), hay que usar
  `COOKIE_SAMESITE=none` **con HTTPS** (`secure`), o el navegador no enviará la cookie.
- Al borrar un formulario se limpian las referencias en `User.info` e `inProcessPets`.
- Los errores se lanzan con `AppError(message, statusCode)` y los traduce
  `middleware/errorHandler.js` (incluye errores de Mongoose). Las rutas no
  encontradas pasan por `middleware/notFound.js`.
- `app.js` configura Express y exporta la app; `script.js` conecta a Mongo y
  levanta el servidor (los tests pueden importar `app.js` sin arrancarlo).
- La configuración está centralizada en `config/`; ningún otro módulo lee `process.env`.
