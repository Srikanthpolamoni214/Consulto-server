
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import userModel from "../Models/userModel.js";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const googleRoute = express.Router()
googleRoute.post("/google-register", async (req, res) => {
  const { name, email, photoUrl ,password} = req.body;

  if (!email || !name || !photoUrl) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
    let user = await userModel.findOne({ email });
if(!user){
 try {
    // 🔍 Check if user exists
// id
        const userCount = await userModel.countDocuments();
        const nextIdNumber = userCount + 1;
        const userid = `con${String(nextIdNumber).padStart(3, '0')}`
    if (!user) {
      // New Google user → create account
      const hashedPassword = await bcrypt.hash(password, 10);

      user = new userModel({
        name: name,
        userid,
        email,
        image:photoUrl,
        // registeredVia: "google",
        password: hashedPassword,
      });

      await user.save();

     
      return res.json({
        success: true,
        message: "Google sign-up successful",
        // photoUrl: user.photoUrl,
      });
      
    }

 
  }
  catch (err) {
    console.error("Google Auth Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
else{
     return res.status(400).json({ success: false, message: 'Email already exists'
      });
}
  
});

export default googleRoute;
