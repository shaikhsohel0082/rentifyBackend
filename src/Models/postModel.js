import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  room: {
    type: Number,
    required: true,
  },
  likes:{
    type:Number
  }
});

const postModel = mongoose.model("posts", postSchema);
export default postModel;
