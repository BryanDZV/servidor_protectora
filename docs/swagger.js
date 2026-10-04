// Configuración central de Swagger/OpenAPI.
// swagger-jsdoc lee los comentarios @openapi de las rutas y de app.js.
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API Protectora de Animales (BFF)",
      version: "1.0.0",
      description:
        "Backend for Frontend de la protectora. Los animales se obtienen de " +
        "RescueGroups (única fuente) y los usuarios y formularios viven en MongoDB. " +
        "Autenticación mediante JWT.",
    },
    servers: [
      {
        url: "/",
        description: "Servidor actual",
      },
    ],
    tags: [
      { name: "Animales", description: "Animales (fuente: RescueGroups)" },
      { name: "Usuarios", description: "Registro, login y datos de usuario" },
      { name: "Formularios", description: "Formularios de adopción" },
      { name: "Sistema", description: "Estado de la API" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "jwt",
          description:
            "El JWT viaja en una cookie httpOnly llamada `jwt`. Se establece " +
            "automáticamente al hacer login o registro.",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Token JWT en `Authorization: Bearer <token>`. Pensado para " +
            "clientes que no usan cookies (Swagger UI, Postman, apps móviles).",
        },
      },
      schemas: {
        Animal: {
          type: "object",
          description:
            "Animal normalizado desde RescueGroups. `isFavorite` y `localAdoptionStatus` se añaden en el backend.",
          properties: {
            id: { type: "string", example: "12345" },
            nombre: { type: "string", example: "Rex" },
            especie: { type: "string", example: "Perro" },
            genero: { type: "string", example: "Macho" },
            rangoEdad: { type: "string", example: "Joven" },
            fechaNacimiento: {
              type: "string",
              nullable: true,
              example: "2022-05-10",
            },
            size: { type: "string", example: "Mediano" },
            peso: { type: "number", example: 12.5 },
            salud: {
              type: "object",
              properties: {
                vacunado: { type: "boolean", example: true },
                desparasitado: { type: "boolean", example: true },
                sano: { type: "boolean", example: true },
                esterilizado: { type: "boolean", example: false },
                identificado: { type: "boolean", example: false },
                microchip: { type: "boolean", example: true },
              },
            },
            personalidad: {
              type: "array",
              items: { type: "string" },
              example: ["Juguetón", "Cariñoso"],
            },
            historia: { type: "string", example: "Rescatado en la calle..." },
            aSaber: { type: "string", example: "" },
            requisitosAdopcion: { type: "string", example: "" },
            tasaAdopcion: { type: "number", example: 50 },
            permiteEnvio: { type: "boolean", example: true },
            ubicacion: { type: "string", example: "Madrid, Spain" },
            foto: { type: "string", example: "https://rescue.org/rex.jpg" },
            imagenes: {
              type: "array",
              items: { type: "string" },
            },
            estadoAdopcion: {
              type: "string",
              example: "Disponible",
              description: "Estado tal y como lo da RescueGroups.",
            },
            isFavorite: {
              type: "boolean",
              description: "Si el usuario autenticado lo tiene en favoritos.",
            },
            localAdoptionStatus: {
              type: "string",
              nullable: true,
              enum: ["Reservado", "Adoptado", null],
              description:
                "Estado local derivado: Reservado (tiene formulario) o Adoptado (está en pets). null = usar el de RescueGroups.",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65f1c2a4e9b1a2b3c4d5e6f7" },
            name: { type: "string", example: "Ana García" },
            image: { type: "string", example: "https://ejemplo.com/ana.jpg" },
            email: { type: "string", example: "ana@ejemplo.com" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
            favPets: { type: "array", items: { type: "string" } },
            inProcessPets: { type: "array", items: { type: "string" } },
            pets: { type: "array", items: { type: "string" } },
            info: {
              type: "array",
              items: { $ref: "#/components/schemas/AdoptionForm" },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UserInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Ana García" },
            image: { type: "string", example: "https://ejemplo.com/ana.jpg" },
            email: { type: "string", example: "ana@ejemplo.com" },
            password: {
              type: "string",
              format: "password",
              example: "Abc123!x",
              description:
                "Entre 8 y 12 caracteres, con mayúscula, minúscula, número y símbolo.",
            },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "ana@ejemplo.com" },
            password: { type: "string", example: "Abc123!x" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
          },
          description:
            "El JWT no va en el cuerpo: se envía en la cookie httpOnly `jwt`.",
        },
        AdoptionForm: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65f1c2a4e9b1a2b3c4d5e6f7" },
            user: { $ref: "#/components/schemas/User" },
            animalExternalId: { type: "string", example: "12345" },
            telf: { type: "string", example: "600123456" },
            dni: { type: "string", example: "12345678A" },
            direccion: { type: "string", example: "Calle Mayor 1" },
            postal: { type: "number", example: 28001 },
            city: { type: "string", example: "Madrid" },
            petFriendly: { type: "boolean", example: true },
            tieneMascotas: { type: "boolean", example: false },
            tipoVivienda: {
              type: "string",
              enum: ["Piso", "Casa", "Finca"],
              example: "Piso",
            },
            alquilerOCompra: {
              type: "string",
              enum: ["Alquiler", "Propiedad"],
              example: "Alquiler",
            },
            permisoCasero: { type: "boolean", example: true },
            tieneJardin: { type: "boolean", example: false },
            acuerdoVisitas: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AdoptionFormInput: {
          type: "object",
          required: [
            "animalExternalId",
            "telf",
            "dni",
            "direccion",
            "postal",
            "city",
            "petFriendly",
            "tieneMascotas",
            "tipoVivienda",
            "alquilerOCompra",
            "permisoCasero",
            "tieneJardin",
            "acuerdoVisitas",
          ],
          properties: {
            animalExternalId: { type: "string", example: "12345" },
            telf: { type: "string", example: "600123456" },
            dni: { type: "string", example: "12345678A" },
            direccion: { type: "string", example: "Calle Mayor 1" },
            postal: { type: "number", example: 28001 },
            city: { type: "string", example: "Madrid" },
            petFriendly: { type: "boolean", example: true },
            tieneMascotas: { type: "boolean", example: false },
            tipoVivienda: {
              type: "string",
              enum: ["Piso", "Casa", "Finca"],
              example: "Piso",
            },
            alquilerOCompra: {
              type: "string",
              enum: ["Alquiler", "Propiedad"],
              example: "Alquiler",
            },
            permisoCasero: { type: "boolean", example: true },
            tieneJardin: { type: "boolean", example: false },
            acuerdoVisitas: { type: "boolean", example: true },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "boolean", example: true },
            statusCode: { type: "integer", example: 500 },
            message: {
              type: "string",
              example: "Error interno del servidor",
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            totalItems: { type: "integer", example: 42 },
            currentPage: { type: "integer", example: 1 },
            totalPages: { type: "integer", example: 5 },
            limit: { type: "integer", example: 10 },
          },
        },
        PaginatedAnimals: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Animal" },
            },
            pagination: { $ref: "#/components/schemas/Pagination" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./app.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
