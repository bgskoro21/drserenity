import paymentServices from "../services/payment-services.js";

const handleAfterPayment = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await paymentServices.handleAfterPayment(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  handleAfterPayment,
};
