require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/grocery");

    const users = await User.find({ 
      $or: [{ email: "admin1@gmail.com" }, { name: "Deep Makadia And Mihir Parekh" }] 
    });
    
    console.log(`Found ${users.length} users with this email/name.`);
    
    for (let u of users) {
      console.log(`User: ${u.email} | Name: ${u.name} | isAdmin: ${u.isAdmin}`);
      const isValid = await bcrypt.compare("admin", u.password);
      console.log(`Password 'admin' is valid? ${isValid}`);
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.disconnect();
  }
}

checkAdmin();
