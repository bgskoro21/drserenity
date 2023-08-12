import supertest from "supertest";
import { createTestCustomer, createTestInvalidToken, getTestCustomer, getTestInvalidToken, removeTestCustomer, removeTestInvalidToken } from "./test-util.js";
import { app } from "../src/application/app.js";
import { logger } from "../src/application/logging.js";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("POST /api/users", () => {
  afterEach(async () => {
    await removeTestCustomer();
  });

  it("Should can register new customers", async () => {
    const result = await supertest(app).post("/api/users").send({
      email: "bagaskara148@gmail.com",
      name: "test",
      password: "test",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("Should can register new customers", async () => {
    const result = await supertest(app).post("/api/users").send({
      email: "",
      name: "test",
      password: "test",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
  });
});

describe("GET /api/verify/:token", () => {
  beforeEach(async () => {
    await createTestCustomer();
  });

  afterEach(async () => {
    await removeTestInvalidToken();
    await removeTestCustomer();
  });

  it("Should can verify account user", async () => {
    const token = jwt.sign({ email: "bagaskara148@gmail.com" }, "register-secret-key", { expiresIn: "1d" });

    const result = await supertest(app).get("/api/verify/" + token);

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.email).toBeDefined();
    expect(result.body.data.name).toBeDefined();
    expect(result.body.data.profile_picture).toBeDefined();
    expect(result.body.data.verified_at).toBeDefined();
  });

  it("Should reject verify account user if token invalid", async () => {
    const token = jwt.sign({ email: "bagaskara148@gmail.com" }, "register-secret-key", { expiresIn: "1d" });

    const result = await supertest(app).get("/api/verify/" + (token + 1));

    logger.info(result.body);

    expect(result.status).toBe(403);
  });
});

describe("POST /api/forgot", () => {
  beforeEach(async () => {
    await createTestCustomer();
  });

  afterEach(async () => {
    await removeTestCustomer();
  });

  it("should can customer forgot password", async () => {
    const result = await supertest(app).post("/api/forgot").send({
      email: "bagaskara148@gmail.com",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("should reject customer forgot password if user not found", async () => {
    const result = await supertest(app).post("/api/forgot").send({
      email: "bagaskara147@gmail.com",
    });

    logger.info(result.body);

    expect(result.status).toBe(404);
  });
});

describe("GET /api/forgot", () => {
  beforeEach(async () => {
    await createTestCustomer();
  });

  afterEach(async () => {
    await removeTestInvalidToken();
    await removeTestCustomer();
  });

  it("should can customer check forgot token", async () => {
    const token = jwt.sign({ email: "bagaskara148@gmail.com" }, "forgot-secret-key", { expiresIn: "1d" });

    const result = await supertest(app).get("/api/forgot").query({ token: token });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.email).toBe("bagaskara148@gmail.com");
  });

  it("should reject customer check forgot token if user not found", async () => {
    const token = jwt.sign({ email: "bagaskara147@gmail.com" }, "forgot-secret-key", { expiresIn: "1d" });

    const result = await supertest(app).get("/api/forgot").query({ token: token });

    logger.info(result.body);

    expect(result.status).toBe(404);
  });
});

describe("POST /api/reset-password", () => {
  beforeEach(async () => {
    await createTestCustomer();
  });

  afterEach(async () => {
    await removeTestCustomer();
  });

  it("Should can customer reset password", async () => {
    const result = await supertest(app).post("/api/reset-password").send({
      email: "bagaskara148@gmail.com",
      password: "bagas123",
      password_confirmation: "bagas123",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.email).toBeDefined();
    expect(result.body.data.name).toBeDefined();
    expect(result.body.data.profile_picture).toBeDefined();
    expect(result.body.data.verified_at).toBeDefined();
  });

  it("Should reject customer reset password if password confirmaton doesnt match", async () => {
    const result = await supertest(app).post("/api/reset-password").send({
      email: "bagaskara148@gmail.com",
      password: "bagas123",
      password_confirmation: "bagas124",
    });

    expect(result.status).toBe(400);
  });

  it("Should reject customer reset password if user not found", async () => {
    const result = await supertest(app).post("/api/reset-password").send({
      email: "bagaskara147@gmail.com",
      password: "bagas123",
      password_confirmation: "bagas123",
    });

    expect(result.status).toBe(404);
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await createTestCustomer();
  });
  afterEach(async () => {
    await removeTestCustomer();
  });

  it("Should can customer login", async () => {
    const result = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    expect(result.status).toBe(200);
    expect(result.body.accessToken).toBeDefined();
    expect(result.body.refreshToken).toBeDefined();
  });

  it("Should reject customer login if invalid credentials", async () => {
    const result = await supertest(app).post("/api/users/login").send({
      email: "salah@gmail.com",
      password: "test",
    });

    expect(result.status).toBe(401);
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await createTestCustomer();
  });
  afterEach(async () => {
    await removeTestCustomer();
  });

  it("Should can get users current", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const result = await supertest(app).get("/api/users/current").set("Authorization", resultLogin.body.accessToken);

    expect(result.status).toBe(200);
    expect(result.body.data.email).toBeDefined();
    expect(result.body.data.name).toBeDefined();
    expect(result.body.data.profile_picture).toBeDefined();
  });

  it("Should reject get users current if token not found", async () => {
    const result = await supertest(app).get("/api/users/current");

    expect(result.status).toBe(401);
  });

  it("Should reject get users current if token invalid", async () => {
    const result = await supertest(app).get("/api/users/current").set("Authorization", "salah");

    expect(result.status).toBe(403);
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await createTestCustomer();
  });
  afterEach(async () => {
    await removeTestCustomer();
  });

  it("Should can update customer", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    // const imagePath = "./public/images/es krim.jpg";
    // const image = fs.readFileSync(imagePath);

    // const result = await supertest(app).patch("/api/users/current").field("name", "test123").field("password", "test123").attach("photo", image, "es krim.jpg").set("Authorization", resultLogin.body.accessToken);
    const result = await supertest(app).patch("/api/users/current").field("name", "test123").field("password", "test123").set("Authorization", resultLogin.body.accessToken);

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("test123");

    const testCustomer = await getTestCustomer();
    expect(await bcrypt.compare("test123", testCustomer.password)).toBe(true);
    // expect(result.body.data.profile_picture).toBeDefined();
  });

  it("Should reject update customer if token invalid", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const imagePath = "./public/images/es krim.jpg";
    const image = fs.readFileSync(imagePath);

    const result = await supertest(app).patch("/api/users/current").field("name", "test123").field("password", "test123").attach("photo", image, "es krim.jpg").set("Authorization", "salah");

    expect(result.status).toBe(403);
  });
});

describe("DELETE /api/users/current", () => {
  beforeEach(async () => {
    await createTestCustomer();
    // await createTestInvalidToken();
  });
  afterEach(async () => {
    await removeTestInvalidToken();
    await removeTestCustomer();
  });

  it("Should can logout customer", async () => {
    const resultLogin = await supertest(app).post("/api/users/login").send({
      email: "bagaskara148@gmail.com",
      password: "test",
    });

    const result = await supertest(app).delete("/api/users/current").set("Authorization", resultLogin.body.accessToken);

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });
});
