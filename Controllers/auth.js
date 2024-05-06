import User from "./../Models/user.js";
import Course from "./../Models/course.js";

import { hashPassword, comparePassword } from "./../utils/auth.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken");

    const hashedPassword = await hashPassword(password);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    await User.findByIdAndUpdate(user.id, { token: token }, { new: true });

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Invalid password");
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "5s",
    });
    user.password = undefined;
    await User.findByIdAndUpdate(user.id, { token: token }, { new: true });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).send("Error. Try again.");
  }
};

export const logout = (req, res) => {
  try {
    res.redirect("http://localhost:5173/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging out. Please try again!");
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password").exec();
    return res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).send("Error fetching user information");
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send({ Status: "No User found" });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: "Reset your password - Learnopia",
      text: `Dear ${user.name},

      We received a request to reset your password for your [Your Platform Name] account. To proceed with this request, please follow the instructions below:
      
        1. Click on the following link to reset your password:
        ${process.env.FRONTEND_URL}/reset-password/${user.id}/${token}
      
        2. If you're unable to click on the link, please copy and paste it into your web browser's address bar.
      
        3. Once the link is opened, you will be directed to a page where you can create a new password for your account.
      
      If you did not request this password reset, please disregard this email. Your account is still secure, and no changes have been made.
      
      Thank you for using [Your Platform Name].
      
      Best regards,
      Learnopia Team`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "Success" });
      }
    });
  } catch (err) {
    console.error(err);
  }
};
export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(400).send("Invalid token");
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: err }));
        })
        .catch((err) => res.send({ Status: err }));
    }
  });
};

export const userCourses = async (req, res) => {
  const user = await User.findById(req.userId).exec();
  const courses = await Course.find({ _id: { $in: user.courses } })
    .populate("instructor", "_id name")
    .exec();
  res.json(courses);
};

export const getMyCart = async (req, res) => {
  try {
    // Find the user by _id and populate the 'products' field of the cart with product details
    const user = await User.findById(req.userId).populate("cart.products");
    res.json(user.cart);
  } catch (error) {
    console.error(error);
  }
};
