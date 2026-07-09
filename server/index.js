require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/grocery")
  .then(async () => {
    console.log("MongoDB Connected");
    
    const User = require("./models/User");
    const bcrypt = require("bcryptjs");
    const adminExists = await User.findOne({ name: "admin" });
    if (!adminExists) {
      const hash = await bcrypt.hash("admin", 10);
      await User.create({
        name: "admin",
        email: "admin@store.com",
        password: hash,
        isAdmin: true
      });
      console.log("Admin user seeded successfully!");
    }
  })
  .catch(err => console.log(err));

const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const contactRoute = require("./routes/contact");
const categoryRoute = require("./routes/category");
const checkoutRoute = require("./routes/checkout");

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/contact", contactRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/checkouts", checkoutRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});