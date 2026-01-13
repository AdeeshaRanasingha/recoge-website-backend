import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductValidator,
} from "../application/product.js";

const productRouter = Router();

// Routes for "/"
productRouter
  .route("/")
  .get(getAllProducts)
  .post(createProductValidator, createProduct);

// Routes for "/:id"
productRouter
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default productRouter;
