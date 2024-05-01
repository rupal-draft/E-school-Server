import express from "express";
import formidable from "express-formidable";

const router = express.Router();


import { isInstructor, requireSignin } from "../Middleware/verify.js";
import {
    createProduct,
    getAllProducts,
    addToCart,
    uploadImage,
    removeImage
} from "../Controllers/product.js";


router.get("/products", getAllProducts);

router.post(
  "/products/upload-image",
  requireSignin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadImage
);
router.post("/products/remove-image", removeImage);

router.post(
  "/products/createproduct",
  requireSignin,
  isInstructor,
  createProduct
);
router.post("/products/addtocart", requireSignin, addToCart);


export default router;
