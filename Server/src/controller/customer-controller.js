import customerServices from "../services/customer-services.js";

const create = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await customerServices.create(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const verify = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = req.user;
    const result = await customerServices.verify(user, token);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await customerServices.forgotPassword(email);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const checkForgotToken = async (req, res, next) => {
  try {
    const user = req.user;
    const { token } = req.query;
    const result = await customerServices.checkForgotToken(user, token);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await customerServices.resetPassword(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await customerServices.login(request);
    res.status(200).json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const email = req.user.email;
    const result = await customerServices.get(email);
    res.status(200).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const email = req.user.email;
    const request = req.body;
    const file = req.file;
    if (file) {
      const filePath = file.destination + "/" + file.filename;
      request.profile_picture = filePath;
    }

    const result = await customerServices.update(email, request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const email = req.user.email;
    const token = req.headers.authorization;
    const result = await customerServices.logout(email, token);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  create,
  login,
  get,
  update,
  logout,
  verify,
  forgotPassword,
  checkForgotToken,
  resetPassword,
};
