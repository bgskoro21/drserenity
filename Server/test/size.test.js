import { createTestProducts, creteTestAdmin, createTestCategory, removeTestProducts, removeTestCategory, removeTestAdmin, removeTestSize, getTestProducts, createTestSize, getTestSize } from "./test-util.js";
import { app } from "../src/application/app.js";
import supertest from "supertest";
import { logger } from "../src/application/logging.js";

describe("POST /api/products/:productId/sizes", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    await createTestCategory();
    await createTestProducts();
  });
  afterEach(async () => {
    await removeTestSize();
    await removeTestProducts();
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("Should can create new size", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const testProducts = await getTestProducts();

    const result = await supertest(app)
      .post("/api/products/" + testProducts.id + "/sizes")
      .set("Authorization", resultLogin.body.accessToken)
      .send({
        name: "XL",
        stock: 10,
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.name).toBeDefined();
    expect(result.body.data.stock).toBeDefined();
  });

  it("Should reject create new size if product not found", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const testProducts = await getTestProducts();

    const result = await supertest(app)
      .post("/api/products/" + (testProducts.id + 1) + "/sizes")
      .set("Authorization", resultLogin.body.accessToken)
      .send({
        name: "test",
        stock: 10,
      });

    expect(result.status).toBe(404);
  });

  it("Should reject create new size if request invalid", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const testProducts = await getTestProducts();

    const result = await supertest(app)
      .post("/api/products/" + testProducts.id + "/sizes")
      .set("Authorization", resultLogin.body.accessToken)
      .send({
        name: "",
        stock: "",
      });

    expect(result.status).toBe(400);
  });
});

describe("GET /api/products/:productId/sizes", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    await createTestCategory();
    await createTestProducts();
    await createTestSize();
  });
  afterEach(async () => {
    await removeTestSize();
    await removeTestProducts();
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("Should can get sizes by products", async () => {
    const testProducts = await getTestProducts();

    const result = await supertest(app).get("/api/products/" + testProducts.id + "/sizes");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
  });

  it("Should reject get sizes by products if product not found", async () => {
    const testProducts = await getTestProducts();

    const result = await supertest(app).get("/api/products/" + (testProducts.id + 1) + "/sizes");

    expect(result.status).toBe(404);
  });
});

describe("GET /api/products/:productId/sizes/:sizeId", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    await createTestCategory();
    await createTestProducts();
    await createTestSize();
  });
  afterEach(async () => {
    await removeTestSize();
    await removeTestProducts();
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("Should can get detail sizes", async () => {
    const testProducts = await getTestProducts();
    const testSize = await getTestSize();
    const result = await supertest(app).get("/api/products/" + testProducts.id + "/sizes/" + testSize.id);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.name).toBeDefined();
    expect(result.body.data.product_id).toBeDefined();
  });

  it("Should reject get detail sizes if product not found", async () => {
    const testProducts = await getTestProducts();
    const testSize = await getTestSize();
    const result = await supertest(app).get("/api/products/" + (testProducts.id + 1) + "/sizes/" + testSize.id);

    expect(result.status).toBe(404);
  });

  it("Should reject get detail sizes if size not found", async () => {
    const testProducts = await getTestProducts();
    const testSize = await getTestSize();
    const result = await supertest(app).get("/api/products/" + testProducts.id + "/sizes/" + (testSize.id + 1));

    expect(result.status).toBe(404);
  });
});

describe("PUT /api/products/:productId/sizes/:sizeId", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    await createTestCategory();
    await createTestProducts();
    await createTestSize();
  });
  afterEach(async () => {
    await removeTestSize();
    await removeTestProducts();
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("Should can update sizes", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const testProducts = await getTestProducts();
    const testSize = await getTestSize();

    const result = await supertest(app)
      .put("/api/products/" + testProducts.id + "/sizes/" + testSize.id)
      .set("Authorization", resultLogin.body.accessToken)
      .send({
        name: "XL",
        stock: 10,
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.name).toBe("XL");
    expect(result.body.data.stock).toBe(10);
  });

  it("Should reject update sizes if sizes not found", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const testProducts = await getTestProducts();
    const testSize = await getTestSize();

    const result = await supertest(app)
      .put("/api/products/" + testProducts.id + "/sizes/" + (testSize.id + 1))
      .set("Authorization", resultLogin.body.accessToken)
      .send({
        name: "XL",
        stock: 10,
      });

    logger.info(result.body);

    expect(result.status).toBe(404);
  });

  it("Should reject update sizes if product not found", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const testProducts = await getTestProducts();
    const testSize = await getTestSize();

    const result = await supertest(app)
      .put("/api/products/" + (testProducts.id + 1) + "/sizes/" + testSize.id)
      .set("Authorization", resultLogin.body.accessToken)
      .send({
        name: "XL",
        stock: 10,
      });

    logger.info(result.body);

    expect(result.status).toBe(404);
  });

  it("Should reject update sizes if request invalid", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const testProducts = await getTestProducts();
    const testSize = await getTestSize();

    const result = await supertest(app)
      .put("/api/products/" + testProducts.id + "/sizes/" + testSize.id)
      .set("Authorization", resultLogin.body.accessToken)
      .send({
        name: "",
        stock: "",
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
  });
});

describe("DELETE /api/products/:productId/sizes/:sizeId", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    await createTestCategory();
    await createTestProducts();
    await createTestSize();
  });
  afterEach(async () => {
    await removeTestSize();
    await removeTestProducts();
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("Should can delete size", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const testProducts = await getTestProducts();
    const testSize = await getTestSize();

    const result = await supertest(app)
      .delete("/api/products/" + testProducts.id + "/sizes/" + testSize.id)
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });

  it("Should reject delete size if product not found", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const testProducts = await getTestProducts();
    const testSize = await getTestSize();

    const result = await supertest(app)
      .delete("/api/products/" + (testProducts.id + 1) + "/sizes/" + testSize.id)
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(404);
  });

  it("Should reject delete size if size not found", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const testProducts = await getTestProducts();
    const testSize = await getTestSize();

    const result = await supertest(app)
      .delete("/api/products/" + testProducts.id + "/sizes/" + (testSize.id + 1))
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(404);
  });
});
