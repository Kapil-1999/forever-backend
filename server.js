import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRoutes from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";


const app = express();
const PORT = process.env.PORT || 4000;
connectDb();
connectCloudinary()

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/product', productRouter)

app.get("/", (req , res) => {
    res.send("api is working")
});

app.listen(PORT, () => {
    console.log(`server is running in http://localhost:${PORT}`);
    
})