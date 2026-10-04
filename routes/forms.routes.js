const express = require("express");
const {
  getForm,
  getFormById,
  postForm,
  putForm,
  deleteForm,
} = require("../controllers/forms.controller");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

/**
 * @openapi
 * /form:
 *   get:
 *     tags:
 *       - Formularios
 *     summary: Lista los formularios del usuario autenticado
 *     description: Un usuario solo ve los suyos; un admin ve todos.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de formularios (con el usuario populado)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdoptionForm'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", isAuth, getForm);

/**
 * @openapi
 * /form/{id}:
 *   get:
 *     tags:
 *       - Formularios
 *     summary: Obtiene un formulario por su ID
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
 *         description: Datos del formulario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdoptionForm'
 *       403:
 *         description: El formulario no pertenece al usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Formulario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", isAuth, getFormById);

/**
 * @openapi
 * /form:
 *   post:
 *     tags:
 *       - Formularios
 *     summary: Crea un formulario de adopción
 *     description: El usuario se toma de la cookie de sesión, no del cuerpo.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdoptionFormInput'
 *     responses:
 *       201:
 *         description: Formulario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdoptionForm'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", isAuth, postForm);

/**
 * @openapi
 * /form/{id}:
 *   put:
 *     tags:
 *       - Formularios
 *     summary: Actualiza un formulario
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdoptionFormInput'
 *     responses:
 *       200:
 *         description: Formulario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdoptionForm'
 *       403:
 *         description: El formulario no pertenece al usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", isAuth, putForm);

/**
 * @openapi
 * /form/{id}:
 *   delete:
 *     tags:
 *       - Formularios
 *     summary: Elimina un formulario
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
 *         description: Formulario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdoptionForm'
 *       403:
 *         description: El formulario no pertenece al usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", isAuth, deleteForm);

module.exports = router;
