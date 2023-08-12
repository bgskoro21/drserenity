import supertest from "supertest";
import { removeTestCategory, removeTestAdmin, creteTestAdmin, createTestCategory, getTestCategory } from "./test-util.js";
import { app } from "../src/application/app.js";
import fs from "fs";
import { logger } from "../src/application/logging.js";

describe("POST /api/categories", () => {
  beforeEach(async () => {
    await creteTestAdmin();
  });
  afterEach(async () => {
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("Should can create new category", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const imagePath = "./public/images/es krim.jpg";
    const image = fs.readFileSync(imagePath);

    const result = await supertest(app).post("/api/categories").field("name", "test").attach("photo", image, "es krim.jpg").set("Authorization", resultLogin.body.accessToken);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.name).toBeDefined();
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

  it("Should reject create new category if request invalid", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const result = await supertest(app).post("/api/categories").field("name", "").set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(400);
  });
});

describe("GET /api/categories", () => {
  beforeEach(async () => {
    await createTestCategory();
  });
  afterEach(async () => {
    await removeTestCategory();
  });

  it("Should can get all categories", async () => {
    const result = await supertest(app).get("/api/categories");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
  });
});

describe("GET /api/categories/:id", () => {
  beforeEach(async () => {
    await createTestCategory();
  });
  afterEach(async () => {
    await removeTestCategory();
  });

  it("Shoul can get detail category", async () => {
    const testCategory = await getTestCategory();
    const result = await supertest(app).get("/api/categories/" + testCategory.id);

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.name).toBeDefined();
    expect(result.body.data.picture).toBeDefined();
  });
});

describe("PATCH /api/categories/:id", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    // await createTestCategory();
  });
  afterEach(async () => {
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("should can update category", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const imagePath = "./public/images/es krim.jpg";
    const image = fs.readFileSync(imagePath);

    const resultCreate = await supertest(app).post("/api/categories").field("name", "test").attach("photo", image, "es krim.jpg").set("Authorization", resultLogin.body.accessToken);

    logger.info(resultCreate.body.data);

    const result = await supertest(app)
      .patch("/api/categories/" + resultCreate.body.data.id)
      .set("Authorization", resultLogin.body.accessToken)
      .field("name", "test123");

    logger.info(result.body);

    const path = "./public/images/" + result.body.data.picture.split("/")[3];

    fs.unlink(path, (err) => {
      if (err) {
        console.error("Gagal menghapus gambar lama:", err);
      } else {
        console.log("Gambar lama berhasil dihapus");
      }
    });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.name).toBe("test123");
    expect(result.body.data.picture).toBeDefined();
  });

  it("should reject update category if request invalid", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const imagePath = "./public/images/es krim.jpg";
    const image = fs.readFileSync(imagePath);

    const resultCreate = await supertest(app).post("/api/categories").field("name", "test").attach("photo", image, "es krim.jpg").set("Authorization", resultLogin.body.accessToken);

    const result = await supertest(app)
      .patch("/api/categories/" + resultCreate.body.data.id)
      .set("Authorization", resultLogin.body.accessToken)
      .field("name", "");

    const path = "./public/images/" + resultCreate.body.data.picture.split("/")[3];

    fs.unlink(path, (err) => {
      if (err) {
        console.error("Gagal menghapus gambar lama:", err);
      } else {
        console.log("Gambar lama berhasil dihapus");
      }
    });

    expect(result.status).toBe(400);
  });

  it("should reject update category if category not found", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const imagePath = "./public/images/es krim.jpg";
    const image = fs.readFileSync(imagePath);

    const resultCreate = await supertest(app).post("/api/categories").field("name", "test").attach("photo", image, "es krim.jpg").set("Authorization", resultLogin.body.accessToken);

    const result = await supertest(app)
      .patch("/api/categories/" + (resultCreate.body.data.id + 1))
      .set("Authorization", resultLogin.body.accessToken)
      .field("name", "test123")
      .attach("photo", image, "es krim.jpg");

    logger.info(result.body);

    const path = "./public/images/" + resultCreate.body.data.picture.split("/")[3];

    fs.unlink(path, (err) => {
      if (err) {
        console.error("Gagal menghapus gambar lama:", err);
      } else {
        console.log("Gambar lama berhasil dihapus");
      }
    });
    expect(result.status).toBe(404);
  });
});

describe("DELETE /api/categories/:id", () => {
  beforeEach(async () => {
    await creteTestAdmin();
    // await createTestCategory();
  });
  afterEach(async () => {
    await removeTestCategory();
    await removeTestAdmin();
  });

  it("Should can delete category", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const imagePath = "./public/images/es krim.jpg";
    const image = fs.readFileSync(imagePath);

    const resultCreate = await supertest(app).post("/api/categories").field("name", "test").attach("photo", image, "es krim.jpg").set("Authorization", resultLogin.body.accessToken);

    logger.info(resultCreate.body);

    const result = await supertest(app)
      .delete("/api/categories/" + resultCreate.body.data.id)
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });

  it("Should reject delete category if category not found", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const imagePath = "./public/images/es krim.jpg";
    const image = fs.readFileSync(imagePath);

    const resultCreate = await supertest(app).post("/api/categories").field("name", "test").attach("photo", image, "es krim.jpg").set("Authorization", resultLogin.body.accessToken);

    const result = await supertest(app)
      .delete("/api/categories/" + (resultCreate.body.data.id + 1))
      .set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

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
