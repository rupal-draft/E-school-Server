import User from "./../Models/user.js";
import cloudinary from "cloudinary";
import Course from "./../Models/course.js";

export const makeInstructor = async (req, res) => {
  try {
    const { qualification, experience, bankName, branchName, accountNumber } =
      req.body;
    const user = await User.findById(req.userId).exec();

    const statusUpdated = await User.findByIdAndUpdate(
      user._id,
      {
        qualification: qualification,
        experience: experience,
        bankName: bankName,
        branchName: branchName,
        accountNumber: accountNumber,

        $addToSet: { role: "Instructor" },
      },
      { new: true }
    ).exec();
    res.json(statusUpdated);
  } catch (err) {
    console.error(err);
    res.status(400).send("Error updating role");
  }
};

export const imageInstructor = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.files.image.path);
    // console.log(result);
    const updatedData = {
      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    };
    const user = await User.findById(req.userId).exec();
    const statusImageUpdated = await User.findByIdAndUpdate(
      user._id,
      updatedData,
      { new: true }
    ).exec();
    res.json(statusImageUpdated);
  } catch (err) {
    console.error(err);
  }
};

export const instructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.userId })
      .sort({ createdAt: -1 })
      .exec();
    res.json(courses);
  } catch (err) {
    console.error(err);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "Instructor" });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const studentCount = async (req, res) => {
  try {
    const users = await User.find({ courses: req.body.courseId })
      .select("_id")
      .exec();
    res.json(users);
  } catch (err) {
    console.log(err);
  }
};
