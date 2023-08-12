import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import adminController from "../controller/admin-controller.js";
import { upload } from "../middleware/multer-middleware.js";
import customerController from "../controller/customer-controller.js";
import categoryController from "../controller/category-controller.js";
import productController from "../controller/product-controller.js";
import sizeController from "../controller/size-controller.js";
import cartController from "../controller/cart-controller.js";
import orderController from "../controller/order-controller.js";

export const privateRoutes = new express.Router();

privateRoutes.use(authMiddleware);
// Admin Routes
privateRoutes.post("/api/admin", adminController.create);
privateRoutes.get("/api/admin", adminController.getAllAdmin);
privateRoutes.get("/api/admin/current", adminController.get);
privateRoutes.patch("/api/admin/current", upload.single("photo"), adminController.update);
privateRoutes.delete("/api/admin/current", adminController.logout);

// Customer Routes
privateRoutes.get("/api/users/current", customerController.get);
privateRoutes.patch("/api/users/current", upload.single("photo"), customerController.update);
privateRoutes.delete("/api/users/current", customerController.logout);

// Category Routes
privateRoutes.post("/api/categories", upload.single("photo"), categoryController.create);
privateRoutes.patch("/api/categories/:id", upload.single("photo"), categoryController.update);
privateRoutes.delete("/api/categories/:id", categoryController.destroy);

// Products Routes
privateRoutes.post("/api/products", upload.single("photo"), productController.create);
privateRoutes.post("/api/products/:id", upload.single("photo"), productController.update);
privateRoutes.delete("/api/products/:id", productController.destroy);

// Size Routes
privateRoutes.post("/api/products/:productId/sizes", sizeController.create);
privateRoutes.put("/api/products/:productId/sizes/:sizeId", sizeController.update);
privateRoutes.delete("/api/products/:productId/sizes/:sizeId", sizeController.destroy);

// Cart Routes
privateRoutes.post("/api/cart", cartController.create);
privateRoutes.get("/api/cart", cartController.get);
privateRoutes.delete("/api/cart/:cartId", cartController.destroy);

// Order Routes
privateRoutes.post("/api/checkout", orderController.checkout);
privateRoutes.patch("/api/orders/:orderId", orderController.updateStatus);
privateRoutes.get("/api/orders/:orderId/payment", orderController.payment);
