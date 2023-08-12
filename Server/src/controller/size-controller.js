import sizeServices from "../services/size-services.js";

const create = async (req, res, next) => {
  try {
    const request = req.body;
    const { productId } = req.params;
    const result = await sizeServices.create(productId, request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getByProducts = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await sizeServices.getByProducts(productId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getDetail = async (req, res, next) => {
  try {
    const { productId, sizeId } = req.params;
    const result = await sizeServices.getDetailSize(productId, sizeId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const { productId, sizeId } = req.params;
    const request = req.body;
    request.id = sizeId;
    const result = await sizeServices.update(productId, request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { productId, sizeId } = req.params;
    const result = await sizeServices.destroy(productId, sizeId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  create,
  getByProducts,
  getDetail,
  update,
  destroy,
};
