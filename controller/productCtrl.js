const Product = require('../models/productModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (err) {
    throw new Error(err);
  }  
});

const updateProduct = asyncHandler(async(req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.findOneAndUpdate({_id: id}, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    res.json(product);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteProduct = asyncHandler(async(req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOneAndDelete({_id: id});
    res.json(product);
  } catch (err) {
    throw new Error(err);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {

    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach(el => delete queryObj[el]);

    console.log(queryObj);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => {`$${match}`});

    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join('');
      query = query.sort(sortBy);
    } else {  
      query = query.sort('-createdAt');
    }

    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page -1) * limit;
    query = query.skip(skip).limit(limit);
    if(req.query.page) {
      const productCount = await Product.countDocuments();
      if(skip >= productCount) throw new Error('This Page does not exists.');
    }

    const product = await query;            
    res.json(product);
  } catch (err) {
    throw new Error(err);
  }
}); 

const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  try {
    const user = await User.findById(_id);

    const isAlreadyAdded = user.wishlist.includes(prodId);

    const update = isAlreadyAdded
      ? { $pull: { wishlist: prodId } }
      : { $push: { wishlist: prodId } };

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      update,
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// const rating = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { star, prodId, comment } = req.body;

//   try {
//     const product = await Product.findById(prodId);

//     const ratingIndex = product.ratings.findIndex(
//       (rating) => rating.postedBy.toString() === _id.toString()
//     );

//     if (ratingIndex > -1) {
//       // Update existing rating
//       product.ratings[ratingIndex].star = star;
//       if (comment !== undefined) { // Check if comment is defined before setting it
//         product.comment[ratingIndex].comment = comment;
//       }
//       await product.save();
      
//     } else {
//       // Create new rating
//       product.ratings.push({
//         star,
//         comment: comment || "",
//         postedBy: _id,
//       });
//       await product.save();
      
//     }
//     const getAllRatings = await Product.findById(prodId);
//     const totalRatings = getAllRatings.ratings.length;
//     let ratingSum = getAllRatings.ratings
//       .map((item) => item.star)
//       .reduce((prev, current) => prev + current, 0);
//     let actualRating = Math.round(ratingSum / totalRatings);
//     let finalProduct = await Product.findByIdAndUpdate(
//       prodId, 
//       {
//         totalRatings: actualRating,
//       }, 
//       {
//         new: true,
//       }
//     );
//     res.json(finalProduct);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const rating = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { star, prodId, comment } = req.body;

  try {
    const product = await Product.findById(prodId);

    const userRatingIndex = product.ratings.findIndex(
      (rating) => rating.postedBy.toString() === userId.toString()
    );

    if (userRatingIndex !== -1) {
      // User has already rated this product, update their rating
      product.ratings[userRatingIndex].star = star;
      product.ratings[userRatingIndex].comment = comment;
    } else {
      // User has not yet rated this product, add a new rating
      product.ratings.push({
        star,
        comment,
        postedBy: userId,
      });
    }

    const totalRating = product.ratings.length;
    const ratingSum = product.ratings.reduce(
      (sum, rating) => sum + rating.star,
      0
    );
    const actualRating = Math.round(ratingSum / totalRating);

    product.totalRatings = actualRating;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { 
  createProduct, 
  getProduct, 
  getAllProducts, 
  updateProduct, 
  deleteProduct,
  addToWishList,
  rating
};