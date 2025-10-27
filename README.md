# ⚙️ API RESTful - Gestión de Protectora de Animales

<div align="center">
  <h3>Servidor Backend con Node.js, Express y MongoDB</h3>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Desplegado%20en%20Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
</p>

---

## 🚀 Despliegue y Funcionalidad

Esta es la API (Backend) que alimenta la aplicación de la protectora, proporcionando la lógica de negocio, la persistencia de datos y el sistema de autenticación.

🔗 **API Live:** [servidor-protectora-bice.vercel.app](https://servidor-protectora-bice.vercel.app/)

## ✨ Características Principales

* **Autenticación JWT:** Sistema de registro y login de usuarios mediante JSON Web Tokens (JWT).
* **Gestión de Usuarios:** Rutas protegidas para la gestión y actualización de perfiles de usuario.
* **Base de Datos NoSQL:** Conexión y gestión de datos de usuarios y animales a través de **MongoDB**.
* **CRUD de Datos:** Permite crear, leer, actualizar y eliminar (`C.R.U.D.`) información sobre animales.

## 🔑 Endpoints Clave

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Crea un nuevo usuario. | Público |
| `POST` | `/api/auth/login` | Autentica al usuario y devuelve un token JWT. | Público |
| `GET` | `/api/animals` | Obtiene la lista de animales disponibles. | Público |
| `POST` | `/api/animals` | Crea un nuevo registro de animal. | Protegido (Admin) |
| `GET` | `/api/users/profile` | Obtiene el perfil del usuario autenticado. | Protegido (Usuario) |

---



El servidor estará corriendo en `http://localhost:3000` (o el puerto que hayas definido).

---
