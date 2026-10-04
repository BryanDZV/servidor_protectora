const formService = require("../services/form.service");
const catchAsync = require("../utils/catchAsync");

const getForm = catchAsync(async (req, res) => {
  const forms = await formService.getForms(req.user);
  return res.status(200).json(forms);
});

const getFormById = catchAsync(async (req, res) => {
  const form = await formService.getFormById(req.params.id, req.user);
  return res.status(200).json(form);
});

const postForm = catchAsync(async (req, res) => {
  const inserted = await formService.createForm(req.user._id, req.body);
  return res.status(201).json(inserted);
});

const putForm = catchAsync(async (req, res) => {
  const updatedForm = await formService.updateForm(
    req.params.id,
    req.user,
    req.body,
  );
  return res.status(200).json(updatedForm);
});

const deleteForm = catchAsync(async (req, res) => {
  const deletedForm = await formService.deleteForm(req.params.id, req.user);
  return res.status(200).json(deletedForm);
});

module.exports = {
  getForm,
  getFormById,
  postForm,
  putForm,
  deleteForm,
};
