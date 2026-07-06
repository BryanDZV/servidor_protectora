# Backend - Protectora de Animales

Este es el servidor de una aplicación para gestionar adopciones de mascotas. La idea es que una protectora pueda publicar animales disponibles, y los usuarios puedan registrarse, guardar favoritos, y rellenar formularios de adopción.

Lo construí con Node.js y Express, usando MongoDB como base de datos. La API expone endpoints para animales, usuarios y formularios, con autenticación por JWT.

## Tecnologías

- **Node.js** + **Express** para el servidor
- **MongoDB** + **Mongoose** para la base de datos
- **JWT** para autenticación de usuarios
- **bcrypt** para guardar contraseñas hasheadas
- **CORS** habilitado para conectar con el frontend
- Preparado para desplegar en **Vercel**

## Qué puede hacer la API

### Animales
- Listar animales con filtros (por especie, edad, tamaño, etc.)
- Ver el detalle de un animal
- Crear, editar y eliminar animales (para admins)

### Usuarios
- Registro y login con email y contraseña
- Guardar animales en favoritos
- Marcar animales como "en proceso de adopción"
- Ver perfil de usuario con sus mascotas, favoritos y formularios

### Formularios de adopción
- Crear un formulario vinculado a un usuario y un animal
- Consultar formularios existentes
- Actualizar o eliminar formularios

### Autenticación
- Al hacer login se devuelve un token JWT
- Algunas rutas están protegidas y requieren el token en el header `Authorization: Bearer <token>`
- El middleware de auth decodifica el token, busca al usuario en la base de datos y lo adjunta a la petición

## Cómo está organizado

```
├── controllers/          # Reciben las peticiones HTTP y devuelven respuestas
├── services/             # Lógica de negocio (crear usuarios, filtrar animales...)
├── models/               # Esquemas de Mongoose (Animal, User, AdoptionForm)
├── routes/               # Define las rutas de la API
├── middleware/           # Auth y CORS
├── jwt/                  # Generación y verificación de tokens
├── validators/           # Validaciones de entrada
├── seed.js               # Script para poblar la base de datos con datos de prueba
└── script.js             # Punto de entrada de la aplicación
```

La arquitectura separa controllers, services y models para que cada capa tenga una responsabilidad clara. Los controllers solo manejan la entrada y salida HTTP, la lógica pesada va en los services.

## Cómo arrancarlo

1. Clonar el repo
2. Crear un archivo `.env` en la raíz con:
   ```
   DB_URL=tu_url_de_mongodb
   JWT_SECRET=una_clave_secreta
   PORT=5002
   ```
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

La app se levanta por defecto en el puerto 5002, o en el que indique la variable `PORT`.

## Sobre los datos de prueba

El script de seed genera usuarios, animales y formularios de adopción aleatorios para poder probar la API sin tener que crear todo a mano. También permite resetear o limpiar la base de datos:

- `npm run seed` - genera datos nuevos
- `npm run seed:reset` - limpia las colecciones y vuelve a generar
- `npm run seed:drop` - borra toda la base de datos

## Notas

- Las contraseñas nunca se guardan en texto plano, siempre hasheadas con bcrypt.
- El middleware de errores captura excepciones de los controllers gracias a un helper `catchAsync` que envuelve las funciones async.
- La conexión a MongoDB está en un módulo aparte (`db.js`) para poder reutilizarla o testearla de forma aislada.
