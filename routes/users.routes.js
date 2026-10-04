const express = require("express");
const {
  register,
  login,
  logout,
  checkSession,
  getUserById,
  postFav,
  postAdoption,
} = require("../controllers/users.controller");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

/**
 * @openapi
 * /user/register:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Registra un nuevo usuario (y abre sesión)
 *     description: >
 *       Crea el usuario y establece la cookie httpOnly con el JWT.
 *       El token NO se devuelve en el cuerpo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: El email ya está registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/register", register);

/**
 * @openapi
 * /user/login:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Inicia sesión
 *     description: >
 *       Valida las credenciales y establece la cookie httpOnly con el JWT.
 *       El token NO se devuelve en el cuerpo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login correcto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Faltan email o contraseña
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/login", login);

/**
 * @openapi
 * /user/logout:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Cierra la sesión
 *     description: Elimina la cookie httpOnly del token.
 *     responses:
 *       200:
 *         description: Sesión cerrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sesión cerrada correctamente
 */
router.post("/logout", logout);

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtiene un usuario por su ID
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", isAuth, getUserById);

/**
 * @openapi
 * /user/checksession:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Comprueba la sesión actual
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Sin sesión válida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/checksession", isAuth, checkSession);

/**
 * @openapi
 * /user/addfav:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Actualiza los favoritos del usuario autenticado
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               favPets:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["12345", "67890"]
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/addfav", isAuth, postFav);

/**
 * @openapi
 * /user/addAdoption:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Actualiza los animales en proceso del usuario autenticado
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inProcessPets:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["12345"]
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/addAdoption", isAuth, postAdoption);

module.exports = router;
