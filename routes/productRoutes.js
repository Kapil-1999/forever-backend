import express from "express";
import { AddProduct, productList, removeProduct, signleProduct } from "../controller/productController.js";
import upload from "../middleware/multer.js";
import { AdminAuth } from "../middleware/adminAuth.js";
const productRouter = express.Router();

productRouter.post("/add", AdminAuth, upload.fields([{name : 'image1', maxCount: 1},{name : 'image2', maxCount: 1}, {name : 'image3', maxCount: 1}, {name : 'image4', maxCount: 1}]), AddProduct);
productRouter.get('/list', productList);
productRouter.delete('/delete/:id',AdminAuth , removeProduct);
productRouter.get('/single/:id' , signleProduct);

export default productRouter;
