import asyncHandler from "../../utils/asyncHandler.utils.js";
import Product from "../../models/product.model.js";

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const { category, minPrice, maxPrice, sort } = req.query;
  const isFiltered = category || minPrice || maxPrice || sort;

  if (!isFiltered) {
    const products = await Product.find();
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  }
  // Filtered request
  const filter = {};


  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    newest:       { createdAt: -1 },
    oldest:       { createdAt:  1 },
    "price-asc":  { price:  1 },
    "price-desc": { price: -1 },
    popular:      { rating: -1 },
  };
  const sortQuery = sortMap[sort] ?? { createdAt: -1 };

  const products = await Product.find(filter).sort(sortQuery);

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: products,
  });
});