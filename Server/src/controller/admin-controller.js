import adminServices from "../services/admin-services.js";

const create = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await adminServices.create(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getAllAdmin = async (req, res, next) => {
  try {
    const result = await adminServices.getAllAdmin();
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
    const result = await adminServices.login(request);
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
    const username = req.user.username;
    const result = await adminServices.get(username);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const username = req.user.username;
    const request = req.body;
    const file = req.file;
    if (file) {
      const filePath = file.destination + "/" + file.filename;
      request.profile_picture = filePath;
    }
    const result = await adminServices.update(username, request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // const token = req.headers.authorization;
    const username = req.user.username;
    const result = await adminServices.logout(username, token);
    res.status(200).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  create,
  getAllAdmin,
  login,
  get,
  update,
  logout,
};
