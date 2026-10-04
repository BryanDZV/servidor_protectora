// Expresiones regulares declaradas fuera para que se compilen una sola vez (Mejor rendimiento)
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$/;

const validationEmail = (email) => {
  return EMAIL_REGEX.test(String(email).toLowerCase());
};

/**
 * Valida que la contraseña tenga entre 8 y 12 caracteres,
 * y al menos una minúscula, una mayúscula, un número y un carácter especial.
 */
const validationPassword = (password) => {
  return PASSWORD_REGEX.test(String(password));
};

module.exports = { validationEmail, validationPassword };
