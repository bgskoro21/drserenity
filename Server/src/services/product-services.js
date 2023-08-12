import { prismaClient } from "../application/database.js";
import { ResponseError } from "../err/response-error.js";
import { getCategoryByIdValidation } from "../validation/category-validation.js";
import { createProductsValidation, getDetailProductsValidation, getProductsValidation, searchProductsValidation, updateProductsValidation } from "../validation/products-validation.js";
import { validate } from "../validation/validation.js";
import fs from "fs";

const checkCategoryMustExist = async (category_id) => {
  category_id = validate(getCategoryByIdValidation, category_id);

  const totalCategoryInDatabase = await prismaClient.kategori.count({
    where: {
      id: category_id,
    },
  });

  if (totalCategoryInDatabase !== 1) {
    throw new ResponseError(404, "Category not found!");
  }

  return category_id;
};

const create = async (request) => {
  request = validate(createProductsValidation, request);

  return prismaClient.products.create({
    data: request,
    select: {
      id: true,
      name: true,
      prices: true,
      picture: true,
      description: true,
    },
  });
};

const getAll = async (request) => {
  request = validate(getProductsValidation, request);
  const skip = (request.page - 1) * request.size;

  const products = await prismaClient.products.findMany({
    take: request.size,
    skip: skip,
  });

  const totalProducts = await prismaClient.products.count();
  return {
    data: products,
    paging: {
      page: request.page,
      total_item: totalProducts,
      total_page: Math.ceil(totalProducts / request.size),
    },
  };
};

const getProductsByCategory = async (categoryId, request) => {
  categoryId = await checkCategoryMustExist(categoryId);
  request = validate(getProductsValidation, request);

  const skip = (request.page - 1) * request.size;

  const products = await prismaClient.products.findMany({
    where: {
      category_id: categoryId,
    },
    take: request.size,
    skip: skip,
  });

  const totalProducts = await prismaClient.products.count({
    where: {
      category_id: categoryId,
    },
  });

  return {
    data: products,
    paging: {
      page: request.page,
      total_item: totalProducts,
      total_page: Math.ceil(totalProducts / request.size),
    },
  };
};

const getDetail = async (id) => {
  id = validate(getDetailProductsValidation, id);

  const product = await prismaClient.products.findFirst({
    where: {
      id: id,
    },
  });

  if (!product) {
    throw new ResponseError(404, "Product not found!");
  }

  return product;
};

const update = async (request) => {
  request = validate(updateProductsValidation, request);

  const product = await prismaClient.products.findFirst({
    where: {
      id: request.id,
    },
  });

  if (!product) {
    throw new ResponseError(404, "Product not found!");
  }

  if (request.picture) {
    const path = "./public/images/" + product.picture.split("/")[3];
    fs.unlink(path, (err) => {
      if (err) {
        throw new ResponseError(400, "Delete old image failed!");
      } else {
        console.log("Gambar lama berhasil dihapus!");
      }
    });
  }

  return prismaClient.products.update({
    data: request,
    where: {
      id: request.id,
    },
    select: {
      id: true,
      name: true,
      prices: true,
      picture: true,
      description: true,
    },
  });
};

const destroy = async (id) => {
  id = validate(getDetailProductsValidation, id);

  const product = await prismaClient.products.findFirst({
    where: {
      id: id,
    },
  });

  if (!product) {
    throw new ResponseError(404, "Product not found!");
  }

  const path = "./public/images/" + product.picture.split("/")[3];

  fs.unlink(path, (err) => {
    if (err) {
      throw new ResponseError(400, "Delete old image failed!");
    } else {
      console.log("Gambar lama berhasil dihapus!");
    }
  });

  await prismaClient.products.delete({
    where: {
      id: id,
    },
  });

  return "OK";
};

const search = async (request) => {
  request = validate(searchProductsValidation, request);

  const skip = (request.page - 1) * request.size;

  const filters = [];

  if (request.name) {
    filters.push({
      OR: [
        {
          name: {
            contains: request.name,
          },
        },
        {
          category: {
            name: {
              contains: request.name,
            },
          },
        },
      ],
    });
  }

  if (request.prices) {
    filters.push({
      prices: {
        gte: request.prices,
      },
    });
  }

  if (request.description) {
    filters.push({
      description: {
        contains: request.description,
      },
    });
  }

  const products = await prismaClient.products.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
  });

  const totalProducts = await prismaClient.products.count({
    where: {
      AND: filters,
    },
  });

  return {
    data: products,
    paging: {
      page: request.page,
      total_item: totalProducts,
      total_page: Math.ceil(totalProducts / request.size),
    },
  };
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
