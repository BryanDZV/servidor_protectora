const express = require("express");
const {
  getForm,
  getFormById,
  postForm,
  putForm,
  deleteForm,
} = require("../controllers/forms.controller");

const router = express.Router();

router.get("/", getForm);
router.get("/:id", getFormById);

router.post("/register", postForm);
router.post("/insertMany", postForm);

router.put("/:id", putForm);

router.delete("/:id", deleteForm);

module.exports = router;
