import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const productSchema = new Schema(
  {
    image:{},
    title:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        unique:true,
        lowercase:true,
    },
    author:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type: String,
        required: true,
    },
    publication_date:{
        type: Date,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    format: {
        type: String,
        enum: ["Hardcover", "Paperback", "EBook"],
        required: true
    },
    ratings:[{
        type: Number,
        comment: String,
        postedBy: { type:mongoose.Schema.Types.ObjectId, ref: "User" },
    }],
    totalrating: {
        type: Number,
        default: 0,
    },
    instructor: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
},
{ timestamps: true }
);

export default mongoose.model("Product", productSchema);
