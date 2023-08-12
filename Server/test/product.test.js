import supertest from "supertest";
import { app } from "../src/application/app.js";
import { createManyTestProducts, createTestCategory, createTestProducts, creteTestAdmin, getTestCategory, getTestProducts, removeTestAdmin, removeTestCategory, removeTestProducts } from "./test-util.js";
import fs from "fs";
import { logger } from "../src/application/logging.js";

describe("POST /api/products", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    await createTestCategory();
  });
  afterEach(async () => {
    await removeTestProducts();
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("Should can create new products", async () => {
    const testCategory = await getTestCategory();

    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const imagePath = "./public/images/es krim.jpg";
    const img = fs.readFileSync(imagePath);

    const result = await supertest(app)
      .post("/api/products")
      .set("Authorization", resultLogin.body.accessToken)
      .field("name", "test")
      .field("prices", 10000)
      .field("description", "test")
      .field("category_id", testCategory.id)
      .attach("photo", img, "es krim.jpg");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.name).toBeDefined();
    expect(result.body.data.prices).toBeDefined();
    expect(result.body.data.picture).toBeDefined();

    const path = "./public/images/" + result.body.data.picture.split("/")[3];

    fs.unlink(path, (err) => {
      if (err) {
        console.error("Gagal menghapus gambar lama:", err);
      } else {
        console.log("Gambar lama berhasil dihapus");
      }
    });
  });

  it("Should reject create new products if request invalid", async () => {
    const testCategory = await getTestCategory();

    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const result = await supertest(app).post("/api/products").set("Authorization", resultLogin.body.accessToken).field("name", "test").field("prices", 10000).field("category_id", testCategory.id);

    expect(result.status).toBe(400);
  });
});

describe("GET /api/categories/:categoryId/products", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    await createTestCategory();
    await createManyTestProducts();
  });
  afterEach(async () => {
    await removeTestProducts();
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("Should can get product by category", async () => {
    const testCategory = await getTestCategory();
    const result = await supertest(app).get("/api/categories/" + testCategory.id + "/products");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_item).toBe(15);
    expect(result.body.paging.total_page).toBe(2);
  });

  it("Should can get product by category in size 15", async () => {
    const testCategory = await getTestCategory();
    const result = await supertest(app)
      .get("/api/categories/" + testCategory.id + "/products")
      .query({
        size: 15,
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(15);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_item).toBe(15);
    expect(result.body.paging.total_page).toBe(1);
  });

  it("Should reject get product by category if category not found", async () => {
    const testCategory = await getTestCategory();
    const result = await supertest(app).get("/api/categories/" + (testCategory.id + 1) + "/products");

    logger.info(result.body);

    expect(result.status).toBe(404);
  });
});

describe("GET /api/categories/:categoryId/products/:id", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    await createTestCategory();
    await createTestProducts();
  });
  afterEach(async () => {
    await removeTestProducts();
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("should can get detail products", async () => {
    const testCategory = await getTestCategory();
    const testProducts = await getTestProducts();

    const result = await supertest(app).get("/api/categories/" + testCategory.id + "/products/" + testProducts.id);

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.name).toBeDefined();
    expect(result.body.data.prices).toBeDefined();
    expect(result.body.data.picture).toBeDefined();
    expect(result.body.data.category_id).toBeDefined();
  });

  it("should reject get detail products if category not found", async () => {
    const testCategory = await getTestCategory();
    const testProducts = await getTestProducts();

    const result = await supertest(app).get("/api/categories/" + (testCategory.id + 1) + "/products/" + testProducts.id);

    logger.info(result.body);

    expect(result.status).toBe(404);
  });

  it("should reject get detail products if product not found", async () => {
    const testCategory = await getTestCategory();
    const testProducts = await getTestProducts();

    const result = await supertest(app).get("/api/categories/" + testCategory.id + "/products/" + (testProducts.id + 1));

    logger.info(result.body);

    expect(result.status).toBe(404);
  });
});

describe("GET /api/products", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    await createTestCategory();
    await createManyTestProducts();
  });
  afterEach(async () => {
    await removeTestProducts();
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("Should can get all products", async () => {
    const result = await supertest(app).get("/api/products");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_item).toBe(15);
    expect(result.body.paging.total_page).toBe(2);
  });

  it("Should can get all products in page 2", async () => {
    const result = await supertest(app).get("/api/products").query({ page: 2 });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
    expect(result.body.paging.total_page).toBe(2);
  });
});

