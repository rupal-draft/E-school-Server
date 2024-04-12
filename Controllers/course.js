import cloudinary from "cloudinary";
import Course from "./../Models/course.js";
import slugify from "slugify";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import { readFileSync } from "fs";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

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
    const { title, content, video } = req.body;

    if (req.userId != id) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findOneAndUpdate(
      { slug },
      {
        $push: {
          lessons: { title, content, video_link: video, slug: slugify(title) },
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
