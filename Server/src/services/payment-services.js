import { prismaClient } from "../application/database.js";
import { ResponseError } from "../err/response-error.js";
import crypto from "crypto";

const handleAfterPayment = async (request) => {
  const { order_id, transaction_status, gross_amount, payment_type, signature_key } = request;
  // const envSignatureKey = process.env.SIGNATURE_KEY;
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  //   Mengambil request midtrans kecuali signature key nya
  const stringToDigest = Object.keys(request)
    .map((key) => {
      if (key !== "signature_key") return `${key}=${request[key]}`;
      return null;
    })
    .filter(Boolean)
    .join("&");

  const signatureKey = crypto.createHmac("sha256", serverKey).update(stringToDigest).digest("hex");

  if (signature_key !== signatureKey) {
    throw new ResponseError(403, "Invalid payment signature!");
  }

  if (transaction_status === "settlement") {
    await prismaClient.orders.update({
      where: {
        id: order_id,
      },
      data: {
        status: "DIKEMAS",
      },
    });
  }

  const existingPayment = await prismaClient.payments.findFirst({
    where: {
      order_id: order_id,
    },
  });

  if (!existingPayment) {
    await prismaClient.payments.create({
      data: {
        order_id: order_id,
        amount: parseFloat(gross_amount),
        status: transaction_status === "settlement" ? "success" : "pending",
        payment_method: payment_type,
        updated_at: new Date().toISOString(),
      },
    });
  } else {
    await prismaClient.payments.update({
      where: {
        id: existingPayment.id,
      },
      data: {
        status: transaction_status === "settlement" ? "success" : "pending",
      },
    });
  }

  return "Notification received and processed successfully";
};

export default {
  handleAfterPayment,
};
