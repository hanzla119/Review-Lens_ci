import { getDatasetProducts } from "../services/productDatasetService.js";

export const listProducts = async (req, res, next) => {
  try {
    const result = await getDatasetProducts({
      limit: req.query.limit,
      offset: req.query.offset,
      refresh: req.query.refresh === "true",
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};
