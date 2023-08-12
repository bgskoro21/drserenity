import orderServices from "../services/order-services.js";

const checkout = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const result = await orderServices.checkout(user, request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const user = req.user;
    const { orderId } = req.params;
    const request = {
      id: orderId,
      type: req.query.type,
    };
    await orderServices.updateStatus(user, request);
    res.status(200).json({
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

const payment = async (req, res, next) => {
  try {
    const user = req.user;
    const { orderId } = req.params;
    const result = await orderServices.payment(user, orderId);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  checkout,
  updateStatus,
  payment,
};
