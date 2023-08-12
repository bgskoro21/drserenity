import categoryServices from "../services/category-services.js";

const create = async (req, res, next) => {
  try {
    const request = req.body;
    const file = req.file;
    if (file) {
      const filePath = process.env.APP_URL + "/" + file.filename;
      request.picture = filePath;
    }
    const result = await categoryServices.create(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getAllCategory = async (req, res, next) => {
  try {
    const result = await categoryServices.getAllCategory();
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await categoryServices.getCategoryById(id);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = req.body;
    const file = req.file;
    if (file) {
      const path = process.env.APP_URL + "/" + file.filename;
      request.picture = path;
    }
    request.id = id;
    const result = await categoryServices.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    await categoryServices.destroy(id);
    res.status(200).json({ data: "OK" });
  } catch (e) {
    next(e);
  }
};

export default {
  create,
  getAllCategory,
  getCategoryById,
  update,
  destroy,
};
