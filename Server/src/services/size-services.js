import { prismaClient } from "../application/database.js";
import { ResponseError } from "../err/response-error.js";
import { getDetailProductsValidation } from "../validation/products-validation.js";
import { createSizesValidation, getSizesValidation, updateSizesValidation } from "../validation/size-validation.js";
import { validate } from "../validation/validation.js";

const checkProductMustExist = async (product_id) => {
  product_id = validate(getDetailProductsValidation, product_id);

  const totalProductInDatabase = await prismaClient.products.count({
    where: {
      id: product_id,
    },
  });

  if (totalProductInDatabase !== 1) {
    throw new ResponseError(404, "Product not found!");
  }

  return product_id;
};

const create = async (product_id, request) => {
  product_id = await checkProductMustExist(product_id);
  request = validate(createSizesValidation, request);
  request.product_id = product_id;

  return prismaClient.sizes.create({
    data: request,
    select: {
      id: true,
      name: true,
      stock: true,
    },
  });
};

const getByProducts = async (product_id) => {
  product_id = await checkProductMustExist(product_id);

  return prismaClient.sizes.findMany({
    where: {
      product_id: product_id,
    },
  });
};

const getDetailSize = async (product_id, size_id) => {
  product_id = await checkProductMustExist(product_id);
  size_id = validate(getSizesValidation, size_id);

  const size = await prismaClient.sizes.findFirst({
    where: {
      id: size_id,
      product_id: product_id,
    },
  });

  if (!size) {
    throw new ResponseError(404, "Size not found!");
  }

  return size;
};

const update = async (productId, request) => {
  productId = await checkProductMustExist(productId);
  request = validate(updateSizesValidation, request);

  const totalSizesInDatabase = await prismaClient.sizes.count({
    where: {
      id: request.id,
      product_id: productId,
    },
  });

  if (totalSizesInDatabase !== 1) {
    throw new ResponseError(404, "Size not found!");
  }

  request.product_id = productId;

  return prismaClient.sizes.update({
    where: {
      id: request.id,
    },
    data: request,
    select: {
      id: true,
      name: true,
      stock: true,
    },
  });
};

const destroy = async (productId, sizeId) => {
  productId = await checkProductMustExist(productId);
  sizeId = validate(getSizesValidation, sizeId);

  const totalSizeInDatabase = await prismaClient.sizes.count({
    where: {
      id: sizeId,
      product_id: productId,
    },
  });

  if (totalSizeInDatabase !== 1) {
    throw new ResponseError(404, "Size not found!");
  }

  await prismaClient.sizes.delete({
    where: {
      id: sizeId,
    },
  });

  return "OK";
};

export default {
  create,
  getByProducts,
  getDetailSize,
  update,
  destroy,
};
