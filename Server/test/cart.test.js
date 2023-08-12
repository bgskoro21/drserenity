import supertest from "supertest";
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
  getTestProducts,
  getTestSize,
  createTestCart,
  getTestCart,
} from "./test-util.js";
import { app } from "../src/application/app.js";
import { logger } from "../src/application/logging.js";

describe("POST /api/cart", () => {
  beforeEach(async () => {
    await createTestCustomer();
    await createTestCategory();
    await createTestProducts();
    await createTestSize();
  });
  afterEach(async () => {
    await removeTestCart();
    await removeTestSize();
    await removeTestProducts();
    await removeTestCategory();
    await removeTestCustomer();
  });

  it("Should can user insert item to the cart", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const testProducts = await getTestProducts();
    const testSize = await getTestSize();

    const result = await supertest(app)
      .post("/api/cart")
      .send({
        product_id: testProducts.id,
        size_id: testSize.id,
        quantity: 50,
      })
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBeDefined();
    expect(result.body.data.product_id).toBeDefined();
    expect(result.body.data.size_id).toBeDefined();
    expect(result.body.data.quantity).toBeDefined();
    expect(result.body.data.created_at).toBeDefined();
  });

  it("Should reject user insert item to the cart if request invalid", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const result = await supertest(app)
      .post("/api/cart")
      .send({
        product_id: "",
        size_id: "",
        quantity: "",
      })
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(400);
  });
});

describe("GET /api/cart", () => {
  beforeEach(async () => {
    await createTestCustomer();
    await createTestCategory();
    await createTestProducts();
    await createTestSize();
    await createTestCart();
  });
  afterEach(async () => {
    await removeTestCart();
    await removeTestSize();
    await removeTestProducts();
    await removeTestCategory();
    await removeTestCustomer();
  });

  it("Should can get cart", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const result = await supertest(app).get("/api/cart").set("Authorization", resultLogin.body.accessToken);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
  });

  it("Should can get cart if user invalid", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const result = await supertest(app)
      .get("/api/cart")
      .set("Authorization", resultLogin.body.accessToken + 1);

    expect(result.status).toBe(403);
  });
});

describe("DELETE /api/cart", () => {
  beforeEach(async () => {
    await createTestCustomer();
    await createTestCategory();
    await createTestProducts();
    await createTestSize();
    await createTestCart();
  });
  afterEach(async () => {
    await removeTestCart();
    await removeTestSize();
    await removeTestProducts();
    await removeTestCategory();
    await removeTestCustomer();
  });

  it("Should can delete item in the cart", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const testCart = await getTestCart();

    const result = await supertest(app)
      .delete("/api/cart/" + testCart.id)
      .set("Authorization", resultLogin.body.accessToken);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });

  it("Should reject delete item in the cart if cart not found", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const testCart = await getTestCart();

    const result = await supertest(app)
      .delete("/api/cart/" + (testCart.id + 1))
      .set("Authorization", resultLogin.body.accessToken);

    expect(result.status).toBe(404);
  });
});
