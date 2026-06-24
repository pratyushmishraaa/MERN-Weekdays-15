import asyncHandler from "../../utils/asyncHandler.utils.js";
import Product from "../../models/product.model.js";
import ApiError from "../../utils/errorHandler.utils.js";

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: null,
  });
});