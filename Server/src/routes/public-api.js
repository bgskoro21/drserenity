import express from "express";
import adminController from "../controller/admin-controller.js";
import customerController from "../controller/customer-controller.js";
import categoryController from "../controller/category-controller.js";
import productController from "../controller/product-controller.js";
import sizeController from "../controller/size-controller.js";
import paymentController from "../controller/payment-controller.js";
import { registerMiddleware } from "../middleware/register-middleware.js";
import { forgotMiddleware } from "../middleware/forgot-middleware.js";

export const publicRoutes = new express.Router();

// Admin Routes
publicRoutes.post("/api/admin/login", adminController.login);

// Customer Routes
publicRoutes.post("/api/users", customerController.create);
publicRoutes.post("/api/users/login", customerController.login);
publicRoutes.get("/api/verify/:token", registerMiddleware, customerController.verify);
publicRoutes.post("/api/forgot", customerController.forgotPassword);
publicRoutes.get("/api/forgot", forgotMiddleware, customerController.checkForgotToken);
publicRoutes.post("/api/reset-password", customerController.resetPassword);

// Category Routes
publicRoutes.get("/api/categories", categoryController.getAllCategory);
publicRoutes.get("/api/categories/:id", categoryController.getCategoryById);

// Products Routes
publicRoutes.get("/api/categories/:categoryId/products", productController.getProductsByCategory);
publicRoutes.get("/api/products", productController.getAll);
publicRoutes.get("/api/categories/:categoryId/products/:id", productController.getDetail);
publicRoutes.get("/api/products/:id", productController.getDetail);
publicRoutes.get("/api/products/search", productController.search);

// Sizes Routes
publicRoutes.get("/api/products/:productId/sizes", sizeController.getByProducts);
publicRoutes.get("/api/products/:productId/sizes/:sizeId", sizeController.getDetail);

// Payment Routs
publicRoutes.post("/payments/notification", paymentController.handleAfterPayment);
