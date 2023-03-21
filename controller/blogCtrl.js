const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

const createBlog = asyncHandler(async(req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch(err) {
    throw new Error(err);
  }
});

const updateBlog = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blog = await Blog.findByIdAndUpdate({ _id: id }, req.body, { 
      new: true 
    });
    res.json(blog);
  } catch(err) {
    throw new Error(err);
  }
});

const getBlog = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const updateViews = await Blog.findByIdAndUpdate(
      { _id: id }, 
      {
        $inc: {numViews: 1}
      }, 
      {new: true}
    );
    res.json(updateViews);
  } catch(err) {
    throw new Error(err);
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    throw new Error(err);
  }
})

const deleteBlog = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blog = await Blog.findByIdAndDelete({ _id: id });

    res.json(blog);
  } catch (err) {
    throw new Error(err);
  }
});

const likeBlog = asyncHandler(async(req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  try {
    // Find the blog which you want to be liked
    const blog = await Blog.findById({ _id: blogId });
    // find the login user 
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        { _id: blogId }, 
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false
        }, 
        { new: true}
      );
      res.json(blog);
    }

    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        { _id: blogId }, 
        {
          $pull: { likes: loginUserId },
          isLiked: false
        }, 
        { new: true}
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        { _id: blogId },
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }

  } catch (err) {
    throw new Error(err);
  }
});

const dislikeBlog = asyncHandler(async(req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  try {
    // Find the blog which you want to be liked
    const blog = await Blog.findById({ _id: blogId });
    // find the login user 
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isDisliked = blog?.isDisliked;
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        { _id: blogId }, 
        {
          $pull: { likes: loginUserId },
          isLiked: false
        }, 
        { new: true}
      );
      res.json(blog);
    }

    if (isDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        { _id: blogId }, 
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false
        }, 
        { new: true}
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        { _id: blogId },
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      res.json(blog);
    }

  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { 
  createBlog, 
  updateBlog, 
  getBlog, 
  getAllBlogs, 
  deleteBlog, 
  likeBlog, 
  dislikeBlog 
};
