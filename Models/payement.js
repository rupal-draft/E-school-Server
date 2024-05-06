import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const payementSchema = new Schema(
  {
    instructor: {
      type: String,
    },
    course: { type: {} },
    suscriber: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Payement", payementSchema);
