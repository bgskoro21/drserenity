import { prismaClient } from "../application/database.js";
import { ResponseError } from "../err/response-error.js";
import { checkoutValidation, paymentValidation, updateOrderValidation } from "../validation/order-validation.js";
import { validate } from "../validation/validation.js";
import midtransClient from "midtrans-client";

const calculateTotalAmount = (items) => {
  let totalAmount = 0;
  for (const item of items) {
    totalAmount += item.quantity * item.products.prices;
  }

  return totalAmount;
};

const checkout = async (user, request) => {
  request = validate(checkoutValidation, request);

  const carts = await prismaClient.carts.findMany({
    where: {
      email: user.email,
    },
    select: {
      id: true,
      product_id: true,
      size_id: true,
      email: true,
      quantity: true,
      products: {
        select: {
          prices: true,
        },
      },
    },
  });

  if (!carts) {
    throw new ResponseError(404, "Cart not found!");
  }

  const order = await prismaClient.orders.create({
    data: {
      id: "ORDER-" + new Date().getTime(),
      email: user.email,
      order_date: new Date().toISOString(),
      address: request.address,
      total_amount: calculateTotalAmount(carts),
      detail_order: {
        create: carts.map((item) => ({
          product_id: item.product_id,
          size_id: item.size_id,
          quantity: item.quantity,
          price_per_unit: item.products.prices,
          total_price: item.quantity * item.products.prices,
        })),
      },
    },
    select: {
      id: true,
      order_date: true,
      address: true,
      total_amount: true,
    },
  });

  carts.forEach(async (item) => {
    await prismaClient.carts.deleteMany({
      where: {
        email: user.email,
      },
    });
  });

  return order;
};

const updateStatus = async (user, request) => {
  request = validate(updateOrderValidation, request);

  const totalOrderInDatabase = await prismaClient.orders.count({
    where: {
      email: user.email,
      id: request.id,
    },
  });

  if (totalOrderInDatabase !== 1) {
    throw new ResponseError(404, "Order not found!");
  }

  let status = "";

  if (request.type === "cancel") {
    status = "DIBATALKAN";
  } else if (request.type === "shipping") {
    status = "DIKIRIM";
  } else {
    status = "SELESAI";
  }

  return prismaClient.orders.update({
    where: {
      id: request.id,
    },
    data: {
      status: status,
    },
  });
};

const payment = async (user, orderId) => {
  orderId = validate(paymentValidation, orderId);

  const order = await prismaClient.orders.findFirst({
    where: {
      email: user.email,
      id: orderId,
    },
  });

  if (!order) {
    throw new ResponseError(404, "Order not found!");
  }

  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });

  let parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: order.total_amount,
    },
  };

  return snap.createTransaction(parameter).then((transaction) => {
    // transaction token
    let transactionToken = transaction.token;
    return transactionToken;
  });
};

export default { checkout, updateStatus, payment };
