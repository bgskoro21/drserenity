import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";

const removeTestAdmin = async () => {
  return prismaClient.admin.deleteMany({
    where: {
      username: "test",
    },
  });
};

const creteTestAdmin = async () => {
  return prismaClient.admin.create({
    data: {
      username: "test",
      name: "test",
      password: await bcrypt.hash("test", 10),
    },
  });
};

const getTestAdmin = async () => {
  return prismaClient.admin.findFirst({
    where: {
      username: "test",
    },
  });
};

const removeTestCustomer = async () => {
  return prismaClient.customer.deleteMany({
    where: {
      email: "bagaskara148@gmail.com",
    },
  });
};

const createTestCustomer = async () => {
  return prismaClient.customer.create({
    data: {
      email: "bagaskara148@gmail.com",
      name: "test",
      password: await bcrypt.hash("test", 10),
    },
  });
};

const getTestCustomer = async () => {
  return prismaClient.customer.findFirst({
    where: {
      email: "bagaskara148@gmail.com",
    },
  });
};

const createTestInvalidToken = async () => {
  return prismaClient.invalidToken.create({
    data: {
      token_jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJnc2tvcm8yMSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY4OTA4Mzk1NywiZXhwIjoxNjg5MDg3NTU3fQ.VefS0sEtrmu7UTZ9r9MGvecxhQZT4CrwuOVcWQOS88M",
      created_at: new Date(),
    },
    select: {
      token_jwt: true,
    },
  });
};

const removeTestInvalidToken = async () => {
  return prismaClient.invalidToken.deleteMany();
};

const getTestInvalidToken = async () => {
  return prismaClient.invalidToken.findFirst();
};

const removeTestCategory = async () => {
  return prismaClient.kategori.deleteMany();
};

const createTestCategory = async () => {
  return prismaClient.kategori.create({
    data: {
      name: "test category",
      picture: "public/images/1689121883092-es krim.jpg",
    },
  });
};

const getTestCategory = async () => {
  return prismaClient.kategori.findFirst();
};

const removeTestProducts = async () => {
  return prismaClient.products.deleteMany();
};

const createTestProducts = async () => {
  const testCategory = await getTestCategory();
  return prismaClient.products.create({
    data: {
      name: "test",
      prices: 10000,
      picture: "test",
      category_id: testCategory.id,
      description: "test",
    },
  });
};

const createManyTestProducts = async () => {
  const testCategory = await getTestCategory();
  for (let i = 0; i < 15; i++) {
    await prismaClient.products.create({
      data: {
        name: "test" + i,
        prices: 10000,
        picture: "test" + i,
        category_id: testCategory.id,
        description: "test description" + i,
      },
    });
  }
};

const getTestProducts = async () => {
  return prismaClient.products.findFirst();
};

const removeTestSize = async () => {
  return prismaClient.sizes.deleteMany();
};

const createTestSize = async () => {
  const testProducts = await getTestProducts();
  return prismaClient.sizes.create({
    data: {
      product_id: testProducts.id,
      name: "test",
      stock: 10,
    },
    select: {
      id: true,
      name: true,
      product_id: true,
      stock: true,
    },
  });
};

const getTestSize = async () => {
  return prismaClient.sizes.findFirst();
};

const removeTestCart = async () => {
  const testCustomer = await getTestCustomer();
  return prismaClient.carts.deleteMany({
    where: {
      email: testCustomer.email,
    },
  });
};

const createTestCart = async () => {
  const testCustomer = await getTestCustomer();
  const testProduct = await getTestProducts();
  const testSize = await getTestSize();

  return prismaClient.carts.create({
    data: {
      email: testCustomer.email,
      product_id: testProduct.id,
      size_id: testSize.id,
      quantity: 50,
      created_at: new Date().toISOString(),
    },
  });
};

const getTestCart = async () => {
  return prismaClient.carts.findFirst({
    where: {
      email: "bagaskara148@gmail.com",
    },
  });
};

const removeTestOrder = async () => {
  const testCustomer = await getTestCustomer();
  return prismaClient.orders.deleteMany({
    where: {
      email: testCustomer.email,
    },
  });
};

const removeTestDetailOrder = async () => {
  return prismaClient.detailOrder.deleteMany();
};

const getTestOrder = async () => {
  const testCustomer = await getTestCustomer();
  return prismaClient.orders.findFirst({
    where: {
      email: testCustomer.email,
    },
  });
};

const createTestOrder = async () => {
  const testCustomer = await getTestCustomer();
  return prismaClient.orders.create({
    data: {
      id: "ORDER-" + new Date().getTime(),
      email: testCustomer.email,
      order_date: new Date().toISOString(),
      total_amount: 50000,
      address: "test",
    },
  });
};

const createTestDetailOrder = async () => {
  const testProducts = await getTestProducts();
  const testOrder = await getTestOrder();
  const testSize = await getTestSize();

  return prismaClient.detailOrder.create({
    data: {
      order_id: testOrder.id,
      product_id: testProducts.id,
      size_id: testSize.id,
      quantity: 50,
      price_per_unit: 10000,
      total_price: 5000000,
    },
  });
};

const removeTestPayments = async () => {
  const testOrder = await getTestOrder();
  return prismaClient.payments.deleteMany({
    where: {
      order_id: testOrder.id,
    },
  });
};
export {
  removeTestAdmin,
  creteTestAdmin,
  getTestAdmin,
  removeTestCustomer,
  createTestCustomer,
  getTestCustomer,
  createTestInvalidToken,
  removeTestInvalidToken,
  getTestInvalidToken,
  removeTestCategory,
  createTestCategory,
  getTestCategory,
  removeTestProducts,
  createTestProducts,
  createManyTestProducts,
  getTestProducts,
  removeTestSize,
  createTestSize,
  getTestSize,
  removeTestCart,
  createTestCart,
  getTestCart,
  removeTestDetailOrder,
  removeTestOrder,
  createTestOrder,
  createTestDetailOrder,
  getTestOrder,
  removeTestPayments,
};
