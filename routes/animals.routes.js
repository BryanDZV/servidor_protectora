const express = require("express");
const {
  getAnimals,
  getAnimalById,
} = require("../controllers/animals.controller");
const { isAuthOptional } = require("../middleware/isAuthOptional");

const router = express.Router();

/**
 * @openapi
 * /animales:
 *   get:
 *     tags:
 *       - Animales
 *     summary: Lista animales desde RescueGroups (BFF)
 *     description: >
 *       Obtiene los animales directamente de RescueGroups y los devuelve
 *       normalizados. Si la petición incluye un token válido, cada animal se
 *       enriquece con `isFavorite`. `localAdoptionStatus` se calcula siempre a
 *       partir de los datos locales (formularios y adopciones).
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página (empieza en 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Elementos por página (máximo 100)
 *       - in: query
 *         name: especie
 *         schema:
 *           type: string
 *           enum: [Perro, Gato, Conejo, Caballo, Ave, Reptil]
 *         description: Filtra por especie
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *           enum: [Macho, Hembra]
 *         description: Filtra por género
 *       - in: query
 *         name: rangoEdad
 *         schema:
 *           type: string
 *           enum: [Cachorro, Joven, Adulto, Senior]
 *         description: Filtra por rango de edad
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           enum: [Pequeño, Mediano, Grande]
 *         description: Filtra por tamaño
 *       - in: query
 *         name: texto
 *         schema:
 *           type: string
 *         description: Busca por nombre
 *     responses:
 *       200:
 *         description: Lista paginada de animales
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAnimals'
 *       502:
 *         description: Error contactando con RescueGroups
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", isAuthOptional, getAnimals);

/**
 * @openapi
 * /animales/{id}:
 *   get:
 *     tags:
 *       - Animales
 *     summary: Obtiene un animal por su id externo (RescueGroups)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del animal en RescueGroups
 *     responses:
 *       200:
 *         description: Datos del animal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Animal'
 *       404:
 *         description: Animal no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       502:
 *         description: Error contactando con RescueGroups
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", isAuthOptional, getAnimalById);

module.exports = router;
