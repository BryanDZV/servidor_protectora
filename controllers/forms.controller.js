const formService = require("../services/form.service");
const catchAsync = require("../utils/catchAsync");

const getForm = catchAsync(async (req, res) => {
  const allForms = await formService.getForms();
  return res.status(200).json(allForms);
});

const getFormById = catchAsync(async (req, res) => {
  const myform = await formService.getFormById(req.params.id);
  return res.status(200).json(myform);
});

const postForm = catchAsync(async (req, res) => {
  const inserted = await formService.createForm(req.body);
  return res.status(201).json(inserted);
});

const putForm = catchAsync(async (req, res) => {
  const updatedForm = await formService.updateForm(req.params.id, req.body);
  return res.status(200).json(updatedForm);
});

const deleteForm = catchAsync(async (req, res) => {
  const deletedForm = await formService.deleteForm(req.params.id);
  return res.status(200).json(deletedForm);
});

module.exports = {
  getForm,
  getFormById,
  postForm,
  putForm,
  deleteForm,
};
