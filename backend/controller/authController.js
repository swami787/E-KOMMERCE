import User from "../model/userModel.js";
import validator from "validator"
import bcrypt from "bcryptjs"
import { genToken, genToken1 } from "../config/token.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});


export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const existUser = await User.findOne({ email: normalizedEmail });
    
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Enter valid email" });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
    }
    
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one number" });
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one special character" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashPassword,
      verificationToken,
      verificationTokenExpires
    });

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: normalizedEmail,
      subject: "Email Verification",
      html: `
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: `Registration error: ${error.message}` });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ 
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json({ 
      message: "Email verified successfully! You can now login." 
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ message: `Email verification error: ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email first" });
    }
    
    if (!user.password) {
      return res.status(400).json({ message: "Please use Google login" });
    }
    
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    return res.status(200).json(user);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};
export const logOut = async (req,res) => {
try {
    res.clearCookie("token")
    return res.status(200).json({message:"logOut successful"})
} catch (error) {
    console.log("logOut error")
    return res.status(500).json({message:`LogOut error ${error}`})
}
    
}


export const googleLogin = async (req, res) => {
  try {
    let { name, email, googleId } = req.body;
    const normalizedEmail = email.toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        googleId,
        isVerified: true // Google accounts are considered verified
      });
    } else {
      // Update existing user with Google ID
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }
    
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    return res.status(200).json(user);
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: `Google login error: ${error.message}` });
  }
};

export const adminLogin = async (req,res) => {
    try {
        let {email , password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        let token = await genToken1(email)
        res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite: "Strict",
        maxAge: 1 * 24 * 60 * 60 * 1000
    })
    return res.status(200).json(token)
        }
        return res.status(400).json({message:"Invaild creadintials"})

    } catch (error) {
        console.log("AdminLogin error")
    return res.status(500).json({message:`AdminLogin error ${error}`})
        
    }
    
}

