import productServices from "../services/product-services.js";

const create = async (req, res, next) => {
  try {
    const request = req.body;
    const file = req.file;
    if (file) {
      const filePath = process.env.APP_URL + "/" + file.filename;
      request.picture = filePath;
      delete request.photo;
    }

    const result = await productServices.create(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const request = {
      page: req.query.page,
      size: req.query.size,
    };
    const result = await productServices.getProductsByCategory(categoryId, request);
    res.status(200).json({
      data: result.data,
      paging: {
        page: result.paging.page,
        total_item: result.paging.total_item,
        total_page: result.paging.total_page,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const request = {
      page: req.query.page,
      size: req.query.size,
    };
    const result = await productServices.getAll(request);
    res.status(200).json({
      data: result.data,
      paging: {
        page: result.paging.page,
        total_item: result.paging.total_item,
        total_page: result.paging.total_page,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await productServices.getDetail(id);
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
      const filePath = process.env.APP_URL + "/" + file.filename;
      request.picture = filePath;
    }
    request.id = id;
    const result = await productServices.update(request);
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
    const result = await productServices.destroy(id);
    res.status(200).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const search = async (req, res, next) => {
  try {
    const request = {
      name: req.query.name,
      prices: req.query.prices,
      description: req.query.description,
      page: req.query.page,
      size: req.query.size,
    };

    const result = await productServices.search(request);

    res.status(200).json({
      data: result.data,
      paging: {
        page: result.paging.page,
        total_item: result.paging.total_item,
        total_page: result.paging.total_page,
      },
    });
  } catch (e) {
    next(e);
  }
};

export default {
  create,
  getProductsByCategory,
  getAll,
  getDetail,
  update,
  destroy,
  search,
};
