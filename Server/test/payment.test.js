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
  createTestCart,
  removeTestDetailOrder,
  removeTestOrder,
  createTestOrder,
  createTestDetailOrder,
  getTestOrder,
  removeTestPayments,
} from "./test-util.js";
import { app } from "../src/application/app.js";
import { logger } from "../src/application/logging.js";
import crypto from "crypto";

describe("POST /payment/notification", () => {
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
    await removeTestPayments();
    await removeTestDetailOrder();
    await removeTestOrder();
    await removeTestCart();
    await removeTestSize();
    await removeTestProducts();
    await removeTestCategory();
    await removeTestCustomer();
  });

  it("Should respond with 200 OK when receiving a valid notification", async () => {
    const testOrder = await getTestOrder();
    const mockNotification = {
      order_id: testOrder.id,
      transaction_status: "settlement",
      gross_amount: testOrder.total_amount,
      payment_type: "bank_transfer",
    };

    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    const stringToDigest = Object.keys(mockNotification)
      .map((key) => {
        return `${key}=${mockNotification[key]}`;
      })
      .join("&");

    const signatureKey = crypto.createHmac("sha256", serverKey).update(stringToDigest).digest("hex");

    mockNotification.signature_key = signatureKey;

    const result = await supertest(app).post("/payments/notification").send(mockNotification);

    logger.info(result.body);

    expect(result.status).toBe(200);
  });

  it("Should respond with 403 OK when receiving an invalid notification", async () => {
    const testOrder = await getTestOrder();
    const mockNotification = {
      order_id: testOrder.id,
      transaction_status: "settlement",
      gross_amount: testOrder.total_amount,
      payment_type: "bank_transfer",
      signature_key: "invalid_signature_key",
    };

    const result = await supertest(app).post("/payments/notification").send(mockNotification);

    logger.info(result.body);

    expect(result.status).toBe(403);
  });
});
