import { prismaClient } from "../application/database.js";
import { ResponseError } from "../err/response-error.js";
import { createCartValidation, deleteCartValidation } from "../validation/cart-validation.js";
import { validate } from "../validation/validation.js";

const create = async (user, request) => {
  request = validate(createCartValidation, request);

  const totalCartInDatabase = await prismaClient.carts.count({
    where: {
      email: user.email,
      product_id: request.product_id,
    },
  });

  request.email = user.email;
  request.created_at = new Date().toISOString();

  if (totalCartInDatabase === 1) {
    return prismaClient.carts.update({
      where: {
        email: user.email,
        product_id: request.product_id,
      },
      data: request,
      select: {
        id: true,
        email: true,
        product_id: true,
        size_id: true,
        quantity: true,
        created_at: true,
      },
    });
  }

  return prismaClient.carts.create({
    data: request,
    select: {
      id: true,
      email: true,
      product_id: true,
      size_id: true,
      quantity: true,
      created_at: true,
    },
  });
};

const get = async (user) => {
  return prismaClient.carts.findMany({
    where: {
      email: user.email,
    },
  });
};

const destroy = async (user, cartId) => {
  cartId = validate(deleteCartValidation, cartId);

  const totalCartInDatabase = await prismaClient.carts.count({
    where: {
      email: user.email,
      id: cartId,
    },
  });

  if (totalCartInDatabase !== 1) {
    throw new ResponseError(404, "Cart not found!");
  }

  await prismaClient.carts.delete({
    where: {
      id: cartId,
    },
  });

  return "OK";
};

export default {
  create,
  get,
  destroy,
};
