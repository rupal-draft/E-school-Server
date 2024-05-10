import cloudinary from "cloudinary";
import Product from "./../Models/product.js";
import User from "./../Models/user.js";
import slugify from "slugify";
import "dotenv/config";

// Upload image of book cover

export const uploadImage = async (req, res) => {
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

// Remove image of book cover

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

// Create a Product

export const createProduct = async (req, res) => {
    if(req.body.title){
        req.body.slug = slugify(req.body.title);
    }
    try{
        const alreadyExist = await Product.findOne({
            slug: slugify(req.body.title.toLowerCase()),
        });
        if (alreadyExist) return res.status(400).send("Product already exists");
        const newProduct = await new Product({
            slug: slugify(req.body.title),
            image: req.body.image,
            instructor: req.userId,
            ...req.body,
        }).save();
        res.json(newProduct);
    } catch (error) {
        console.log(error);
    }
};

// Get a Product

export const getAProduct = async (req, res) => {
    const { id } = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch(error) {
        return res.status(400).send("Cannot find the product !");
    }
};

// Get all Products

export const getAllProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.json(products);
    } catch(error) {
        return res.status(400).send("Cannot find products !");
    }
};

// Add to cart

export const addToCart = async (req, res) => {
    const _id = req.userId;
    const { prodId } = req.body;
    try {
        // Find the user by _id
        const user = await User.findById(_id);

        // Get the product details (assuming there's a 'price' field in the product document)
        const product = await Product.findById(prodId);
        let updatedUser;

        // Check if the product is already in the cart
        const alreadyAdded = user.cart.products.find((id) => id.toString() === prodId);

        if (alreadyAdded) {
            // If the product is already in the cart, 
            // Remove the product from the cart and update the cartTotal
            updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                $pull: { "cart.products": prodId },
                $inc: { "cart.cartTotal": -product.price } 
            },
            {
                new: true,
            }
            );
        }
        else{
            // Add the product to the cart and update the cartTotal
            updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                $push: { "cart.products": prodId },
                $inc: { "cart.cartTotal": product.price }
            },
            {
                new: true,
            }
            );
        }
        
        // Respond with the updated user object containing the modified cart
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
    }
};

