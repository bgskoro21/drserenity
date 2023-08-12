import supertest from "supertest";
import { removeTestAdmin, creteTestAdmin, getTestAdmin, removeTestCustomer, removeTestInvalidToken } from "./test-util.js";
import { app } from "../src/application/app.js";
import { logger } from "../src/application/logging.js";
import fs from "fs";
import bcrypt from "bcrypt";

describe("POST /api/admin", () => {
  afterEach(async () => {
    await removeTestAdmin();
  });

  it("Should can create new admin", async () => {
    const result = await supertest(app).post("/api/admin").send({
      username: "test",
      name: "test",
      password: "test",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBeDefined();
    expect(result.body.data.name).toBeDefined();
  });

  it("Should reject create new admin if request invalid", async () => {
    const result = await supertest(app).post("/api/admin").send({
      username: "",
      name: "test",
      password: "test",
    });

    expect(result.status).toBe(400);
  });
});

describe("POST /api/admin", () => {
  beforeEach(async () => {
    await creteTestAdmin();
  });
  afterEach(async () => {
    await removeTestAdmin();
  });

  it("Should can login admin", async () => {
    const result = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    expect(result.status).toBe(200);
    expect(result.body.accessToken).toBeDefined();
    expect(result.body.refreshToken).toBeDefined();
  });

  it("Should reject create new admin if username is wrong", async () => {
    const result = await supertest(app).post("/api/admin/login").send({
      username: "salah",
      password: "test",
    });

    expect(result.status).toBe(401);
  });

  it("Should reject create new admin if password is wrong", async () => {
    const result = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "salah",
    });

    expect(result.status).toBe(401);
  });
});

describe("GET /api/admin/current", () => {
  beforeEach(async () => {
    await creteTestAdmin();
  });
  afterEach(async () => {
    await removeTestAdmin();
  });

  it("Should can get admin", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const result = await supertest(app).get("/api/admin/current").set("Authorization", resultLogin.body.accessToken);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBeDefined();
    expect(result.body.data.name).toBeDefined();
  });

  it("Should reject get admin if token invalid", async () => {
    const result = await supertest(app).get("/api/admin/current").set("Authorization", "basing");

    expect(result.status).toBe(403);
  });
});

describe("PATCH /api/admin/current", () => {
  beforeEach(async () => {
    await creteTestAdmin();
  });

  afterEach(async () => {
    await removeTestAdmin();
  });

  it("Should can update admin", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    // const imagePath = "./public/images/es krim.jpg";
    // const image = fs.readFileSync(imagePath);

    // const result = await supertest(app).patch("/api/admin/current").set("Authorization", resultLogin.body.accessToken).field("name", "test123").field("password", "test123").attach("photo", image, "es krim.jpg");
    const result = await supertest(app).patch("/api/admin/current").set("Authorization", resultLogin.body.accessToken).field("name", "test123").field("password", "test123");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("test123");

    const testAdmin = await getTestAdmin();
    expect(await bcrypt.compare("test123", testAdmin.password)).toBe(true);
    // expect(result.body.data.profile_picture).toBeDefined();
  });

  it("Should reject update admin if token invalid", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const imagePath = "./public/images/es krim.jpg";
    const image = fs.readFileSync(imagePath);

    const result = await supertest(app).patch("/api/admin/current").set("Authorization", "test").field("name", "test123").field("password", "test123").attach("photo", image, "es krim.jpg");

    logger.info(result.body);

    expect(result.status).toBe(403);
  });
});

describe("DELETE /api/admin/curent", () => {
  beforeEach(async () => {
    await creteTestAdmin();
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestInvalidToken();
  });

  it("Should can admin logout", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const result = await supertest(app).delete("/api/admin/current").set("Authorization", resultLogin.body.accessToken);
    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    // await prismaClient.invalidToken.deleteMany();
  });

  it("Should can admin logout", async () => {
    const resultLogin = await supertest(app).post("/api/admin/login").send({
      username: "test",
      password: "test",
    });

    const result = await supertest(app).delete("/api/admin/current").set("Authorization", "salah");
    logger.info(result.body);
    expect(result.status).toBe(403);
  });
});
