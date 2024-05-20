import cloudinary from "cloudinary";
import Course from "./../Models/course.js";
import User from "./../Models/user.js";
import "dotenv/config";

import slugify from "slugify";
import AWS from "aws-sdk";
import Razorpay from "razorpay";
import crypto from "crypto";
import url from "url";
import jwt from "jsonwebtoken";

import { nanoid } from "nanoid";
import { readFileSync } from "fs";
import Payement from "../Models/payement.js";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1,
  region: process.env.AWS_REGION1,
  apiVersion: process.env.AWS_API_VERSION,
};

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_API,
  key_secret: process.env.RAZORPAY_SECRET,
});

const S3 = new AWS.S3(awsConfig);

export const imageCourse = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.files.image.path);
    const imageInfo = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    res.json(imageInfo);
  } catch (err) {
    console.error(err);
  }
};

export const removeImage = async (req, res) => {
  const { image } = req.body;
  // console.log(image.public_id);
  const deletePhoto = (publicId) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
  const photoPublicId = image.public_id;
  deletePhoto(photoPublicId)
    .then((result) => {
      console.log("Photo deleted successfully:", result);
    })
    .catch((error) => {
      console.error("Error deleting photo:", error);
    });
};

export const createCourses = async (req, res) => {
  // console.log(req.body);
  try {
    const alreadyExist = await Course.findOne({
      slug: slugify(req.body.cousrseTittle.toLowerCase()),
    });
    if (alreadyExist) return res.status(400).send("Title is taken");
    const course = await new Course({
      slug: slugify(req.body.cousrseTittle),
      instructor: req.userId,
      image: req.body.image,
      ...req.body,
    }).save();
    res.json(course);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Error creating courses!");
  }
};

export const readCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate("instructor", "_id name")
      .exec();
    res.json(course);
  } catch (err) {
    console.error(err);
  }
};

export const videoUpload = async (req, res) => {
  try {
    if (req.userId != req.params.id) {
      return res.status(400).send("Unauthorized");
    }

    const { video } = req.files;
    // console.log(video);
    if (!video) return res.status(404).send("No Video found!");

    const params = {
      Bucket: "learnopia-bucket",
      Key: `${nanoid()}.${video.type.split("/")[1]}`, //video/mp4 -> [video,mp4] -> mp4 (For later understanding before interview)
      Body: readFileSync(video.path),
      ACL: "public-read",
      ContentType: video.type,
    };
    S3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.error(err);
  }
};

export const removeVideo = async (req, res) => {
  try {
    if (req.userId != req.params.id) {
      return res.status(400).send("Unauthorized");
    }
    const { Bucket, Key } = req.body;

    const params = {
      Bucket,
      Key,
    };

    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      console.log(data);
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};

export const addLesson = async (req, res) => {
  try {
    const { slug, id } = req.params;
    const { title, content, preview, video } = req.body;

    if (req.userId != id) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findOneAndUpdate(
      { slug },
      {
        $push: {
          lessons: {
            title,
            content,
            free_preview: preview,
            video_link: video,
            slug: slugify(title),
          },
        },
      },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Add lesson failed");
  }
};

export const deleteLesson = async (req, res) => {
  const { slug } = req.params;
  const id = req.body.removed[0]._id;
  console.log(id);
  const video = req.body.removed[0].video_link;

  const { Bucket, Key } = video;

  const params = {
    Bucket,
    Key,
  };

  S3.deleteObject(params, (err, data) => {
    if (err) {
      res.sendStatus(400);
    }
    console.log(data);
  });

  const course = await Course.findOne({ slug }).exec();

  const deletedCourse = await Course.findByIdAndUpdate(
    course._id,
    {
      $pull: { lessons: { _id: id } },
    },
    { new: true }
  ).exec();
  res.json(deletedCourse);
};

export const publish = async (req, res) => {
  try {
    const { courseId } = req.params;

    let course = await Course.findByIdAndUpdate(
      courseId,
      { published: true },
      { new: true }
    ).exec();
    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Publish course failed");
  }
};

export const unpublish = async (req, res) => {
  try {
    const { courseId } = req.params;

    let course = await Course.findByIdAndUpdate(
      courseId,
      { published: false },
      { new: true }
    ).exec();

    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unpublish course failed");
  }
};

export const courses = async (req, res) => {
  const all = await Course.find({ published: true })
    .limit(11)
    .populate("instructor", "_id")
    .exec();
  res.json(all);
};

export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.userId).exec();
    let ids = [];
    let length = user.courses && user.courses.length;
    for (let i = 0; i < length; i++) {
      ids.push(user.courses[i].toString());
    }
    const course = await Course.findById(courseId).exec();
    res.json({
      status: ids.includes(courseId),
      course: course,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const freeEnrollment = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).exec();
    const instructor = await User.findById(course.instructor).exec();
    if (course.paid) return;

    const result = await User.findByIdAndUpdate(
      req.userId,
      {
        $addToSet: { courses: course._id },
      },
      { new: true }
    ).exec();

    if (result) {
      const payment = new Payement({
        instructor: instructor.name,
        course: course,
        suscriber: result.name,
      });

      await payment.save();
    } else {
      throw new Error("Payment is not saved");
    }
    res.json({
      message: "Congratulations! You have successfully enrolled",
      course: result,
    });
  } catch (err) {
    console.log("free enrollment err", err);
    return res.status(400).send("Enrollment create failed");
  }
};

export const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

export const paymentVerification = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const token = parsedUrl.query.token;
  const courseId = parsedUrl.query.courseId;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const course = await Course.findById(courseId).exec();
    if (course.paid) return;

    const result = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $addToSet: { courses: course._id },
      },
      { new: true }
    ).exec();
    // res.json({
    //   message: "Congratulations! You have successfully enrolled",
    //   course: result,
    // });

    const instructor = await User.findById(course.instructor);

    const payment = new Payement({
      instructor: instructor.name,
      course: course,
      suscriber: result.name,
    });

    await payment.save();

    res.redirect(
      `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    return res.status(400).send("Payment failed!");
  }
};
