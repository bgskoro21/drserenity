import supertest from "supertest";
import { app } from "../src/application/app.js";
import { logger } from "../src/application/logging.js";
import {
  createTestCustomer,
  createTestCategory,
  createTestProducts,
  createTestSize,
  removeTestProducts,
  removeTestCategory,
  removeTestCart,
  removeTestSize,
  removeTestCustomer,
  createTestCart,
  removeTestDetailOrder,
  removeTestOrder,
  createTestOrder,
  createTestDetailOrder,
  getTestOrder,
} from "./test-util.js";

describe("POST api/checkout", () => {
  beforeEach(async () => {
    await createTestCustomer();
    await createTestCategory();
    await createTestProducts();
    await createTestSize();
    await createTestCart();
  });
  afterEach(async () => {
    await removeTestDetailOrder();
    await removeTestOrder();
    await removeTestCart();
    await removeTestSize();
    await removeTestProducts();
    await removeTestCategory();
    await removeTestCustomer();
  });

  it("Should can customer checkout", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const result = await supertest(app)
      .post("/api/checkout")
      .send({
        address: "test",
      })
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.order_date).toBeDefined();
    expect(result.body.data.total_amount).toBeDefined();
    expect(result.body.data.address).toBeDefined();
  });

  it("Should reject customer checkout if token invalid", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const result = await supertest(app)
      .post("/api/checkout")
      .send({
        address: "test",
      })
      .set("Authorization", resultLogin.body.accessToken + 1);

    logger.info(result.body);

    expect(result.status).toBe(403);
  });

  it("Should reject customer checkout if request invalid", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const result = await supertest(app)
      .post("/api/checkout")
      .send({
        address: "",
      })
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(400);
  });
});

describe("PATCH /api/orders/:orderId", () => {
  beforeEach(async () => {
    await createTestCustomer();
    await createTestCategory();
    await createTestProducts();
    await createTestSize();
    await createTestCart();
    await createTestOrder();
    await createTestDetailOrder();
  });
  afterEach(async () => {
    await removeTestDetailOrder();
    await removeTestOrder();
    await removeTestCart();
    await removeTestSize();
    await removeTestProducts();
    await removeTestCategory();
    await removeTestCustomer();
  });

  it("Should can customer cancel order", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const testOrder = await getTestOrder();

    const result = await supertest(app)
      .patch("/api/orders/" + testOrder.id)
      .query({ type: "cancel" })
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });

  it("Should can customer cancel order", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const testOrder = await getTestOrder();

    const result = await supertest(app)
      .patch("/api/orders/" + testOrder.id)
      .query({ type: "shipping" })
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });

  it("Should can customer cancel order", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const testOrder = await getTestOrder();

    const result = await supertest(app)
      .patch("/api/orders/" + testOrder.id)
      .query({ type: "finish" })
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });

  it("Should reject customer cancel order if order not found", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const testOrder = await getTestOrder();

    const result = await supertest(app)
      .patch("/api/orders/" + (testOrder.id + 1))
      .query({ type: "cancel" })
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(404);
  });
});

describe("GET /api/orders/:orderId/payment", () => {
  beforeEach(async () => {
    await createTestCustomer();
    await createTestCategory();
    await createTestProducts();
    await createTestSize();
    await createTestCart();
    await createTestOrder();
    await createTestDetailOrder();
  });
  afterEach(async () => {
    await removeTestDetailOrder();
    await removeTestOrder();
    await removeTestCart();
    await removeTestSize();
    await removeTestProducts();
    await removeTestCategory();
    await removeTestCustomer();
  });

  it("Should can get snap token midtrans", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const testOrder = await getTestOrder();

    const result = await supertest(app)
      .get("/api/orders/" + testOrder.id + "/payment")
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("Should reject get snap token midtrans if order not found", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const testOrder = await getTestOrder();

    const result = await supertest(app)
      .get("/api/orders/" + (testOrder.id + 1) + "/payment")
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(404);
  });
});
