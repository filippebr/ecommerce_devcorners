const Blog = require('../models/blogModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const cloudinaryUploadImg = require('../utils/cloudinary');
const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);

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
    const getBlogs = await Blog.findById(id)
      .populate('likes')
      .populate('dislikes');
    const updateViews = await Blog.findByIdAndUpdate(
      { _id: id }, 
      {
        $inc: {numViews: 1}
      }, 
      {new: true}
    );
    res.json(getBlogs);
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
    const blog = await Blog.findById(blogId);
    // find the login user 
    const loginUserId = req?.user?._id;
    // find if the user has disliked the blog
    const alreadyDisliked = blog.dislikes.includes(loginUserId);

    if (alreadyDisliked) {
      await Blog.findByIdAndUpdate(
        blogId, 
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false
        }
      );
      res.json(blog);
      return;
    }

    const isLiked = blog.likes.includes(loginUserId);

    if (isLiked) {
      await Blog.findByIdAndUpdate(
        blogId, 
        {
          $pull: { likes: loginUserId },
          isLiked: false
        }
      );
      res.json(blog);
    } else {
      await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        }
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
    const blog = await Blog.findById(blogId);
    // find the login user 
    const loginUserId = req?.user?._id;
    // find if the user has disliked the blog
    const alreadyLiked = blog.likes.includes(loginUserId);

    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId, 
        {
          $pull: { likes: loginUserId },
          isLiked: false
        }
      );
      res.json(blog);
      return;
    }

    const isDisliked = blog.dislikes.includes(loginUserId);

    if (isDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId, 
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false
        }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        }
      );
      res.json(blog);
    }

  } catch (err) {
    throw new Error(err);
  }
});

const uploadBlogImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id); 

  try {
    const { files } = req;
    const urls = await Promise.all(
      files.map(async ({ path }) => {
        const newPath = await cloudinaryUploadImg(path, 'images');
        // not working very well with webp images, cannot remove image when the server is on 
        fs.unlinkSync(path);       
        return newPath;
      })
    );

    const findBlog = await Blog.findByIdAndUpdate(
      id,
      { images: urls },
      { new: true }
    );
    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { 
  createBlog, 
  updateBlog, 
  getBlog, 
  getAllBlogs, 
  deleteBlog, 
  likeBlog, 
  dislikeBlog, 
  uploadBlogImages
};