describe("PUT /api/products/:id", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    await createTestCategory();
    await createTestProducts();
  });
  afterEach(async () => {
    await removeTestProducts();
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("Should can update product", async () => {
    const testProducts = await getTestProducts();
    const testCategory = await getTestCategory();

    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const result = await supertest(app)
      .put("/api/products/" + testProducts.id)
      .set("Authorization", resultLogin.body.accessToken)
      .send({
        name: "test123",
        prices: 12000,
        description: "test",
        category_id: testCategory.id,
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.name).toBe("test123");
    expect(result.body.data.description).toBe("test");
    expect(result.body.data.prices).toBe(12000);
    expect(result.body.data.picture).toBeDefined();
  });

  it("Should reject update product if product not found", async () => {
    const testProducts = await getTestProducts();
    const testCategory = await getTestCategory();

    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const result = await supertest(app)
      .put("/api/products/" + (testProducts.id + 1))
      .set("Authorization", resultLogin.body.accessToken)
      .send({
        name: "test123",
        prices: 12000,
        description: "test",
        category_id: testCategory.id,
      });

    logger.info(result.body);

    expect(result.status).toBe(404);
  });

  it("Should reject update product if request invalid", async () => {
    const testProducts = await getTestProducts();
    const testCategory = await getTestCategory();

    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const result = await supertest(app)
      .put("/api/products/" + testProducts.id)
      .set("Authorization", resultLogin.body.accessToken)
      .send({
        name: "",
        prices: 12000,
        description: "test",
        category_id: testCategory.id,
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
  });
});

describe("DELETE /api/products", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    await createTestCategory();
  });

  afterEach(async () => {
    await removeTestProducts();
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("Should can delete products", async () => {
    const testCategory = await getTestCategory();

    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const imagePath = "./public/images/es krim.jpg";
    const img = fs.readFileSync(imagePath);

    const resultCreate = await supertest(app)
      .post("/api/products")
      .set("Authorization", resultLogin.body.accessToken)
      .field("name", "test")
      .field("prices", 10000)
      .field("description", "test")
      .field("category_id", testCategory.id)
      .attach("photo", img, "es krim.jpg");

    const result = await supertest(app)
      .delete("/api/products/" + resultCreate.body.data.id)
      .set("Authorization", resultLogin.body.accessToken);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });

  it("Should reject delete products if product not found", async () => {
    const testCategory = await getTestCategory();

    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const imagePath = "./public/images/es krim.jpg";
    const img = fs.readFileSync(imagePath);

    const resultCreate = await supertest(app)
      .post("/api/products")
      .set("Authorization", resultLogin.body.accessToken)
      .field("name", "test")
      .field("prices", 10000)
      .field("description", "test")
      .field("category_id", testCategory.id)
      .attach("photo", img, "es krim.jpg");

    const result = await supertest(app)
      .delete("/api/products/" + (resultCreate.body.data.id + 1))
      .set("Authorization", resultLogin.body.accessToken);

    expect(result.status).toBe(404);

    const path = "./public/images/" + resultCreate.body.data.picture.split("/")[3];

    fs.unlink(path, (err) => {
      if (err) {
        console.error("Gagal menghapus gambar lama:", err);
      } else {
        console.log("Gambar lama berhasil dihapus");
      }
    });
  });
});

describe("GET /api/products/search", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    await createTestCategory();
    await createManyTestProducts();
  });
  afterEach(async () => {
    await removeTestProducts();
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("Should can search products without paramater", async () => {
    const result = await supertest(app).get("/api/products/search");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it("Should can search products in page 2", async () => {
    const result = await supertest(app).get("/api/products/search").query({ page: 2 });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it("Should can search products using name of products", async () => {
    const result = await supertest(app).get("/api/products/search").query({ name: "test1" });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it("Should can search products using name of category", async () => {
    const result = await supertest(app).get("/api/products/search").query({ name: "test category" });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it("Should can search products using prices of products", async () => {
    const result = await supertest(app).get("/api/products/search").query({ prices: 10000 });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it("Should can search products using description of products", async () => {
    const result = await supertest(app).get("/api/products/search").query({ description: "test description1" });

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });
});
