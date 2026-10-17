import express from "express";
import {
  getMedicines,
  getFeatured,
  getCategories,
  getMedicineById,
} from "../controllers/medicineController.js";

const router = express.Router();

router.get("/", getMedicines);
router.get("/featured", getFeatured);     // must stay above "/:id"
router.get("/categories", getCategories); // must stay above "/:id"
router.get("/:id", getMedicineById);

export default router;