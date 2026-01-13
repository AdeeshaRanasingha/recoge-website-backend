import Product from "../infrastructure/entities/product.js";
import { NotFoundError, ValidationError } from "../domain/errors/errors.js";

// --- 1. CONTROLLERS ---

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// --- Manual Validation Middleware ---
export const createProductValidator = (req, res, next) => {
  const { title, price, priceValue, image } = req.body;
  const errors = [];

  if (!title) errors.push("Title is required");
  if (!price) errors.push("Price display string is required");
  if (!priceValue || typeof priceValue !== 'number') errors.push("Price value must be a number");
  if (!image) errors.push("Image URL is required");

  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "));
  }
  
  next();
};

export const createProduct = async (req, res, next) => {
  try {
    // No Zod parsing, just pull directly from body
    const data = req.body;

    const newProduct = {
      title: data.title,
      price: data.price,
      priceValue: data.priceValue,
      image: data.image,
      variants: data.variants || null,
      fit: data.fit || null,
      bg: data.bg || "bg-gray-100",
      inStock: data.inStock !== undefined ? data.inStock : true, // Default true
      sizes: data.sizes || [],
      colors: data.colors || [],
      gender: data.gender || "Men",
    };

    const createdProduct = await Product.create(newProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if exists first
    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...req.body }, // Spread body to update fields provided
      { new: true }    // { new: true } ensures we return the *updated* document
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    await Product.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};