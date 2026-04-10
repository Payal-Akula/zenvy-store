const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();

const productRoutes = require("./routes/productRoutes");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const wishlistRouter = require("./routes/wishlist");
const cartRoutes = require("./routes/cartRoute");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dealsRoutes = require("./routes/dealsRoutes");
const newArrivalsRoutes = require("./routes/newArrivalsRoutes");
const unifiedProducts = require("./routes/unifiedProducts");


const app = express();
const connectDB = require("./config/db");
connectDB();

app.use(cors({ origin: "*" }));
app.use(express.json());

//img
app.use("/images", express.static("public/images"));


app.use("/api/products", productRoutes);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/best", dealsRoutes);
app.use("/api/new/arrivals", newArrivalsRoutes);
app.use("/api/unified", unifiedProducts);



const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});