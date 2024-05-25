import postModel from "../Models/postModel.js";
import nodemailer from "nodemailer";
export const createPost = async (req, res) => {
  const userId = req.params.id;
  console.log("userId", userId);
  console.log("body", req.body);
  const { image, area, description, price, room } = req.body;
  const newPost = new postModel({
    userId,
    image,
    area,
    description,
    price,
    room,
    likes: 0,
  });
  try {
    const response = await newPost.save();
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const response = await postModel.find();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log("postId", postId);
    const response = await postModel.findByIdAndDelete(postId);
    console.log("post deleted successfully", response);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log("postId", postId);
    const response = await postModel.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } },
      { new: true } // Return the updated document
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { image, area, description, price, room, likes } = req.body;

    // Find the post by ID and update it with the new data
    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { image, area, description, price, room, likes },
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    // If the post was not found, return a 404 error
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Respond with the updated post
    res.status(200).json(updatedPost);
  } catch (err) {
    // Handle validation errors and other errors
    res.status(400).json({ message: err.message });
  }
};
async function sendMailToBuyer(user, post, owner) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Flat Details",
    html: `
          <p>Hello, ${user.firstName} ${user.lastName}</p>
          <p>Thank you for your interest in : <h5>${post.room}BHK Flat with rent of price &#8377; ${post.price}</h5></p>
          
          <p>Here are the owner details, you can contact:</p>
          <h5>Owner Name : ${owner.user.firstName} ${owner.user.lastName}</h5>
          <h5>Owner Email : ${owner.user.email}</h5>
          <h5>Owner Phone Number: ${owner.user.phoneNumber}</h5>
          `,
  };
  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully to buyer");
}
async function sendMailToOwner(user, post, owner) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: owner.user.email,
    subject: "Flat Details",
    html: `
          <p>Hello, ${owner.user.firstName} ${owner.user.lastName}</p>
          <p>${user.firstName} ${user.lastName} has shown interest in  : <h5>${post.room}BHK Flat at${post.area} with rent of price &#8377; ${post.price}</h5></p>
          
          <p>Here are the buyer details :</p>
          <h5>Buyer Name : ${user.firstName} ${user.lastName}</h5>
          <h5>Buyer Email : ${user.email}</h5>
          <h5>Buyer Phone Number: ${user.phoneNumber}</h5>
          `,
  };
  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully to seller");
}
export const sendMail = (req, res) => {
  const { user, post, owner } = req.body;

  sendMailToBuyer(user, post, owner);

  sendMailToOwner(user, post, owner);
  res.status(200).json({ message: "Email sent successfully" });
};
