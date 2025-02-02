import express from "express";
import {
  addProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  searchProperties,
} from "../controllers/property.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/search", searchProperties);
router.get("/", getProperties);
router.get("/:id", getProperty);


router.post("/", verifyToken, addProperty);
router.put("/:id", verifyToken, updateProperty);
router.delete("/:id", verifyToken, deleteProperty);

export default router;
